<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <div class="flex flex-col justify-start p-3 flex-1">
          <div class="text-base font-semibold">商家订单列表</div>
          <div class="flex items-center">
            <div class="flex-1">
              <div class="flex" v-if="hasPermission('OrderStoreAccountBalance')">
                <div class="mr-4">
                  累计充值余额: <span style="color: red">￥{{ totalRechargeAmount || 0 }}</span>
                </div>
                <div class="mr-4">
                  账户可用余额: <span style="color: red">￥{{ availableBalance || 0 }}</span>
                </div>
                <div class="mr-4">
                  已使用余额: <span style="color: red">￥{{ usageAmount || 0 }}</span>
                </div>
              </div>
            </div>
            <Popconfirm
              title="确定是否操作批量接单？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="batchJieOrderHanld"
              @cancel="() => {}"
              v-if="hasPermission('batchJDorder')"
            >
              <Button :style="{ marginRight: '8px' }">批量接单</Button>
            </Popconfirm>
            <Button
              :loading="exportExcelLoading"
              @click="aoaToExcel"
              v-if="hasPermission('OrderStoreExport')"
            >
              导出Excel
            </Button>
          </div>
        </div>
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow: hasPermission('OrderStoreDetail'),
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              label: '撤销分配',
              ifShow: record.ifOrder == 1 && hasPermission('OrderStoreRevoke'),
              popConfirm: {
                title: '是否确认撤销',
                placement: 'left',
                confirm: handleRevoke.bind(null, record),
              },
            },
            {
              label: '确认接单',
              ifShow: record.ifOrder != 1 && hasPermission('OrderStoreConfirm'),
              popConfirm: {
                title: '请确认是否接收该订单？',
                placement: 'left',
                confirm: handleReceiving.bind(null, record, false),
              },
            },
            {
              label: '拒绝接单',
              ifShow: record.ifOrder != 1 && hasPermission('OrderStoreRefuse'),
              popConfirm: {
                title: '请确认是否拒绝该订单？',
                placement: 'left',
                confirm: handleReceiving.bind(null, record, true),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <PasswordModal @register="passwordModal" @success="handleSuccess" />
    <AmountModla @register="amountRegisterModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, toRefs } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { exportStoreExcel, getOrderStoreList, uploadAllocationOrderStore } from '/@/api/order'
  import { useGo } from '/@/hooks/web/usePage'
  import { handleBillList } from '../utils'
  import { Recordable } from 'vite-plugin-mock'
  import PasswordModal from '../components/PasswordModal.vue'
  import { useModal } from '/@/components/Modal'
  import { Button, Popconfirm } from 'ant-design-vue'
  import { downloadByData } from '/@/utils/file/download'
  import AmountModla from '../components/amountModal/index.vue'
  import { getStoreList, batchIfOrder } from '/@/api/store'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import { isIEBrowse } from '/@/utils/is'
  import { getAccountDetail } from '/@/api/finance/accountLimit'
  import { formatNumber } from '/@/utils/tool'
  import { usePermission } from '/@/hooks/web/usePermission'

  export default defineComponent({
    name: 'OrderStorePage',
    components: { BasicTable, TableAction, PasswordModal, Button, AmountModla, Popconfirm },
    setup() {
      const { hasPermission } = usePermission()
      const exportExcelLoading = ref(false)
      const go = useGo()
      const { createMessage } = useMessage()
      const fileList = ref([])
      const [passwordModal, { openModal: openPasswordModal }] = useModal()
      const [amountRegisterModal, { openModal: amountOpenModal }] = useModal()
      const availableBalance: any = ref(0)
      const usageAmount: any = ref(0)
      const totalRechargeAmount: any = ref(0)
      const [
        registerTable,
        { reload, getPaginationRef, setPagination, getDataSource, getForm, clearSelectedRowKeys },
      ] = useTable({
        // title: '商家订单列表',
        beforeFetch,
        api: getOrderStoreList,
        afterFetch,
        columns: columns({ payModal: handlePayModal }),
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 100,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
        rowKey: 'merchantId',
        rowSelection: {
          type: 'checkbox',
          onChange: rowSelectionSelect,
          onSelectAll: rowSelectionSelectAll,
        },
      })
      const rowList = ref([])
      // 多选
      function rowSelectionSelect(e) {
        const find = rowList.value.find((v) => v == e.merchantId)
        // 如果有则移除，否则获取
        if (find) {
          rowList.value = rowList.value.filter((v) => v != e.merchantId)
        } else {
          rowList.value.push(e)
        }
      }

      // 全选
      function rowSelectionSelectAll(bool: boolean) {
        const row = getDataSource()
        const ndata = row?.map((item) => item.merchantId)
        if (bool) {
          rowList.value = [...ndata]
        } else {
          rowList.value = []
        }
      }
      // 处理参数
      async function beforeFetch(data) {
        const pdata = toRefs(data)
        const timeValue = pdata.timeSelect.value

        data['pageIndex'] = data.cursor
        data['pageSize'] = data.limit
        setPagination({
          pageSize: data.limit,
        })
        if (data.time) {
          if (timeValue == '创建时间') {
            data['beginCreateTime'] = `${data.time[0]}`
            data['endCreateTime'] = `${data.time[1]}`
          } else if (timeValue == '分配时间') {
            data['beginAllocatTime'] = `${data.time[0]}`
            data['endAllocatTime'] = `${data.time[1]}`
          } else if (timeValue == '接单时间') {
            data['beginReceivtTime'] = `${data.time[0]}`
            data['endReceivtTime'] = `${data.time[1]}`
          } else if (timeValue == '还款时间') {
            data['beginPayTime'] = `${data.time[0]}`
            data['endPayTime'] = `${data.time[1]}`
          }
        }
        if (data.rentTypeList == 2 || data.rentTypeList == 3) {
          data['rentTypeList'] = '2,3'
        }

        delete data.timeSelect
        delete data.time
        return data
      }
      // 批量接单
      async function batchJieOrderHanld() {
        const merchantIds = rowList.value?.join(',')
        const res = await batchIfOrder({ merchantIds })
        if (res?.data.code == 200) {
          createMessage.success('批量接单成功')
          console.log(res, '我是res')
          rowList.value = []
          reload()
          clearSelectedRowKeys()
        }
      }
      // 处理返回数据
      async function afterFetch(data) {
        init()
        data.forEach((v) => {
          const res: any = handleBillList(v.orderBillItemList)
          v['firstPay'] = res.firstPay
          v['deposit'] = res.deposit
        })
        const form = await getForm()
        form.updateSchema([
          {
            field: 'status',
            componentProps: {
              onChange: () => {
                form.submit()
              },
            },
          },
        ])
        return data
      }

      const merchantCodeList = ref<any>([])
      async function init() {
        getAccountDetail({}).then((res: any) => {
          availableBalance.value = formatNumber(res.availableBalance || 0, 2)
          usageAmount.value = formatNumber(res.usageAmount || 0, 2)
          totalRechargeAmount.value = formatNumber(res.totalRechargeAmount || 0, 2)
        })

        const form = await getForm()
        const mlist = await getStoreList({ pageSize: 99999, limit: 999999 })
        merchantCodeList.value = mlist.list

        form.updateSchema([
          {
            field: 'merchantCode',
            componentProps: {
              placeholder: '请选择',
              options: merchantCodeList.value,
              fieldNames: {
                label: 'merchantName',
                value: 'merchantCode',
                key: 'merchantCode',
              },
            },
          },
        ])
      }

      function handleSuccess(data) {
        if (data?.showPwd) {
          handlePassword(data.data)
        } else {
          reload()
        }
      }
      // 输入密码
      function handlePassword(data: any) {
        openPasswordModal(true, {
          isUpdate: true,
          data,
        })
      }

      function handlePayModal(record: Recordable) {
        amountOpenModal(true, {
          record,
          isUpdate: true,
        })
      }

      async function handleReceiving(record: Recordable, isCancel: boolean) {
        const res = await uploadAllocationOrderStore({
          id: record.merchantId,
          ifOrder: isCancel ? 2 : 1,
        })
        if (res && res.code == 500) {
          createMessage.error(res.message)
          return
        }
        if (isCancel) {
          createMessage.success(`拒单成功`)
        } else {
          createMessage.success(`接单成功`)
        }
        reload()
        // handlePassword({
        //   come: 'storeOrder',
        //   data: {
        //     id: record.merchantId,
        //     ifOrder: isCancel ? 2 : 1,
        //   },
        //   isCancel,
        // })
      }

      async function handleRevoke(record: Recordable) {
        await uploadAllocationOrderStore({ id: record.merchantId, ifOrder: 3 })
        reload()
        createMessage.success('撤回成功')
      }

      // 导出
      async function aoaToExcel() {
        if (isIEBrowse()) {
          createMessage.error('请使用除IE之外的浏览器导出Excel')
          return
        }
        const form = await getForm()
        const value = form.getFieldsValue()
        const formValue = await beforeFetch(cloneDeep(value))

        exportExcelLoading.value = true
        const pageData: any = getPaginationRef()
        const params = {
          ...formValue,
          limit: pageData.total,
        }
        const res = await exportStoreExcel(params)
        downloadByData(res.data, '订单列表.xlsx')
        exportExcelLoading.value = false
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.id}?uid=${record.uid}&ifStore=1&name=${record.nickName}&back=/order/storeOrder`,
        )
      }

      return {
        registerTable,
        handleSuccess,
        handleReceiving,
        handleDetail,
        handleRevoke,
        fileList,
        passwordModal,
        aoaToExcel,
        exportExcelLoading,
        amountRegisterModal,
        availableBalance,
        usageAmount,
        totalRechargeAmount,
        hasPermission,
        batchJieOrderHanld,
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
