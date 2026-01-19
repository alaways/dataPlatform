<script setup lang="ts">
  import { onMounted, ref, Ref } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  import { getProductOverdueBill } from '/@/api/statistics'
  import { Spin, Tooltip } from 'ant-design-vue'
  import { InfoCircleOutlined } from '@ant-design/icons-vue'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { searchFormSchema } from './data'

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
  // ylist: 0.金额 1.账单
  const y1listAll = ref<any>([])
  const y2listAll = ref<any>([])

  onMounted(() => {
    init()
    updateSchema([
      {
        field: 'countType',
        componentProps: {
          onChange: () => init(),
        },
      },
    ])
  })
  async function init() {
    loading.value = true
    const values = await validate()
    const h1 = new Promise((resolve) => {
      if (y1listAll.value && y1listAll.value.length) {
        resolve({ xlist: xlist.value, y1list: y1listAll.value[values.countType] || [] })
        return
      }
      getProductOverdueBill({ rentType: 2, days: 30, spuType: 1 }).then((res: any) => {
        // 4.金额回款率 5.账单汇款率
        y1listAll.value = res.data?.ylist
        resolve({ xlist: res.data?.xlist, y1list: y1listAll.value[values.countType] || [] })
      })
    })
    const h2 = new Promise((resolve) => {
      if (y2listAll.value && y2listAll.value.length) {
        resolve({ y2list: y2listAll.value[values.countType] || [] })
        return
      }
      getProductOverdueBill({ rentType: 2, days: 30, spuType: 2 }).then((res: any) => {
        y2listAll.value = res.data?.ylist
        resolve({ y2list: y2listAll.value[values.countType] || [] })
      })
    })
    Promise.all([h1, h2]).then((res: any) => {
      res = { ...res[0], ...res[1] }
      xlist.value = res.xlist
      if (res.y1list && res.y1list.length) {
        y1list.value = res.y1list.map((v) => Number((Number(v) * 100).toFixed(2)))
      }
      if (res.y2list && res.y2list.length) {
        y2list.value = res.y2list.map((v) => Number((Number(v) * 100).toFixed(2)))
      }
      loading.value = false
      setOptionsEchats()
    })
  }
  const colors = ['#5470C6', '#84bebd']
  const { setOptions } = useECharts(lineRef as Ref<HTMLDivElement>)
  function setOptionsEchats() {
    setOptions({
      legend: {
        bottom: true,
        data: ['手机', '电动车'],
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
        nameTextStyle: {
          fontSize: 16,
          color: 'red',
        },
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
          name: '手机',
          type: 'line',
          stack: 'Stack1',
          data: y1list.value,
          itemStyle: {
            color: colors[0], // 线的颜色
          },
        },
        {
          name: '电动车',
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
      <span>产品逾期账单回款数据(每日更新)</span>
      <Tooltip overlayClassName="productOverdueBillTooltip" placement="bottom" class="ml-3">
        <template #title>
          <div>
            <div>统计范围过往30天的月付类型产品,每日0点刷新;</div>
            <div>逾期账单金额回款率=（昨天）逾期回款金额/总逾期待还金额 </div>
            <div>逾期账单回款率=（昨天）逾期回款账单/总逾期待还账单</div>
            <div>注：（昨天）逾期回款金额、总逾期待还金额,剔除提前还款、罚金;含部分还款</div>
          </div>
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
  ::v-deep.vben-basic-form .ant-form-item:not(.ant-form-item-with-help) {
    margin-bottom: 0 !important;
  }

  .productOverdueBillTooltip {
    .ant-tooltip-content {
      .ant-tooltip-inner {
        width: 400px !important;
      }
    }
  }
</style>
