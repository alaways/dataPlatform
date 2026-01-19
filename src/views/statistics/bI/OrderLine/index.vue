<script setup lang="ts">
  import { ref, defineProps, watch } from 'vue'
  import Line from './Line.vue'
  import { Col, Row, Card } from 'ant-design-vue'
  import { orderDataLineChartByMayi } from '/@/api/statistics/index'
  const props = defineProps({
    type: String,
    params: Object || {},
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
  async function init() {
    const res = await orderDataLineChartByMayi({ type: props.type, ...props.params })
    const pdata = JSON.parse(JSON.stringify(res.data))
    pdata.ylist?.map((item: any) => {
      const allLen = item.filter((citem) => citem === '0')
      if (allLen.length == item.length) {
        notHas.value = new Date().valueOf()
      } else {
        notHas.value = false
      }
    })
    console.log(pdata, 'pdataShow')
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
