<script setup lang="ts">
  import { Ref, ref, watch } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'

  const props = defineProps({
    pdata: Object,
  })
  const xlist = ref<any>([])
  const yqList = ref<any>([])
  const zzList = ref<any>([]) // 在租

  const pieChartRef = ref<HTMLDivElement | null>(null)
  const { setOptions } = useECharts(pieChartRef as Ref<HTMLDivElement>)
  watch(
    () => props.pdata,
    (data) => {
      xlist.value = [...data?.xlist] || []
      zzList.value = [...data?.ylist[0]?.map((v) => Number(v))] || []
      yqList.value = data?.ylist[1]?.map((v) => Number(v)) || []
      let infodata = ['新增订单数']
      const sortList = data?.ylist?.[0]?.sort((a, b) => Number(a) - Number(b))
      // const maxNumber = Math.floor(Number(sortList[sortList?.length - 1]) + 100000)
      // const minNumber = Math.floor(sortList[0])
      let yAxis = [
        {
          type: 'value',
          // min: minNumber,
          // max: maxNumber,
        },
      ]
      let series = [
        {
          name: '近30天新增订单数',
          type: 'line',
          stack: 'Stack1',
          yAxisIndex: 0,
          data: zzList.value,
        },
      ]

      if (infodata.length && yAxis.length && series.length) {
        new setOptions({
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: infodata,
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
    },
  )
</script>

<template>
  <div class="w-full h-72" ref="pieChartRef"></div>
</template>
<style>
  .w-full svg {
    padding-top: 0px !important;
  }
</style>
