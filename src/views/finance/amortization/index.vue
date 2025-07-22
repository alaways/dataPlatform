<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <div class="flex flex-col justify-start p-3 flex-1">
          <div class="flex items-center">
            <div class="text-base font-semibold mr-4">摊销计算</div>
            <div class="flex-1"> </div>
            <Button
              v-if="hasPermission('FinanceAmortizationExport')"
              class="mr-3"
              :loading="exportExcelLoading"
              @click="aoaToExcel"
            >
              <template #icon><DownloadOutlined /></template>
              申请下载Excel
            </Button>
            <Button @click="handleDownload" v-if="hasPermission('FinanceAmortizationExport')">
              <template #icon><UnorderedListOutlined /></template>
              下载暂存列表
            </Button>
          </div>
        </div>
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
            {
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
  import { BasicTable, TableAction, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { exportApplyForExcelAmortization, getAmortizationList } from '/@/api/finance/amortization'
  import { Button } from 'ant-design-vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { isIEBrowse } from '/@/utils/is'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useModal } from '/@/components/Modal'
  import DownloadModal from '/@/components/DownloadModal/index.vue'
  import { DownloadOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
  import { cloneDeep } from 'lodash-es'
  import { useGo } from '/@/hooks/web/usePage'

  export default defineComponent({
    name: 'FinanceAmortizationPage',
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
      const exportExcelLoading = ref(false)
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [downloadModal, { openModal: openDownloadModal }] = useModal()

      const [registerTable, { reload, getForm, getPaginationRef }] = useTable({
        beforeFetch,
        api: getAmortizationList,
        columns,
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
        if (pdata.time) {
          pdata['timeBool'] = true
          pdata['beginCreateTime'] = `${pdata.time[0]}`
          pdata['endCreateTime'] = `${pdata.time[1]}`
        }

        delete pdata.time
        return pdata
      }

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

      function handleSuccess() {
        reload()
      }

      function handleDownload() {
        openDownloadModal(true)
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.orderId}?uid=${record.uid}&name=${record.nickName}&back=/Finance/FinanceAmortization`,
        )
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
        const res = await exportApplyForExcelAmortization(params)
        if (res.code == 200) {
          createMessage.success('已添加进下载暂存列表')
        } else {
          createMessage.success('申请失败')
        }
        exportExcelLoading.value = false
      }

      onMounted(() => {
        init()
      })

      return {
        registerTable,
        handleSuccess,
        exportExcelLoading,
        aoaToExcel,
        hasPermission,
        downloadModal,
        handleDownload,
        handleDetail,
      }
    },
  })
</script>
