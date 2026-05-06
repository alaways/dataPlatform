<template>
  <Card title="订单数据管理" :bordered="false">
    <BaseCard :list="topContentChilds" :hideTitle="true" :res="cutRes" />
  </Card>
  <OrderLine :type="4" v-if="hasPermission('ShoutGDOrderLine')" />
  <Card class="bottomCard" title="金额数据管理" :bordered="false">
    <BaseCard :list="contentArrs" :hideTitle="true" :res="cutRes" />
  </Card>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import { Card } from 'ant-design-vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import BaseCard from '../components/baseCard/index.vue'
  import { getNewMain } from '/@/api/statistics/index'
  import OrderLine from '../components/OrderLine/index.vue'
  export default defineComponent({
    name: 'TotalAllPie',
    components: { Card, BaseCard, OrderLine },
    setup() {
      const { hasPermission } = usePermission()
      const topContentChilds = ref([
        {
          id: 'totalOrderCount',
          label: '总订单数',
          amount: '',
          isShow: hasPermission('ShoutGDtotalOrderCount'),
          titple: '线下（租赁生效中、已逾期、已买断、已完结）+支付宝数据的总订单数',
          color: '#90EE90',
        },
        {
          id: 'waitDeliveryCount',
          label: '待发货',
          amount: '',
          titple: '线下待发货订单+支付宝数据的待发货订单数即可',
          isShow: hasPermission('ShoutGDwaitDeliveryCount'),
          color: '#90EE90',
        },
        {
          id: 'confirmOrderCount',
          label: '待确认收货',
          amount: '',
          titple: '线下待确认收货订单+支付宝数据的待确认收货订单数即可',
          isShow: hasPermission('ShoutGDconfirmOrderCount'),
          color: '#90EE90',
        },
        {
          id: 'rentOrderCount',
          label: '租用中',
          amount: '',
          titple: '线下（租赁生效中、已逾期）订单数+支付宝数据的租用中订单数即可',
          isShow: hasPermission('ShoutGDrentOrderCount'),
          color: '#90EE90',
        },
        {
          id: 'waitReturnOrderCount',
          label: '待归还',
          amount: '',
          titple: '线下待归还订单数+支付宝数据的待归还订单数即可',
          isShow: hasPermission('ShoutGDwaitReturnOrderCount'),
          color: '#90EE90',
        },
        {
          id: 'completeOrderCount',
          label: '订单完结',
          amount: '',
          titple: '线下（已买断、已完结）订单数+支付宝数据的订单完结数即可',
          isShow: hasPermission('ShoutGDcompleteOrderCount'),
          color: '#90EE90',
        },
        {
          id: 'overDueOrderCount',
          label: '已逾期',
          amount: '',
          titple: '线下（已逾期）订单数+支付宝数据的已逾期订单数即可',
          isShow: hasPermission('ShoutGDoverDueOrderCount'),
          color: '#FFB6C1',
        },
        {
          id: 'orderOverDueLv',
          label: '订单逾期率',
          titple: '计算公式：逾期订单/总订单',
          amount: '',
          isShow: hasPermission('ShoutGDorderOverDueLv'),
          isAddLv: true,
          color: '#FFB6C1',
        },

        {
          id: 'yesterdayTotalOrderCount',
          label: '昨天新增订单数',
          titple: '线下数据+支付宝数据的新增订单数据',
          amount: '',
          isShow: hasPermission('ShoutGDyesterdayTotalOrderCount'),
          color: '#90EE90',
        },
        {
          id: 'orderCountGe30',
          label: '近30天新增订单',
          titple: '(线下数据+支付宝数据)近30天新增订单合计数',
          amount: '',
          isShow: hasPermission('ShoutGDorderCountGe30'),
          color: '#90EE90',
        },
        {
          id: 'countRegUser',
          label: '注册用户数',
          titple: '线下数据+ 支付宝数据',
          amount: '',
          isShow: hasPermission('ShoutGDcountRegUser'),
          color: '#90EE90',
        },
      ])
      const contentArrs = ref([
        {
          id: 'futureContract',
          label: '合同金额',
          color: '#AFEEEE	',
          titple:
            '线下（租赁生效中、已逾期、已买断、已完结）状态订单的合同金额（订单总金额）+支付宝数据的订单合同总价，含买断价+已收增值服务金额',
          amount: '',
          isShow: hasPermission('ShoutGDfutureContract'),
        },
        {
          id: 'notDueContract',
          label: '未到期订单合同价',
          titple:
            '线下的未到期订单合同总金额(订单状态：租赁生效中、已逾期）+支付宝数据未到期订单合同总金额（订单状态：待确认收货、租用中、已逾期）',
          amount: '',
          isShow: hasPermission('ShoutGDnotDueContract'),
          color: '#AFEEEE',
        },
        {
          id: 'notDueRent',
          label: '未到期金额',
          titple:
            '线下的待收租金金额(除去首付以及已收租金、不含逾期租金总金额)+支付宝数据的未到期买断金额；',
          amount: '',
          color: '#AFEEEE	',
          isShow: hasPermission('ShoutGDnotDueRent'),
        },
        {
          id: 'loanMoney',
          label: '订单货款成本（仅货款）',
          titple: '【支付宝数据】+【线下数据】货款采购合计',
          amount: '',
          color: '#AFEEEE	',
          isShow: hasPermission('ShoutGDloanMoney'),
        },
        {
          id: 'overDueRent',
          label: '逾期金额',
          color: 'yellow',
          titple:
            '取值：线下（已逾期状态）订单的逾期租金金额（不含罚金）+支付宝数据的逾期租金+逾期尾款（不算在未到期金额里',
          amount: '',
          isShow: hasPermission('ShoutGDoverDueRent'),
        },
        {
          id: 'overdueLv',
          label: '金额逾期率',
          titple:
            '公式：【线下（已逾期状态）订单的逾期租金金额（不含罚金）+支付宝数据的（逾期租金+逾期买断金额）】/合同金额',
          amount: '',
          color: 'yellow',
          isShow: hasPermission('ShoutGDoverdueLv'),
          isAddLv: true,
        },
        {
          id: 'overdueAmountGe30',
          label: '逾期时间≥30天的逾期金额',
          color: 'yellow',
          titple: '线下数据+支付宝数据',
          amount: '',
          isShow: hasPermission('ShoutGDoverdueAmountGe30'),
        },
        {
          id: 'overdueAmountGe30Lv',
          label: '逾期时间≥30天的逾期率',
          color: 'yellow',
          titple:
            '【（当前线下逾期时间≥30天的订单逾期租金金额）+（当前支付宝数据逾期时间≥30天的订单逾期租金金额）】/【（线下合同金额）+（支付宝数据合同金额）】',
          amount: '',
          isAddLv: true,
          isShow: hasPermission('ShoutGDoverdueAmountGe30Lv'),
        },
        {
          id: 'overdueAmountGe180',
          label: '逾期时间≥180天的逾期金额',
          color: 'yellow',
          titple: '线下数据+支付宝数据',
          amount: '',
          isShow: hasPermission('ShoutGDoverdueAmountGe180'),
        },
        {
          id: 'overdueAmountGe180Lv',
          label: '逾期时间≥180天的逾期率',
          color: 'yellow',
          titple:
            '【（当前线下逾期时间≥180天的订单逾期租金金额）+（当前支付宝数据逾期时间≥180天的订单逾期租金金额）】/【（线下合同金额）+（支付宝数据合同金额）】',
          amount: '',
          isAddLv: true,
          isShow: hasPermission('ShoutGDoverdueAmountGe180Lv'),
        },
        {
          id: 'receiveRentAmount',
          label: '已收租金',
          titple: `线下的首付总金额+线下的已还期数租金总额+支付宝数据的已收租金金额； 
          注：①线下的首付总金额(含锁费、公证、增值服务、订单账单金额、部分还款)
          ②线下的已还期数租金总额`,
          color: '#90EE90',
          amount: '',
          isShow: hasPermission('ShoutGDreceiveRentAmount'),
        },
        {
          id: 'goodsAmount',
          label: '已收增值服务金额',
          amount: '',
          titple:
            '取值：线下的已收增值服务金额（取值：锁费、公证、增值服务）+支付宝数据的已收增值服务金额；',
          color: '#90EE90',
          isShow: hasPermission('ShoutGDgoodsAmount'),
        },
        {
          id: 'buyoutAmount',
          label: '已收买断金额',
          amount: '',
          color: '#90EE90',
          isShow: hasPermission('ShoutGDbuyoutAmount'),
        },
        {
          id: 'otherAmount',
          label: '其他收款（主要：罚金）',
          amount: '',
          titple: '取值：线下的已收罚金总金额+支付宝数据的已收其他收款（主要：罚金）',
          color: '#90EE90',
          isShow: hasPermission('ShoutGDotherAmount'),
        },
      ])
      const cutRes = ref(null)
      onMounted(async () => {
        getData()
      })
      const getData = async () => {
        // 获取线下 + 零零享租 数据
        const res = await getNewMain({ type: 4 })
        cutRes.value = res?.data || {}
      }
      return {
        topContentChilds: topContentChilds?.value?.filter((item: any) => item.isShow),
        contentArrs: contentArrs?.value?.filter((item: any) => item.isShow),
        hasPermission,
        cutRes,
      }
    },
  })
</script>
