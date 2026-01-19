<script setup lang="ts">
  import { onMounted, ref, Ref } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { getOrderLast30days } from '/@/api/statistics'
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
  const loading = ref<any>(false)

  async function init() {
    loading.value = true
    const values = await validate()
    getOrderLast30days({ rentType: 2, days: 30, ...values }).then((res: any) => {
      res = res.data
      xlist.value = res.xlist
      // ylist: 0.首付 1.租金
      y1list.value = res.ylist[0]
      y2list.value = res.ylist[1]
      if (res.ylist[0] && res.ylist[0].length) {
        y1list.value = res.ylist[0].map((v) => Number((v / 100).toFixed(2)))
      }
      if (res.ylist[1] && res.ylist[1].length) {
        y2list.value = res.ylist[1].map((v) => Number((v / 100).toFixed(2)))
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

  const colors = ['#5470C6', '#84bebd']
  const { setOptions } = useECharts(lineRef as Ref<HTMLDivElement>)
  function setOptionsEchats() {
    setOptions({
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: true,
        data: ['租金-首付款(单位:￥)', '租金(单位:￥)'],
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
      series: [
        {
          name: '租金-首付款(单位:￥)',
          type: 'line',
          stack: 'Stack1',
          data: y1list.value,
          itemStyle: {
            color: colors[0], // 线的颜色
          },
        },
        {
          name: '租金(单位:￥)',
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
  <div class="last30days">
    <div class="text-base font-bold mt-8 mb-3" size="large">
      <span>过往30天每日收款数据</span>
      <Tooltip overlayClassName="last30daysTooltip" placement="bottom" class="ml-3">
        <template #title>
          <div>①金额取值: 需要含罚金、锁费、公证费、增值服务费用 </div>
          <div>②订单状态取值: 租赁生效中、已逾期、已买断、已完结 </div>
          <div>③时间范围: 每天00:00:00-23:59:59时间区间内的所有支付金额 </div>
          <div>④实时查询: 假设23号手动入账20号的收款,则20号当天数据需要增加对应的收款金额 </div>
        </template>
        <InfoCircleOutlined :style="{ color: '#999', fontSize: '17px' }" />
      </Tooltip>
    </div>
    <BasicForm @register="registerForm" />
    <Spin tip="正在加载..." size="large" :spinning="loading">
      <div class="w-full" style="height: 450px" ref="lineRef"></div>
    </Spin>
  </div>
</template>

<style lang="less">
  .last30days {
    ::v-deep.vben-basic-form .ant-form-item:not(.ant-form-item-with-help) {
      margin-bottom: 0 !important;
    }
  }

  .last30daysTooltip {
    .ant-tooltip-content {
      .ant-tooltip-inner {
        width: 630px !important;
      }
    }
  }
</style>
