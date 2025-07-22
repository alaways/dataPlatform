<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button type="primary" @click="handleFine" v-if="hasPermission('OrderBatchCollectionFine')">
          批量修改罚金
        </Button>
        <Button
          type="primary"
          @click="handlePayment"
          v-if="hasPermission('OrderBatchCollectionPayment')"
        >
          批量收款
        </Button>
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow: hasPermission('OrderBatchCollectionDetail'),
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <PaidModal @register="paidModal" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx">
  import { computed, defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { getBatchCollectionFineOrder, getBatchCollectionOrderList } from '/@/api/order'
  import { useGo } from '/@/hooks/web/usePage'
  import { Recordable } from 'vite-plugin-mock'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { Button, Modal } from 'ant-design-vue'
  import { cloneDeep } from 'lodash-es'
  import { formatNumber } from '/@/utils/tool'
  import PaidModal from './PaidModal.vue'
  import { useModal } from '/@/components/Modal'

  export default defineComponent({
    name: 'OrderBatchCollection',
    components: {
      BasicTable,
      TableAction,
      Button,
      PaidModal,
    },
    setup() {
      const go = useGo()
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()

      const rowList = ref<any>([])
      const billItemSn = computed(() => {
        return rowList.value.map((v) => v.billItemSn).join(',') || ''
      })

      const [paidModal, { openModal: openPaidModal }] = useModal()

      const [registerTable, { reload, getDataSource, clearSelectedRowKeys }] = useTable({
        title: '',
        beforeFetch,
        api: getBatchCollectionOrderList,
        afterFetch,
        columns,
        scroll: { y: 600 },
        clickToRowSelect: false,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        rowKey: 'billItemSn',
        rowSelection: {
          type: 'checkbox',
          onSelect: rowSelectionSelect,
          onSelectAll: rowSelectionSelectAll,
        },
        pagination: {
          pageSize: 15,
          pageSizeOptions: ['10', '15'],
        },
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })

      function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        return pdata
      }

      function afterFetch() {
        clearSelectedRowKeys()
        rowList.value = []
      }

      function rowSelectionSelect(e) {
        const find = rowList.value.find((v) => v.billItemSn == e.billItemSn)
        // 如果有则移除，否则获取
        if (find) {
          rowList.value = rowList.value.filter((v) => v.billItemSn != e.billItemSn)
        } else {
          rowList.value.push(e)
        }
      }

      // 全选
      function rowSelectionSelectAll(bool: boolean) {
        const row = getDataSource()
        if (bool) {
          rowList.value = [...row]
        } else {
          rowList.value = []
        }
      }

      function handleFine() {
        if (!rowList.value.length) {
          createMessage.error('至少选择一条账单')
          return
        }
        const penaltyAmount = rowList.value.reduce((sum, item) => sum + item.penaltyAmount, 0)

        Modal.confirm({
          title: '批量修改罚金',
          content: () => {
            return (
              <div>
                <div>
                  {{ penaltyAmount }}
                  合计逾期罚金:{' '}
                  <span style={{ color: 'red' }}>{formatNumber(penaltyAmount || 0, 2)}</span>元
                </div>
                <div>批量修改罚金: 0(元)</div>
              </div>
            )
          },
          onCancel: () => '',
          onOk: () => {
            Modal.confirm({
              title: '请再次确认批量修改罚金!',
              onCancel: () => '',
              onOk: async () => {
                if (billItemSn.value) {
                  await getBatchCollectionFineOrder({
                    billItemSn: billItemSn.value,
                    modifyPenaltyAmount: 0,
                  })
                }
                createMessage.success('提交成功')
                handleSuccess()
              },
            })
          },
        })
      }

      function handlePayment() {
        if (!rowList.value.length) {
          createMessage.error('至少选择一条账单')
          return
        }
        const totalAmount = rowList.value.reduce(
          (sum, item) => sum + item.repayAmount + item.penaltyAmount,
          0,
        )
        const repayAmount = rowList.value.reduce((sum, item) => sum + item.repayAmount, 0)

        const penaltyAmount = rowList.value.reduce((sum, item) => sum + item.penaltyAmount, 0)

        if (penaltyAmount) {
          Modal.confirm({
            title: '当前勾选账单内,存在未修改罚金,请确认是否继续收款？',
            onCancel: () => '',
            onOk: async () => {
              openPaidModal(true, {
                isUpdate: true,
                record: {
                  billItemSn: billItemSn.value,
                  totalAmount,
                  penaltyAmount,
                  repayAmount,
                },
              })
            },
          })
        } else {
          openPaidModal(true, {
            isUpdate: true,
            record: {
              billItemSn: billItemSn.value,
              totalAmount,
              penaltyAmount,
              repayAmount,
            },
          })
        }
      }

      function handleSuccess() {
        reload()
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.id}?uid=${record.uid}&name=${record.nickName}&back=/order/OrderBatchCollection`,
        )
      }

      return {
        registerTable,
        handleDetail,
        hasPermission,
        handleSuccess,
        handlePayment,
        handleFine,
        paidModal,
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
</style>
