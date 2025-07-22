<template>
  <PageWrapper title="订单详情" contentBackground @back="goBack">
    <template #footer>
      <ATabs default-active-key="Detail" v-model:activeKey="currentKey">
        <template v-for="item in menuData">
          <ATabPane v-if="!ifStore || ifStore != item.ifStore" :key="item.key" :tab="item.tab" />
        </template>
      </ATabs>
    </template>
    <div class="m-4">
      <component
        v-if="detailInfo"
        :is="currentKey"
        :detailInfo="detailInfo"
        :ifStore="ifStore"
        :isAllocation="isAllocation"
      />
      <Skeleton v-else :active="true" :loading="loading" :paragraph="{ rows: 16 }" />
    </div>
    <div class="floatButton" v-if="showActionList && currentKey != 'Bill'">
      <template v-for="(item, index) in showIconAction(detailInfo, { ifAllot })">
        <div
          class="floatItem"
          :key="index"
          :name="item.name"
          @click="callAction(item.action)"
          v-if="item.show"
        >
          <IconVue :icon="item.icon" color="#4090f7" :size="24" />
          <div>{{ item.title }}</div>
        </div>
      </template>
    </div>
    <ExamineModal @register="examinModal" @success="handleSuccess" />
    <OnLineExamineModal @register="onLineExamineRegister" @success="handleSuccess" />
    <PaidModal @register="paidModal" @success="handleSuccess" />
    <DeliveryModal @register="deliveryModal" @success="handleSuccess" />
    <AllocationModal @register="allocationModal" @success="handleSuccess" />
    <PasswordModal @register="passwordModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="tsx">
  import { computed, defineComponent, provide, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { PageWrapper } from '/@/components/Page'
  import { useGo } from '/@/hooks/web/usePage'
  import { useTabs } from '/@/hooks/web/useTabs'
  import { Card, Tabs, Skeleton, Modal } from 'ant-design-vue'
  import { menuList, showIconAction } from './data'
  import Detail from './components/detail/index.vue'
  import RiskControl from './components/riskControl/index.vue'
  import RiskControlOrange from './components/riskControlOrange/index.vue'
  import Examine from './components/examine/index.vue'
  import Finance from './components/finance/index.vue'
  import Bill from './components/bill/index.vue'
  import Qualifications from './components/qualifications/index.vue'
  import Information from './components/information/index.vue'
  import RentOut from './components/rentOut/index.vue'
  import Logistics from './components/logistics/index.vue'
  import ProsecuteFiles from './components/prosecuteFiles/index.vue'
  import CollectionRecord from './components/collectionRecord/index.vue'
  import ZxSearch from './components/ZxSearch/index.vue'
  import {
    cancleDelivery,
    getFastMailList,
    getOpenPrintExpressWaybill,
    getOrderDetail,
    getPrintExpressWaybill,
  } from '/@/api/order'
  import IconVue from '/@/components/Icon/src/Icon.vue'
  import { useModal } from '/@/components/Modal'
  import ExamineModal from '../components/ExamineModal.vue'
  import OnLineExamineModal from '../components/onLineExamineModal/OnLineExamineModal.vue'
  import PaidModal from '../components/PaidModal.vue'
  import DeliveryModal from '../components/deliveryModal/DeliveryModal.vue'
  import AllocationModal from '../components/AllocationModal.vue'
  import PasswordModal from '../components/PasswordModal.vue'
  import { handlePreviewPDF, insertAt } from '/@/utils/tool'
  import { getStoreList } from '/@/api/store'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useMessage } from '/@/hooks/web/useMessage'

  export default defineComponent({
    name: 'OrderDetail',
    components: {
      PageWrapper,
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      Detail,
      RiskControl,
      RiskControlOrange,
      Examine,
      Finance,
      Bill,
      Qualifications,
      Information,
      RentOut,
      Card,
      IconVue,
      ExamineModal,
      PaidModal,
      DeliveryModal,
      PasswordModal,
      AllocationModal,
      Skeleton,
      Logistics,
      ProsecuteFiles,
      OnLineExamineModal,
      CollectionRecord,
      ZxSearch,
    },

    setup() {
      const route = useRoute()
      const go = useGo()
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [examinModal, { openModal }] = useModal()
      const [onLineExamineRegister, { openModal: onLineExamineOpenModal }] = useModal()
      const [paidModal, { openModal: openPaidModal }] = useModal()
      const [deliveryModal, { openModal: openDeliveryModal }] = useModal()
      const [allocationModal, { openModal: openAllocationModal }] = useModal()
      const [passwordModal, { openModal: openPasswordModal }] = useModal()
      // 此处可以得到用户ID
      const orderId = ref(route.params?.id)
      const menuData = ref<any>(menuList || [])
      const userName = ref(route.query?.name)
      const auditId = ref(route.query?.auditId)
      const back = ref(route.query?.back)
      const tabName = String(route.query?.tab || '')

      // 用于分配订单
      const ifAllot = ref(route.query?.ifAllot)
      // 用于商家订单
      const ifStore = ref(route.query?.ifStore)
      const isAllocation = ref(false)
      if (route.query.isAllocation) {
        isAllocation.value = route.query.isAllocation == '1'
      }

      const detailInfo = ref<any>()
      const currentKey = ref(menuList[0]?.key) // 菜单key
      const fastMailList = ref<any>()
      const merchantCodeList = ref<any>()
      const totalAmount = ref(0)
      const billstr = ref('')
      const billsList = ref([])
      const loading = ref(true)

      provide('init', getDetail)

      // 设置Tab的标题（不会影响页面标题）
      const { setTitle } = useTabs()
      setTitle('订单详情:' + userName.value)

      const showActionList = computed(() => {
        const dlist = showIconAction(detailInfo.value, { ifAllot: ifAllot.value }).filter(
          (v) => v.show,
        )
        return dlist && dlist.length
      })

      getDetail()
      async function getDetail() {
        loading.value = true
        detailInfo.value = ''
        // 获取订单详情
        detailInfo.value = await getOrderDetail(orderId.value)
        loading.value = false
        console.log(detailInfo.value, 'detailInfoValue')
        // 切换 0首付使用 有橙风控
        if (detailInfo.value.goodsLeaseType == 4) {
          menuData.value.forEach((v) => {
            if (v.tab == '风控信息') {
              v.key = 'RiskControlOrange'
            }
          })
        }
        //  征信查询
        if (!detailInfo?.value.fsOrderId) {
          menuData.value = [...menuData?.value.filter((item: any) => item.key != 'ZxSearch')]
        }
        if (detailInfo?.value.fsOrderId) {
          menuData.value = [...menuData?.value]
        }
        console.log(menuList, menuData.value, '么有关联征信')
        // 租后管理
        const status = detailInfo.value.status
        if (
          hasPermission('OrderDetailBuyout') &&
          [301, 501, 502, 601, 801, 901, 902, 903].includes(status) &&
          !ifStore.value
        ) {
          menuData.value = insertAt(menuList, 1, {
            tab: '租后管理',
            key: 'RentOut', // 对应组件名
          })
        }
        if (tabName) {
          currentKey.value = tabName
        }
        // 获取快递信息列表
        getFastMailList().then((res) => {
          fastMailList.value = res
        })

        // 商家分配
        getStoreList({ pageSize: 99999 }).then((res) => {
          merchantCodeList.value = res.list
        })

        // 首次支付金额
        totalAmount.value = detailInfo.value?.downPaymentAmount || 0
        // 要付的账单
        const orderBillItemVOList = detailInfo.value?.orderBillItemVOList || []
        billsList.value = orderBillItemVOList
        const blist = orderBillItemVOList.filter((v) => v.sourceType == 0).map((v) => v.billItemSn)
        billstr.value = blist.join(',')
      }
      const actionList = {
        // 人工审核
        handleExamin: () => {
          const params = {
            isUpdate: true,
            record: {
              id: auditId.value,
              orderId: orderId.value,
              ipProvince: detailInfo.value.ipProvince,
              ipCity: detailInfo.value.ipCity,
              spuType: detailInfo.value.spuType,
              rentType: detailInfo.value.rentType,
            },
          }
          if (detailInfo.value.goodsLeaseType == 4) {
            onLineExamineOpenModal(true, params)
          } else {
            openModal(true, params)
          }
        },
        // 确认支付
        handlePaid: () => {
          openPaidModal(true, {
            isUpdate: true,
            record: {
              isSourceType: true,
              orderId: orderId.value,
              totalAmount: totalAmount.value / 100,
              billItemSn: billstr.value,
              uid: detailInfo.value?.uid,
              billsList: billsList,
              status: detailInfo.value.status,
            },
          })
        },
        // 发货
        handleDelivery: () => {
          openDeliveryModal(true, {
            isUpdate: true,
            fastMailList: fastMailList.value,
            record: {
              ...detailInfo.value,
              id: orderId.value,
              orderSn: detailInfo.value?.orderSn,
            },
          })
        },
        // 取消发货
        handleCancleDelivery: () => {
          Modal.confirm({
            title: () => '是否确认取消发货',
            onCancel: () => {},
            onOk: async () => {
              await cancleDelivery(detailInfo.value.orderSn)
              createMessage.success('取消成功')
              handleSuccess('')
            },
          })
        },
        // 打印快递面单
        handlePrint: () => {
          Modal.confirm({
            title: () => '是否确认打印快递面单',
            onCancel: () => {},
            onOk: async () => {
              await getPrintExpressWaybill(orderId.value)
              createMessage.success('打印成功')
            },
          })
        },
        // 打开快递面单
        handleOpenPrint: () => {
          Modal.confirm({
            title: () => '是否确认打开快递面单',
            onCancel: () => {},
            onOk: async () => {
              const res = await getOpenPrintExpressWaybill(orderId.value)
              handlePreviewPDF(res)
            },
          })
        },
        // 商家分配
        handleStore: () => {
          openAllocationModal(true, {
            isUpdate: true,
            merchantCodeList,
            record: {
              id: orderId.value,
              ...detailInfo.value.orderExt,
            },
          })
        },
      }
      // 调用方法
      function callAction(actionName: string) {
        actionList[actionName]()
      }
      // 输入密码
      function handlePassword(data: any) {
        openPasswordModal(true, {
          isUpdate: true,
          data,
        })
      }

      function handleSuccess(data) {
        if (data?.showPwd) {
          handlePassword(data.data)
        } else {
          getDetail()
        }
      }

      /**
       * 处理
       */

      // 返回上一页
      function goBack() {
        go(String(back.value))
      }
      return {
        menuData,
        currentKey,
        orderId,
        auditId,
        detailInfo,
        goBack,
        handleSuccess,
        examinModal,
        paidModal,
        deliveryModal,
        passwordModal,
        loading,
        allocationModal,
        ifAllot,
        ifStore,
        isAllocation,
        showIconAction,
        showActionList,
        onLineExamineRegister,
        callAction,
      }
    },
  })
</script>

<style lang="less" scoped>
  .floatButton {
    position: fixed;
    cursor: pointer;
    bottom: 200px;
    right: 100px;
    z-index: 10;
    border: 1px solid #f0f0f0;
    background: #fff;
    box-shadow: 3px 5px 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    min-height: 40px;
    min-width: 40px;
    padding: 0;

    .floatItem {
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #f0f0f0;
      padding: 0 10px;

      div {
        margin-left: 6px;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
</style>
