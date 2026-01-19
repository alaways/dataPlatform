<template>
  <Card title="订单汇总">
    <!-- 表格数据 -->
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button type="primary" :loading="exportExcelLoading" @click="onExportOrderData">导出</Button>
      </template>
    </BasicTable>
    <!-- 曲线图 -->
    <OrderLine />
  </Card>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { Card, Button } from 'ant-design-vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { BasicTable, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import dayjs from 'dayjs'
  import { getOrderInfo, exportOrderInfo } from '/@/api/statistics/index'
  import { isIEBrowse } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import OrderLine from './OrderLine/index.vue'

  export default defineComponent({
    name: 'TotalAllPie',
    components: { Card, BasicTable, Button, OrderLine },
    setup() {
      const { hasPermission } = usePermission()
      const [registerTable, { getForm, getPaginationRef }] = useTable({
        title: '',
        beforeFetch,
        api: getOrderInfo,
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
      const exportExcelLoading = ref(false)
      const { createMessage } = useMessage()
      // 处理参数
      async function beforeFetch(data: any) {
        const payload = {
          cursor: data.cursor,
          limit: data.limit,
          startTime: dayjs(data.time[0]).format('YYYY-MM-DD'),
          endTime: dayjs(data.time[1]).format('YYYY-MM-DD'),
          categoryIdList: data.categoryIdList || [],
        }
        return payload
      }
      // 导出订单数据
      async function onExportOrderData() {
        if (isIEBrowse()) {
          createMessage.error('请使用除IE之外的浏览器导出Excel')
          return
        }
        const form = await getForm()
        const value = form.getFieldsValue()
        const formValue = await beforeFetch(cloneDeep(value))

        exportExcelLoading.value = true
        const pageData: any = getPaginationRef()
        const params: any = {
          ...formValue,
          limit: pageData.total,
        }
        window.open(`
https://admin.gsrental.cn/mayiApi/statistic/orderInfoExport?limit=0&startTime=${params.startTime}&endTime=${params.endTime}&categoryIdList=${params.categoryIdList}`)
        // const res = await 
        // downloadByData(res.data, '逾期用户锁机列表.xlsx')
        exportExcelLoading.value = false
      }
      const cutRes = ref(null)
      return {
        hasPermission,
        cutRes,
        registerTable,
        onExportOrderData,
        exportExcelLoading,
      }
    },
  })
</script>
