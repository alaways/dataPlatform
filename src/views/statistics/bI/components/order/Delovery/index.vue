<script setup lang="ts">
  import { onMounted, Ref, ref } from 'vue'
  import { useECharts } from '/@/hooks/web/useECharts'
  import { chartStatisticlnfo2 } from '/@/api/statistics/index'
  import { RangePicker } from 'ant-design-vue'
  import { handleMonth } from '/@/utils/order'
  import dayjs from 'dayjs'
  // const props = defineProps({
  //   merchantTerminalNoList: String,
  // })
  const defalutValue = handleMonth()
  const startTime = ref(defalutValue[0])
  const endTime = ref(defalutValue[1])
  const pieChartRef = ref<HTMLDivElement | null>(null)
  const { setOptions } = useECharts(pieChartRef as Ref<HTMLDivElement>)
  const getOrderLineData = async () => {
    const params: any = {
      type: 1,
      startTime: startTime.value,
      endTime: endTime.value,
    }
    const res = await chartStatisticlnfo2(params)
    const data = res?.data
    const len = data?.ylist[1]?.length
    const duibiArr: any = []
    for (let i = 0; i <= len; i++) {
      duibiArr.push(48)
    }
    if (data) {
      setOptions({
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['二手', '全新'],
        },
        xAxis: {
          type: 'category',
          data: data.xlist,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '二手',
            type: 'line',
            data: data.ylist[0],
            markLine: {
              symbol: 'none',
              data: [
                {
                  yAxis: 48,
                  lineStyle: {
                    color: 'red',
                    type: 'solid',
                    width: 1,
                  },
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '48小时',
                  },
                },
              ],
            },
          },
          {
            name: '全新',
            type: 'line',
            data: data.ylist[1],
          },
        ],
      })
    }
  }
  onMounted(async () => {
    getOrderLineData()
  })
  // 修改时间并查询
  const changeDateTime = (data) => {
    if (data[0]) {
      startTime.value = dayjs(data[0]).format('YYYY-MM-DD')
    }
    if (data[1]) {
      endTime.value = dayjs(data[1]).format('YYYY-MM-DD')
    }
    getOrderLineData()
  }
</script>

<template>
  <div class="searchCont">
    <div class="left">
      <RangePicker closeIcon @change="changeDateTime" :value="[dayjs(startTime), dayjs(endTime)]" />
    </div>
  </div>
  <div class="w-full h-72 orderLineCont" ref="pieChartRef"></div>
</template>
<style>
  .w-full svg {
    padding-top: 0px !important;
  }
  .orderLineCont {
    height: 450px;
  }
  .searchCont {
    display: flex;
    justify-content: space-between;
  }
</style>
