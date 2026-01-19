<script setup lang="ts">
  import { onMounted, ref, Ref } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { getExpireBillDay30 } from '/@/api/statistics'
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

  // ylist: 0.金额 1.账单
  const y1listAll = ref<any>([])
  const y2listAll = ref<any>([])

  async function init() {
    loading.value = true
    const values = await validate()
    const params = { rentType: 2, days: 30 }
    // 手机
    const h1 = new Promise((resolve) => {
      if (y1listAll.value && y1listAll.value.length) {
        resolve({ xlist: xlist.value, y1list: y1listAll.value[values.countType] || [] })
        return
      }
      getExpireBillDay30({ ...params, spuType: 1 }).then((res: any) => {
        y1listAll.value = res.data?.ylist
        resolve({ xlist: res.data?.xlist, y1list: y1listAll.value[values.countType] || [] })
      })
    })
    // 电动车
    const h2 = new Promise((resolve) => {
      if (y2listAll.value && y2listAll.value.length) {
        resolve({ y2list: y2listAll.value[values.countType] || [] })
        return
      }
      getExpireBillDay30({ ...params, spuType: 2 }).then((res: any) => {
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
  <div class="expireBillDay30">
    <div class="text-base font-bold mt-8 mb-3" size="large">
      <span>过往30天到期账单回款(每日更新)</span>
      <Tooltip overlayClassName="expireBillDay30Tooltip" placement="bottom" class="ml-3">
        <template #title>
          <div>
            <div>过往30天;月付类型账单</div>
            <div class="mt-3">计算公式：</div>
            <div class="mt-3">到期账单回款率=当天已还（含提前还）账单/到期账单 </div>
            <div>到期账单金额回款率=当天已还（含提前还）账单总金额/到期账单总金额 </div>
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
  .expireBillDay30 {
    ::v-deep.vben-basic-form .ant-form-item:not(.ant-form-item-with-help) {
      margin-bottom: 0 !important;
    }
  }

  .expireBillDay30Tooltip {
    .ant-tooltip-content {
      .ant-tooltip-inner {
        width: 480px !important;
      }
    }
  }
</style>
