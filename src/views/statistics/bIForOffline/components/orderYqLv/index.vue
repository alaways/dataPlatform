<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { BasicTable, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { orderOverdueReturnLv } from '/@/api/statistics/index'
  export default defineComponent({
    name: 'TotalAllPie',
    components: { BasicTable },
    setup() {
      const { hasPermission } = usePermission()
      const [registerTable, { setTableData }] = useTable({
        title: '',
        beforeFetch,
        api: orderOverdueReturnLv,
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
      const loading = ref(false)
      const exportExcelLoading = ref(false)
      const payloadSearch = ref({})
      const listData = ref([])
      const timer = ref()
      // 处理参数
      async function beforeFetch(data: any) {
        // const payload: any = {}
        // if (data?.categoryInfoType) {
        //   payload.categoryInfoType = data?.categoryInfoType
        // }
        // if (data?.rentModeNameType) {
        //   payload.rentModeNameType = data?.rentModeNameType
        // }
        // payloadSearch.value = payload
        return data
      }
      return {
        hasPermission,
        registerTable,
        exportExcelLoading,
        payloadSearch,
        timer,
        listData,
        loading,
      }
    },
  })
</script>
<style lang="less">
  .loading {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    z-index: 99;
    .ant-spin {
      position: absolute;
      bottom: 50%;
    }
  }
</style>
