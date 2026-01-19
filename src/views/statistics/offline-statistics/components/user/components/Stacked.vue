<script setup lang="ts">
  import { ref, Ref } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  import { getUserCount } from '/@/api/statistics'

  const chartRef = ref<HTMLDivElement | null>(null)
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)

  const xlist = ref<any>([])
  const y1list = ref<any>([])
  const y2list = ref<any>([])
  const y3list = ref<any>([])
  init()
  async function init() {
    let res: any = await getUserCount()
    res = res.data
    xlist.value = res.xlist
    y1list.value = res.ylist[0]
    y2list.value = res.ylist[1]
    y3list.value = res.ylist[2]
    setOptionsEchats()
  }
  function setOptionsEchats() {
    setOptions({
      title: {
        text: '用户统计',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        data: ['注册用户', '实名认证', '成交用户'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: xlist.value,
          // data: ["7天", "15天", "30天", "45天", "60天", "75天", "90天"]
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '注册用户',
          type: 'line',
          stack: 'Total1',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: y1list.value,
        },
        {
          name: '实名认证',
          type: 'line',
          stack: 'Total2',
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: y2list.value,
        },
        {
          name: '成交用户',
          type: 'line',
          stack: 'Total3',
          // label: {
          //   show: true,
          //   position: 'top',
          // },
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: y3list.value,
        },
      ],
    })
  }
</script>

<template>
  <div class="w-full h-full" ref="chartRef"></div>
</template>
