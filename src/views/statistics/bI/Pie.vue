<script setup lang="ts">
  import { ref, Ref, defineEmits } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  import { Button } from 'ant-design-vue'
  defineExpose({ init })
  const emit = defineEmits(['onChange'])
  const pies = ref<HTMLDivElement | null>(null)
  const { setOptions } = useECharts(pies as Ref<HTMLDivElement>)
  const dlist = ref<any>([
    { value: 0, name: '在租首付总金额', keys: 'totalDownPayment' },
    { value: 0, name: '在租待收租金总金额', keys: 'amountRentLease' },
    { value: 0, name: '在租订单逾期租金总金额', keys: 'amountOverdueRent' },
    { value: 0, name: '在租已还期数租金总金额', keys: 'amountRentPaidInstallments' },
  ])
  const dAlllist = ref<any>([
    { value: 0, name: '首付总金额', keys: 'totalDownPaymentAmount' },
    { value: 0, name: '已收总金额', keys: 'totalAmountReceived' },
    { value: 0, name: '逾期待收账单总金额', keys: 'rentTotalOverOrderAmount' },
    { value: 0, name: '未到期待收账单总金额', keys: 'rentTotalNotOverOrderAmount' },
  ])
  const currentSHowKey = ref('2')
  const parentData = ref(null)
  async function init(event, data) {
    if (data) parentData.value = data
    const currentList = event == '1' ? dlist.value : dAlllist.value
    const nlist = currentList.map((item: any) => {
      if (data[item.keys] != null && data[item.keys] != undefined) {
        item.value = data[item.keys]
        return item
      }
    })
    if (currentList == '1') {
      dlist.value = [...nlist]
    }
    if (currentList == '2') {
      dAlllist.value = [...nlist]
    }
    setOptionsEchats()
  }
  function setOptionsEchats() {
    const currentList = currentSHowKey.value == '1' ? dlist.value : dAlllist.value
    setOptions({
      title: {
        text: '租单资金统计',
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
          data: [...currentList],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: '#fff',
            },
          },
        },
      ],
    })
  }
  const changeRadio = (event) => {
    currentSHowKey.value = event
    emit('onChange', event)
    // if (parentData.value) init(event, parentData.value)
  }
</script>

<template>
  <div>
    <div class="tabTit">
      <Button
        value="2"
        :type="currentSHowKey == '2' ? 'primary' : null"
        @click="() => changeRadio('2')"
        >总订单</Button
      >
      <Button
        value="1"
        :type="currentSHowKey == '1' ? 'primary' : null"
        @click="() => changeRadio('1')"
        >在租订单</Button
      >
    </div>
    <div class="flex items-center justify-center" style="height: 500px">
      <div class="w-full h-full" ref="pies"></div>
    </div>
  </div>
</template>
<style>
  .tabTit {
    padding: 20px;
    background: #fff;
  }

  .w-full svg {
    padding-top: 30px;
    background: #fff;
  }
</style>
