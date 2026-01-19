<script setup lang="ts">
  import { ref, Ref } from 'vue'
  import { getUserCountInfo } from '/@/api/statistics'
  import { useECharts } from '/@/hooks/web/useECharts'

  const chartRef = ref<HTMLDivElement | null>(null)
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>)

  const dlist = ref<any>([
    { value: 0, name: '注册数', keys: 'countUser' },
    { value: 0, name: '实名认证数', keys: 'countRealNameUser' },
    { value: 0, name: '成交用户数', keys: 'countRentUser' },
  ])
  init()
  async function init() {
    let res: any = await getUserCountInfo()
    res = res.data
    dlist.value.forEach((v) => {
      Object.keys(res).forEach((o) => {
        if (v.keys == o) {
          v.value = Number(res[o]) || 0
        }
      })
      return v
    })
    setOptionsEchats()
  }
  function setOptionsEchats() {
    setOptions({
      title: {
        text: '用户转化漏斗',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c}',
      },
      // legend: {},
      series: [
        {
          name: 'Funnel',
          type: 'funnel',
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
          min: 0,
          max: 10000,
          minSize: '30%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
            formatter: '{b} : {c}',
            color: '#fff',
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 0,
          },
          emphasis: {
            label: {
              fontSize: 20,
            },
          },
          data: dlist.value,
        },
      ],
    })
  }
</script>

<template>
  <div class="w-full h-full" ref="chartRef"></div>
</template>
