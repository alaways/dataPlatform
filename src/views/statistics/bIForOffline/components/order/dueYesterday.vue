<template>
  <div class="mt-6 dueYesterday">
    <div class="text-base font-bold mb-3" size="large">
      <span>昨日到期数据</span>
      <Tooltip overlayClassName="dueYesterdayTooltip" placement="bottom" class="ml-3">
        <template #title>
          <div>
            <div>昨日到期账单还款情况;范围月付类型产品;每日0点刷新</div>
            <div class="mt-3">计算公式：</div>
            <div class="mt-3">
              ① 【未逾期即将到期】账单还款率 =
              到期已还的账单数（取当天还款数据）/未逾期即将到期订单数</div
            >
            <div>
              ② 【未逾期即将到期】账单金额还款率 =
              到期已还的账单金额（取当天还款数据）/未逾期即将到期订单金额
            </div>
            <div class="mt-3">
              ① 【首次逾期即将到期】账单还款率 =
              到期已还的账单数（取当天还款数据）/首次逾期即将到期订单数
            </div>
            <div>
              ② 【首次逾期即将到期】账单金额还款率 =
              到期已还的账单金额（取当天还款数据）/首次逾期即将到期订单金额
            </div>
            <div class="mt-3">
              ① 【多次逾期即将到期】账单还款率 =
              到期已还的账单数（取当天还款数据）/多次逾期即将到期订单数
            </div>
            <div>
              ② 【多次逾期即将到期】账单金额还款率 =
              到期已还的账单金额（取当天还款数据）/多次逾期即将到期订单金额
            </div>
          </div>
        </template>
        <InfoCircleOutlined :style="{ color: '#999', fontSize: '17px' }" />
      </Tooltip>
    </div>
    <div v-for="(item, index) in list" :key="index">
      <div class="text-sm font-bold">{{ item.title }}</div>
      <Row class="my-3" :gutter="8">
        <Col
          :span="24 / item.children.length"
          v-for="(items, idx) in item.children"
          :key="idx"
          class="text-[#fff] text-xl"
        >
          <div class="flex flex-row items-center p-3" :style="{ 'background-color': items.color }">
            <div class="flex flex-col flex-1">
              <div class="mb-2 text-sm">{{ items.title }}</div>
              <div>{{ items.count }}</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { getDueYesterdayData } from '/@/api/statistics'
  import { onMounted, reactive } from 'vue'
  import { Col, Row, Tooltip } from 'ant-design-vue'
  import { duYesterdayList } from './data'
  import { formatNumber } from '/@/utils/tool'
  import dayjs from 'dayjs'
  import { cloneDeep } from 'lodash-es'
  import { InfoCircleOutlined } from '@ant-design/icons-vue'

  const list = reactive([
    { title: '未逾期', children: cloneDeep(duYesterdayList) },
    { title: '首次逾期', children: cloneDeep(duYesterdayList) },
    { title: '非首次逾期', children: cloneDeep(duYesterdayList) },
  ])

  onMounted(() => {
    init()
  })

  async function init() {
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    getDueYesterdayData({ rentType: 2, date: yesterday }).then((res: any) => {
      list.forEach((v, i) => {
        const data = res[i]
        v.children.forEach((e: any) => {
          Object.keys(data).forEach((o) => {
            if (e.key == o) {
              if (e.title.indexOf('还款率') != -1) {
                e.count = `${(Number(data[o]) * 100).toFixed(2)}%`
              } else if (e.title.indexOf('金额') != -1) {
                e.count = formatNumber(Number(data[o]) || 0, 2)
              } else {
                e.count = Number(data[o])
              }
            }
          })
        })
      })
    })
  }
</script>

<style lang="less">
  .dueYesterday {
    .ant-col-5 {
      max-width: 20% !important;
    }

    .ant-col-3 {
      max-width: 14.28% !important;
      flex: 0 0 14.28% !important;
    }
  }

  .dueYesterdayTooltip {
    .ant-tooltip-content {
      .ant-tooltip-inner {
        width: 730px !important;
      }
    }
  }
</style>
