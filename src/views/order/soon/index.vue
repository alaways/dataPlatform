<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button type="primary" @click="handleFollowBy" v-if="hasPermission('OrderSoonFollowBy')">
          分配跟进人
        </Button>
        <Button
          :loading="exportExcelLoading"
          @click="aoaToExcel"
          v-if="hasPermission('OrderSoonExport')"
        >
          <template #icon><DownloadOutlined /></template>
          申请下载Excel
        </Button>
        <Button @click="handleDownload" v-if="hasPermission('OrderSoonExport')">
          <template #icon><UnorderedListOutlined /></template>
          下载暂存列表
        </Button>
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow: hasPermission('OrderSoonDetail'),
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              ifShow: hasPermission('OrdeSoonReceive') && !record.followBy && record.isToday,
              label: '领取催收单',
              popConfirm: {
                title: '请确认领取该催收单!',
                confirm: handleReceive.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <FollowByModal @register="followByRegister" @success="handleSuccess" />
    <DownloadModal @register="downloadModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { exportApplyForSoonExcel, getOrderUpcoming } from '/@/api/order'
  import { useGo } from '/@/hooks/web/usePage'
  import { Recordable } from 'vite-plugin-mock'
  import { onMounted } from 'vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useModal } from '/@/components/Modal'
  import { useMessage } from '/@/hooks/web/useMessage'
  import FollowByModal from '../slippage/FollowByModal.vue'
  import { setTaskItem } from '/@/api/collection/task'
  import { useUserStore } from '/@/store/modules/user'
  import { Button } from 'ant-design-vue'
  import { handleTodayThan, isValidISO8601 } from '/@/utils/tool'
  import { isIEBrowse } from '/@/utils/is'
  import { cloneDeep } from 'lodash-es'
  import DownloadModal from '/@/components/DownloadModal/index.vue'
  import { DownloadOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
  import { cityCoding } from '/@/utils/cityData2'

  export default defineComponent({
    name: 'OrderSoonPage',
    components: {
      BasicTable,
      TableAction,
      FollowByModal,
      Button,
      DownloadModal,
      DownloadOutlined,
      UnorderedListOutlined,
    },
    setup() {
      const go = useGo()
      const userStore = useUserStore()
      const userInfo = userStore.getUserInfo
      const exportExcelLoading = ref(false)
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [downloadModal, { openModal: openDownloadModal }] = useModal()
      const [followByRegister, { openModal: openfollowByModal }] = useModal()
      const [
        registerTable,
        { getForm, reload, getSelectRowKeys, setSelectedRowKeys, getPaginationRef },
      ] = useTable({
        title: '即将到期订单列表',
        beforeFetch,
        api: getOrderUpcoming,
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
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
          getCheckboxProps(record: Recordable) {
            // 分配过了禁止分屏
            return { disabled: record.followBy || !record.isToday }
          },
        },
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
        if (pdata.rentTypeList == 2 || pdata.rentTypeList == 3) {
          pdata.rentTypeList = '2,3'
        }
        if (pdata.repayDate) {
          pdata['timeBool'] = true
          pdata['repayDateBegin'] = `${isValidISO8601(pdata.repayDate[0], 'YYYY-MM-DD')}`
          pdata['repayDateEnd'] = `${isValidISO8601(pdata.repayDate[1], 'YYYY-MM-DD')}`
        }
        if (pdata.city) {
          const cityArr = cloneDeep(cityCoding)
          // 将value转成中文并且添加省级
          let ipProvinces: string[] = []
          let ipCitys: string[] = []
          cityArr.forEach((v) => {
            const flist = v.children
              ?.filter((f) => pdata.city.some((c) => c == f.value))
              .map((m) => m.label)
            if (flist && flist.length) {
              ipCitys.push(...flist)
              ipProvinces.push(v.label)
            }
          })

          pdata.ipProvinces = ipProvinces.join(',')
          pdata.ipCitys = ipCitys?.filter((v) => v != '市辖区').join(',')
        } else {
          delete pdata.ipCitys
          delete pdata.ipProvinces
        }
        delete pdata.city
        delete pdata.repayDate
        return pdata
      }

      function afterFetch(data) {
        const dlist = data.map((v) => {
          return {
            ...v,
            isToday: handleTodayThan(v.repayDate),
          }
        })
        return dlist
      }

      onMounted(() => {
        init()
      })
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
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.id}?uid=${record.uid}&name=${record.nickName}&back=/order/orderSoon`,
        )
      }

      function handleSuccess(data) {
        if (data == 'FollowBy') {
          setSelectedRowKeys([])
        }
        reload()
      }

      // 分配跟进人
      function handleFollowBy() {
        const select = getSelectRowKeys()
        if (!select.length) {
          createMessage.error(`请先选择要分配的订单`)
          return
        }
        openfollowByModal(true, {
          isUpdate: true,
          record: {
            orderIds: select.join(','),
          },
        })
      }

      // 领取催收单
      async function handleReceive(record: Recordable) {
        await setTaskItem({
          orderIds: record.id,
          uid: userInfo.uid,
        })
        createMessage.success(`领取成功`)
        handleSuccess('FollowBy')
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
        const formValue = await beforeFetch(cloneDeep(value))
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
        const res = await exportApplyForSoonExcel(params)
        if (res.code == 200) {
          createMessage.success('已添加进下载暂存列表')
        } else {
          createMessage.success('申请失败')
        }
        exportExcelLoading.value = false
      }

      return {
        registerTable,
        handleDetail,
        hasPermission,
        handleSuccess,
        handleFollowBy,
        handleReceive,
        followByRegister,
        aoaToExcel,
        exportExcelLoading,
        downloadModal,
        handleDownload,
      }
    },
  })
</script>

<style lang="less" scoped>
  .TableAction {
    flex-direction: column;

    ::v-deep.vben-basic-table-action {
      button {
        margin-bottom: 2px;
      }

      .action-divider {
        display: none !important;
      }
    }
  }
</style>
