<template>
  <BasicTable @register="registerTable" style="padding: 0">
    <template #toolbar v-if="hasPermission('FinanceAccountQuery')">
      <div class="flex flex-col content-end mb-4">
        <div class="flex flex-row">
          <div class="flex-1"></div>
          <Button
            :loading="exportExcelLoading"
            @click="aoaToExcel"
            v-if="hasPermission('FinanceAccountExport')"
          >
            导出Excel
          </Button>
        </div>
        <div class="flex mt-4" v-if="!hasPermission('Finance.loanMoney.platform')">
          <div class="mr-4">
            货款: <span style="color: red">￥{{ modifyLoanMoney }}</span>
          </div>
          <div class="mr-4">
            业务员提成: <span style="color: red">￥{{ modifyRoyaltyFee }}</span>
          </div>
          <div class="mr-4">
            商家分佣: <span style="color: red">￥{{ modifyRebateFee }}</span>
          </div>
          <div class="mr-4">
            货款合计: <span style="color: red">￥{{ totalAmount }}</span>
          </div>
          <div class="mr-4">
            接单商家合计承担: <span style="color: red">￥{{ storeTotal }}</span>
          </div>
        </div>
      </div>
    </template>
    <template #action="{ record }">
      <TableAction
        :actions="[
          {
            label: '详情',
            onClick: handleDetail.bind(null, record),
          },
        ]"
      />
    </template>
  </BasicTable>
</template>
<script lang="ts">
  import { defineComponent, ref, toRefs } from 'vue'
  import { getAccountLimitList, getAccountDetail, exportExcel } from '/@/api/finance/accountLimit'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { usageAmountColumns, usageAmountSearchSchema } from './data'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { formatNumber } from '/@/utils/tool'
  import { Recordable } from 'vite-plugin-mock'
  import { useGo } from '/@/hooks/web/usePage'
  import { isIEBrowse } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { downloadByData } from '/@/utils/file/download'
  import { Button } from 'ant-design-vue'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'UsageAmountTable',
    components: { BasicTable, TableAction, Button },
    setup() {
      const go = useGo()
      const { hasPermission } = usePermission()
      const { createMessage } = useMessage()

      const modifyLoanMoney = ref<any>(0)
      const modifyRoyaltyFee = ref<any>(0)
      const modifyRebateFee = ref<any>(0)
      const totalAmount = ref<any>(0)
      const storeTotal = ref<any>(0)
      const exportExcelLoading = ref(false)

      const [registerTable, { getForm, getPaginationRef }] = useTable({
        beforeFetch,
        columns: usageAmountColumns,
        scroll: { y: 600 },
        api: getAccountLimitList,
        formConfig: {
          labelWidth: 80,
          schemas: usageAmountSearchSchema,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })

      init()
      async function init() {
        if (hasPermission('FinanceAccountQuery')) {
          handleAmountDetail('')
        }
      }

      function handleAmountDetail(merchantCode) {
        const params: any = { type: 2 }
        if (merchantCode) {
          params['merchantCode'] = merchantCode
        }
        getAccountDetail(params).then((res: any) => {
          modifyLoanMoney.value = formatNumber(res.loanMoney || 0, 2)
          modifyRoyaltyFee.value = formatNumber(res.royaltyFee || 0, 2)
          modifyRebateFee.value = formatNumber(res.rebateFee || 0, 2)
          totalAmount.value = formatNumber(res.totalAmount || 0, 2)
          storeTotal.value = formatNumber(res.merchantTotalLoanMoney || 0, 2)
        })
      }

      function beforeFetch(data) {
        const pdata = toRefs(data)
        data['pageIndex'] = data.cursor
        data['pageSize'] = data.limit

        data['type'] = 2 //  "1-充值，2-扣款"

        if (data.merchantCode) {
          handleAmountDetail(data.merchantCode)
        }
        const timeValue = pdata.timeSelect.value
        if (data.time) {
          if (timeValue == '创建时间') {
            data['beginCreateTime'] = `${data.time[0]}`
            data['endCreateTime'] = `${data.time[1]}`
          } else if (timeValue == '首付支付时间') {
            data['beginFirstPayTime'] = `${data.time[0]}`
            data['endFirstPayTime'] = `${data.time[1]}`
          } else if (timeValue == '付款时间') {
            data['beginPayTime'] = `${data.time[0]}`
            data['endPayTime'] = `${data.time[1]}`
          }
        }
        delete data.time
        return data
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.orderId}?uid=${record.uid}&name=${record.nickName}&back=/finance/accountLimit?type=UsageAmountTable`,
        )
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
        const res = await exportExcel(params)
        downloadByData(res.data, '已使用余额.xlsx')
        exportExcelLoading.value = false
      }
      return {
        registerTable,
        modifyLoanMoney,
        modifyRoyaltyFee,
        modifyRebateFee,
        totalAmount,
        storeTotal,
        hasPermission,
        handleDetail,
        exportExcelLoading,
        aoaToExcel,
      }
    },
  })
</script>
