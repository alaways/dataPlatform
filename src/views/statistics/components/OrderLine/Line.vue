<script setup lang="ts">
  import { Ref, ref } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'

  const props = defineProps({
    pdata: Object,
  })
  const xlist = ref<any>([])
  const yqList = ref<any>([])
  const zzList = ref<any>([]) // 在租

  const pieChartRef = ref<HTMLDivElement | null>(null)
  const { setOptions } = useECharts(pieChartRef as Ref<HTMLDivElement>)
  xlist.value = props.pdata?.xlist || []
  zzList.value = props.pdata?.ylist[0]?.map((v) => Number(v)) || []
  yqList.value = props.pdata?.ylist[1]?.map((v) => Number(v)) || []
  let data = ['新增订单']
  let yAxis = [{ type: 'value', name: '新增订单' }]
  let series = [
    { name: '新增订单', type: 'line', stack: 'Stack1', yAxisIndex: 0, data: zzList.value },
  ]

  if (data.length && yAxis.length && series.length) {
    setOptions({
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        // right: true,
        // data: ["新增订单"]
        data,
      },
      grid: {
        top: '14%',
        left: '2%',
        right: '3%',
        bottom: '2%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xlist.value,
      },
      yAxis,
      series,
    })
  }
</script>

<template>
  <div class="w-full h-72" ref="pieChartRef"></div>
</template>
