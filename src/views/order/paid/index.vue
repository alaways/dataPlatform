<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button
          :loading="exportExcelLoading"
          @click="aoaToExcel"
          v-if="hasPermission('OrderPaidExport')"
        >
          <template #icon><DownloadOutlined /></template>
          申请下载Excel
        </Button>
        <Button @click="handleDownload" v-if="hasPermission('OrderPaidExport')">
          <template #icon><UnorderedListOutlined /></template>
          下载暂存列表
        </Button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('OrderPaidDetail'),
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <DownloadModal @register="downloadModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { exportApplyForPaidExcel, getOrderPaidList } from '/@/api/order'
  import { useGo } from '/@/hooks/web/usePage'
  import { Recordable } from 'vite-plugin-mock'
  import { isIEBrowse } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import { Button } from 'ant-design-vue'
  import { getStoreList } from '/@/api/store'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useModal } from '/@/components/Modal'
  import DownloadModal from '/@/components/DownloadModal/index.vue'
  import { DownloadOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
  import { isValidISO8601 } from '/@/utils/tool'

  export default defineComponent({
    name: 'OrderPaidPage',
    components: {
      BasicTable,
      TableAction,
      Button,
      DownloadModal,
      DownloadOutlined,
      UnorderedListOutlined,
    },
    setup() {
      const go = useGo()
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const exportExcelLoading = ref(false)
      const [downloadModal, { openModal: openDownloadModal }] = useModal()
      const [registerTable, { reload, getForm, getPaginationRef }] = useTable({
        title: '已支付列表',
        beforeFetch,
        api: getOrderPaidList,
        afterFetch,
        columns: columns(),
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })
      function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        pdata['tradeStatus'] = 1
        if (pdata.rentTypeList == 2 || pdata.rentTypeList == 3) {
          pdata.rentTypeList = '2,3'
        }
        if (pdata.time) {
          pdata['timeBool'] = true
          pdata['beginPayTime'] = `${isValidISO8601(pdata.time[0], 'YYYY-MM-DD')}`
          pdata['endPayTime'] = `${isValidISO8601(pdata.time[1], 'YYYY-MM-DD')}`
        }
        delete pdata.time
        return pdata
      }
      // 处理返回数据
      function afterFetch(data) {
        // data.forEach((v) => {
        //   const res: any = handleBillList(v.orderBillItemList)
        //   v['firstPay'] = res.firstPay
        //   v['deposit'] = res.deposit
        // })
        return data
      }

      onMounted(() => {
        init()
      })

      const merchantCodeList = ref<any>([])
      async function init() {
        const form = await getForm()
        form.updateSchema([
          {
            field: 'status',
            componentProps: {
              onChange: () => {
                form.submit()
              },
            },
          },
        ])
        const mlist = await getStoreList({ pageSize: 99999, limit: 999999 })
        merchantCodeList.value = mlist.list

        form.updateSchema([
          {
            field: 'merchantCode',
            componentProps: {
              placeholder: '请选择',
              options: merchantCodeList.value,
              fieldNames: {
                label: 'merchantName',
                value: 'merchantCode',
                key: 'merchantCode',
              },
            },
          },
        ])
      }

      function handleSuccess() {
        reload()
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.orderId}?uid=${record.uid}&name=${record.name}&back=/order/orderPaid`,
        )
      }
      function handleDownload() {
        openDownloadModal(true)
      }

      async function aoaToExcel() {
        if (isIEBrowse()) {
          createMessage.error('请使用除IE之外的浏览器导出Excel')
          return
        }
        const form = await getForm()
        const value = form.getFieldsValue()
        const formValue: any = await beforeFetch(cloneDeep(value))
        if (!formValue?.timeBool) {
          createMessage.error('请筛选时间进行导出')
          return
        }
        exportExcelLoading.value = true
        const pageData: any = getPaginationRef()
        const params = {
          ...formValue,
          limit: pageData.total,
        }
        const res = await exportApplyForPaidExcel(params)
        if (res.code == 200) {
          createMessage.success('已添加进下载暂存列表')
        } else {
          createMessage.success('申请失败')
        }
        exportExcelLoading.value = false
      }

      return {
        registerTable,
        handleSuccess,
        handleDetail,
        aoaToExcel,
        exportExcelLoading,
        hasPermission,
        downloadModal,
        handleDownload,
      }
    },
  })
</script>
