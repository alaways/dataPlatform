<script setup lang="ts">
  import { ref, defineProps, watch } from 'vue'
  import Line from './Line.vue'
  import { Col, Row, Card } from 'ant-design-vue'
  import { orderDataLineChart, orderDataLineChartByMayi } from '/@/api/statistics/index'
  const props = defineProps({
    type: String,
    params: Object || {},
    dataSource: String,
  })
  const loading = ref<boolean>(true)
  const dlist = ref([])
  const notHas = ref<any>()
  init()
  watch(
    () => props.params,
    () => {
      init()
    },
  )
  watch(
    () => props.dataSource,
    () => {
      init()
    },
  )
  async function init() {
    // 线下
    const offlineRes = await orderDataLineChart({ type: props.type, ...props.params })
    // 线上
    const onlineRes = await orderDataLineChartByMayi({ type: props.type, ...props.params })
    const ylist = []
    await Promise.all([offlineRes, onlineRes]).then((res: any) => {
      if (!res) return
      const offlineData = offlineRes?.data.ylist[0]
      const onlineData = onlineRes?.data.ylist[0]
      if (offlineData?.length && onlineData?.length) {
        offlineData?.map((item: any, index: number) => {
          onlineData.find((oitem, oindex) => {
            if (oindex == index) {
              ylist.push( Number(oitem) + Number(item) )
            }
          })
        })
      }
    })
    const xlist = offlineRes?.data?.xlist?.length ? offlineRes?.data?.xlist : onlineRes?.data?.xlist
    const pdata = {
      xlist,
      ylist: [ylist],
    }
    dlist.value = pdata
    loading.value = !loading.value
  }
</script>

<template>
  <Card shadow="hover">
    <Row class="pb-3 mb-2 border-b-2 border-slate-100">
      <Col :span="14" class="text-base font-semibold">近30天新增订单数</Col>
    </Row>
    <Line :pdata="dlist" v-show="!notHas" />
    <div v-show="notHas">当前查询条件，暂无数据</div>
  </Card>
</template>
