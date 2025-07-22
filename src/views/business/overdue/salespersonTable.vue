<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <div class="flex items-center justify-between flex-1">
          <p style="padding: 0">
            提示说明： <br />
            1、订单数、总到期订单、逾期订单(含租赁生效、已逾期、已买断、已完结订单) <br />
            2、逾期率 = 逾期订单 / 总到期订单
          </p>
          <Button
            v-if="hasPermission('BusinessOverdueExport')"
            :loading="exportExcelLoading"
            @click="aoaToExcel"
          >
            导出Excel
          </Button>
        </div>
      </template>
    </BasicTable>
    <Modal @register="registerModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { salespersonColumns, searchSalespersonFormSchema } from './data'
  import { cloneDeep } from 'lodash-es'
  import { exportExcel, getSalespersonStatisticsList } from '/@/api/business/salesperson'
  import { Button } from 'ant-design-vue'
  import { isIEBrowse } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { downloadByData } from '/@/utils/file/download'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { isValidISO8601 } from '/@/utils/tool'
  import { useModal } from '/@/components/Modal'
  import Modal from './Modal.vue'

  export default defineComponent({
    name: 'SalespersonTable',
    components: { BasicTable, Button, Modal },
    setup() {
      const exportExcelLoading = ref(false)
      const [registerModal, { openModal }] = useModal()
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [registerTable, { getForm, getPaginationRef }] = useTable({
        defSort: { field: 'sortNum', order: 'desc' },
        sortFn(sortInfo) {
          return { field: sortInfo.field, order: sortInfo.order }
        },
        beforeFetch,
        api: getSalespersonStatisticsList,
        columns: salespersonColumns(handleOverdue),
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 120,
          schemas: searchSalespersonFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        striped: false,
        showIndexColumn: false,
      })

      // 处理参数
      async function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        // 排序
        if (pdata.field && pdata.order) {
          const order = pdata.order == 'ascend' ? 'asc' : 'desc'
          if (pdata.field == 'sortNum') {
            pdata['sortNumOrderBy'] = order
          } else {
            pdata['orderBy'] = `${pdata.field} ${order}`
          }
        }
        delete pdata.field
        delete pdata.order
        if (pdata.time) {
          pdata['createTimeStart'] = `${isValidISO8601(pdata.time[0], 'YYYY-MM-DD')}`
          pdata['createTimeEnd'] = `${isValidISO8601(pdata.time[1], 'YYYY-MM-DD')}`
        }
        delete pdata.time
        return pdata
      }

      // 逾期订单
      async function handleOverdue(record: Recordable, isUpdate: boolean, entryType: number) {
        const form = await getForm()
        const values = await beforeFetch(await form.validate())
        openModal(true, {
          isUpdate,
          record,
          values,
          entryType,
          isProvince: false,
        })
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

        exportExcelLoading.value = true
        const pageData: any = getPaginationRef()
        const params = {
          ...formValue,
          limit: pageData.total,
        }
        const res = await exportExcel(params)
        downloadByData(res.data, '业务员统计.xlsx')
        exportExcelLoading.value = false
      }
      return {
        registerTable,
        exportExcelLoading,
        aoaToExcel,
        hasPermission,
        registerModal,
      }
    },
  })
</script>
