<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <div class="flex flex-col justify-start p-3 flex-1">
          <div class="text-base font-semibold">货款结算对账</div>
          <div class="flex items-center">
            <div class="flex-1">
              <div class="flex" v-if="hasPermission('FinanceBalanceAccount')">
                <div class="mr-4">
                  账户可用余额: <span style="color: red">￥{{ availableBalance || 0 }}</span>
                </div>
                <div class="mr-4">
                  已使用余额: <span style="color: red">￥{{ usageAmount || 0 }}</span>
                </div>
              </div>
            </div>
            <Button
              v-if="hasPermission('FinanceBalanceExport')"
              class="mr-3"
              :loading="exportExcelLoading"
              @click="aoaToExcel"
            >
              导出Excel
            </Button>
            <BasicUpload
              v-if="hasPermission('FinanceBalanceImport')"
              class="mr-3"
              :maxSize="20"
              :maxNumber="1"
              :api="impExcelApi"
              :accept="['xls', 'xlsx']"
              @change="uploadChange"
            >
              导入Excel
            </BasicUpload>
            <Button
              v-if="hasPermission('FinanceBalanceDownloadTemplate')"
              class="mr-3"
              @click="downTemplate"
            >
              下载模板
            </Button>
            <Button
              v-if="hasPermission('FinanceBalanceConfirm')"
              v-show="[1, 2].includes(showAction)"
              type="primary"
              @click="handleAllPayConfirm"
            >
              确认付款
            </Button>
          </div>
        </div>
      </template>
      <template #action="{ record }">
        <TableAction class="TableAction" :actions="handleAction(handleBalanceStatus, record)" />
      </template>
    </BasicTable>

    <Modals @register="registerModal" @success="handleSuccess" />
    <PayModal @register="registerPayModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, toRefs } from 'vue'
  import { BasicTable, TableAction, useTable } from '/@/components/Table'
  import { columns, handleAction, payStatusList, searchFormSchema } from './data'
  import { handleBillList } from '../../order/utils'
  import { downloadByData, downloadByUrl } from '/@/utils/file/download'
  import { cloneDeep } from 'lodash-es'
  import { Button, Modal } from 'ant-design-vue'
  import { getBalanceList, exportExcel, updateBalance, impExcelApi } from '/@/api/finance/balance'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useModal } from '/@/components/Modal'
  import Modals from './Modal.vue'
  import PayModal from './payModal.vue'
  import { BasicUpload } from '/@/components/Upload'
  import { isIEBrowse } from '/@/utils/is'
  import { getAccountDetail } from '/@/api/finance/accountLimit'
  import { formatNumber, isValidISO8601 } from '/@/utils/tool'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { getStoreList } from '/@/api/store'
  // import { useUserStore } from '/@/store/modules/user'

  export default defineComponent({
    name: 'FinanceBalancePage',
    components: { BasicTable, Button, Modals, PayModal, TableAction, BasicUpload },
    setup() {
      const { hasPermission } = usePermission()
      const { createMessage } = useMessage()
      const exportExcelLoading = ref(false)
      const showAction = ref(-1) // -1.全部 0.复核 1.待付款 2.待付款(提成未付) 3.已付款
      const [registerModal, { openModal }] = useModal()
      const [registerPayModal, { openModal: openPayModal }] = useModal()
      const availableBalance: any = ref(0)
      const usageAmount: any = ref(0)
      const totalRechargeAmount: any = ref(0)

      const [registerTable, { reload, getForm, getPaginationRef, getSelectRowKeys }] = useTable({
        // title: '货款结算对账',
        beforeFetch,
        api: getBalanceList,
        afterFetch,
        columns: columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
          getCheckboxProps() {
            if ([1, 2].includes(showAction.value)) {
              return { disabled: false }
            } else {
              return { disabled: true }
            }
          },
        },
        actionColumn: hasPermission('FinanceBalanceAction')
          ? {
              width: 100,
              title: '操作',
              dataIndex: 'action',
              slots: { customRender: 'action' },
              fixed: 'right',
            }
          : undefined,
      })

      function beforeFetch(data) {
        const pdata = toRefs(data)
        const timeValue = pdata.timeSelect.value
        data['pageIndex'] = data.cursor
        data['pageSize'] = data.limit
        if (data.rentTypeList == 2 || data.rentTypeList == 3) {
          data.rentTypeList = '2,3'
        }
        if (data.time) {
          if (timeValue == '创建时间') {
            data['beginCreateTime'] = `${isValidISO8601(data.time[0], 'YYYY-MM-DD')}`
            data['endCreateTime'] = `${isValidISO8601(data.time[1], 'YYYY-MM-DD')}`
          } else if (timeValue == '首付支付时间') {
            data['beginFirstPayTime'] = `${isValidISO8601(data.time[0], 'YYYY-MM-DD')}`
            data['endFirstPayTime'] = `${isValidISO8601(data.time[1], 'YYYY-MM-DD')}`
          } else if (timeValue == '付款时间') {
            data['beginPayTime'] = `${isValidISO8601(data.time[0], 'YYYY-MM-DD')}`
            data['endPayTime'] = `${isValidISO8601(data.time[1], 'YYYY-MM-DD')}`
          }
        }
        if (data.payStatus == -1) {
          delete data.payStatus
          delete data.reviewerStatus
        } else if (data.payStatus == 0) {
          data['reviewerStatus'] = 0
          delete data.payStatus
        } else {
          data.payStatus = data.payStatus - 1
          delete data.reviewerStatus
        }
        delete data.time
        return data
      }
      // 处理返回数据
      async function afterFetch(data) {
        data.forEach((v) => {
          const res: any = handleBillList(v.orderBillItemList)
          v['firstPay'] = res.firstPay
          v['deposit'] = res.deposit
        })

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
        form.updateSchema([
          {
            field: 'payStatus',
            componentProps: {
              options: payStatusList,
              onChange: (e) => {
                showAction.value = e
                form.submit()
              },
            },
          },
        ])

        const mlist = await getStoreList({ pageSize: 999999, limit: 999999 })
        merchantCodeList.value = mlist.list
        const kongObj = {
          merchantCode: 'empty',
          merchantName: '查询空商家',
        }
        console.log([kongObj, ...merchantCodeList.value], 'list商家数据')
        form.updateSchema([
          {
            field: 'merchantCode',
            componentProps: {
              placeholder: '请选择',
              options: [kongObj, ...merchantCodeList.value],
              fieldNames: {
                label: 'merchantName',
                value: 'merchantCode',
                key: 'merchantCode',
              },
            },
          },
        ])
      }

      async function handleBalanceStatus(record: Recordable, type: string) {
        const formValues = {
          ids: record.id,
          orderSn: record.orderSn,
        }
        if (type == 'Review') {
          // 复核
          formValues['reviewerStatus'] = 1
          await updateBalance(formValues)
          handleMessageSuccess('复核成功')
        } else if (type == 'Revoke') {
          // 撤回
          formValues['payStatus'] = 1
          await updateBalance(formValues)
          handleMessageSuccess('撤回成功')
        } else if (type == 'PayConfirm') {
          // 确认付款
          openPayModal(true, {
            record,
            showAction: showAction.value,
            isUpdate: true,
          })
        } else if (type == 'Update') {
          openModal(true, {
            record,
            isUpdate: true,
            isAfter: 0,
          })
        } else if (type == 'UpdateAfter') {
          openModal(true, {
            record,
            isUpdate: true,
            isAfter: 1,
          })
        }
      }

      function handleAllPayConfirm() {
        const ids = getSelectRowKeys()
        if (ids.length) {
          Modal.confirm({
            title: () => '是否确认付款',
            onCancel: () => {},
            onOk: async () => {
              await updateBalance({
                ids: ids.join(','),
                payStatus: 2,
              })
              handleMessageSuccess('确认成功')
            },
          })
        }
      }

      function handleMessageSuccess(message) {
        createMessage.success(message)
        handleSuccess()
      }

      function handleSuccess() {
        reload()
      }

      function uploadChange() {
        handleSuccess()
      }

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
        const res = await exportExcel(params)
        downloadByData(res.data, '货款结算对账.xlsx')
        exportExcelLoading.value = false
      }

      function downTemplate() {
        const url =
          'https://guangsu-v2.oss-cn-shanghai.aliyuncs.com/2024-06-04/f7e3b290-c64e-4bf2-857e-84fe44fc9d54.xlsx'
        downloadByUrl({ url, fileName: '货款结算对账模板.xlsx' })
      }

      onMounted(() => {
        init()
      })

      return {
        registerTable,
        handleSuccess,
        exportExcelLoading,
        aoaToExcel,
        registerModal,
        handleBalanceStatus,
        showAction,
        handleAction,
        registerPayModal,
        impExcelApi,
        handleAllPayConfirm,
        uploadChange,
        availableBalance,
        usageAmount,
        totalRechargeAmount,
        hasPermission,
        downTemplate,
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
