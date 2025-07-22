<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <div class="flex flex-col justify-start p-3 flex-1">
          <div class="flex items-center">
            <div class="flex-1">
              <div class="flex" v-if="hasPermission('StreamBalance')">
                <div class="mr-4">
                  <Tips :withdrawData="withdrawData" :userInfo="userInfo" />
                </div>
              </div>
            </div>
            <Button
              class="mr-3"
              :loading="exportExcelLoading"
              @click="aoaToExcel"
              v-if="hasPermission('FinanceStreamExport')"
            >
              <template #icon><DownloadOutlined /></template>
              申请下载Excel
            </Button>
            <Button @click="handleDownload" v-if="hasPermission('FinanceStreamExport')">
              <template #icon><UnorderedListOutlined /></template>
              下载暂存列表
            </Button>
          </div>
        </div>
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow: hasPermission('FinanceStreamOrderDetail'),
              label: '订单详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              ifShow: hasPermission('FinanceStreamBillDetail'),
              label: '订单账单',
              onClick: handleDetail.bind(null, record, { tabName: 'Bill' }),
            },
          ]"
        />
      </template>
    </BasicTable>

    <DownloadModal @register="downloadModal" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
  import { BasicTable, TableAction, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { cloneDeep } from 'lodash-es'
  import { Button } from 'ant-design-vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { isIEBrowse } from '/@/utils/is'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { Recordable } from 'vite-plugin-mock'
  import { getCollectionList, exportApplyForExcelCollection } from '/@/api/finance/collection'
  import { useGo } from '/@/hooks/web/usePage'
  import Tips from './Tips.vue'
  import { getStoreList } from '/@/api/store'
  import { useModal } from '/@/components/Modal'
  import DownloadModal from '/@/components/DownloadModal/index.vue'
  import { DownloadOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
  import { isValidISO8601 } from '/@/utils/tool'

  const props = {
    withdrawData: { type: Object },
    userInfo: { type: Object },
  }

  export default defineComponent({
    name: 'StreamSettled',
    components: {
      BasicTable,
      Button,
      TableAction,
      Tips,
      DownloadModal,
      DownloadOutlined,
      UnorderedListOutlined,
    },
    props,
    setup(props) {
      const go = useGo()
      const { hasPermission } = usePermission()
      const { createMessage } = useMessage()
      const exportExcelLoading = ref(false)
      const [downloadModal, { openModal: openDownloadModal }] = useModal()

      const [registerTable, { getForm, getPaginationRef, setProps }] = useTable({
        // title: '已结算',
        beforeFetch,
        api: getCollectionList,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 100,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })

      function beforeFetch(data) {
        data['pageIndex'] = data.cursor
        data['pageSize'] = data.limit
        data['pointType'] = 4
        if (data.time) {
          data['timeBool'] = true
          data['beginPayTime'] = `${isValidISO8601(data.time[0], 'YYYY-MM-DD')}`
          data['endPayTime'] = `${isValidISO8601(data.time[1], 'YYYY-MM-DD')}`
        }
        delete data.time
        return data
      }

      function handleDownload() {
        openDownloadModal(true)
      }

      function handleDetail(record: Recordable, tab: any) {
        let url = `/Order_router/orderDetail/${record.orderId}?uid=${record.uid}&name=${record.name}&back=/finance/financeStream`
        if (tab && tab.tabName) {
          url = `${url}&tab=${tab.tabName}`
        }
        go(url)
      }

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
        const res = await exportApplyForExcelCollection(params)
        if (res.code == 200) {
          createMessage.success('已添加进下载暂存列表')
        } else {
          createMessage.success('申请失败')
        }
        exportExcelLoading.value = false
      }

      const userInfo = computed(() => {
        return props.userInfo
      })

      const withdrawData = computed(() => {
        return props.withdrawData
      })

      watch(
        () => props.userInfo,
        () => {
          init()
        },
      )

      onMounted(() => {
        init()
      })

      async function init() {
        nextTick(() => {
          setProps({
            columns: columns(props.userInfo?.settleRate || 0),
          })
        })
        const res = await getStoreList({ pageSize: 999999, limit: 999999 })
        const form = await getForm()
        form.updateSchema({
          field: 'merchantCode',
          componentProps: {
            options: res.list,
            fieldNames: {
              label: 'merchantName',
              value: 'merchantCode',
              key: 'merchantCode',
            },
          },
        })
      }

      return {
        registerTable,
        exportExcelLoading,
        aoaToExcel,
        hasPermission,
        handleDetail,
        withdrawData,
        userInfo,
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
