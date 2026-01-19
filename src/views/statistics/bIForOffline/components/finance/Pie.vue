<script setup lang="ts">
  import { ref, Ref } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'

  defineExpose({ init })

  const pies = ref<HTMLDivElement | null>(null)
  const { setOptions } = useECharts(pies as Ref<HTMLDivElement>)

  const dlist = ref<any>([
    //   { value: 0, name: '首付金额', keys: 'downPayment' },
    //   { value: 0, name: '已还金额', keys: 'repaidAmount' },
    //   { value: 0, name: '待收租金金额', keys: 'repayAmount' },
    //   { value: 0, name: '逾期金额', keys: 'overdueAmount' },
    //   { value: 0, name: '罚金金额', keys: 'penaltyAmount' },
    { value: 0, name: '首付总金额', keys: 'downPayment' },
    { value: 0, name: '待收租金金额', keys: 'repayAmount' },
    { value: 0, name: '已还期数租金总额', keys: 'repaidAmount' },
    // { value: 0, name: '已结清订单总金额', keys: 'settleAmount' },
    { value: 0, name: '逾期租金总金额', keys: 'overdueAmount' },
  ])
  async function init(res: any, req: any) {
    dlist.value.forEach((v) => {
      Object.keys(res).forEach((o) => {
        if (v.keys == o) {
          if (v.keys == 'repayAmount') {
            const repay = Number(res['repayAmount']) - Number(res['overdueAmount'])
            v.value = Number(repay / 100) || 0
          } else {
            v.value = Number(res[o] / 100) || 0
          }
        }
      })
      return v
    })
    dlist.value.forEach((v) => {
      if (v.keys == 'settleAmount') {
        v.value = Number(req['settleAmount'] / 100) || 0
      }
    })
    setOptionsEchats()
  }
  function setOptionsEchats() {
    setOptions({
      title: {
        text: '租单资金统计',
        // subtext: "2023-08~2023-11",
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      label: {
        show: true,
        formatter: '{b}: {c} ({d}%)',
      },
      series: [
        {
          type: 'pie',
          radius: '70%',
          data: dlist.value,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    })
  }
</script>

<template>
  <div class="flex items-center justify-center" style="height: 500px">
    <div class="w-full h-full" ref="pies"></div>
  </div>
</template>
