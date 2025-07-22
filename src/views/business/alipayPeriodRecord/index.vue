<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button
          v-if="hasPermission('BusinessAlipayPeriodRecordExport')"
          :loading="exportExcelLoading"
          @click="aoaToExcel"
        >
          导出Excel
        </Button>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { Button } from 'ant-design-vue'
  import { downloadByData } from '/@/utils/file/download'
  import { cloneDeep } from 'lodash-es'
  import { exportAlipayPeriodExcel, getAlipayPeriodList } from '/@/api/business/alipayPeriodRecord'
  import { isIEBrowse } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'

  export default defineComponent({
    name: 'BusinessAlipayPeriodRecord',
    components: { BasicTable, Button },
    setup() {
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const exportExcelLoading = ref(false)

      const [registerTable, { getForm, getPaginationRef }] = useTable({
        title: '支付宝周期代扣',
        beforeFetch,
        api: getAlipayPeriodList,
        columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
      })

      // 处理参数
      async function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        if (pdata.time) {
          pdata['beginCreateTime'] = `${pdata.time[0]}`
          pdata['endCreateTime'] = `${pdata.time[1]}`
        }

        delete pdata.time
        return pdata
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
        const res = await exportAlipayPeriodExcel(params)
        downloadByData(res.data, '逾期用户锁机列表.xlsx')
        exportExcelLoading.value = false
      }

      return {
        registerTable,
        aoaToExcel,
        exportExcelLoading,
        hasPermission,
      }
    },
  })
</script>
