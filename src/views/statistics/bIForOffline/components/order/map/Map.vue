<template>
  <div>
    <div class="mb-2 flex items-center">
      <div class="text-xl font-semibold">地区数据总览</div>
      <DateSearch style="margin-top: 20px" @submit="getData" />
    </div>
    <div ref="chartRef" :style="{ height, width }"></div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, onMounted, nextTick } from 'vue'

  import { mapData, mapModel } from './data'
  import DateSearch from '/@/views/statisticsNew/components/dateSearch.vue'
  import { getMapMain } from '/@/api/statistics'
  import { cloneDeep } from 'lodash-es'
  import * as echarts from 'echarts/core'
  import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    VisualMapComponent,
    GeoComponent,
  } from 'echarts/components'
  import { MapChart } from 'echarts/charts'
  import { CanvasRenderer } from 'echarts/renderers'

  export default defineComponent({
    components: { DateSearch },
    props: {
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: 'calc(100vh - 78px)',
      },
    },
    setup() {
      echarts.use([
        TitleComponent,
        ToolboxComponent,
        TooltipComponent,
        VisualMapComponent,
        GeoComponent,
        MapChart,
        CanvasRenderer,
      ])
      const chartRef = ref()
      let mapDatas = cloneDeep(mapData)

      onMounted(async () => {
        const json = (await (await import('./china.json')).default) as any
        echarts.registerMap('china', json)
        getData({})
      })

      function getData(params) {
        getMapMain(params).then((res: any) => {
          mapDatas = mapDatas.map((v: mapModel) => {
            const data = res[v.name] || {}
            return {
              ...v,
              value: data.orderCount || 0,
              orderCount: data.orderCount || 0,
              expOrderCount: data.expOrderCount || 0,
              overdueOrderCount: data.overdueOrderCount || 0,
            }
          })
          nextTick(() => {
            setEchartsOptions()
          })
        })
      }

      function setEchartsOptions() {
        var myChart = echarts.init(chartRef.value)
        // setOptions({
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter(params) {
              let value = params.value
              if (Array.isArray(value) || value === undefined) {
                // 鼠标移到涟漪点上不显示浮层
                // 鼠标移到路线上不显示浮层
                return ''
              }
              if (isNaN(value)) {
                value = 0
              }
              return `<div style='font-size:15px;'> ${params.name}</div>
              <div style='text-align:left;margin-top:4px;'>
                <div>● 总在租订单: ${value}<div>
                <div>● 已到期订单: ${params.data.expOrderCount}<div>
                <div>● 总逾期订单: ${params.data.overdueOrderCount}<div>
              </div>`
            },
          },
          visualMap: {
            min: 0,
            max: 200,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            inRange: {
              color: ['#BFBFBF', '#3899FF', '#92D050', '#3BAE56', '#F7BB37', '#CC3300', '#FF6699'],
            },
          },
          series: [
            {
              name: '省份',
              type: 'map',
              map: 'china',
              label: {
                show: true,
                fontSize: 10,
              },
              data: mapDatas,
            },
          ],
        })
      }
      return { chartRef, getData }
    },
  })
</script>
