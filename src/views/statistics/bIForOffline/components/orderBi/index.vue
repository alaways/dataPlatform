<template>
  <BasicTable @register="registerTable" />
  <FloatSearch :confirmFn="confirmFn"/>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { orderCountWeekBi } from '/@/api/statistics/index'
  import { columns, searchFormSchema } from './data'
  import FloatSearch from './FloatSearch.vue'

  export default defineComponent({
    name: 'TotalAllPie',
    components: { BasicTable, FloatSearch },
    setup() {
      const [registerTable, { getForm , setTableData }] = useTable({
        title: '',
        columns: columns,
        scroll: { y: 600 },
        api: orderCountWeekBi,
        beforeFetch,
        afterFetch,
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
      function beforeFetch(data: any) {
        return data
      }

      async function afterFetch(data: any) {
        console.log(data, 'afterData')
        return data || []
      }
      // 提交查询数据
      const confirmFn = async({ city, store, user }) => {
       
        const form = await getForm()
        const value = form?.getFieldsValue()
        const params: any = {
          ...value,
        }
        if (city?.length) {
          params.ipCityList = city || []
        }
        if (store?.length) {
          params.storeMerchantNameList = store || []
        }
        if (user?.length) {
          params.salesPersonNameList = user || []
        }
        const res = await orderCountWeekBi(params)
        setTableData(res?.data || [])
      }
      return {
        registerTable,
        confirmFn,
      }
    },
  })
</script>
