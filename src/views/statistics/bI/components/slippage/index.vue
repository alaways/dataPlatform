<template>
  <div class="p-3">
    <Card shadow="never" v-if="0">
      <h3>按产品形态统计</h3>
      <div class="flex items-center mt-3 mr-2">
        <div
          v-for="(item, index) in shapeList"
          :key="index"
          class="px-4 py-3 text-[#333] mr-3 mb-3 cursor-pointer"
          :class="{
            'text-[#fff]': index == bIndex,
          }"
          :style="{
            'background-color': index == bIndex ? '#16a34a' : '#d1d5db',
          }"
          @click="handleChange(index)"
        >
          {{ item }}
        </div>
      </div>
    </Card>

    <Card shadow="never">
      <div class="text-base font-bold mb-6" size="large">汇总统计</div>

      <!-- <BasicForm @register="registerForm" /> -->

      <Spin tip="加载中..." :spinning="loading">
        <Row :gutter="20" class="mb-10 mt-6">
          <template v-for="(item, index) in summaryData" :key="index">
            <Col class="mt-3" :span="item.span || 6" v-if="item.show" :key="index">
              <div style="border: 1px solid #f1f1f1" v-if="item.title">
                <div
                  class="text-[#fff] w-full h-12 flex items-center justify-center"
                  :style="{ background: item.color }"
                >
                  <div>{{ item.title }}</div>
                  <Tooltip class="ml-2" placement="bottom" v-if="item.tooltip">
                    <template #title>{{ item.tooltip }}</template>
                    <InfoCircleOutlined :style="{ color: '#fff', fontSize: '17px' }" />
                  </Tooltip>
                </div>
                <div class="flex items-center justify-center w-full h-16 text-2xl">
                  <span v-if="item.type == 2">￥</span>
                  <span>{{ item.num }}</span>
                  <span v-if="item.type == 3">%</span>
                </div>
              </div>
            </Col>
          </template>
        </Row>
      </Spin>

      <SummaryTable v-if="0" />
    </Card>
  </div>
</template>

<script lang="ts" setup name="statisticsSlippage">
  import { getMainCardOnline, getOverDueOrderDetailsOnline } from '/@/api/statistics'
  import { onMounted, ref } from 'vue'
  import { shapeList, summaryList, searchFormSchema } from './data.d'
  import { Col, Row, Card, Tooltip, Spin } from 'ant-design-vue'
  import { cloneDeep } from 'lodash-es'
  import { formatNumber } from '/@/utils/tool'
  import { InfoCircleOutlined } from '@ant-design/icons-vue'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import SummaryTable from './summaryTable/index.vue'

  const bIndex = ref(0)
  const summaryData = ref<any>([])
  const loading = ref<boolean>(false)
  summaryData.value = cloneDeep(summaryList())

  const rentType = ref<any>(2)
  const spuType = ref<any>('')
  const [registerForm, { updateSchema }] = useForm({
    labelWidth: 100,
    schemas: searchFormSchema,
    showActionButtonGroup: false,
  })

  const handleChange = (e: number) => {
    bIndex.value = e
  }

  init()
  async function init() {
    loading.value = true
    getOverDueOrderDetailsOnline({ spuType: spuType.value, rentType: rentType.value }).then(
      (res: any) => {
        res = res.data[0]
        summaryData.value.forEach((v) => {
          Object.keys(res).forEach((o) => {
            if (v.key && v.key == o) {
              if (v.key.indexOf('Amount') != -1) {
                v.num = res[o] / 100
              } else {
                v.num = res[o]
              }
            }
          })
          // const yq = Number(res.overdueOrderCount) / Number(res.countExpireOrder)
          const yq = Number(res.overdueOrderCount) / Number(res.countExpireOrderWithSettle)
          if (v.key == 'yqRate') {
            v.num = handleToFixed2(yq * 100)
          }
          if (v.key == 'hkRate') {
            v.num = handleToFixed2((1 - Number(yq)) * 100)
          }
          if (v.key == 'maturityCompletionOrder') {
            v.num = Number(res['settleOrderCount']) - Number(res['buyOutOrderCount']) || 0
          }

          if (v.title.indexOf('金额') != -1) {
            v.num = formatNumber(v.num * 100, 2)
          }
        })
        getMainCardOnline({ spuType: spuType.value, rentType: rentType.value }).then((req) => {
          summaryData.value.forEach((ch) => {
            // const countExpireOrder = Number(req.data['countExpireOrderWithSettle']) || 0
            const countExpireOrder = Number(req.data['countExpireOrder2']) || 0
            const countExpireTotalAmount2 = Number(req.data['countExpireTotalAmount2']) || 0
            if (
              [
                'overDueOrderCountGe5',
                'countOverdueAmountGe5',
                'overdueAmountGe30',
                'overdueAmountGe180',
              ].includes(ch.key)
            ) {
              if (ch.key.indexOf('Amount') != -1) {
                ch.num = formatNumber(req.data[ch.key], 2)
              } else {
                ch.num = req.data[ch.key]
              }
            }
            // 订单逾期率
            if (ch.key == 'countOverdueAmountrRate') {
              const rate = Number(req.data['overDueOrderCountGe5']) / countExpireOrder
              ch.num = Number((rate * 100).toFixed(2))
            }
            // 5天订单逾期率
            if (ch.key == 'overdueRate5') {
              const rate = Number(req.data['overDueOrderCountGe5']) / countExpireOrder
              ch.num = Number((rate * 100).toFixed(2))
            }
            // 15天订单逾期率
            if (ch.key == 'overdueRate15') {
              const rate = Number(req.data['overDueOrderCountGe15']) / countExpireOrder
              ch.num = Number((rate * 100).toFixed(2))
            }
            // 金额逾期率
            if (ch.key == 'sumAmountrRate') {
              const rate = Number(req.data['countOverdueAmount']) / countExpireTotalAmount2
              ch.num = Number((rate * 100).toFixed(2))
            }
            // 15天逾期率
            if (ch.key == 'sumAmountrRate15') {
              const rate = Number(req.data['overdueAmountGe15']) / countExpireTotalAmount2
              ch.num = Number((rate * 100).toFixed(2))
            }
            // 30天金额逾期率
            if (ch.key == 'sumAmountrRate30') {
              const rate = Number(req.data['overdueAmountGe30']) / countExpireTotalAmount2
              ch.num = Number((rate * 100).toFixed(2))
            }
            // 180天金额逾期率
            if (ch.key == 'sumAmountrRate180') {
              const rate = Number(req.data['overdueAmountGe180']) / countExpireTotalAmount2
              ch.num = Number((rate * 100).toFixed(2))
            }

            // 尾期订单逾期率
            // const countLastBill =
            //   Number(req.data['countLastBillOverdue']) +
            //   Number(req.data['countSettleOrder']) -
            //   Number(req.data['buyOutOrderCount'])
            if (ch.key == 'lastBillOrderRate') {
              const rate =
                Number(req.data['countLastBillOverdue']) / Number(req.data['lastExpCount'])
              ch.num = Number((rate * 100).toFixed(2))
            }

            // 尾期金额逾期率
            // const countLastBillAmount =
            //   Number(req.data['lastBillOverdueAllAmount']) +
            //   Number(req.data['settleAmount']) -
            //   Number(req.data['buyOutAmount'])
            if (ch.key == 'lastBillAmountRate') {
              const rate =
                Number(req.data['lastBillOverdueAmount']) / Number(req.data['lastExpAmount'])
              ch.num = Number((rate * 100).toFixed(2))
            }
          })

          loading.value = false
        })
      },
    )
  }

  function handleToFixed2(num, toFixed = 2) {
    if (!num) num = 0
    return num.toFixed(toFixed)
  }

  onMounted(() => {
    updateSchema([
      {
        field: 'rentType',
        componentProps: {
          onChange: (e) => {
            if (typeof e == 'number') {
              rentType.value = e
              init()
            } else if (!e) {
              rentType.value = ''
              init()
            }
          },
        },
      },
      {
        field: 'spuType',
        componentProps: {
          onChange: (e) => {
            if (typeof e == 'number') {
              spuType.value = e
              init()
            } else if (!e) {
              spuType.value = ''
              init()
            }
          },
        },
      },
    ])
  })
</script>

<style lang="less" scoped>
  ::v-deep.vben-basic-form .ant-form-item:not(.ant-form-item-with-help) {
    margin-bottom: 0 !important;
  }
</style>
