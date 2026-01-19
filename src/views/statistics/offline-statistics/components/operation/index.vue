<template>
  <div> <BasicTable @register="registerTable" /> </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { cloneDeep } from 'lodash-es'
  import { getOperationList } from '/@/api/statistics/operation'

  export default defineComponent({
    name: 'StatisticsOperationPage',
    components: {
      BasicTable,
    },
    setup() {
      const [registerTable] = useTable({
        title: '',
        beforeFetch,
        api: getOperationList,
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
      })
      function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        if (pdata.time) {
          pdata['beginPayTime'] = `${pdata.time[0]}`
          pdata['endPayTime'] = `${pdata.time[1]}`
        }
        delete pdata.time
        return pdata
      }

      return {
        registerTable,
      }
    },
  })
</script>
