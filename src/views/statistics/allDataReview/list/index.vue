<template>
  <Card title="订单数据管理" :bordered="false">
    <BaseCard :list="topContentChilds" :res="cutRes" />
  </Card>
  <OrderLine :type="2" v-if="hasPermission('orderCountForMonth')" />
  <Card class="bottomCard" title="金额数据管理" :bordered="false">
    <BaseCard :list="contentArrs" :res="cutRes" />
  </Card>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import { Card } from 'ant-design-vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import BaseCard from '/@/views/statistics/components/baseCard/index.vue'
  import { getNewMain } from '/@/api/statistics/index'
  import OrderLine from '/@/views/statistics/components/OrderLine/index.vue'
  export default defineComponent({
    name: 'OOXiangzu',
    components: { Card, BaseCard, OrderLine },
    setup() {
      const { hasPermission } = usePermission()
      const topContentChilds = ref([
        {
          id: 'totalOrderCount',
          label: '总订单数',
          amount: '',
          titple: '总订单数=待发货+待确认收货+租用中+待归还+订单完结+已逾期',
          isShow: hasPermission('totalOrderCount'),
          color: '#90EE90',
        },
        {
          id: 'waitDeliveryCount',
          label: '待发货',
          amount: '',
          isShow: hasPermission('waitDeliveryCount'),
          color: '#90EE90',
        },
        {
          id: 'confirmOrderCount',
          label: '待确认收货',
          amount: '',
          isShow: hasPermission('confirmOrderCount'),
          color: '#90EE90',
        },
        {
          id: 'rentOrderCount',
          label: '租用中',
          amount: '',
          isShow: hasPermission('rentOrderCount'),
          color: '#90EE90',
        },
        {
          id: 'waitReturnOrderCount',
          label: '待归还',
          amount: '',
          isShow: hasPermission('waitReturnOrderCount'),
          color: '#90EE90',
        },
        {
          id: 'completeOrderCount',
          label: '订单完结',
          amount: '',
          isShow: hasPermission('completeOrderCount'),
          color: '#90EE90',
        },
        {
          id: 'overDueOrderCount',
          label: '已逾期',
          amount: '',
          isShow: hasPermission('overDueOrderCount'),
          color: '#FFB6C1',
        },
        {
          id: 'orderOverDueLv',
          label: '订单逾期率',
          titple: '计算：逾期订单/总订单',
          amount: '',
          isShow: hasPermission('orderOverDueLv'),
          isAddLv: true,
          color: '#FFB6C1',
        },

        {
          id: 'yesterdayTotalOrderCount',
          label: '昨天新增订单数',
          titple: '昨日新增的待发货订单数',
          amount: '',
          isShow: hasPermission('orderCountForYesDay'),
          color: '#90EE90',
        },
        {
          id: 'orderCountGe30',
          label: '近30天新增订单',
          titple: '近30天新增订单合计数',
          amount: '',
          isShow: hasPermission('ooxorderCountForMonth'),
          color: '#90EE90',
        },
        {
          id: 'countRegUser',
          label: '注册用户数',
          amount: '',
          isShow: hasPermission('ooxregisterUser'),
          color: '#90EE90',
        },
      ])
      const contentArrs = ref([
        {
          id: 'futureContract',
          label: '合同金额',
          color: '#AFEEEE	',
          titple: '订单合同总价，含买断价+已收增值服务金额',
          amount: '',
          isShow: hasPermission('futureContract'),
        },
        {
          id: 'notDueContract',
          label: '未到期订单合同价',
          titple: '支付宝数据未到期订单合同总金额（订单状态：待确认收货、租用中、已逾期）',
          amount: '',
          isShow: hasPermission('unOrderPrice'),
          color: '#AFEEEE',
        },
        {
          id: 'notDueRent',
          label: '未到期金额',
          titple: '未到期金额：未收租金+买断尾款',
          amount: '',
          color: '#AFEEEE	',
          isShow: hasPermission('notDueRent'),
        },
        {
          id: 'loanMoney',
          label: '订单货款成本（仅货款）',
          titple: '【支付宝数据】租用中、已完成、已逾期、待归还的「采购价」不含运费',
          amount: '',
          color: '#AFEEEE	',
          isShow: hasPermission('loanMoney'),
        },
        {
          id: 'overDueRent',
          label: '逾期金额',
          color: 'yellow',
          titple: '逾期租金+逾期尾款（不算在未到期金额里）',
          amount: '',
          isShow: hasPermission('overDueRent'),
        },
        {
          id: 'overdueLv',
          label: '金额逾期率',
          titple: '公式：（逾期租金+逾期买断金额）/合同金额',
          amount: '',
          color: 'yellow',
          isShow: hasPermission('overdueLv'),
          isAddLv: true,
        },
        {
          id: 'overdueAmountGe30',
          label: '逾期时间≥30天的逾期金额',
          color: 'yellow',
          titple: '当前逾期时间≥30天以上的订单逾期租金金额（订单状态：已逾期）',
          amount: '',
          isShow: hasPermission('ooxOverDueRentMonth'),
        },
        {
          id: 'overdueAmountGe30Lv',
          label: '逾期时间≥30天的逾期率',
          color: 'yellow',
          titple: '计算公式=当前逾期时间≥30天的订单逾期租金金额（订单状态：已逾期）/合同金额',
          amount: '',
          isAddLv: true,
          isShow: hasPermission('ooXOverdueLvMonth'),
        },
        {
          id: 'overdueAmountGe180',
          label: '逾期时间≥180天的逾期金额',
          color: 'yellow',
          titple: '当前逾期时间≥180天以上的订单逾期租金金额（订单状态：已逾期）',
          amount: '',
          isShow: hasPermission('ooxOverDueRentQuarter'),
        },
        {
          id: 'overdueAmountGe180Lv',
          label: '逾期时间≥180天的逾期率',
          color: 'yellow',
          titple: '计算公式=当前逾期时间≥180天的订单逾期租金金额（订单状态：已逾期）/合同金额',
          amount: '',
          isAddLv: true,
          isShow: hasPermission('ooXOverdueLvQuarter'),
        },
        {
          id: 'receiveRentAmount',
          label: '已收租金',
          titple: '仅租金金额',
          color: '#90EE90',
          amount: '',
          isShow: hasPermission('receiveRentAmount'),
        },
        {
          id: 'goodsAmount',
          label: '已收增值服务金额',
          amount: '',
          color: '#90EE90',
          isShow: hasPermission('goodsAmount'),
        },
        {
          id: 'buyoutAmount',
          label: '已收买断金额',
          amount: '',
          color: '#90EE90',
          isShow: hasPermission('buyoutAmount'),
        },
        {
          id: 'otherAmount',
          label: '其他收款（主要：罚金）',
          amount: '',
          color: '#90EE90',
          isShow: hasPermission('otherAmount'),
        },
      ])
      const cutRes = ref(null)
      onMounted(async () => {
        const res = await getNewMain({ type: 2 })
        cutRes.value = res?.data
      })
      return {
        topContentChilds: topContentChilds?.value?.filter((item: any) => item.isShow),
        contentArrs: contentArrs?.value?.filter((item: any) => item.isShow),
        cutRes,
        hasPermission,
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
    top: -63px;
    left: 120px;
  }
</style>
