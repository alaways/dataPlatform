<template>
  <div clss="pb-30">
    <BasicTable @register="registerTable">
      <template #headerCell="{ column }">
        <template v-if="column.key === 'repayDate'">
          <span>
            修改时间
            <EditOutlined
              v-if="hasPermission('OrderDetailUpdateBillTime')"
              class="icon"
              @click="updateMoreDate"
            />
          </span>
        </template>
        <template v-else>
          <!-- <HeaderCell :column="column" /> -->
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action' && ifStore != '1' && isShowAction && !isUnPayDown">
          <TableAction
            class="TableAction"
            :actions="[
              {
                ifShow: function () {
                  return (
                    ![3, 4].includes(record.status) && hasPermission('OrderDetailOfflineCollection')
                  )
                },
                label: '线下收款',
                onClick: handleOncePay.bind(null, record, 1),
              },
              {
                ifShow: function () {
                  return ![3, 4].includes(record.status) && hasPermission('OrderDetailPayQCode')
                },
                label: '二维码支付',
                onClick: handleOncePay.bind(null, record, 2),
              },
              {
                ifShow:
                  !record.payOutMerchantAccount &&
                  isAllocation &&
                  hasPermission('OrderDetailPayOut'),
                label: '分账确认',
                onClick: handlePayOut.bind(null, record),
              },
              {
                // 1.权限 2.判断是否蚂蚁链 3.账单是有效状态 4.应还金额必须为0
                ifShow:
                  isAntChainPay &&
                  hasPermission('OrderDetailAntChainPay') &&
                  ![3, 4].includes(record.status) &&
                  record.repaidAmount == 0,
                label: '手动代扣',
                onClick: handleAntChainPay.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
      <template #summary>
        <div class="summarList" :style="{ minWidth: summaryWidth, marginLeft: '-56px' }">
          <div
            v-for="item in columns"
            :style="{ width: item.width + 8 + 'px', height: '30px' }"
            :key="item.dataIndex"
          >
            <span v-if="item?.dataIndex == 'billItemSn'"> 合计 </span>
            <!-- <span v-if="item?.dataIndex == 'periodNo'">
              {{ someCheck(tableData, 'periodNo') }}
            </span> -->
            <span v-if="item?.dataIndex == 'totalAmount'">
              {{ someCheck(tableData, 'totalAmount') }}
            </span>
            <span v-if="item?.dataIndex == 'penaltyAmount'">
              {{ someCheck(tableData, 'penaltyAmount') }}
            </span>
            <span v-if="item?.dataIndex == 'modifyPenaltyAmount'">
              {{ someCheck(tableData, 'modifyPenaltyAmount') }}
            </span>
            <span v-if="item?.dataIndex == 'repayAmount'">
              {{ someCheck(tableData, 'repayAmount') }}
            </span>
            <span v-if="item?.dataIndex == 'repaidAmount'">
              {{ someCheck(tableData, 'repaidAmount') }}
            </span>
          </div>
        </div>
      </template>
    </BasicTable>
    <div style="height: 100px" v-show="showDrawer"></div>

    <div class="tableFoot" v-show="showDrawer">
      <div class="mr-5 flex flex-col" style="align-items: flex-end">
        <div class="price">账单总金额 {{ seletCount }}</div>
        <div>已选择 {{ seletList.length }} 条账单</div>
      </div>
      <Button
        class="mr-3"
        size="large"
        type="primary"
        shape="round"
        @click="handleMorePay(1)"
        v-if="hasPermission('OrderDetailOfflineCollection')"
      >
        线下收款
      </Button>
      <Button
        type="primary"
        size="large"
        shape="round"
        @click="handleMorePay(2)"
        v-if="hasPermission('OrderDetailPayQCode')"
      >
        二维码付款
      </Button>
    </div>
    <PaidModal @register="registerModal" @success="handleSuccess" @cancle="handleCancle" />
    <PasswordModal @register="passwordModal" @success="handleSuccess" />
    <DateModal @register="dateModal" @success="handleSuccess" />
    <PenaltyAmountModal @register="penaltyAmountModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, inject, onMounted, ref } from 'vue'
  import { BasicTable, TableAction, useTable } from '/@/components/Table'
  import { tableSchema } from './data'
  import { useModal } from '/@/components/Modal'
  import PaidModal from '../../../components/PaidModal.vue'
  import PasswordModal from '../../../components/PasswordModal.vue'
  import DateModal from './DateModal.vue'
  import PenaltyAmountModal from './PenaltyAmountModal.vue'
  import { Button, Modal } from 'ant-design-vue'
  import { nextTick } from 'vue'
  import { sum } from 'lodash-es'
  import { canParseJSON, formatNumber } from '/@/utils/tool'
  import { EditOutlined } from '@ant-design/icons-vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { getAntChainWithholding, getUserConcern, updatePayOutMerchantAccount } from '/@/api/order'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { handleAntChainBill, handleOhterBill } from './handle'
  // import { TableSummaryRow, TableSummaryCell } from '@ant-design/plots'

  const props = {
    detailInfo: { type: Object },
    ifStore: { type: String },
    isAllocation: { type: Boolean },
  }
  export default defineComponent({
    components: {
      BasicTable,
      PaidModal,
      PasswordModal,
      TableAction,
      Button,
      DateModal,
      PenaltyAmountModal,
      EditOutlined,
      // TableSummaryRow,
      // TableSummaryCell,
    },
    props,
    setup(props) {
      const parent: any = inject('init')
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()

      const [registerModal, { openModal }] = useModal()
      const [passwordModal, { openModal: openPasswordModal }] = useModal()
      const [dateModal, { openModal: openDateModal }] = useModal()
      const [penaltyAmountModal, { openModal: openPenaltyAmountModal }] = useModal()

      const detailInfo: any = ref(props.detailInfo)
      const tableData = ref<any>([])
      const seletList = ref<any>([])
      const seletCount = ref<any>(0) // 显示价格
      const paramsCount = ref<any>(0) // 传值价格
      const showDrawer = ref<boolean>(false)
      const isAllocation = ref<boolean>(props.isAllocation || false)
      const lastList = ref<any>([])
      const payShow = ref<any>(null)
      const summaryWidth = ref(0)
      const lastBillId = ref('') // 获取最后账单Id

      /**
       * 蚂蚁链 - 手动代扣
       */
      const isAntChainPay = computed(() => {
        return [1, 2, 4].includes(detailInfo.value.atoStatus)
      })
      /**
       * 蚂蚁链 - 已经签了代扣协议，0首付才合并
       */
      const isAntChainOrder = computed(() => {
        return !!detailInfo.value.atoStatus && detailInfo.value.goodsLeaseType == 4
      })

      // tableData.value.forEach((item) => {
      //   // 应还金额 = 账单金额 - 已还金额 + 逾期罚金
      //   item['repayAmount'] = item.repayAmount + item.penaltyAmount
      // })
      const isShowAction = computed(() => {
        return !!tableData.value.filter(
          (v) => ![3, 4].includes(v.status) || (!v.payOutMerchantAccount && isAllocation.value),
        ).length
      })

      // 是否含有未支付首付
      const isUnPayDown = computed(() => {
        return !!tableData.value.find((v) => v.sourceType == 0 && ![3, 4].includes(v.status))
      })
      const columns = ref(
        tableSchema({
          isAllocation: isAllocation.value,
          updateMoreDate,
          updatePenaltyAmount,
        }),
      )
      const [registerTable, { reload, setSelectedRowKeys, getDataSource, setTableData }] = useTable(
        {
          title: '账单详情',
          columns: tableSchema({
            isAllocation: isAllocation.value,
            updateMoreDate,
            updatePenaltyAmount,
          }),
          pagination: false,
          showIndexColumn: false,
          rowKey: 'billItemSn',
          rowSelection: {
            type: 'checkbox',
            onChange: rowSelectionChange,
            getCheckboxProps(record: Recordable) {
              // sourceType 首付为0的禁止
              if (
                record.sourceType == 0 ||
                [3, 4].includes(record.status) ||
                props.ifStore == '1'
              ) {
                return { disabled: true }
              } else {
                return { disabled: false }
              }
            },
          },
          actionColumn: {
            width: 120,
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
          },
        },
      )

      async function init() {
        /**
         * 合并账单 - 后端不愿做
         * 蚂蚁链 - 1.未签约前，判断 当前小程序合同配置是否为蚂蚁链 订单501之前
         * 蚂蚁链 - 2.签约后，atoStatus > 0 代表蚂蚁链合同
         */
        console.log(
          'pay_offline:>',
          hasPermission('pay_offline'),
          'payInit:',
          hasPermission('payInit'),
          'paycoupon_offline:',
          hasPermission('paycoupon_offline'),
          'payCoupon:',
          hasPermission('payCoupon'),
        )
        const billItemList = detailInfo.value?.orderBillItemVOList || []
        let handleList: any = []
        // 已经签约了蚂蚁代扣
        if (isAntChainOrder.value) {
          handleList = handleAntChainBill(billItemList)
          handleSetTableData(handleList)
          return
        }
        // 未签约
        if (detailInfo.value?.status <= 501) {
          // 判断当前订单的小程序合同是否是蚂蚁链
          const res = await getUserConcern({ label: 'sysConf.ContractSigns' })
          let appletSignType = ''
          if (res && canParseJSON(res)) {
            const data = JSON.parse(res)
            appletSignType = data[detailInfo.value?.appletCode] || ''
            if (appletSignType == '蚂蚁链') {
              handleList = handleAntChainBill(billItemList)
              handleSetTableData(handleList)
              return
            }
          }
        }
        // 不是蚂蚁链走正常处理
        handleList = handleOhterBill(billItemList)
        handleSetTableData(handleList)
      }

      function handleSetTableData(handleList: any) {
        tableData.value = handleList.map((v) => {
          return {
            ...v,
            rentType: detailInfo.value.rentType,
          }
        })
        setTableData(tableData.value)
        // 默认 打钩
        const blist = tableData.value
          .filter((v) => v.sourceType == 0 && v.status != 4 && v.status != 3) // 3.逾期已还 4.正常支付
          .map((v) => v.billItemSn)
        nextTick(() => {
          setSelectedRowKeys(blist)
        })
        // 获取未支付的账单列表
        lastList.value = tableData.value.filter((v) => v.type == 2 && v.status < 3)
        const lastLen = lastList.value.length
        if (lastLen != 0) {
          lastBillId.value = lastList.value[lastLen - 1].billItemSn
        }
      }

      // 选中触发
      function rowSelectionChange(_, record) {
        const flist = record.filter((v) => ![3, 4].includes(v.status)) // 3.逾期已还 4.正常支付
        // 处理显示列表
        showDrawer.value = !!flist.length
        seletList.value = flist.map((v) => v.billItemSn)

        // 处理显示价格
        const countList = flist.map((v) => v.repayAmount)

        if (isUnPayDown.value && detailInfo.value.status == 401) {
          paramsCount.value = detailInfo.value.downPaymentAmount
        } else {
          paramsCount.value = sum(countList) // 显示价格
        }
        seletCount.value = formatNumber(paramsCount.value, 2, '.', ',', '￥', '元')
      }

      /**
       * 单条支付
       * payTypes 0.两个选择 1.线下支付 2.二维码支付
       */
      function handleOncePay(record: Recordable, payShow: number, _: any) {
        const isDepositShow =
          lastBillId.value == record.billItemSn && lastList.value.length == 1 ? 1 : 0
        const deposit = (detailInfo.value.deposit || 0) - (detailInfo.value.deductDeposit || 0)
        openModal(true, {
          isUpdate: true,
          record: {
            orderId: detailInfo.value.id,
            totalAmount: record.repayAmount / 100,
            billItemSn: record.billItemSn,
            uid: record.uid,
            billsList: tableData.value,
            payShow,
            deposit,
            isDepositShow,
          },
        })
      }

      /**
       * 多条支付
       * payTypes 0.两个选择 1.线下支付 2.二维码支付
       */
      function handleMorePay(npayShow: number) {
        const isLen = lastList.value.length == seletList.value.length
        const isDepositShow = seletList.value.find((v) => v == lastBillId.value) && isLen ? 1 : 0
        const deposit = (detailInfo.value.deposit || 0) - (detailInfo.value.deductDeposit || 0)
        payShow.value = npayShow
        openModal(true, {
          isUpdate: true,
          record: {
            isSourceType: !!isUnPayDown.value,
            orderId: detailInfo.value.id,
            totalAmount: paramsCount.value / 100,
            billItemSn: seletList.value.join(','),
            uid: detailInfo.value.uid,
            billsList: tableData.value,
            status: detailInfo.value.status,
            payShow: npayShow,
            deposit,
            isDepositShow,
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
          reload()
        }
      }

      function handleCancle() {
        parent()
        reload()
      }

      // 单条修改时间
      function updateOnceDate(record: Recordable) {
        openDateModal(true, {
          isUpdate: true,
          record,
        })
      }

      // 修改多条时间
      function updateMoreDate() {
        const dlist = getDataSource().filter(
          (v: any) => ![3, 4].includes(v.status) && !v.beforeRepayDate,
        )
        if (!dlist || !dlist.length) {
          createMessage.error(`该账单不可修改时间`)
          return
        }
        // 判断是否包含首付
        const downPayList = dlist.filter((v) => v.sourceType == 0 && v.status != 4)
        if (downPayList && downPayList.length) {
          createMessage.error(`当前账单有首付未支付,不可修改时间`)
          return
        }
        // 判断是否包含逾期账单
        const slippageList = dlist.filter((v) => v.status == 2)
        if (slippageList && slippageList.length) {
          createMessage.error(`当前账单含有逾期,不可修改时间`)
          return
        }
        const billItemSn = dlist.map((v) => v.billItemSn)
        openDateModal(true, {
          isUpdate: true,
          record: {
            sourceBizId: detailInfo.value.id,
            billItemSn: billItemSn.join(','),
            repayDate: dlist[0].repayDate,
          },
        })
      }

      function updatePenaltyAmount(record: Recordable) {
        openPenaltyAmountModal(true, {
          isUpdate: true,
          record: {
            ...record,
            orderId: detailInfo.value.id,
          },
        })
      }

      /**
       * 分账确认
       */
      function handlePayOut(record: Recordable) {
        Modal.confirm({
          title: () => '是否确认分账',
          onCancel: () => {},
          onOk: async function () {
            await updatePayOutMerchantAccount({
              orderBillItemIds: [record.id],
              payOutMerchantAccount: 1,
            })
            createMessage.success(`确认成功`)
            handleSuccess({})
          },
        })
      }

      function handleAntChainPay(record: Recordable) {
        Modal.confirm({
          title: () => '是否确认发起蚂蚁代扣',
          onCancel: () => {},
          onOk: async function () {
            await getAntChainWithholding({
              orderId: detailInfo.value.id,
              periodNo: record.periodNo,
            })
            createMessage.success(`请求成功`)
            handleSuccess({})
          },
        })
      }

      onMounted(() => {
        init()
        setTimeout(() => {
          const dom = document.querySelector('.ant-spin-container .ant-table-content table')
          const cutStyle = dom?.getAttribute('style')
          const cutW = cutStyle?.split('width:')[1]?.split(';')[0]
          summaryWidth.value = cutW
        }, 200)
      })
      const someCheck = (tableData, key) => {
        let num: any = 0
        tableData.map((item: any) => {
          num += item[key]
        })
        if (key == 'periodNo') return tableData[tableData.length - 1]?.periodNo
        return formatNumber(num, 2)
      }
      return {
        registerTable,
        handleOncePay,
        handleMorePay,
        handlePassword,
        updateOnceDate,
        updateMoreDate,
        handleSuccess,
        handleCancle,
        registerModal,
        passwordModal,
        dateModal,
        seletList,
        seletCount,
        showDrawer,
        isAllocation,
        handlePayOut,
        hasPermission,
        handleAntChainPay,
        isAntChainPay,
        ifStore: props.ifStore,
        isShowAction,
        isUnPayDown,
        penaltyAmountModal,
        payShow,
        columns,
        tableData,
        someCheck,
        summaryWidth,
      }
    },
  })
</script>
<style lang="less" scoped>
  .TableAction {
    flex-direction: column;

    ::v-deep.vben-basic-table-action {
      button {
        margin-bottom: 2px;
      }

      .action-divider {
        display: none !important;
      }
    }
  }

  .icon {
    cursor: pointer;
  }

  .desc-wrap {
    padding: 16px;
    background-color: @component-background;
  }

  .ant-drawer-body {
    padding: 0 !important;
  }

  .tableFoot {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%; // 210左边
    background-color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    padding: 16px 20px 16px;
    z-index: 100;

    .price {
      font-size: 16px;
      color: red;
      margin-bottom: 6px;
    }
  }

  .footerFlex {
    display: flex;
  }

  .summarList {
    display: flex;
    min-width: 100%;
    width: 100%;
    text-align: center;
  }
</style>
