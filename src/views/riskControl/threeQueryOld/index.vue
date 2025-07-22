<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button
          :loading="exportExcelLoading"
          @click="aoaToExcel"
          v-if="hasPermission('riskThreeOldExport')"
        >
          导出记录
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
  import { isIEBrowse } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { exportThreeQueryOldExcel, getThreeQueryOldList } from '/@/api/riskControl'
  import { usePermission } from '/@/hooks/web/usePermission'

  export default defineComponent({
    name: 'RiskThreeQueryOld',
    components: { BasicTable, Button },
    setup() {
      const exportExcelLoading = ref(false)
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()

      const [registerTable, { getForm, getPaginationRef }] = useTable({
        // title: '三要素查询记录',
        beforeFetch,
        api: getThreeQueryOldList,
        columns,
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
        pdata['cursor'] = pdata.pageIndex
        pdata['limit'] = pdata.pageSize
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
        const res = await exportThreeQueryOldExcel(params)
        downloadByData(res.data, '三要素查询记录-旧.xlsx')
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
