<template>
  <Card :bordered="false">
    <div class="updateTime" v-if="!isHideTitle">{{ title }}</div>
    <div class="topChilds">
      <Card
        v-for="item in cardList"
        :key="item?.id"
        class="cardmrItem"
        :style="{ backgroundColor: item?.color }"
      >
        <div class="baseT">
          {{ item?.label }}
          <Tooltip placement="bottom" v-if="item?.titple">
            <template #title>{{ item?.titple }}</template>
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
        <div class="desc">{{ item?.amount }}</div>
        <div class="itemBottom" v-if="item?.showYes">
          {{ item?.yesterAmount }}
          较前1日
          <span v-if="getYesterLv(item?.yesterLv) != '-'">
            <ArrowDownOutlined v-if="item?.isUp" style="color: red" />
            <ArrowUpOutlined v-else style="color: green" />
          </span>
          {{ getYesterLv(item?.yesterLv) }}
        </div>
      </Card>
    </div>
  </Card>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { Card, Tooltip } from 'ant-design-vue'
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
  import dayjs from 'dayjs'
  import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons-vue'

  interface listItem {
    id: string | number
    color: string
    label: string
    titple: string | undefined
    amount: string | number
    yesterAmount: string | number | undefined
    showYes: boolean | undefined
    yesterLv: string | number | undefined
  }
  const props = {
    list: Array<listItem>,
    res: Object,
    title: String,
    hideTitle: Boolean,
  }
  export default defineComponent({
    name: 'StoreList',
    components: { Card, ExclamationCircleOutlined, Tooltip, ArrowDownOutlined, ArrowUpOutlined },
    props,
    setup(props) {
      const _props = props
      const cardList = ref(_props?.list || [])
      const cutRes = ref(_props?.res)
      const title = ref(_props?.title || '更新时间：每日9点')
      const isHideTitle = ref(_props?.hideTitle)
      watch(
        () => _props?.res,
        (res) => {
          if (res) {
            cutRes.value = res
            getDetailInfo()
          }
        },
      )
      const getYesterLv = (lv) => {
        if (lv == '0' || lv == 0 || lv == '0%') return '-'
        if (typeof lv == 'number') {
          return String(lv)?.replace('-', '')
        }
        return lv?.replace('-', '')
      }
      // 是否百分比
      const addLvHanld = (item: any, type = false, isNum) => {
        if (type) {
          const num = item.toFixed(2)
          return `${num}%`
        }
        const num = Number(item).toFixed(6)
        const allNum = (Number(num) * 100).toFixed(3)
        let fen = String(allNum).split('.')[1]
        fen = fen?.slice(0, 2)
        if (isNum) return Number(String(allNum).split('.')[0] + '.' + fen)
        return `${String(allNum).split('.')[0] + '.' + fen}%`
      }
      const getOrderYesObj = {
        placeOrderCount: ['yestePlaceOrderCount', 'placeOrderCountRate'],
        rentOrderCount: ['yesteRentOrderCount', 'rentOrderCountRate'],
        registerUserCount: ['yesteRegisterUserCount', 'registerUserCountRate'],
        rentAlreadyOverOrderCount: [
          'yesteRentAlreadyOverOrderCount',
          'rentAlreadyOverOrderCountRate',
        ],
        endOrderCout: ['yesteEndOrderCout', 'endOrderCoutRate'],
        overOrderCount: ['yesteOverOrderCount', 'overOrderCountRate'],
        rentOverOrderAmount: ['yesteRentOverOrderAmount', 'rentOverOrderAmountRate'],
        todayOvereOrderCount: ['yesteOvereOrderCount', 'todayOvereOrderCountRate'],
        todayOverOrderAmount: ['yesteOverOrderAmount', 'todayOverOrderAmountRate'],
        totalContractAmount: ['yesteTotalContractAmount', 'totalContractAmountRate'],
        totalOutstandingAmount: ['yesteTotalOutstandingAmount', 'totalOutstandingAmountRate'],
        totalAmountRentalOrder: ['yesteTotalAmountRentalOrder', 'totalAmountRentalOrderRate'],
        totalDownPayment: ['yesteTotalDownPayment', 'totalDownPaymentRate'],
        amountRentLease: ['yesteAmountRentLease', 'amountRentLeaseRate'],
        amountOverdueRent: ['yesteAmountOverdueRent', 'amountOverdueRentRate'],
        rentReductionAmount: ['yesteRentReductionAmount', 'rentReductionAmountRate'],
        overdueTotalRateAmount: ['yesteOverdueTotalRateAmount', 'overdueTotalRateAmountRate'],
        rentTotalOverOrderAmount: ['yesteRentTotalOverOrderAmount', 'rentTotalOverOrderAmountRate'],
        overdueRateAmount: ['yesteOverdueRateAmount', 'overdueRateAmountRate'],
        totalAmountReceived: ['yesteTotalAmountReceived', 'totalAmountReceivedRate'],
        amountSettled: ['yesteAmountSettled', 'amountSettledRate'],
        amountRentPaidInstallments: [
          'yesteAmountRentPaidInstallments',
          'amountRentPaidInstallmentsRate',
        ],
        depositAmount: ['yesteDepositAmount', 'depositAmountRate'],
        penaltyAmountRentalPaid: ['yestePenaltyAmountRentalPaid', 'penaltyAmountRentalPaidRate'],
        amountTotalCollectedRental: [
          'yesteAmountTotalCollectedRental',
          'amountTotalCollectedRentalRate',
        ],
        amountReceivableRental: ['yesteAmountReceivableRental', 'amountReceivableRentalRate'],
        totalAmountFinesCollected: [
          'yesteTotalAmountFinesCollected',
          'totalAmountFinesCollectedRate',
        ],
        penaltyReductionAmount: ['yestePenaltyReductionAmount', 'penaltyReductionAmountRate'],
        totalDownPaymentAmount: ['yesteTotalDownPaymentAmount', 'totalDownPaymentAmountRate'],
        rentTotalNotOverOrderAmount: [
          'yesteRentTotalNotOverOrderAmount',
          'rentTotalNotOverOrderAmountRate',
        ],
        amountReceivable: ['yesteAmountReceivable', 'amountReceivableRate'],
        amountTotalCollected: ['yesteAmountTotalCollected', 'amountTotalCollectedRate'],
        currentRentIngLv: ['yesteCurrentRentIngLv', 'currentRentIngLvRate'],
        currentRentOutLv: ['yesteCurrentRentOutLv', 'currentRentOutLvRate'],
      }
      const getDetailInfo = async () => {
        const contentList = cardList.value
        Object.keys(cutRes.value).forEach((Ritem) => {
          cardList.value = contentList.map((item: any) => {
            if (item.id === Ritem) {
              // 设置昨日数据
              if (getOrderYesObj[item.id]) {
                const yesterDayNum = getOrderYesObj[item.id]?.[0]
                const yesterDayLv = getOrderYesObj[item.id]?.[1]
                item.yesterAmount = Number(cutRes.value[yesterDayNum]).toLocaleString()
                item.yesterLv = cutRes.value[yesterDayLv] + '%'
                item.isUp = cutRes.value[yesterDayLv] > 0 ? true : false
              }
              item.amount = `${Number(cutRes.value?.[Ritem])?.toLocaleString()}`
              if (item.isAddLv) {
                const yesterDayNum = getOrderYesObj[item.id]?.[0]
                item.yesterAmount = addLvHanld(cutRes.value[yesterDayNum])
                item.amount = addLvHanld(cutRes.value?.[Ritem])
              }
              // 在租订单金额逾期率
              if (item.id === 'overdueTotalRateAmount') {
                const lv: any =
                  addLvHanld(cutRes.value['overdueTotalRateAmount'], false, true) -
                  addLvHanld(cutRes.value['yesteOverdueTotalRateAmount'], false, true)
                item.yesterLv = lv.toFixed(2) + '%'
                item.isUp = lv.toFixed(2) > 0 ? true : false
              }
              // 总订单金额逾期率
              if (item.id === 'overdueRateAmount') {
                const lv: any =
                  addLvHanld(cutRes.value['overdueRateAmount'], false, true) -
                  addLvHanld(cutRes.value['yesteOverdueRateAmount'], false, true)
                item.yesterLv = lv.toFixed(2) + '%'
                item.isUp = lv.toFixed(2) > 0 ? true : false
              }
            }
            return item
          })
        })
      }

      const getContentArrs = () => {
        let list = cardList.value
        list = list.map((item: any) => {
          item.children = item.children?.filter((citem: any) => citem.isShow)
          return item
        })
        return list
      }
      return {
        cardList: getContentArrs(),
        dayjs,
        title,
        isHideTitle,
        getYesterLv,
      }
    },
  })
</script>
<style scoped>
  .topCont,
  .topChilds {
    display: flex;
  }

  .cardItem {
    flex: 1;
    border-radius: 12px;
    margin: 16px;
    max-width: 290px;
  }

  .bottomCard .ant-card-head {
    padding: 0px;
  }

  .cardmrItem {
    border-radius: 12px;
  }

  .descr {
    color: #999;
  }

  .bold {
    font-size: 20px;
    font-weight: bold;
  }

  .bigTit {
    font-size: 16px;

    span {
      font-size: 12px;
    }
  }

  .baseT {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
  }

  .bottomCard .desc {
    font-size: 18px;
    font-weight: bold;
  }

  .bottomCard .cardItem {
    max-width: 24%;
    min-width: 24%;
  }

  .topChilds {
    display: flex;
    flex-flow: wrap;
    flex-wrap: wrap;
  }

  .topChilds .desc {
    font-size: 18px;
    font-weight: bold;
  }

  .topChilds .cardmrItem {
    max-width: 290px;
    min-width: 24%;
    margin-right: 1%;
    margin-bottom: 16px;
  }

  .updateTime {
    position: relative;
    top: -86px;
    left: 120px;
  }
</style>
