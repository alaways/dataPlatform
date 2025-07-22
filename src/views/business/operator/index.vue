<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <div class="flex flex-1 items-center justify-between pl-6">
          <template v-if="searchTimeType != -1">
            <div style="color: #e11d48">
              <span v-if="searchTimeType == 0">创建时间 {{ searchTimeTxt }} (实时)</span>
              <span v-else-if="searchTimeType == 1">按月维度(过往)</span>
            </div>
          </template>
          <div v-else></div>
          <Button
            :loading="exportExcelLoading"
            @click="aoaToExcel"
            v-if="hasPermission('BusinessOperatorExport')"
          >
            导出Excel
          </Button>
        </div>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { PageWrapper } from '/@/components/Page'
  import { columns, searchFormSchema } from './data'
  import { getStoreList } from '/@/api/store'
  import { exportExcel, getOperatorStoreList } from '/@/api/business/operator'
  import { cloneDeep } from 'lodash-es'
  import { Button } from 'ant-design-vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { downloadByData } from '/@/utils/file/download'
  import { isIEBrowse } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { handleMonthToDay } from '/@/utils/tool'

  export default defineComponent({
    name: 'BusinessOperatorPage',
    components: { BasicTable, PageWrapper, Button },
    setup() {
      const { hasPermission } = usePermission()
      const { createMessage } = useMessage()

      const exportExcelLoading = ref(false)
      const searchTimeType = ref(-1) // -1.空 0.创建时间 1.按月维度
      const searchTimeTxt = ref('') // 展示使用

      const [registerTable, { getForm, getPaginationRef }] = useTable({
        title: '风控审单列表',
        beforeFetch,
        api: getOperatorStoreList,
        scroll: { y: 600 },
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        bordered: true,
      })
      // 处理参数
      async function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        // 排序
        if (pdata.field) {
          const order = pdata.order == 'ascend' ? 'asc' : 'desc'
          pdata['orderBy'] = `${pdata.field} ${order}`
          delete pdata.field
          delete pdata.order
        }

        const timeValue = pdata.timeSelect

        if (timeValue == '创建时间') {
          delete pdata.observationTimePoint
          if (pdata.time) {
            pdata['beginCreateTime'] = `${pdata.time[0]}`
            pdata['endCreateTime'] = `${pdata.time[1]}`
            searchTimeType.value = 0
            searchTimeTxt.value = pdata.time.join('~')
          } else {
            searchTimeType.value = -1
          }
        } else if (timeValue == '按月维度') {
          delete pdata.time
          if (pdata.observationTimePoint) {
            pdata['observationTimePoint'] = handleMonthToDay(pdata.observationTimePoint)
            searchTimeType.value = 1
            searchTimeTxt.value = pdata.observationTimePoint
          } else {
            searchTimeType.value = -1
          }
        }

        delete pdata.time
        return pdata
      }

      init()
      const merchantList = ref<any>([])
      async function init() {
        const res = await getStoreList({ pageSize: 99999 })
        merchantList.value = res.list
      }

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
        downloadByData(res.data, '全部订单.xlsx')
        exportExcelLoading.value = false
      }

      return {
        registerTable,
        hasPermission,
        exportExcelLoading,
        aoaToExcel,
        searchTimeType,
        searchTimeTxt,
      }
    },
  })
</script>
