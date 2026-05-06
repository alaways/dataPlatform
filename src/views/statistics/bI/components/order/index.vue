<template>
  <Card title="订单汇总">
    <HeaderShow :timer="String(timer)" @resetHanlder="resetHanlder" />
    <!-- 表格数据 -->
    <BasicTable @register="registerTable">
      <template #toolbar>
        <div class="loading" v-if="loading">
          <Spin />
        </div>
        <Button type="primary" size="small" :loading="exportExcelLoading" @click="onExportOrderData"> 导出 </Button>
      </template>
    </BasicTable>
    <!-- 曲线图 -->
    <OrderLine :merchantTerminalNoList="payloadSearch?.merchantTerminalNoList" />
    <!-- 发货曲线图 -->
    <DeliveryLine :merchantTerminalNoList="payloadSearch?.merchantTerminalNoList" />
  </Card>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { Card, Button, Spin } from 'ant-design-vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { BasicTable, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import dayjs from 'dayjs'
  import { orderInfoAsync } from '/@/api/statistics/index'
  import { isIEBrowse } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import OrderLine from './OrderLine/index.vue'
  import { getDataForId } from '../../utils'
  import HeaderShow from '../../HeaderShow.vue'
  import DeliveryLine from './Delovery/index.vue'
  export default defineComponent({
    name: 'TotalAllPie',
    components: { HeaderShow, Card, BasicTable, Button, OrderLine, DeliveryLine, Spin },
    setup() {
      const { hasPermission } = usePermission()
      const [registerTable, { setTableData, getForm, getPaginationRef }] = useTable({
        title: '',
        beforeFetch,
        api: (payload) => getListData(payload),
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
      const id = ref()
      const exportExcelLoading = ref(false)
      const { createMessage } = useMessage()
      const payloadSearch = ref({})
      const listData = ref([])
      const timer = ref()
      // 重新获取统计数据
      const resetHanlder = async () => {
        const from = getForm()
        loading.value = true
        // 重新组装一遍数据
        const payload = await beforeFetch(from?.getFieldsValue())
        const nres = await orderInfoAsync(payload, { updateForce: 1 })
        id.value = nres?.id
        if (nres?.id) {
          timer.value = nres?.updateTime
          getDataForId(nres?.id, listData)
        }
      }
      const getListData = async (payload) => {
        loading.value = true
        const nres = await orderInfoAsync(payload, { updateForce: 0 })
        id.value = nres?.id
        if (nres?.id) {
          timer.value = nres?.updateTime
          getDataForId(nres?.id, listData)
        }
      }
      watch(
        () => listData.value,
        (res: any) => {
          if (res) {
            if (res) {
              loading.value = false
            }
            setTableData(res)
          }
        },
      )
      // 处理参数
      async function beforeFetch(data: any) {
        const payload = {
          cursor: data.cursor,
          limit: data.limit,
          startTime: dayjs(data.time[0]).format('YYYY-MM-DD'),
          endTime: dayjs(data.time[1]).format('YYYY-MM-DD'),
          categoryIdList: data.categoryIdList || [],
          merchantTerminalNoList: data?.merchantTerminalNoList?.join(',') || '',
        }
        payloadSearch.value = payload
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
        payloadSearch,
        timer,
        listData,
        resetHanlder,
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
