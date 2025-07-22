<template>
  <BasicTable @register="registerTable" style="padding: 0">
    <template #toolbar v-if="hasPermission('FinanceAccountQuery')">
      <div class="flex flex-col content-end">
        <div class="flex flex-row mb-4" v-if="0">
          <div class="flex-1"></div>
          <Button
            :loading="exportExcelLoading"
            @click="aoaToExcel"
            v-if="hasPermission('FinanceAccountExport')"
          >
            导出Excel
          </Button>
        </div>
        <div class="flex" v-if="!hasPermission('Finance.loanMoney.platform')">
          <div class="mr-4">
            账户可用余额: <span style="color: red">￥{{ availableBalance || 0 }}</span>
          </div>
          <div class="mr-4">
            已使用余额: <span style="color: red">￥{{ usageAmount || 0 }}</span>
          </div>
          <div class="mr-4">
            累计充值额度: <span style="color: red">￥{{ totalRechargeAmount }}</span>
          </div>
        </div>
      </div>
    </template>
  </BasicTable>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { getAccountLimitList, getAccountDetail, exportExcel } from '/@/api/finance/accountLimit'
  import { BasicTable, useTable } from '/@/components/Table'
  import { availableBalanceColumns, availableBalanceSearchSchema } from './data'
  import { cloneDeep } from 'lodash-es'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { formatNumber } from '/@/utils/tool'
  import { isIEBrowse } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { downloadByData } from '/@/utils/file/download'
  import { Button } from 'ant-design-vue'

  export default defineComponent({
    name: 'AvailableBalanceTable',
    components: { BasicTable, Button },
    setup() {
      const { hasPermission } = usePermission()
      const { createMessage } = useMessage()

      const availableBalance: any = ref(0)
      const usageAmount: any = ref(0)
      const totalRechargeAmount: any = ref(0)
      const exportExcelLoading = ref(false)

      const [registerTable, { getForm, getPaginationRef }] = useTable({
        beforeFetch,
        columns: availableBalanceColumns,
        scroll: { y: 600 },
        api: getAccountLimitList,
        formConfig: {
          labelWidth: 80,
          schemas: availableBalanceSearchSchema,
        },
        useSearchForm: hasPermission('FinanceAccountMerchant'),
        bordered: true,
        showIndexColumn: false,
      })

      init()
      async function init() {
        if (hasPermission('FinanceAccountQuery')) {
          handleAmountDetail('')
        }
      }

      function handleAmountDetail(merchantCode) {
        const params: any = { type: 1 }
        if (merchantCode) {
          params['merchantCode'] = merchantCode
        }
        getAccountDetail(params).then((res: any) => {
          availableBalance.value = formatNumber(res.availableBalance || 0, 2)
          usageAmount.value = formatNumber(res.usageAmount || 0, 2)
          totalRechargeAmount.value = formatNumber(res.totalRechargeAmount || 0, 2)
        })
      }

      function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit

        pdata['type'] = 1 //  "1-充值，2-扣款"

        if (pdata.merchantCode) {
          handleAmountDetail(pdata.merchantCode)
        }

        return pdata
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
        downloadByData(res.data, '账户充值记录.xlsx')
        exportExcelLoading.value = false
      }

      return {
        registerTable,
        availableBalance,
        usageAmount,
        totalRechargeAmount,
        hasPermission,
        exportExcelLoading,
        aoaToExcel,
      }
    },
  })
</script>
