<template>
  <div>
    <BasicTable @register="registerTable">
      <!-- <template #toolbar>
        <BasicUpload
          v-if="hasPermission('OrderListImport')"
          :maxSize="20"
          :maxNumber="1"
          :api="impExcelApi"
          class="my-5"
          :accept="['xls', 'xlsx']"
        >
          导入Excel
        </BasicUpload>

        <Button
          :loading="exportExcelLoading"
          @click="aoaToExcel"
          v-if="hasPermission('OrderListExport')"
        >
          <template #icon><DownloadOutlined /></template>
          申请下载Excel
        </Button>
        <Button @click="handleDownload" v-if="hasPermission('OrderListExport')">
          <template #icon><UnorderedListOutlined /></template>
          下载暂存列表
        </Button>
      </template> -->
      <template #action="{ record }">
        <!-- <TableAction
          :actions="[
            {
              ifShow: hasPermission('OrderListDetail'),
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              ifShow:
                hasPermission('OrderListCancel') &&
                (record.merchantTerminalNo == '2023111709466887' ||
                  record.merchantTerminalNo == '2021004105683179'),
              label: '取消',
              onClick: handleCancle.bind(null, record),
            },
          ]"
        /> -->
      </template>
    </BasicTable>
    <PasswordModal @register="passwordModal" @success="handleSuccess" />
    <CancleModal @register="cancleModal" @success="handleSuccess" />
    <DownloadModal @register="downloadModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { export3Excel, getOrderList, impExcelApi } from '/@/api/order'
  import { useGo } from '/@/hooks/web/usePage'
  import { Button } from 'ant-design-vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { handleBillList } from '../utils'
  import { useUserStore } from '/@/store/modules/user'
  import { BasicUpload } from '/@/components/Upload'
  import PasswordModal from '../components/PasswordModal.vue'
  import CancleModal from '../components/CancleModal.vue'
  import DownloadModal from '/@/components/DownloadModal/index.vue'
  import { useModal } from '/@/components/Modal'
  import { cloneDeep } from 'lodash-es'
  import { isIEBrowse } from '/@/utils/is'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { DownloadOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'

  export default defineComponent({
    name: 'OrderList',
    components: {
      BasicTable,
      TableAction,
      Button,
      BasicUpload,
      PasswordModal,
      CancleModal,
      DownloadModal,
      DownloadOutlined,
      UnorderedListOutlined,
    },
    setup() {
      const go = useGo()
      const exportExcelLoading = ref(false)
      const importExcelLoading = ref(false)
      const fileList = ref([])
      const patnerList = ref([])
      const patnerVisible = ref(false)
      const sysPartnerCode = ref()
      const userStore = useUserStore()
      const patrnerRecord = ref()
      const { hasPermission } = usePermission()
      const { createMessage } = useMessage()
      const [passwordModal, { openModal: openPasswordModal }] = useModal()
      const [cancleModal, { openModal: openCancleModal }] = useModal()
      const [downloadModal, { openModal: openDownloadModal }] = useModal()
      const [
        registerTable,
        { reload, getForm, setColumns, getColumns, getPaginationRef },
        // setTableData, setLoading
      ] = useTable({
        title: '订单列表',
        api: getOrderList,
        afterFetch,
        columns: columns(),
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: false,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 170,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })
      const orderList = ref([])
      // 处理返回数据
      function afterFetch(data) {
        data.forEach((v) => {
          const res: any = handleBillList(v.orderBillItemList)
          v['firstPay'] = res.firstPay
          v['deposit'] = res.deposit
          v['attrMap'] = v?.['attrMap'] || {}
          return v
        })

        orderList.value = data
        return data
      }

      function handleSuccess(data) {
        reload()
        if (data?.showPwd) {
          handlePassword(data.data)
        } else {
          reload()
        }
      }
      // 输入密码
      function handlePassword(data: any) {
        openPasswordModal(true, {
          isUpdate: true,
          data,
        })
      }
      async function handleCancle(record: Recordable) {
        openCancleModal(true, {
          isUpdate: true,
          record,
        })
      }
      function handleDetail(record: Recordable) {
        const index: any = orderList?.value?.findIndex((item: any) => item.id === record?.id)
        const bodyScroll: any = document.querySelector('body')?.scrollTop
        const tableBody = document?.querySelector('.ant-table-body')
        if (tableBody) {
          const scrollTop: any = tableBody.scrollTop
          sessionStorage.setItem('stopNum', scrollTop)
        }
        if (index > -1) {
          sessionStorage.setItem('bodyScroll', bodyScroll)
          sessionStorage.setItem('allIndex', index)
        }
        go(
          `/order/orderDetail/${record.id}?uid=${record.uid}&name=${record.nickName}&auditId=${record.auditId}&back=/Order/OrderList`,
        )
      }

      function handleDownload() {
        openDownloadModal(true)
      }

      // 导出
      async function aoaToExcel() {
        if (isIEBrowse()) {
          createMessage.error('请使用除IE之外的浏览器导出Excel')
          return
        }
        const form = await getForm()
        const value = form.getFieldsValue()
        const formValue = await cloneDeep(value)

        exportExcelLoading.value = true
        const pageData: any = getPaginationRef()
        const params = {
          ...formValue,
          limit: pageData.total,
        }
        const res = await export3Excel(params)
        if (res.code == 200) {
          createMessage.success('已添加进下载暂存列表')
        } else {
          createMessage.success('申请失败')
        }
        exportExcelLoading.value = false
      }
      // 推送资方
      const pushPartner = async (record) => {
        patrnerRecord.value = record
        patnerVisible.value = true
      }
      const clolsePatner = () => {
        patnerVisible.value = false
        sysPartnerCode.value = null
        patrnerRecord.value = null
      }
      return {
        registerTable,
        handleSuccess,
        handleCancle,
        handleDetail,
        aoaToExcel,
        importExcelLoading,
        exportExcelLoading,
        fileList,
        impExcelApi,
        passwordModal,
        cancleModal,
        hasPermission,
        downloadModal,
        handleDownload,
        pushPartner,
        patnerList,
        patnerVisible,
        sysPartnerCode,
        clolsePatner,
      }
    },
  })
</script>
