<template>
  <BasicTable @register="registerTable">
    <template #toolbar>
      <div class="loading" v-if="loading">
        <Spin />
      </div>
    </template>
  </BasicTable>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { message, Spin } from 'ant-design-vue'
  import { handleMonth1 } from '/@/utils/order'
  import dayjs from 'dayjs'
  import { getDataForId } from '../../utils'
  const props = {
    api: Function,
    api2: Function,
    columns: Array,
    searchFormSchema: Array,
    columns1: Array,
    notTime: Boolean,
    isChangeSearch: Boolean,
    isAsync: Boolean,
    ParamsNotTime: Boolean,
  }
  export default defineComponent({
    name: 'TotalAllPie',
    components: { BasicTable, Spin },
    emits: ['onSearch'],
    props,
    setup(props, { emit }) {
      const listData = ref([])
      const loading = ref(false)
      const paramsData: any = ref(beforeFetch({ time: handleMonth1() }))
      const handleSearchInfoChange = async (params: any) => {
        const falgStatus: any = (!params?.orderCreateTimeBegin || params.orderCreateTimeBegin == undefined) && !params.time
        // 我包含有切换搜索
        if (params.categoryInfoType) {
          params.categoryInfoType = params.categoryInfoType
        }
        if (props?.ParamsNotTime) {
          paramsData.value = params
          return init(props?.api)
        }
        if (falgStatus && !params.type && !props.notTime) return
        if (params?.time?.[0]) {
          params.orderCreateTimeBegin = `${dayjs(params?.time?.[0]).format('YYYY-MM-DD')} 00:00:00`
        }
        if (params?.time?.[1]) {
          params.orderCreateTimeEnd = `${dayjs(params?.time?.[1]).format('YYYY-MM-DD')} 23:59:59`
        }
        if (params?.merchantTerminalNoList) {
          params.merchantTerminalNoList = params?.merchantTerminalNoList?.join(',')
        }
        if (params.term) {
          params.term = params.term
        }
        if (params.time) delete params.time
        paramsData.value = params
        // 我是逾期率 type
        if (params.type) {
          const apiObj = {
            1: props?.api,
            2: props?.api2,
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
        const payload: any = {
          cursor: data.cursor,
          limit: data.limit,
          orderCreateTimeBegin: data?.time?.[0],
          orderCreateTimeEnd: data?.time?.[1],
          categoryInfoType: data?.categoryInfoType,
          term: data.term || 2,
        }
        if (data?.time?.[0]) {
          payload.orderCreateTimeBegin = `${data?.time?.[0]} 00:00:00`
        }
        if (data?.time?.[1]) {
          payload.orderCreateTimeEnd = `${data?.time?.[0]} 23:59:59`
        }
        if (payload.time) delete payload.time
        if (props?.ParamsNotTime) {
          if (payload.orderCreateTimeBegin) delete payload.orderCreateTimeBegin
          
          if (payload.orderCreateTimeEnd) delete payload.orderCreateTimeEnd
        }
        
        return payload
      }
      const timer: any = ref(null)
      const baseTimeFn = (api) => {
        timer.value = setInterval(() => {
          init(api)
        }, 4000)
      }
      watch(
        () => listData.value,
        (res: any) => {
          if (res) {
            loading.value = false
            setLoading(false)
            setTableData(res)
          }
        },
      )
      const init = async (api: any) => {
        setLoading(true)
        const params = paramsData.value
        const res = await api({ ...beforeFetch(paramsData?.value), ...params })
        if (props.isAsync) {
          setLoading(false)
          loading.value = true
          getDataForId(res?.data?.id, listData)
          return
        }
        loading.value = false
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
        loading,
        registerTable,
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
