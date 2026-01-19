<script setup lang="ts">
  import { onMounted, ref, Ref } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { getOrderLast30daysBill } from '/@/api/statistics'
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
  const y3list = ref<any>([])
  const loading = ref<any>(false)

  async function init() {
    loading.value = true
    const values = await validate()
    getOrderLast30daysBill({ rentType: 2, days: 30, ...values }).then((res: any) => {
      res = res.data
      xlist.value = res.xlist
      if (res.ylist[0] && res.ylist[0].length) {
        y1list.value = res.ylist[0].map((v) => Number((Number(v) * 100).toFixed(2)))
      }
      if (res.ylist[1] && res.ylist[1].length) {
        y2list.value = res.ylist[1].map((v) => Number((Number(v) * 100).toFixed(2)))
      }
      if (res.ylist[2] && res.ylist[2].length) {
        y3list.value = res.ylist[2].map((v) => Number((Number(v) * 100).toFixed(2)))
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
    ])
  })

  const colors = ['#5470C6', '#84bebd', '#80fbca']
  const { setOptions } = useECharts(lineRef as Ref<HTMLDivElement>)
  function setOptionsEchats() {
    setOptions({
      legend: {
        bottom: true,
        data: ['未逾期账单还款率', '首次逾期账单还款率', '多次逾期账单还款率'],
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
          name: '未逾期账单还款率',
          type: 'line',
          stack: 'Stack1',
          data: y1list.value,
          itemStyle: {
            color: colors[0], // 线的颜色
          },
        },
        {
          name: '首次逾期账单还款率',
          type: 'line',
          stack: 'Stack2',
          data: y2list.value,
          itemStyle: {
            color: colors[1], // 线的颜色
          },
        },
        {
          name: '多次逾期账单还款率',
          type: 'line',
          stack: 'Stack3',
          data: y3list.value,
          itemStyle: {
            color: colors[2], // 线的颜色
          },
        },
      ],
    })
  }
</script>

<template>
  <div>
    <div class="text-base font-bold mt-8 mb-3" size="large">
      <span>过往30天账单还款情况</span>
      <Tooltip placement="bottom" class="ml-3">
        <template #title>统计范围过往30天,月付类型数据;每日0点刷新</template>
        <InfoCircleOutlined :style="{ color: '#999', fontSize: '17px' }" />
      </Tooltip>
    </div>
    <BasicForm @register="registerForm" />
    <Spin tip="正在加载..." size="large" :spinning="loading">
      <div class="w-full" style="height: 450px" ref="lineRef"></div>
    </Spin>
  </div>
</template>

<style lang="less" scoped>
  ::v-deep.vben-basic-form .ant-form-item:not(.ant-form-item-with-help) {
    margin-bottom: 0 !important;
  }
</style>
