<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { message } from 'ant-design-vue'
  import { handleMonth1 } from '/@/utils/order'
  import  dayjs from 'dayjs'
  const props = {
    api: Function,
    api2: Function,
    columns: Array,
    searchFormSchema: Array,
    columns1: Array,
  }
  export default defineComponent({
    name: 'TotalAllPie',
    components: { BasicTable },
    props,
    setup(props) {
      const paramsData = ref(beforeFetch({time: handleMonth1()}))
      const handleSearchInfoChange = async (params) => {
        
        const falgStatus = (!params?.orderCreateTimeBegin || params.orderCreateTimeBegin == undefined) && !params.time
        console.log(falgStatus, params, 'paramsShow')
        if (falgStatus && !params.type) return
        
        if (params?.time?.[0]) {
          params.orderCreateTimeBegin = `${dayjs(params?.time?.[0]).format('YYYY-MM-DD')} 00:00:00`
        }
        if (params?.time?.[1]) {
          params.orderCreateTimeEnd = `${dayjs(params?.time?.[1]).format('YYYY-MM-DD')} 23:59:59`
        }
        if (params.time) delete params.time
        console.log('搜索参数', params)
        paramsData.value = params
        // 我是逾期率 type
        if (params.type) {
          console.log(params, 'dataTypeSHow')
          const apiObj = {
            1: props?.api,
            2: props?.api2
          }
          if (params.type == 2) {
            setColumns(props.columns1)
          } else {
            setColumns(props.columns)
          }
          
          init(apiObj[params.type])
        } else {
          init(props?.api)
        }
      }
      const [registerTable, { setTableData, setLoading, setColumns }] = useTable({
        title: '',
        columns:  props?.columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 80,
          schemas: props?.searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: props?.searchFormSchema?.length ? true : false,
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
        if (data?.time?.[0]) {
          payload.orderCreateTimeBegin = `${data?.time?.[0]} 00:00:00`
        }
        if (data?.time?.[1]) {
          payload.orderCreateTimeEnd = `${data?.time?.[0]} 23:59:59`
        }
        console.log('payload 参数', payload)
        if (payload.time) delete payload.time
        return payload
      }
      const timer = ref(null)
      const baseTimeFn = (api) => {
        timer.value = setInterval(() => {
          init(api)
        }, 4000)
      }
      const init = async (api: any) => {
        setLoading(true)
        const params = paramsData.value
        const res = await api({...beforeFetch(paramsData?.value), ...params})
        if (res?.code == 501) {
          clearInterval(timer.value)
          await baseTimeFn(api)
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
        init(props.api)
      })
      const cutRes = ref(null)
      return {
        cutRes,
        registerTable,
      }
    },
  })
</script>
