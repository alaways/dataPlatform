<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { BasicTable, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { getProjectOrder } from '/@/api/statistics/index'
  import { message } from 'ant-design-vue'
  import { handleMonth1 } from '/@/utils/order'
  export default defineComponent({
    name: 'TotalAllPie',
    components: { BasicTable },
    setup() {
      const { hasPermission } = usePermission()
      const paramsData = ref(beforeFetch({time: handleMonth1()}))
      const handleSearchInfoChange = async (params) => {
        
        if (!params?.orderCreateTimeBegin || params.orderCreateTimeBegin == undefined) return
        console.log(params, 'paramsShow')
        paramsData.value = params
        init()
      }
      const [registerTable, { setTableData, setLoading }] = useTable({
        title: '',
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
        handleSearchInfoFn: handleSearchInfoChange,
      })
      // 处理参数
      function beforeFetch(data: any) {
        const payload = {
          cursor: data.cursor,
          limit: data.limit,
          orderCreateTimeBegin: data?.time?.[0],
          orderCreateTimeEnd: data?.time?.[1],
        }
        return payload
      }
      const timer = ref(null)
      const baseTimeFn = () => {
        timer.value = setInterval(() => {
          init()
        }, 4000)
      }
      const init = async () => {
        setLoading(true)
        const params = {
          orderCreateTimeBegin: handleMonth1()?.[0],
          orderCreateTimeEnd: handleMonth1()?.[1],
        }
        const res = await getProjectOrder({...beforeFetch(paramsData?.value), ...params})
        if (res?.code == 501) {
          clearInterval(timer.value)
          await baseTimeFn()
        } else {
          clearInterval(timer.value)
          if (res?.code == 200) {
            setLoading(false)
            setTableData(res?.data)
          } else {
            if (res?.message != '请勿重复执行') message.warn(res?.message)
          }
        }
      }
      onMounted(() => {
        init()
      })
      const cutRes = ref(null)
      return {
        hasPermission,
        cutRes,
        registerTable,
      }
    },
  })
</script>
