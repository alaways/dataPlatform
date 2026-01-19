<script setup lang="ts">
  import { onMounted, ref, Ref } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  import { getOrderCountForMonth } from '/@/api/statistics'
  import { Spin } from 'ant-design-vue'

  const lineRef = ref<HTMLDivElement | null>(null)

  const xlist = ref<any>([])
  const y1list = ref<any>([])
  const y2list = ref<any>([])
  const loading = ref<any>(false)

  onMounted(() => {
    init()
  })
  async function init() {
    loading.value = true
    let res: any = await getOrderCountForMonth()
    res = res.data
    xlist.value = res.xlist
    y1list.value = res.ylist[0]
    y2list.value = res.ylist[1]
    setOptionsEchats()
    loading.value = false
  }

  const { setOptions } = useECharts(lineRef as Ref<HTMLDivElement>)
  function setOptionsEchats() {
    setOptions({
      tooltip: {
        trigger: 'axis',
      },
      legend: {},
      grid: {
        left: '6%',
        right: '6%',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xlist.value,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} ',
        },
      },
      series: [
        {
          name: '在租',
          type: 'line',
          data: y1list.value,
          markPoint: {
            data: [
              {
                type: 'max',
                name: 'Max',
                label: {
                  show: true,
                  color: '#fff',
                },
              },
              {
                type: 'min',
                name: 'Min',
                label: {
                  show: true,
                  color: '#fff',
                },
              },
            ],
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }],
          },
        },
        {
          name: '逾期',
          type: 'line',
          data: y2list.value,
          markPoint: {
            data: [
              {
                name: '最低',
                value: -2,
                xAxis: 1,
                yAxis: -1.5,
                label: {
                  show: true,
                  color: '#fff',
                },
              },
            ],
          },
          markLine: {
            data: [
              { type: 'average', name: 'Avg' },
              [
                {
                  symbol: 'none',
                  x: '90%',
                  yAxis: 'max',
                },
                {
                  symbol: 'circle',
                  label: {
                    position: 'start',
                    formatter: 'Max',
                  },
                  type: 'max',
                  name: '最高点',
                },
              ],
            ],
          },
        },
      ],
    })
  }
</script>

<template>
  <Spin tip="正在加载..." size="large" :spinning="loading">
    <div class="w-full" style="height: 450px" ref="lineRef"></div>
  </Spin>
</template>
