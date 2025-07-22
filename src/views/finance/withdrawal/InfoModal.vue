<template>
  <BasicModal
    :bodyStyle="{ position: 'relative' }"
    :width="1200"
    v-bind="$attrs"
    @register="registerModal"
    title="查看明细"
    destroyOnClose
  >
    <div class="header">
      <div>
        <span class="mr-3">提现记录ID: {{ getTitle }}</span>
        <Tag :color="status.color">{{ status.label }}</Tag>
      </div>
      <div class="mt-3">
        <span>合计: </span>
        <span class="ml-3" style="color: red">
          提现金额: {{ formatNumber(recordData.withdrawAmount, 2) }}</span
        >
        <span class="ml-3" style="color: red">
          平台手续费: {{ formatNumber(recordData.serviceFee, 2) }}</span
        >
        <span class="ml-3" style="color: red">
          平台锁费: {{ formatNumber(recordData.lockFee, 2) }}</span
        >
      </div>
    </div>
    <BasicTable class="pt-15" @register="registerTable">
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              label: '订单详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              label: '订单账单',
              onClick: handleDetail.bind(null, record, { tabName: 'Bill' }),
            },
          ]"
        />
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { infoColumns } from './data'
  import { TableAction, useTable, BasicTable } from '/@/components/Table'
  import { Tag } from 'ant-design-vue'
  import { Recordable } from 'vite-plugin-mock'
  import { useGo } from '/@/hooks/web/usePage'
  import { getWithdrawlDetail } from '/@/api/finance/withdrawal'
  import { formatNumber } from '/@/utils/tool'

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, TableAction, BasicTable, Tag },
    emits: ['success', 'register'],
    setup() {
      const go = useGo()
      const uId = ref('')
      const getTitle = ref('')
      const recordData = ref<any>({})
      const status = ref({ label: '', color: '' })
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        uId.value = data.record.id
        getTitle.value = `${data.record.id}   ${data.record.merchantName}-${data.record.merchantCode}`
        recordData.value = data.record
        const applyStatus = data.record.applyStatus
        if (applyStatus == 1) {
          status.value.label = '已结算'
          status.value.color = 'green'
        } else if (applyStatus == 2) {
          status.value.label = '取消结算'
          status.value.color = 'red'
        } else {
          status.value.label = '审核中'
          status.value.color = 'orange'
        }
        setModalProps({ confirmLoading: false })
      })

      const [registerTable, { setProps }] = useTable({
        title: '',
        beforeFetch,
        api: getWithdrawlDetail,
        afterFetch,
        showIndexColumn: false,
        useSearchForm: false,
        showTableSetting: false,
        bordered: true,
        fetchSetting: {
          listField: 'data',
        },
        actionColumn: {
          width: 100,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })

      function beforeFetch(data) {
        data['pageIndex'] = data.cursor
        data['pageSize'] = data.limit
        data['id'] = uId.value
      }

      function afterFetch(data) {
        const settleRate = data.sysMerchantAccountWithdraw?.settleRate
        nextTick(() => {
          setProps({
            columns: infoColumns(settleRate || 0),
          })
        })
        const dlist = data.sysMerchantAccountWithdrawPayLogPrMapList.map((v) => {
          return {
            ...v.orderPay,
            withdrawAmount: v.withdrawAmount,
          }
        })
        return dlist
      }

      function handleDetail(record: Recordable, tab: any) {
        let url = `/Order_router/orderDetail/${record.orderId}?uid=${record.uid}&name=${record.name}&back=/finance/financeStream`
        if (tab && tab.tabName) {
          url = `${url}&tab=${tab.tabName}`
        }
        go(url)
        closeModal()
      }

      return {
        registerModal,
        registerTable,
        handleDetail,
        formatNumber,
        uId,
        getTitle,
        status,
        recordData,
      }
    },
  })
</script>

<style lang="less" scoped>
  .header {
    position: absolute;
    z-index: 100;
    background: #fff;
    width: 100%;
    padding-bottom: 10px;
  }

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
</style>
