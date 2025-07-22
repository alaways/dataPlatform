<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable :canResize="true" @register="registerTable" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { PageWrapper } from '/@/components/Page'
  import { columns, searchFormSchema } from './data'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { cloneDeep } from 'lodash-es'
  import { getPrintList } from '/@/api/delivery/print'

  export default defineComponent({
    name: 'DeliveryPrintPage',
    components: { BasicTable, PageWrapper },
    setup() {
      const { hasPermission } = usePermission()
      const [registerTable] = useTable({
        title: '打印面单记录',
        beforeFetch,
        api: getPrintList,
        columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        showIndexColumn: false,
        useSearchForm: true,
        bordered: true,
      })

      function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        if (pdata.time) {
          pdata['validityBeginTime'] = `${pdata.time[0]}`
          pdata['validityEndTime'] = `${pdata.time[1]}`
        }
        delete pdata.time
        return pdata
      }

      return {
        registerTable,
        hasPermission,
      }
    },
  })
</script>
