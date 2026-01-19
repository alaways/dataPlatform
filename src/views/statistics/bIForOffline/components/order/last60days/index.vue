<script setup lang="ts">
  import { onMounted, ref, Ref } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { getOrderLast60days } from '/@/api/statistics'
  import { searchFormSchema } from './data'
  import { Spin, Tooltip } from 'ant-design-vue'
  import { InfoCircleOutlined } from '@ant-design/icons-vue'

  const [registerForm, { updateSchema, validate }] = useForm({
    labelWidth: 100,
    schemas: searchFormSchema,
    showActionButtonGroup: false,
  })

  const lineRef = ref<HTMLDivElement | null>(null)

  const xlist = ref<any>([])
  const y1list = ref<any>([])
  const y2list = ref<any>([])
  const objectExt = ref<any>({
    periodNo3: 0,
    periodNo2: 0,
  })
  const loading = ref<any>(false)

  async function init() {
    loading.value = true
    const values = await validate()
    getOrderLast60days({ days: 60, ...values }).then((res: any) => {
      res = res.data
      xlist.value = res.xlist
      objectExt.value = res.objectExt

      // ylist: 0.第2期账单 1.第3期及以上
      y1list.value = res.ylist[1]
      y2list.value = res.ylist[0]
      if (res.ylist[1] && res.ylist[1].length) {
        y1list.value = res.ylist[1].map((v) => Number((v * 100).toFixed(2)))
      }
      if (res.ylist[0] && res.ylist[0].length) {
        y2list.value = res.ylist[0].map((v) => Number((v * 100).toFixed(2)))
      }
      loading.value = false
      setOptionsEchats()
    })
  }

  onMounted(() => {
    init()
    updateSchema([
      {
        field: 'spuType',
        componentProps: {
          onChange: () => init(),
        },
      },
      {
        field: 'rentType',
        componentProps: {
          onChange: () => init(),
        },
      },
      {
        field: 'goodsLeaseType',
        componentProps: {
          onChange: () => init(),
        },
      },
    ])
  })

  function toRate(num: number) {
    return (num * 100).toFixed(2)
  }

  const colors = ['#5470C6', '#84bebd']
  const { setOptions } = useECharts(lineRef as Ref<HTMLDivElement>)
  function setOptionsEchats() {
    setOptions({
      legend: {
        bottom: true,
        data: ['金额还款率【即:第3期及以上】', '金额还款率【即:第2期账单】'],
      },
      grid: {
        top: '8%',
        left: '2%',
        right: '3%',
        bottom: '8%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xlist.value,
      },
      yAxis: {
        type: 'value',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
        formatter: function (params) {
          var relVal = params[0].name
          for (var i = 0, l = params.length; i < l; i++) {
            relVal +=
              '<br/>' + params[i].marker + params[i].seriesName + ':   ' + params[i].value + '%'
          }
          return relVal
        },
      },
      series: [
        {
          name: '金额还款率【即:第3期及以上】',
          type: 'line',
          stack: 'Stack1',
          data: y1list.value,
          itemStyle: {
            color: colors[0], // 线的颜色
          },
        },
        {
          name: '金额还款率【即:第2期账单】',
          type: 'line',
          stack: 'Stack2',
          data: y2list.value,
          itemStyle: {
            color: colors[1], // 线的颜色
          },
        },
      ],
    })
  }
</script>

<template>
  <div>
    <div class="text-base font-bold mt-8 mb-3" size="large">
      <span>过往60天到期账单数据</span>
      <Tooltip v-if="0" placement="bottom" class="ml-3">
        <template #title>过往60天,月付类型账单;</template>
        <InfoCircleOutlined :style="{ color: '#999', fontSize: '17px' }" />
      </Tooltip>
    </div>
    <BasicForm @register="registerForm" />
    <div>
      <span class="txt">过往7天各项的平均还款率: </span>
      <span class="txt">金额还款率【即:第2期账单】: {{ toRate(objectExt.periodNo2) }}%</span>
      <span class="txt">金额还款率【即:第3期及以上】: {{ toRate(objectExt.periodNo3) }}%</span>
    </div>
    <Spin tip="正在加载..." size="large" :spinning="loading">
      <div class="w-full" style="height: 450px" ref="lineRef"></div>
    </Spin>
  </div>
</template>

<style lang="less" scoped>
  ::v-deep.vben-basic-form .ant-form-item:not(.ant-form-item-with-help) {
    margin-bottom: 0 !important;
  }

  .txt {
    line-height: 50px;
    font-size: 16px;
    margin-right: 20px;
    color: red;
  }
</style>
