<script setup lang="ts">
  import { ref, watch, type Ref } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  const props = defineProps({
    pdata: Object,
  })

  const chartRef = ref<HTMLDivElement | null>(null)
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)
  const dlist = ref<any>([])
  dlist.value = props.pdata || []

  setOptionsEchats()
  function setOptionsEchats() {
    setOptions({
      title: {
        text: '用户等级分布图',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: ['全部', 'S类', 'A类', 'B类', 'C类', '其他'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          type: 'bar',
          stack: 'Total',
          itemStyle: {
            borderColor: '#4d8fe5',
            color: '#4d8fe5',
          },
          label: {
            show: true,
            position: 'inside',
            color: '#fff',
          },
          data: dlist.value,
        },
      ],
    })
  }
  watch(
    () => props.pdata,
    () => {
      dlist.value = props.pdata
      setOptionsEchats()
    },
  )
</script>

<template>
  <div class="w-full" style="height: 500px" ref="chartRef"></div>
</template>
