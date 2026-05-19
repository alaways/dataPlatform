<script setup lang="ts">
  import { ref, defineProps, watch } from 'vue'
  import Line from './Line.vue'
  import { Col, Row, Card } from 'ant-design-vue'
  import { orderDataLineChart, orderDataLineChartByMayi } from '/@/api/statistics/index'
  const props = defineProps({
    type: String,
    params: Object || {},
    parentType: String || Number,
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
    () => props.parentType,
    () => {
      init()
    },
  )
  async function init() {
    let res = null
    let resMayi = null
    let resLLx = null
    // 全部 或者没有 默认全部
    if (props.parentType == 'all' || !props.parentType) {
      res = await orderDataLineChart({ type: 1, ...props.params })
      resLLx = await orderDataLineChart({ type: 2, ...props.params })
      resMayi = await orderDataLineChartByMayi({ type: 1, ...props.params, merchantTerminalNoList: '2021004105683179,2023111709466887' })
    }
    if (props.parentType == 'offline') {
      res = await orderDataLineChart({ type: 1, ...props.params })
    }
    if (props.parentType == 'online') {
      resMayi = await orderDataLineChartByMayi({ type: 1, ...props.params, merchantTerminalNoList: '2021004105683179,2023111709466887' }) 
    }
    if (props.parentType == 'llxz') {
      resLLx = await orderDataLineChart({ type: 2, ...props.params })
    }
    const objAll = {
      'online': resMayi?.data?.ylist || [],
      'offline': res?.data?.ylist || [],
      'llxz': resLLx?.data?.ylist || [],
    }
    let pdata = {
      xlist: props.parentType == 'online' ? resMayi?.data?.xlist : res?.data?.xlist || [],
      ylist: objAll[props.parentType],
      objectExt: null
    }
    let nData = {}
    let tData = {}
    let llData = {}
    // 全部都有
    if (res || resMayi || resLLx) {
      if (props.parentType == 'online') {
        tData = JSON.parse(JSON.stringify(resMayi?.data))
      }
      if (props.parentType == 'offline') {
        nData = JSON.parse(JSON.stringify(res?.data))
      }
      if (props.parentType == 'llxz' && Object.keys(resLLx?.data).length) {
        llData = JSON.parse(JSON.stringify(resLLx?.data))
      }
      // 所有的数据
      if (props.parentType == 'all' || !props.parentType) {
        tData = JSON.parse(JSON.stringify(resMayi?.data))
        nData = JSON.parse(JSON.stringify(res?.data))
        llData = JSON.parse(JSON.stringify(resLLx?.data))
      }
    }
    // 全部才加数据
    if (props.parentType == 'all' || !props.parentType) {
      pdata.ylist = nData?.ylist?.map((item: any, index: number) => {
        item = item?.map((citem: any, cindex: any) => {
          let nitem = Number(citem)
          if (tData) nitem += Number(tData?.ylist?.[index]?.[cindex])
          if (llData && Object.keys(llData)?.length && llData?.ylist?.[0]?.length) nitem += Number(llData?.ylist?.[index]?.[cindex])
          return nitem
        })
        return item
      })
    }
    pdata?.ylist?.map((item: any) => {
      const allLen = item.filter((citem) => citem === '0')
      if (allLen.length == item.length) {
        notHas.value = new Date().valueOf()
      } else {
        notHas.value = false
      }
    })
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
