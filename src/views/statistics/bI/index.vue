<template>
  <Card title="" :bordered="false">
    <BaseCard :list="orderCount" :hideTitle="true" :res="cutRes" />
  </Card>
  <OrderLine :type="1" v-if="hasPermission('monthOrderCount')" />
  <Card title="订单金额数据" :bordered="false">
    <BaseCard :list="orderAmountInfo" :hideTitle="true" :res="cutRes" />
  </Card>
  <Card title="已收租金数据" :bordered="false">
    <BaseCard :list="overAmountInfos" :hideTitle="true" :res="cutRes" />
  </Card>
  <Card title="罚金数据" :bordered="false">
    <BaseCard :list="rentOrderAmount" :hideTitle="true" :res="cutRes" />
  </Card>
  <div class="loadingCont" v-if="loading"><Spin :size="80" /><span>正在加载中...</span></div>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import { Card, Spin } from 'ant-design-vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import BaseCard from '../components/baseCard/index.vue'
  import { getBIwMain } from '/@/api/statistics/index'
  import OrderLine from '../components/OrderLine/index.vue'
  export default defineComponent({
    name: 'BIDataTotal',
    components: { Card, BaseCard, Spin, OrderLine },
    setup() {
      const { hasPermission } = usePermission()
      const orderCount = ref([
        {
          id: 'placeOrderCount',
          label: '下单订单数',
          titple: '下单订单状态范围（201-1301）',
          amount: '',
          isShow: hasPermission('placeOrderCount'),
          color: '#fff',
        },
        {
          id: 'allOrderCount',
          label: '总订单数',
          amount: '',
          isShow: hasPermission('allOrderCount'),
          titple: '计算公式： 在租订单数 + 已过期的逾期订单数 + 已完结订单数',
          color: '#fff',
        },
        {
          id: 'rentOrderCount',
          label: '在租订单数',
          amount: '',
          titple:
            '最后一期账单时间未到或已到（包含逾期、租赁生效中）的订单，不含过期（过期指：最后一期账单时间）的逾期订单',
          isShow: hasPermission('rentOrderCount'),
          color: '#fff',
        },
        {
          id: 'registerUserCount',
          label: '注册用户数',
          titple: '累积注册用户(实名用户）uuid，不根据身份信息去重',
          amount: '',
          isShow: hasPermission('registerUserCount'),
          color: '#fff',
        },
        {
          id: 'rentAlreadyOverOrderCount',
          label: '在租已逾期订单数',
          amount: '',
          titple:
            '最后一期账单时间未到或已到（包含逾期）的订单数；不含过期（过期指：最后一期账单时间）逾期的订单数',
          isShow: hasPermission('rentAlreadyOverOrderCount'),
          color: '#fff',
        },
        {
          id: 'endOrderCout',
          label: '已完结订单数',
          amount: '',
          titple: '订单状态（已买断、已完结状态）的订单数',
          isShow: hasPermission('endOrderCout'),
          color: '#fff',
        },
        {
          id: 'overOrderCount',
          label: '已过期的逾期订单数',
          amount: '',
          titple: '最后一期账单时间过期的逾期订单数',
          isShow: hasPermission('overOrderCount'),
          color: '#fff',
        },
        {
          id: 'rentOverOrderAmount',
          label: '已过期的逾期订单账单金额',
          amount: '',
          titple: '最后一期账单时间过期的逾期订单账单未还金额（去掉部分已还金额；不含罚金）',
          isShow: hasPermission('rentOverOrderAmount'),
          color: '#fff',
        },
        {
          id: 'yesterOrderCount',
          label: '昨日新增订单数',
          titple:
            '昨日新增的订单数，订单状态（租赁生效），且订单创建日当天买断、完结的订单需纳入实时统计；剔除取消、退单状态',
          amount: '',
          isShow: hasPermission('yesterOrderCount'),
          color: '#fff',
        },
        {
          id: 'monthOrderCount',
          label: '近30天新增订单数',
          titple:
            '近30天新增的订单数，订单状态（租赁生效），且订单创建日当天买断、完结的订单需纳入实时统计；剔除取消、退单状态',
          amount: '',
          isShow: hasPermission('monthOrderCount'),
          color: '#fff',
        },
        {
          id: 'todayOvereOrderCount',
          label: '今天到期订单数',
          amount: '',
          titple:
            '查看当天时间，订单状态（租赁生效中、已逾期、已买断、已完结），排除第一期租期时间，剩余账单内有一期当天到期，即计算入内（订单状态：租赁生效中、已逾期、已买断、已完结）',
          isShow: hasPermission('todayOvereOrderCount'),
          color: '#ffff',
        },
        {
          id: 'todayOverOrderAmount',
          label: '今天到期订单总金额',
          amount: '',
          titple: '计算公式：今天到期订单数总金额',
          isShow: hasPermission('todayOverOrderAmount'),
          color: '#ffff',
        },
      ])
      const orderAmountInfo = ref([
        {
          id: 'totalContractAmount',
          label: '总合同金额',
          titple: '订单状态（租赁生效中、已逾期、已买断、已完结）的订单总金额',
          amount: '',
          isShow: hasPermission('totalContractAmount'),
          color: '#fff',
        },
        {
          id: 'totalOutstandingAmount',
          label: '总待收金额',
          titple: ' 订单状态（租赁生效中、已逾期）的订单未还租金金额（不含罚金）',
          amount: '',
          isShow: hasPermission('totalOutstandingAmount'),
          color: '#fff',
        },
        {
          id: 'totalAmountRentalOrder',
          label: '在租订单总金额',
          amount: '',
          isShow: hasPermission('totalAmountRentalOrder'),
          titple:
            '在租定义：最后一期账单时间未到或已到（包含逾期、租赁生效中）的订单，不含过期（过期指：最后一期账单时间）的逾期订单，总金额【含锁费、公证、增值服务、租金金额】合计',
          color: '#fff',
        },
        {
          id: 'totalDownPayment',
          label: '在租首付总金额',
          amount: '',
          titple:
            '在租定义：最后一期账单时间未到或已到（包含逾期、租赁生效中）的订单，不含过期（过期指：最后一期账单时间）的逾期订单，第一次支付总金额【含锁费、公证、增值服务、租金金额、加上部分还款】合计',
          isShow: hasPermission('totalDownPayment'),
          color: '#fff',
        },
        {
          id: 'amountRentLease',
          label: '在租待收租金总金额',
          amount: '',
          titple:
            '在租定义：最后一期账单时间未到或已到（包含逾期、租赁生效中）的订单，不含过期（过期指：最后一期账单时间）的逾期订单，账单剩余未还租金金额【除去首付金额、已还租金金额；含逾期租金金额；减掉部分还款金额；不含产生罚金】的合计',
          isShow: hasPermission('amountRentLease'),
          color: '#fff',
        },
        {
          id: 'amountOverdueRent',
          label: '在租订单逾期租金总金额',
          amount: '',
          titple:
            '在租定义：最后一期账单时间未到或已到（包含逾期）的订单，不含过期（过期指：最后一期账单时间）的逾期订单，账单的逾期租金金额（减掉含部分还款；不含罚金）合计',
          isShow: hasPermission('amountOverdueRent'),
          color: '#fff',
        },
        {
          id: 'rentReductionAmount',
          label: '租金减免金额',
          titple:
            '订单状态(租赁生效中、已逾期、已买断、已完结）的账单，折后减免、买断减免的金额合计',
          amount: '',
          isShow: hasPermission('rentReductionAmount'),
          color: '#fff',
        },
        {
          id: 'overdueRateAmount',
          label: '金额逾期率',
          titple:
            '订单状态（已逾期）的账单状态-逾期的租金（不含罚金；减掉部分已还金额）/总合同金额',
          amount: '',
          isAddLv: true,
          isShow: hasPermission('overdueRateAmount'),
          color: '#fff',
        },
      ])
      const overAmountInfos = ref([
        {
          id: 'totalAmountReceived',
          label: '已收总金额',
          amount: '',
          titple:
            '订单状态（租赁生效中、已逾期、已买断、已完结状态），账单实际已还金额【首付金额（含锁费、公证、增值服务、租金金额）；含部分还款；含罚金】的合计',
          isShow: hasPermission('totalAmountReceived'),
          color: '#fff',
        },
        {
          id: 'amountSettled',
          label: '已结清订单总金额',
          amount: '',
          titple:
            '订单状态（已买断、已完结状态），账单实际已还金额【首付金额（含锁费、公证、增值服务、租金金额）；含罚金】的合计',
          isShow: hasPermission('amountSettled'),
          color: '#ffff',
        },
        {
          id: 'amountRentPaidInstallments',
          label: '在租已还期数租金总金额',
          amount: '',
          titple:
            '在租定义：最后一期账单时间未到或已到（包含逾期、租赁生效中）的订单，不含过期（过期指：最后一期账单时间）的逾期订单，账单实际已还租金金额（加上含部分还款；不含罚金金额）的合计',
          isShow: hasPermission('amountRentPaidInstallments'),
          color: '#fff',
        },
        {
          id: 'depositAmount',
          label: '押金金额',
          titple: '账单内有押金字段的金额合计',
          amount: '',
          isShow: hasPermission('depositAmount'),
          color: '#fff',
        },
      ])
      const rentOrderAmount = ref([
        {
          id: 'penaltyAmountRentalPaid',
          label: '在租订单已还罚金总金额',
          titple:
            '在租定义：最后一期账单时间未到或已到（包含逾期）的订单，不含过期（过期指：最后一期账单时间）的逾期订单，产生的逾期罚金，且罚金已还款的总金额',
          amount: '',
          isShow: hasPermission('penaltyAmountRentalPaid'),
          color: '#fff',
        },
        {
          id: 'amountTotalCollectedRental',
          label: '在租订单待收罚金总金额',
          titple:
            '在租定义：最后一期账单时间未到或已到（包含逾期）的订单，不含过期（过期指：最后一期账单时间）的逾期订单，产生的逾期罚金，且罚金待收未还的总金额',
          amount: '',
          isShow: hasPermission('amountTotalCollectedRental'),
          color: '#fff',
        },
        {
          id: 'amountReceivableRental',
          label: '在租订单应收罚金总金额',
          titple: '计算公式：在租订单待收罚金总金额+在租订单已还罚金总金额',
          amount: '',
          isShow: hasPermission('amountReceivableRental'),
          color: '#ffff',
        },
        {
          id: 'totalAmountFinesCollected',
          label: '已收罚金总金额',
          titple: '订单状态（租赁生效中、已逾期、已买断、已完结）的实际已还罚金总金额',
          amount: '',
          isShow: hasPermission('totalAmountFinesCollected'),
          color: '#fff',
        },
        {
          id: 'penaltyReductionAmount',
          label: '罚金减免金额',
          titple: '订单或账单，折后减免的金额合计',
          amount: '',
          isShow: hasPermission('penaltyReductionAmount'),
          color: '#fff',
        },
        
      ])
      const cutRes = ref(null)
      const loading = ref(false)
      onMounted(async () => {
        loading.value = true
        const res = await getBIwMain({ type: 1 })
        loading.value = false
        cutRes.value = res?.data || {}
      })
      return {
        orderCount: orderCount.value?.filter((item: any) => item.isShow),
        orderAmountInfo: orderAmountInfo.value?.filter((item: any) => item.isShow),
        overAmountInfos: overAmountInfos?.value?.filter((item: any) => item.isShow),
        rentOrderAmount: rentOrderAmount?.value?.filter((item: any) => item.isShow),
        hasPermission,
        cutRes,
        loading,
      }
    },
  })
</script>
<style lang="less">
  .loadingCont {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      margin-left: 10px;
    }
  }
</style>
