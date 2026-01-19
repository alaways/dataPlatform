<script setup lang="ts">
  import { onMounted, Ref, ref } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  import { getOrderOfLine } from '/@/api/statistics/index'

  const pieChartRef = ref<HTMLDivElement | null>(null)
  const { setOptions } = useECharts(pieChartRef as Ref<HTMLDivElement>)
  onMounted(async () => {
    const res = await getOrderOfLine({ type: 1 })
    const data = res?.data
    if (data) {
      setOptions({
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['预授权通过率(单位%)', '机审通过率(单位%)', '人审通过率(单位%)'],
        },
        xAxis: {
          type: 'category',
          data: data.xlist,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          { name: '预授权通过率(单位%)', type: 'line', data: data?.fronzenList || [] },
          { name: '机审通过率(单位%)', type: 'line', data: data?.riskList || [] },
          { name: '人审通过率(单位%)', type: 'line', data: data?.rsAuditList || [] },
        ],
      })
    }
  })
</script>

<template>
  <div class="w-full h-72 orderLineCont" ref="pieChartRef"></div>
</template>
<style>
  .w-full svg {
    padding-top: 0px !important;
  }
  .orderLineCont {
    height: 450px;
  }
</style>
