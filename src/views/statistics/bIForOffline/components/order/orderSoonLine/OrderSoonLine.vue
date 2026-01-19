<script setup lang="ts">
  import { computed, onMounted, ref, Ref } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  import { getUpcomingBills } from '/@/api/statistics'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { searchFormSchema } from './data'
  import { Spin, Tooltip } from 'ant-design-vue'
  import { InfoCircleOutlined } from '@ant-design/icons-vue'
  import { formatNumber } from '/@/utils/tool'

  const loading = ref<any>(false)
  const countType = ref<any>(1)

  const info = computed(() => {
    const obj = {
      1: { color: '#5470C6', name: '即将到期的账单数' },
      2: { color: '#84bebd', name: '即将到期金额(单位: ￥)' },
      3: { color: '#f50', name: '即将到期的订单数' },
    }
    return obj[countType.value]
  })

  const [registerForm, { updateSchema, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas: searchFormSchema,
    showActionButtonGroup: false,
  })

  const lineRef = ref<HTMLDivElement | null>(null)

  const xlist = ref<any>([])
  const y1list = ref<any>([])
  const listAll = ref<any>([])

  const amount = computed(() => {
    if (y1list.value && y1list.value.length && countType.value == 2) {
      const sum = y1list.value.reduce(
        (accumulator, currentValue) => Number(accumulator) + Number(currentValue),
        0,
      )
      return formatNumber(sum, 2, '.', ',', '', '', true)
    }
    return 0
  })

  async function init(isRefresh = false) {
    loading.value = true
    if (listAll.value && listAll.value.length && !isRefresh) {
      if (countType.value == 1) {
        y1list.value = listAll.value[0]
      } else if (countType.value == 2) {
        const data = listAll.value[1]
        if (data && data.length) {
          y1list.value = data.map((v) => Number((v / 100).toFixed(2)))
        }
      } else if (countType.value == 3) {
        y1list.value = listAll.value[2]
      }
      setOptionsEchats()
      loading.value = false
      return
    }
    const values = await validate()
    let res: any = await getUpcomingBills({
      ...values,
    })
    res = res.data
    listAll.value = res.ylist
    xlist.value = res.xlist

    if (countType.value == 1) {
      y1list.value = res.ylist[0]
    } else if (countType.value == 2) {
      const data = res.ylist[1]
      if (data && data.length) {
        y1list.value = data.map((v) => Number((v / 100).toFixed(2)))
      }
    } else if (countType.value == 3) {
      y1list.value = listAll.value[2]
    }
    setOptionsEchats()
    loading.value = false
  }

  onMounted(() => {
    setFieldsValue({
      countType: 1,
    })
    init()
    updateSchema([
      {
        field: 'countType',
        componentProps: {
          onChange: (e) => {
            if (typeof e == 'number') {
              countType.value = e
              init()
            }
          },
        },
      },
      {
        field: 'statusList',
        componentProps: {
          onChange: () => init(true),
        },
      },
      {
        field: 'spuType',
        componentProps: {
          onChange: () => init(true),
        },
      },
      {
        field: 'rentType',
        componentProps: {
          onChange: () => init(true),
        },
      },
    ])
  })

  const { setOptions } = useECharts(lineRef as Ref<HTMLDivElement>)
  function setOptionsEchats() {
    setOptions({
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: true,
        data: [info.value.name],
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
          name: info.value.name,
          type: 'line',
          stack: 'Stack1',
          data: y1list.value,
          itemStyle: {
            color: info.value.color, // 线的颜色
          },
        },
      ],
    })
  }
</script>

<template>
  <div class="OrderSoonLine">
    <div class="text-base font-bold mt-8 mb-3" size="large">
      <span>即将到期账单</span>
      <Tooltip overlayClassName="OrderSoonLineTooltip" placement="bottom" class="ml-3">
        <template #title>
          <div>
            <div>统计范围当前月份至往后12个月,每日0点刷新</div>
            <div class="mt-3">计算公式：</div>
            <div class="mt-3">即将到期订单数：取值所有类型的即将到期订单数</div>
            <div>即将到期账单金额：取值所有类型的即将到期账单金额 </div>
            <div>即将到期账单数：取值所有类型的即将到期账单数 </div>
            <div class="mt-3">
              注：即将到期订单数、即将到期账单金额、即将到期账单数，均需剔除提前还款的数据
            </div>
          </div>
        </template>
        <InfoCircleOutlined :style="{ color: '#999', fontSize: '17px' }" />
      </Tooltip>
    </div>
    <BasicForm @register="registerForm">
      <template #amount>
        <div v-if="countType == 2 && !loading" class="flex justify-end">
          <span>合计金额: </span>
          <span class="text-[#dc2626]">￥{{ amount }}</span>
        </div>
        <div v-else></div>
      </template>
    </BasicForm>
    <Spin tip="正在加载..." size="large" :spinning="loading">
      <div class="w-full" style="height: 450px" ref="lineRef"></div>
    </Spin>
  </div>
</template>

<style lang="less">
  .OrderSoonLine {
    ::v-deep.vben-basic-form .ant-form-item:not(.ant-form-item-with-help) {
      margin-bottom: 0 !important;
    }
  }

  .OrderSoonLineTooltip {
    .ant-tooltip-content {
      .ant-tooltip-inner {
        width: 550px !important;
      }
    }
  }
</style>
