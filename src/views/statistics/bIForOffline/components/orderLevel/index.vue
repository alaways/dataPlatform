<template>
  <BasicTable @register="registerTable" />
  <FloatSearch :confirmFn="confirmFn"/>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { orderCountWeekBi } from '/@/api/statistics/index'
  import { columns, searchFormSchema } from './data'
  import { Checkbox } from 'ant-design-vue'
  import FloatSearch from '../orderBi/FloatSearch.vue'
  const CheckboxGroup = Checkbox.Group
  export default defineComponent({
    name: 'TotalAllPie',
    components: { BasicTable, CheckboxGroup, FloatSearch },
    setup() {
      const checkboxList = ref([])
      const checkvalue = ref()
      const [registerTable, { getForm, setTableData }] = useTable({
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
        data.queryType = 'GRADE'
        return data
      }

      async function afterFetch(data: any) {
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
        checkboxList,
        checkvalue,
        confirmFn,
      }
    },
  })
</script>
