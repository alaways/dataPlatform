<template>
  <div class="p-3">
    <Card shadow="never" style="color: #fff; background: #4d8fe5" class="mt-3">
      <div class="text-base">申请总数量</div>
      <div class="text-2xl">{{ countShowOrder }}</div>

      <Row class="mt-3">
        <Col
          :span="5"
          v-for="(item, index) in applyData"
          :key="index"
          class="flex flex-col items-center justify-end text-base"
        >
          <div>
            <span>{{ item.content }}</span>
            <span class="ml-4 text-2xl font-semibold">{{ item.scale }}%</span>
          </div>
          <div class="my-2 text-xl font-semibold">
            <span>{{ item.count }}</span>
          </div>
          <div>{{ item.title }}</div>
        </Col>
      </Row>
    </Card>

    <Card shadow="never" class="mt-3">
      <div class="text-base font-bold" size="large">租后订单统计</div>
      <Row class="my-3" :gutter="8">
        <Col
          :span="24 / leaseData.length"
          v-for="(item, index) in leaseData"
          :key="index"
          class="text-[#fff] text-xl"
        >
          <div class="flex flex-row items-center p-3" :style="{ 'background-color': item.color }">
            <div class="flex flex-col flex-1">
              <div class="mb-2 text-sm">{{ item.title }}</div>
              <div>{{ item.count }}</div>
            </div>
            <div>
              <div class="mb-2 text-sm text-center">{{ item.content }}</div>
              <div v-if="item.scale || item.scale == 0">{{ item.scale }}%</div>
            </div>
          </div>
        </Col>
      </Row>

      <!-- 当天到期账单 -->
      <ExpiredBillsTable />

      <!-- 过往60天到期账单数据 -->
      <Last60days />

      <!-- 昨日到期数据 -->
      <DueYesterday v-if="0" />

      <!-- 过往30天账单还款情况 -->
      <Last30daysBill v-if="0" />

      <!-- 即将到期账单 -->
      <OrderSoonLine />

      <!-- 产品逾期账单回款数据 -->
      <ProductOverdueBill />

      <!-- 过往30天到期账单回款 -->
      <ExpireBillDay30 v-if="0" />

      <!-- 过往30天每日收款数据 -->
      <Last30days />

      <Map />
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { getOrderCount, getOrderCountSettleOrder, getRentOrderCount } from '/@/api/statistics'
  import { onMounted, ref } from 'vue'
  import { applyList, leaseList } from './data.d'
  // import Line from './Line.vue'
  import DueYesterday from './dueYesterday.vue'
  import ProductOverdueBill from './productOverdueBill/index.vue'
  import ExpiredBillsTable from './expiredBillsTable/index.vue'
  import OrderSoonLine from './orderSoonLine/OrderSoonLine.vue'
  import ExpireBillDay30 from './expireBillDay30/index.vue'
  import Last30days from './last30days/index.vue'
  import Last60days from './last60days/index.vue'
  import Last30daysBill from './last30daysBill/index.vue'
  import { Col, Row, Card } from 'ant-design-vue'
  import Map from './map/Map.vue'
  import { formatNumber } from '/@/utils/tool'
  const applyData = ref<any>([])
  const leaseData = ref<any>([])
  const countOrder = ref<number>(0)
  const countShowOrder = ref<string>('')
  applyData.value = applyList
  leaseData.value = leaseList()

  onMounted(() => {
    init()
  })

  async function init() {
    getRentOrderCount().then((res: any) => {
      res = res.data
      const rentOrder = Number(res['rentOrder'] || 0)

      leaseData.value.forEach((e) => {
        Object.keys(res).forEach((o) => {
          const count = Number(res[o])
          if (e.key == o) {
            // e.count = count || 0
            e.count = formatNumber(Number(count) * 100 || 0)
            if (e.key == 'overDueOrder') {
              const expOrder = Number(res['expOrder'] || 0)
              e.scale = ((count / expOrder) * 100).toFixed(2)
            } else {
              e.scale = ((count / rentOrder) * 100).toFixed(2)
            }
          }
        })
      })
    })

    getOrderCountSettleOrder().then((res: any) => {
      leaseData.value.forEach((e) => {
        if (e.key == 'countSettleOrder') {
          e.count = res.data
        }
      })
    })

    let res: any = await getOrderCount()
    res = res.data
    countOrder.value = Number(res['countOrder'])
    countShowOrder.value = formatNumber(Number(res['countOrder'] * 100))
    // applyData.value.forEach((e, i) => {
    applyData.value.forEach((e) => {
      Object.keys(res).forEach((o) => {
        const count = Number(res[o])
        if (e.key == o) {
          // e.count = count || 0
          e.count = formatNumber(count * 100 || 0)
          e.scale = ((count / countOrder.value) * 100).toFixed(2)
          // if (i == 0) {
          //   e.scale = ((count / countOrder.value) * 100).toFixed(2)
          // } else {
          //   e.scale = ((count / applyData.value[i - 1].count) * 100).toFixed(2)
          // }
        }
      })
    })
  }
</script>

<style scoped lang="less">
  .ant-col-5 {
    max-width: 20% !important;
  }
</style>
