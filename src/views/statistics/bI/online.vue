<template>
  <!-- 用户数据 -->
  <BaseCard :list="userContent" :hideTitle="true" :res="cutRes" />
  <!-- 订单数据 -->
  <BaseCard :list="orderContent" :hideTitle="true" :res="cutRes" />
  <!-- 金额数据 -->
  <BaseCard :list="AmountContent" :hideTitle="true" :res="cutRes" />
  <OrderOnlineLine :type="1" v-if="hasPermission('monthOrderCountForOnline')" />
  <Pie ref="pieRef" @onChange="onChangePie" v-if="hasPermission('pieForOnline')" />
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, nextTick } from 'vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import BaseCard from '../components/baseCard/index.vue'
  import {
    getNewUserCountInfo,
    getNewOrderCountInfo,
    getOrderCountByStatus,
    getOrderAmountInfo,
    getBIwMainForOnline,
  } from '/@/api/statistics/index'
  import OrderOnlineLine from './OrderLine/index.vue'
  import Pie from './Pie.vue'
  export default defineComponent({
    name: 'BIDataTotal',
    components: { BaseCard, OrderOnlineLine, Pie },
    setup() {
      const { hasPermission } = usePermission()
      const pieKey = ref('2')
      const uinfo = localStorage.getItem('USERINFO') ? JSON.parse(localStorage.getItem('USERINFO')) : null
      const iswAdmin = uinfo?.uid == '42398518'
      // 用户数据
      const userContent = ref([
        {
          id: 'userCount',
          label: '累计用户',
          amount: '',
          isShow: hasPermission('totalUserForAll'),
          titple: '平台累计用户：当前未认证用户数+当前已认证用户数',
          color: '#fff',
        },
        {
          id: 'userCount4NoIdentity',
          label: '当前未认证用户数',
          amount: '',
          titple: '用户未进行二要素认证客户',
          isShow: hasPermission('totalWuserForAll'),
          color: '#fff',
        },
        {
          id: 'userCount4Identity',
          label: '当前已认证用户数',
          amount: '',
          titple: '用户已进行二要素认证',
          isShow: hasPermission('totalOverUserForAll'),
          color: '#fff',
        },
      ])
      // 订单数据
      const orderContent = ref([
        {
          id: 'orderCountForAll',
          label: '总订单数',
          amount: '',
          titple:
            '当平台总的有效订单数：=当前在租订单+当前逾期订单数+已完结订单+待续租订单+续租中订单',
          isShow: hasPermission('allOrderCountForAll'),
          color: '#fff',
        },
        {
          id: 'yesterOrderCount',
          label: '昨日新增订单数',
          titple:
            '昨日新增的订单数，订单状态（租赁生效），且订单创建日当天买断、完结的订单需纳入实时统计；剔除取消、退单状态',
          amount: '',
          isShow: hasPermission('yesterOrderCountForOnline'),
          color: '#fff',
        },
        {
          id: 'weekOrderCount',
          label: '近7天新增订单数',
          titple:
            '近7天新增的订单数，订单状态（租赁生效），且订单创建日当天买断、完结的订单需纳入实时统计；剔除取消、退单状态',
          amount: '',
          isShow: hasPermission('weekOrderCount'),
          color: '#fff',
        },
        {
          id: 'todayOvereOrderCount',
          label: '今天到期订单数',
          titple:
            '近7天新增的订单数，订单状态（租赁生效），且订单创建日当天买断、完结的订单需纳入实时统计；剔除取消、退单状态',
          amount: '',
          isShow: hasPermission('todayOvereOrderCountForOnline'),
          color: '#fff',
        },
        {
          id: 'todayOverOrderAmount',
          label: '今天到期订单的当期账单应还总金额',
          amount: '',
          showYes: iswAdmin ? false : true,
          isUp: false,
          yesterAmount: 0,
          yesterLv: 0,
          titple: '取今天到期订单的当期账单应还总金额',
          isShow: hasPermission('todayOverOrderAmountForOnline'),
          color: '#ffff',
        },
        {
          id: 'orderCountFor801',
          label: '当前在租订单数',
          amount: '',
          titple: '未到最后到期日的订单数减已买断订单/已完结订单',
          isShow: hasPermission('orderRentCountForAll'),
          color: '#fff',
        },
        {
          id: 'orderCountFor901',
          label: '当前逾期订单数',
          amount: '',
          titple: '当前平台在于订单总数',
          isShow: hasPermission('yuqiOrderCountForAll'),
          color: '#fff',
        },
        {
          id: 'orderCountFor11011201',
          label: '已完结订单数',
          amount: '',
          titple: '当前平台已完结/买断订单数',
          isShow: hasPermission('overedOrderCountForAll'),
          color: '#fff',
        },
        {
          id: 'shenqingOrderNum',
          label: '申请中订单数',
          titple: '当前申请中订单总数',
          amount: '',
          isShow: hasPermission('sqzOrderCountForAll'),
          color: '#fff',
        },

        {
          id: 'shenheOrderNum',
          label: '待审核订单数',
          titple: '当前待审核状态下的订单总数',
          amount: '',
          isShow: hasPermission('dshOrderCountForAll'),
          color: '#fff',
        },
        {
          id: 'whenPayOrderNum',
          label: '待支付订单数（首付）',
          titple: '当前待支付状态下的订单总数',
          amount: '',
          isShow: hasPermission('firstPayOrderCountForAll'),
          color: '#fff',
        },
        {
          id: 'fahuoOrderNum',
          label: '待发货订单数',
          titple: '当前待发货状态下的订单总数',
          amount: '',
          isShow: hasPermission('dfhOrderForAll'),
          color: '#fff',
        },
        {
          id: 'dxzOrderCount',
          label: '待续租/买断/归还订单数',
          titple: '当前待续租/买断/归还的订单总数',
          amount: '',
          isShow: hasPermission('dxzOrderCountForAll'),
          color: '#fff',
        },
        {
          id: 'xzzOtderCount',
          label: '续租中订单数',
          titple: '当前续租中的订单总数',
          amount: '',
          isShow: hasPermission('xzzOrderCountForAll'),
          color: '#fff',
        },
        {
          id: 'orderCountOverdueRate',
          label: '订单逾期率',
          titple: '逾期订单/订单总订单',
          amount: '',
          isAddLv: true,
          isShow: hasPermission('orderLvForAll'),
          color: '#fff',
        },
        {
          id: 'orderCountForGiveBack',
          label: '已归还订单数',
          // titple: '逾期订单/订单总订单',
          amount: '',
          // isAddLv: true,
          isShow: hasPermission('orderCountForGiveBack'),
          color: '#fff',
        },
        {
          id: 'rentalOrderOverdueRate',
          label: '在租订单逾期率',
          titple: '在租已逾期订单数/在租订单数',
          amount: '',
          isAddLv: true,
          isShow: hasPermission('rentalOrderOverdueRateForOnline'),
          color: '#fff',
        },
      ])
      // 金额数据
      const AmountContent = ref([
        {
          id: 'orderAmountForAll',
          label: '订单总金额',
          titple:
            '当前平台订单总金额 =已收租金总金额+待收租金总金额+逾期租金总金额+已收买断尾款总金额+待收买断尾矿总金额+已收增值服务费及配件金额',
          amount: '',
          isShow: hasPermission('orderAllPriceForAll'),
          color: '#fff',
        },
        {
          id: 'orderAmountForType2Paid',
          label: '已收租金总金额',
          titple: '当前已收租金总金额（不含罚金）',
          amount: '',
          isShow: hasPermission('yshOrderAmountForAll'),
          color: '#fff',
        },
        {
          id: 'orderAmountForType2NoPaidNoOverdue',
          label: '待收租金总金额',
          titple: '当前待收租金总金额（不含罚金）',
          amount: '',
          isShow: hasPermission('daiShouOrderAmountForAll'),
          color: '#fff',
        },
        {
          id: 'orderAmountForType2NoPaidOverdue',
          label: '逾期金额总金额',
          titple: '当前逾期总金额',
          amount: '',
          isShow: hasPermission('yuqiOrderAmountForAll'),
          color: '#fff',
        },
        {
          id: 'orderAmountForType6NoPaid',
          label: '待收买断尾款总金额',
          titple: '当前待收尾款总金额',
          amount: '',
          isShow: hasPermission('buyoutOrderAmountForAll'),
          color: '#fff',
        },
        {
          id: 'orderAmountForType6Paid',
          label: '已收买断尾款总金额',
          titple: '当前已收尾款总金额',
          amount: '',
          isShow: hasPermission('buyoutedOrderAmountForAll'),
          color: '#fff',
        },
        {
          id: 'orderAmountForFirstOther',
          label: '已收增值服务及配件费',
          titple: '当前已收增值服务费及配件金额',
          amount: '',
          isShow: hasPermission('otherAmountForAll'),
          color: '#fff',
        },
        {
          id: 'orderAmountForType2NoPaidOverdueRate',
          label: '金额逾期率',
          titple: '逾期金额/订单总金额',
          amount: '',
          isAddLv: true,
          isShow: hasPermission('orderLvForAll'),
          color: '#fff',
        },
      ])
      const cutRes = ref(null)
      const pieRef = ref<any>()
      onMounted(async () => {
        
        const userRes = await getUserInfo()
        const orderRes = await getOrderCount()
        const lvRes = await getBIwMainForOnline({ type: 1 })
        console.log(lvRes, 'lvResshow')
        // 申请中，  待审核， 待支付， 待发货 状态的数据
        // 申请中的数据
        const shenqingOrderNum = await getOrderNum({ orderStatusList: 109 })
        // 待审核，的数据
        const shenheOrderNum = await getOrderNum({ orderStatusList: 201 })
        // 待支付的数据
        const whenPayOrderNum = await getOrderNum({ orderStatusList: 401 })
        // 待发货的数据
        const fahuoOrderNum = await getOrderNum({ orderStatusList: 501 })
        // 待续租订单的数据
        const dxzOrderCount = await getOrderNum({ orderStatusList: 1003 })
        // 续租中订单的数据
        const xzzOtderCount = await getOrderNum({ orderStatusList: 902 })
        // 续租中订单的数据
        const orderCountForGiveBack = await getOrderNum({ searchType: 1 })
        const otherRes = {
          shenqingOrderNum,
          shenheOrderNum,
          whenPayOrderNum,
          fahuoOrderNum,
          dxzOrderCount,
          xzzOtderCount,
          orderCountForGiveBack,
          rentalOrderOverdueRate: lvRes?.data?.rentalOrderOverdueRate,
          totalDownPayment: lvRes?.data?.totalDownPayment,
          amountOverdueRent: lvRes?.data?.amountOverdueRent,
          amountRentLease: lvRes?.data?.amountRentLease,
          amountRentPaidInstallments: lvRes?.data?.amountRentPaidInstallments,
          totalDownPaymentAmount: lvRes?.data?.totalDownPaymentAmount,
          totalAmountReceived: lvRes?.data?.totalAmountReceived,
          rentTotalOverOrderAmount: lvRes?.data?.rentTotalOverOrderAmount,
          rentTotalNotOverOrderAmount: lvRes?.data?.rentTotalNotOverOrderAmount,
          yesterOrderCount: lvRes?.data?.yesterOrderCount,
          weekOrderCount: lvRes?.data?.weekOrderCount,
          todayOvereOrderCount: lvRes?.data?.todayOvereOrderCount,
          todayOverOrderAmount: lvRes?.data?.todayOverOrderAmount,
          yesteOverOrderAmount: lvRes?.data?.yesteOverOrderAmount,
          todayOverOrderAmountRate: lvRes?.data?.todayOverOrderAmountRate,
        }
        let orderAmountRes = await getOrderAllAmount()
        Object.keys(orderAmountRes)?.forEach((item: any) => {
          if (item !== 'orderAmountForType2NoPaidOverdueRate') {
            orderAmountRes[item] = orderAmountRes[item] / 100
          }
        })
        const allData = { ...userRes, ...orderRes, ...otherRes, ...orderAmountRes, }
        cutRes.value = allData
        nextTick(() => {
          console.log(pieRef.value, allData, 'pieRefValue')
          if (pieRef.value) {
            pieRef.value.init(pieKey.value, allData)
          }
        })
      })
      // 获取用户数据
      const getUserInfo = async () => {
        return await getNewUserCountInfo({})
      }
      // 获取总订单数据
      const getOrderCount = async () => {
        return await getNewOrderCountInfo({})
      }
      //获取订单数 数据
      const getOrderNum = async (payload: any) => {
        return await getOrderCountByStatus(payload)
      }
      //获取订单总金额数据
      const getOrderAllAmount = async () => {
        return await getOrderAmountInfo({})
      }
      const onChangePie = (event) => {
        pieKey.value = event
        nextTick(() => {
          if (pieRef.value) {
            pieRef.value.init(event, cutRes.value)
          }
        })
      }
      return {
        userContent: userContent?.value?.filter((item: any) => item.isShow),
        orderContent: orderContent.value?.filter((item: any) => item.isShow),
        AmountContent: AmountContent?.value?.filter((item: any) => item.isShow),
        hasPermission,
        cutRes,
        pieRef,
        onChangePie,
      }
    },
  })
</script>
