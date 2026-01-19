<template>
  <Card title="贷前" :bordered="false">
    <BaseCard :list="orderAmountInfo" :hideTitle="true" :res="cutRes" />
  </Card>
  <Card title="贷中" :bordered="false">
    <BaseCard :list="overAmountInfos" :hideTitle="true" :res="cutRes" />
  </Card>
  <Card title="贷后" :bordered="false">
    <BaseCard :list="rentOrderAmount" :hideTitle="true" :res="cutRes" />
  </Card>
  <OrderLine :type="1" />
  <div class="loadingCont" v-if="loading"><Spin :size="80" /><span>正在加载中...</span></div>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import { Card, Spin } from 'ant-design-vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import BaseCard from '../components/baseCard/index.vue'
  import { getBIwMain, getBIwMainForOnline } from '/@/api/statistics/index'
  import OrderLine from './OrderLine/index.vue'
  export default defineComponent({
    name: 'allDataInfo',
    components: {
      Card,
      BaseCard,
      Spin,
      OrderLine,
    },
    setup() {
      const { hasPermission } = usePermission()
      const searchParams = ref({})
      const yesterDayData = ref({
        yesdaylv: 0,
        amount: 0,
      })
      const orderAmountInfo = ref([
        {
          id: 'allOrderCount',
          label: '总订单数',
          amount: '',
          isShow: hasPermission('allOrderCountForAll1'),
          titple: '（线上+线下）总订单数',
          color: '#fff',
        },
        {
          id: 'totalContractAmount',
          label: '订单总金额',
          titple: '（线上+线下）订单总金额',
          amount: '',
          isShow: hasPermission('totalContractAmountForAll'),
          color: '#fff',
        },
        {
          id: 'totalAmountReceived',
          label: '已收租金总金额',
          titple: '（线上+线下）已收租金总金额',
          amount: '',
          isShow: hasPermission('totalAmountReceivedForAll'),
          color: '#fff',
        },
        {
          id: 'firstNoRentAmount',
          label: '已收增值服务费及配件费',
          titple: '（仅取值线上）已收增值服务费及配件费',
          amount: '',
          isShow: hasPermission('firstNoRentAmountForAll'),
          color: '#fff',
        },
        {
          id: 'totalOutstandingAmount',
          label: '总待收租金总金额',
          titple: '（线上+线下）总待收金额',
          amount: '',
          isShow: hasPermission('totalOutstandingAmountForAll'),
          color: '#fff',
        },
        {
          id: 'yesterOrderCount',
          label: '昨日新增订单数',
          amount: '',
          isShow: hasPermission('yesterOrderCountForAll'),
          titple: '（线上+线下昨日新增订单数）',
          color: '#fff',
        },
        {
          id: 'monthOrderCount',
          label: '近30天新增订单数',
          amount: '',
          titple: '（线上+线下）近30天新增订单数',
          isShow: hasPermission('monthOrderCountForAll'),
          color: '#fff',
        },
      ])
      const overAmountInfos = ref([
        {
          id: 'rentOrderCount',
          label: '当前在租订单数',
          amount: '',
          titple: '（线上+线下）在租订单数',
          isShow: hasPermission('rentOrderCountForAll'),
          color: '#fff',
        },
        {
          id: 'totalAmountRentalOrder',
          label: '在租订单总金额',
          amount: '',
          titple: '（线上+线下）在租订单总金额',
          isShow: hasPermission('totalAmountRentalOrderForAll'),
          color: '#ffff',
        },
        {
          id: 'amountRentLease',
          label: '在租待收租金总金额',
          amount: '',
          titple: '（线上+线下）在租待收租金总金额',
          isShow: hasPermission('amountRentLeaseForAll'),
          color: '#fff',
        },
        {
          id: 'totalDownPayment',
          label: '在租首付总金额',
          titple: '（线上+线下）在租首付总金额',
          amount: '',
          isShow: hasPermission('totalDownPaymentForAll'),
          color: '#fff',
        },
        {
          id: 'rentReductionAmount',
          label: '在租租金减免金额',
          titple: '（线上+线下）在租租金减免金额',
          amount: '',
          isShow: hasPermission('rentReductionAmountForAll'),
          color: '#fff',
        },
        {
          id: 'todayOvereOrderCount',
          label: '今日到期订单数',
          titple: '（线上+线下）今日到期订单数',
          amount: '',
          isShow: hasPermission('todayOvereOrderCountForAll'),
          color: '#fff',
        },
      ])
      const rentOrderAmount = ref([
        {
          id: 'rentAlreadyOverOrderCount',
          label: '当前在租逾期订单数',
          titple: '（线上+线下）在租逾期订单数',
          amount: '',
          isShow: hasPermission('rentAlreadyOverOrderCountForAll'),
          color: '#fff',
        },
        {
          id: 'amountOverdueRent',
          label: '当前在租逾期总金额',
          titple: '（线上+线下）在租逾期总金额',
          amount: '',
          isShow: hasPermission('amountOverdueRentForAll'),
          color: '#fff',
        },
        {
          id: 'rentTotalOverOrderAmount',
          label: '当前在租逾期待收账单总金额',
          titple: '（线上+线下）当前在租逾期待收账单总金额',
          amount: '',
          isShow: hasPermission('rentTotalOverOrderAmountForAll'),
          color: '#ffff',
        },
        // LV
        {
          id: 'currentRentOutLv',
          label: '当前在租金额逾期率',
          titple: '（线上+线下）当前在租金额逾期率',
          amount: '',
          isShow: hasPermission('currentRentOutLvForAll'),
          color: '#fff',
          isAddLv: true,
        },
        {
          // LV
          id: 'currentRentIngLv',
          label: '当前在租订单逾期率',
          titple: '（线上+线下）当前在租订单逾期率',
          amount: '',
          isShow: hasPermission('currentRentIngLvForAll'),
          color: '#fff',
          isAddLv: true,
        },
        // LV end
        {
          id: 'endOrderCout',
          label: '已完结订单数',
          titple: '（线上+线下）已完结订单数',
          amount: '',
          isShow: hasPermission('endOrderCoutForAll'),
          color: '#fff',
        },
      ])
      const cutRes = ref(null)
      const loading = ref(false)
      const pieRef = ref<any>()
      const baseSetAmout = (data, mapObj) => {
        Object.keys(data)?.map((item: any) => {
          Object.keys(mapObj)?.map((citem: any) => {
            if (citem == item) {
              mapObj[item] = Number(mapObj[item]) + Number(data[item])
            }
          })
        })
        return mapObj
      }
      onMounted(async () => {
        loading.value = true
        const offlineRes = await getBIwMain({ type: 1 })
        const onlineRes = await getBIwMainForOnline({ type: 1 })
        Promise.all([offlineRes, onlineRes]).then((res: any) => {
          // 都请求成功
          if (offlineRes.code == 200 && onlineRes.code == 200) {
            loading.value = false
            const baseObj = 0
            const mapObj = {
              // 总订单数
              allOrderCount: baseObj,
              // 订单总金额
              totalContractAmount: baseObj,
              // 昨日
              yesteTotalContractAmount: baseObj,
              // 比例
              totalContractAmountRate: baseObj,
              // 已收租金总金额
              totalAmountReceived: baseObj,
              // 昨日
              yesteTotalAmountReceived: baseObj,
              // 比例
              totalAmountReceivedRate: baseObj,
              // 已收增值服务费及配件费
              firstNoRentAmount: baseObj,
              // 总待收租金总金额
              totalOutstandingAmount: baseObj,
              // 昨日
              yesteTotalOutstandingAmount: baseObj,
              // 比例
              totalOutstandingAmountRate: baseObj,
              // 昨日新增订单数
              yesterOrderCount: baseObj,
              // 近30天新增订单数
              monthOrderCount: baseObj,
              // 当前在租订单数
              rentOrderCount: baseObj,
              // 昨日
              yesteRentOrderCount: baseObj,
              // 比例
              rentOrderCountRate: baseObj,
              // 在租订单总金额
              totalAmountRentalOrder: baseObj,
              // 昨日
              yesteTotalAmountRentalOrder: baseObj,
              // 比例
              totalAmountRentalOrderRate: baseObj,
              // 在租待收租金总金额
              amountRentLease: baseObj,
              // 昨日
              yesteAmountRentLease: baseObj,
              // 比例
              amountRentLeaseRate: baseObj,
              // 在租首付总金额
              totalDownPayment: baseObj,
              // 昨日
              yesteTotalDownPaymentAmount: baseObj,
              // 比例
              totalDownPaymentAmountRate: baseObj,
              // 在租租金减免金额
              rentReductionAmount: baseObj,
              // 昨日
              yesteRentReductionAmount: baseObj,
              // 比例
              rentReductionAmountRate: baseObj,
              // 今日到期订单数
              todayOvereOrderCount: baseObj,
              // 昨日
              yesteOvereOrderCount: baseObj,
              // 比例
              todayOvereOrderCountRate: baseObj,
              // 当前在租逾期订单数
              rentAlreadyOverOrderCount: baseObj,
              // 昨日
              yesteRentAlreadyOverOrderCount: baseObj,
              // 比例
              rentAlreadyOverOrderCountRate: baseObj,
              // 当前在租逾期总金额
              amountOverdueRent: baseObj,
              // 昨日
              yesteAmountOverdueRent: baseObj,
              // 比例
              amountOverdueRentRate: baseObj,
              // 当前在租逾期待收账单总金额
              rentTotalOverOrderAmount: baseObj,
              // 昨日
              yesteRentTotalOverOrderAmount: baseObj,
              // 比例
              rentTotalOverOrderAmountRate: baseObj,
              // 已完结订单数
              endOrderCout: baseObj,
              // 昨日
              yesteEndOrderCout: baseObj,
              // 比例
              endOrderCoutRate: baseObj,
              // 逾期金额率
              currentRentOutLv: baseObj,
              // 昨日
              yesteCurrentRentIngLv: baseObj,
              // 比例
              currentRentIngLvRate: baseObj,
              // 逾期订单率
              currentRentIngLv: baseObj,
              // 昨日
              yesteCurrentRentOutLv: baseObj,
              // 比例
              currentRentOutLvRate: baseObj,
            }
            baseSetAmout(offlineRes?.data, mapObj)
            baseSetAmout(onlineRes?.data, mapObj)
            // 今日
            const currentRentIngLv = mapObj['rentAlreadyOverOrderCount'] / mapObj['rentOrderCount']
            const currentRentOutLv = mapObj['amountOverdueRent'] / mapObj['totalAmountRentalOrder']
            mapObj.currentRentIngLv = currentRentIngLv
            mapObj.currentRentOutLv = currentRentOutLv
            cutRes.value = mapObj || {}
            return
          }
        })
      })
      return {
        orderAmountInfo: orderAmountInfo.value?.filter((item: any) => item.isShow),
        overAmountInfos: overAmountInfos?.value?.filter((item: any) => item.isShow),
        rentOrderAmount: rentOrderAmount?.value?.filter((item: any) => item.isShow),
        hasPermission,
        cutRes,
        loading,
        searchParams,
        pieRef,
        yesterDayData,
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
