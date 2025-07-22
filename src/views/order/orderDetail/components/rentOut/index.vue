<template>
  <div clss="pb-30">
    <div class="font-bold text-base"> 租单汇总 </div>
    <ul class="collect">
      <li v-for="(item, index) in tableData" :key="index">
        <div>{{ item.label }}</div>
        <div>{{ item.value }}</div>
      </li>
    </ul>

    <div class="flexs">
      <Button class="mr-10" size="large" type="primary" shape="round">客户买断</Button>
      <Button class="mr-10" disabled size="large" type="primary" shape="round">客户归还</Button>
      <Button disabled size="large" type="primary" shape="round">客户续住</Button>
    </div>

    <div class="collect mt-10 p-6">
      <div class="text-xl">买断账单</div>
      <div class="flexs flex-col mt-3">
        <div class="text-xl">
          <span>{{ handleFormat(detailInfo.repaidAmount || 0) }}</span>
          <span> ; {{ handleFormat(detailInfo.repaidPenaltyAmount || 0) }}</span>
          <span> ; {{ handleFormat(detailInfo.totalMoney || 0) }}</span>
        </div>
        <div class="text-sm" style="color: #666">已还总金额 ; 已还罚金总金额 ; 签约总金额</div>
      </div>

      <div class="mt-6 text-sm">
        待付租金总金额: {{ handleFormat(detailInfo.rentAmount || 0) }}
      </div>
      <div class="mt-3 text-sm">
        待付逾期罚金: {{ handleFormat(detailInfo.overduePenaltyAmount || 0) }}
      </div>
      <div class="mt-3 text-sm">
        到期买断金额: {{ handleFormat(detailInfo.residualDepreciation || 0) }}
      </div>

      <div class="my-6 text-xl font-bold">当前订单买断金额: {{ handleFormat(buyOut) }}</div>

      <div>
        <span style="color: #e11d48">*</span>
        <span>当前买断金额 = 剩余待付租金 + 待付逾期罚金 + 到期买断金额</span>
      </div>
      <div>
        <span style="color: #e11d48">*</span>
        <span>协商最终买断金额计算公式 = 签约总金额 - 已付总金额</span>
      </div>

      <div class="flex flex-col mt-10" style="align-items: flex-end">
        <Button size="large" type="danger" shape="round" @click="handleOncePay">
          确认买断完结
        </Button>
        <div class="mt-3" style="color: #888">
          (与客户协商好买断金额后，点击[确认买断] 录入协商买断金额确认后即可完结订单)
        </div>
      </div>
    </div>

    <PaidModal @register="registerModal" @success="handleSuccess" />
    <PasswordModal @register="passwordModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, inject, ref } from 'vue'
  import { useModal } from '/@/components/Modal'
  import PaidModal from '../../../components/PaidModal.vue'
  import PasswordModal from '../../../components/PasswordModal.vue'
  import { Button } from '/@/components/Button'
  import { formatNumber } from '/@/utils/tool'

  const props = {
    detailInfo: { type: Object },
  }

  export default defineComponent({
    components: { PaidModal, PasswordModal, Button },
    props,
    setup(props) {
      const [registerModal, { openModal }] = useModal()
      const [passwordModal, { openModal: openPasswordModal }] = useModal()
      const parent: any = inject('init')
      const detailInfo: any = ref(props.detailInfo)

      const tableData = ref<any>([
        {
          label: '首付支付金额(可能包含押金、增值服务金、租金)',
          value: 0,
          key: 'downPaymentTotalAmount',
        },
        { label: '已付租金（不退还）', value: 0, key: 'downPaymentRentAmount' },
        { label: '已付押金（买断不退还）', value: 0, key: 'deposit' },
        { label: '增值服务金额（不退还）', value: 0, key: 'valueAddedServiceAmount' },
        { label: '待付租金（买断前必付清）', value: 0, key: 'rentAmount' },
        { label: '账单逾期罚金（买断、续租、归还必付清）', value: 0, key: 'overduePenaltyAmount' },
        // { label: '订单到期罚金（买断、续租、归还必付清）', value: 0, key: '' },
        { label: '到期买断金额', value: 0, key: 'residualDepreciation' },
        { label: '锁费', value: 0, key: 'lockFee2' },
      ])

      // 买断金额
      const buyOut = computed(() => {
        // 租金总金额+逾期罚金+买断金额呢
        const sum =
          detailInfo.value.rentAmount +
          detailInfo.value.overduePenaltyAmount +
          detailInfo.value.residualDepreciation
        return sum || 0
      })

      init()
      function init() {
        Object.keys(detailInfo.value).forEach((o) => {
          tableData.value.forEach((e) => {
            if (o == e.key) {
              e.value = handleFormat(detailInfo.value[o] || 0)
            }
          })
        })
      }

      function handleFormat(num) {
        return formatNumber(num, 2, '.', ',', '￥')
      }

      // 单条支付
      function handleOncePay() {
        const totalAmount = (Number(buyOut.value) / 100).toFixed(2)
        const deposit = (detailInfo.value.deposit || 0) - (detailInfo.value.deductDeposit || 0)
        openModal(true, {
          isUpdate: true,
          isBuyout: true,
          record: {
            isDepositShow: 1, // 是否显示押金
            orderId: detailInfo.value.id,
            totalAmount: Number(totalAmount),
            uid: detailInfo.value.uid,
            deposit,
            payType: 1, //支付类型（0-正常支付，1-买断支付
          },
        })
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
          parent()
        }
      }

      // 已还租金总金额
      const rentPaidAmount = computed(() => {
        const omsOrderCountInfo = detailInfo.value.omsOrderCountInfo
        return omsOrderCountInfo.paidAmount - omsOrderCountInfo.discountAmount
      })

      // 已还罚金总金额 - 旧
      // const finePaidAmount = computed(() => {
      //   const omsOrderCountInfo = detailInfo.value.omsOrderCountInfo
      //   return omsOrderCountInfo.penaltyPaidAmount - omsOrderCountInfo.penaltyDiscountAmount
      // })

      return {
        handleOncePay,
        handlePassword,
        handleSuccess,
        registerModal,
        passwordModal,
        detailInfo,
        tableData,
        buyOut,
        handleFormat,
        rentPaidAmount,
      }
    },
  })
</script>
<style lang="less" scoped>
  .collect {
    border: 1px solid #e8e8e8;
    margin: 30px;

    li {
      display: flex;
      flex-direction: row;
      height: 50px;
      border-top: 1px solid #e8e8e8;

      &:first-child {
        border-top: none;
      }

      div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;

        &:first-child {
          border-right: 1px solid #e8e8e8;
        }
      }
    }
  }

  .flexs {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
