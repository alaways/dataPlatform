<template>
  <div v-if="loading" class="loading">
    <Spin size="large" tip="Loading..." />
  </div>
  <Card title="订单数据管理" :bordered="false">
    <BaseCard :list="topContentChilds" :hideTitle="true" :res="cutRes" />
  </Card>
  <OrderLine :type="4" v-if="hasPermission('AllGDOrderLine')" />
  <Card class="bottomCard" title="金额数据管理" :bordered="false">
    <BaseCard :list="contentArrs" :hideTitle="true" :res="cutRes" />
  </Card>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import { Card, Spin } from 'ant-design-vue'
  import { usePermission } from '/@/hooks/web/usePermission'
  import BaseCard from '../components/baseCard/index.vue'
  import { getNewMain, getMayiMain } from '/@/api/statistics/index'
  import OrderLine from './OrderLine/index.vue'
  import { useUserStore } from '/@/store/modules/user'

  export default defineComponent({
    name: 'dataAllGD',
    components: { Card, BaseCard, OrderLine, Spin },
    setup() {
      const { hasPermission } = usePermission()
      const loading = ref(true)
      const userStore = useUserStore()
      const isyoulezu = '37512'
      const loginUserId = userStore?.getUserInfo?.uid
      const topContentChilds = ref([
        {
          id: 'totalOrderCount',
          label: '总订单数',
          amount: '',
          isShow: hasPermission('AllGDtotalOrderCount'),
          titple: '微信平台订单+支付宝平台订单（光速易租+光速快租）+零零享租所有订单数据【（租赁生效中、已逾期、已买断、已完结）',
          color: '#90EE90',
        },
        {
          id: 'yesterdayTotalOrderCount',
          label: '昨天新增订单数',
          titple: '微信平台订单+支付宝平台订单（光速易租+光速快租）+零零享租)近昨日新增订单合计数',
          amount: '',
          isShow: hasPermission('AllGDyesterdayTotalOrderCount'),
          color: '#90EE90',
        },
        {
          id: 'orderCountGe30',
          label: '近30天新增订单',
          titple: '微信平台订单+支付宝平台订单（光速易租+光速快租）+零零享租)近30天新增订单合计数',
          amount: '',
          isShow: hasPermission('AllGDorderCountGe30'),
          color: '#90EE90',
        },
        {
          id: 'rentOrderCount',
          label: '租赁中订单',
          amount: '',
          titple: '微信平台订单+支付宝平台订单（光速易租+光速快租）+零零享租)的租用中订单数（租赁中、逾期）',
          isShow: hasPermission('AllGDrentOrderCount'),
          color: '#90EE90',
        },
        {
          id: 'overDueOrderCount',
          label: '逾期订单',
          amount: '',
          titple: '微信平台订单+支付宝平台订单（光速易租+光速快租）+零零享租)的逾期订单数',
          isShow: hasPermission('AllGDoverDueOrderCount'),
          color: '#FFB6C1',
        },
        {
          id: 'orderOverDueLv',
          label: '逾期订单逾期率',
          titple: '微信平台订单+支付宝平台订单（光速易租+光速快租）+零零享租)的逾期订单数/总订单数',
          amount: '',
          isShow: hasPermission('AllGDorderOverDueLv'),
          isAddLv: true,
          color: '#FFB6C1',
        },
        {
          id: 'completeOrderCount',
          label: '订单完结',
          amount: '',
          titple: '微信平台订单+支付宝平台订单（光速易租+光速快租）+零零享租)的订单完结数即可',
          isShow: hasPermission('AllGDcompleteOrderCount'),
          color: '#90EE90',
        },
      ])
      const contentArrs = ref([
        {
          id: 'futureContract',
          label: '订单总金额（合同金额）',
          color: '#AFEEEE	',
          titple: '微信平台订单+支付宝平台订单（光速易租+光速快租，含买断价）+零零享租)订单合同总金额',
          amount: '',
          isShow: hasPermission('AllGDfutureContract'),
        },
        {
          id: 'notDueContract',
          label: '未到期订单合同价',
          titple: '微信平台订单+支付宝平台订单（光速易租+光速快租，含买断价）+零零享租)订单中未到期订单合同总金额',
          amount: '',
          isShow: hasPermission('AllGDnotDueContract'),
          color: '#AFEEEE',
        },
        {
          id: 'notDueRent',
          label: '未到期金额',
          titple: '微信的待收租金金额(除去首付以及已收租金、不含逾期租金总金额)+支付宝（光速易租+光速快租）+零零享的未到期买断金额；',
          amount: '',
          color: '#AFEEEE	',
          isShow: hasPermission('AllGDnotDueRent'),
        },
        {
          id: 'loanMoney',
          label: '订单货款成本（仅货款）',
          titple: '微信平台订单+支付宝平台订单（光速易租+光速快租，含买断价）+零零享租)订单货款总金额',
          amount: '',
          color: '#AFEEEE	',
          isShow: hasPermission('AllGDloanMoney'),
        },
        {
          id: 'overDueRent',
          label: '逾期金额',
          color: 'yellow',
          titple: '微信平台订单+支付宝平台订单（光速易租+光速快租，含买断价）+零零享租)订单在逾期状态下，逾期租金+逾期尾款（此金额不算在未到期金额里）',
          amount: '',
          isShow: hasPermission('AllGDoverDueRent'),
        },
        {
          id: 'overdueLv',
          label: '金额逾期率',
          titple: '微信平台（已逾期状态）订单的逾期租金金额（不含罚金）+支付宝数据+零零享的（逾期租金+逾期买断金额）】/合同金额',
          amount: '',
          color: 'yellow',
          isShow: hasPermission('AllGDoverdueLv'),
          isAddLv: true,
        },
        {
          id: 'overdueAmountGe30',
          label: '逾期时间≥30天的逾期金额',
          color: 'yellow',
          titple: '当前逾期时间≥30天以上的订单逾期租金金额（订单状态：已逾期）',
          amount: '',
          isShow: hasPermission('AllGDoverdueAmountGe30'),
        },
        {
          id: 'overdueAmountGe30Lv',
          label: '逾期时间≥30天的逾期率',
          color: 'yellow',
          titple: '逾期时间≥30天的订单逾期租金金额（订单状态：已逾期）/合同金额',
          amount: '',
          isAddLv: true,
          isShow: hasPermission('AllGDoverdueAmountGe30Lv'),
        },
        // 对股东可见
        {
          id: 'overdueAmountGe30ForW',
          label: '逾期时间≥30天的逾期金额',
          color: 'yellow',
          titple: '当前逾期时间≥30天以上的订单逾期租金金额（订单状态：已逾期）',
          amount: '',
          isShow: hasPermission('AllGDoverdueAmountGe30') && loginUserId != isyoulezu,
        },
        {
          id: 'overdueAmountGe30LvForW',
          label: '逾期时间≥30天的逾期率',
          color: 'yellow',
          titple: '计算公式=当前逾期时间≥30天的订单逾期租金金额（订单状态：已逾期）/合同金额',
          amount: '',
          isAddLv: true,
          isShow: hasPermission('AllGDoverdueAmountGe30Lv') && loginUserId != isyoulezu,
        },
        {
          id: 'overdueAmountGe180',
          label: '逾期时间≥180天的逾期金额',
          color: 'yellow',
          titple: '当前逾期时间≥180天以上的订单逾期租金金额（订单状态：已逾期）',
          amount: '',
          isShow: hasPermission('AllGDoverdueAmountGe180'),
        },
        {
          id: 'overdueAmountGe180Lv',
          label: '逾期时间≥180天的逾期率',
          color: 'yellow',
          titple: '当前逾期时间≥180天的订单逾期租金金额（订单状态：已逾期）/合同金额',
          amount: '',
          isAddLv: true,
          isShow: hasPermission('AllGDoverdueAmountGe180Lv'),
        },
        {
          id: 'receiveRentAmount',
          label: '已收租金',
          titple: `线下的首付总金额+线下的已还期数租金总额+支付宝数据的已收租金金额；
          注：①微信平台订单首付总金额(含锁费、公证、增值服务、订单账单金额、部分还款) 
          ②个平台已还期数租金总额`,
          color: '#90EE90',
          amount: '',
          isShow: hasPermission('AllGDreceiveRentAmount'),
        },
        {
          id: 'goodsAmount',
          label: '已收增值服务金额',
          amount: '',
          titple: '微信平台+支付宝平台+零零享租，已收增值服务费&配件费&溢价金等',
          color: '#90EE90',
          isShow: hasPermission('AllGDgoodsAmount'),
        },
        {
          id: 'buyoutAmount',
          label: '已收买断金额',
          amount: '',
          color: '#90EE90',
          titple: '微信平台+支付宝平台+零零享租，已收买断金额',
          isShow: hasPermission('AllGDbuyoutAmount'),
        },
        {
          id: 'otherAmount',
          label: '其他收款（主要：罚金）',
          amount: '',
          titple: '微信平台+支付宝平台+零零享租其它收款',
          color: '#90EE90',
          isShow: hasPermission('AllGDotherAmount'),
        },
      ])
      const cutRes = ref<any>(null)
      onMounted(async () => {
        getData()
      })
      const getData = async () => {
        // 获取线下 + 零零享租 数据
        const res = await getNewMain({ type: 4 })
        const mayiRes = await getMayiMain({ type: 4 })
        const ResObj = {
          totalOrderCount: 0,
          yesterdayTotalOrderCount: 0,
          orderCountGe30: 0,
          rentOrderCount: 0,
          overDueOrderCount: 0,
          orderOverDueLv: 0,
          completeOrderCount: 0,
          //
          futureContract: 0,
          notDueContract: 0,
          notDueRent: 0,
          loanMoney: 0,
          overDueRent: 0,
          overdueLv: 0,
          overdueAmountGe30: 0,
          overdueAmountGe30Lv: 0,
          overdueAmountGe30ForW: 0,
          overdueAmountGe30LvForW: 0,
          overdueAmountGe180: 0,
          overdueAmountGe180Lv: 0,
          receiveRentAmount: 0,
          goodsAmount: 0,
          buyoutAmount: 0,
          otherAmount: 0,
        }
        // 线上 数据一致相加
        Object.keys(mayiRes?.data)?.forEach((item: any) => {
          if (ResObj[item] != undefined) {
            ResObj[item] += mayiRes?.data[item]
          }
        })
        // 线下 数据一致相加
        Object.keys(res?.data)?.forEach((item: any) => {
          if (ResObj[item] != undefined) {
            ResObj[item] += res?.data[item]
          }
        })
        // 订单逾期率 = 逾期订单数 / 总订单数
        ResObj.orderOverDueLv = ResObj.overDueOrderCount / ResObj.totalOrderCount
        // 金额逾期率 = 【微信平台（已逾期状态）订单的逾期租金金额（不含罚金）+支付宝数据+零零享的（逾期租金+逾期买断金额）】/合同金额
        ResObj.overdueLv = ResObj.overDueRent / ResObj.futureContract
        // 30天逾期金额逾期率 = 30天逾期金额 / 合同价
        ResObj.overdueAmountGe30Lv = ResObj.overdueAmountGe30 / ResObj.futureContract
        ResObj.overdueAmountGe180Lv = ResObj.overdueAmountGe180 / ResObj.futureContract
        ResObj.overdueAmountGe30LvForW = Number(ResObj.overdueAmountGe30ForW) / ResObj.futureContract
        cutRes.value = ResObj || {}
        setTimeout(() => {
          loading.value = false
        }, 800)
      }
      return {
        topContentChilds: topContentChilds?.value?.filter((item: any) => item.isShow),
        contentArrs: contentArrs?.value?.filter((item: any) => item.isShow),
        hasPermission,
        cutRes,
        loading,
      }
    },
  })
</script>
<style>
  .loading {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
</style>
