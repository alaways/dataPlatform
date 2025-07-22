<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button
          :loading="exportExcelLoading"
          @click="aoaToExcel"
          v-if="hasPermission('WithdrawalExport')"
        >
          导出Excel
        </Button>
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow: hasPermission('FinanceWithdrawalOrderDetail'),
              label: '查看详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              ifShow: !record.applyStatus && hasPermission('WithdrawalSettled'),
              label: '确认结算',
              onClick: handleSettled.bind(null, record),
            },
            {
              ifShow: !record.applyStatus && hasPermission('WithdrawalSettled'),
              label: '取消结算',
              popConfirm: {
                title: '是否确认取消',
                placement: 'left',
                confirm: handleCancle.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <Withdrawal @register="registerModal" @success="handleSuccess" />
    <InfoModal @register="registerInfoModal" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, toRefs } from 'vue'
  import { BasicTable, TableAction, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { Recordable } from 'vite-plugin-mock'
  import { useModal } from '/@/components/Modal'
  import Withdrawal from './WithdrawalModal.vue'
  import InfoModal from './InfoModal.vue'
  import { getStoreList } from '/@/api/store'
  import { exportExcel, getWithdrawlList, updateSettled } from '/@/api/finance/withdrawal'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { isIEBrowse } from '/@/utils/is'
  import { cloneDeep } from 'lodash-es'
  import { downloadByData } from '/@/utils/file/download'
  import { Button } from 'ant-design-vue'

  export default defineComponent({
    name: 'FinanceWithdrawalPage',
    components: { BasicTable, TableAction, Withdrawal, InfoModal, Button },
    setup() {
      const exportExcelLoading = ref(false)
      const { hasPermission } = usePermission()

      const [registerModal, { openModal }] = useModal()
      const [registerInfoModal, { openModal: infoModal }] = useModal()

      const { createMessage } = useMessage()

      const [registerTable, { reload, getForm, getPaginationRef }] = useTable({
        // title: '商家提现',
        beforeFetch,
        api: getWithdrawlList,
        columns,
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
      })

      function beforeFetch(data) {
        const pdata = toRefs(data)
        const timeValue = pdata.timeSelect.value
        data['pageIndex'] = data.cursor
        data['pageSize'] = data.limit
        if (data.time) {
          if (timeValue == '发起时间') {
            data['createTimeBegin'] = `${data.time[0]}`
            data['createTimeEnd'] = `${data.time[1]}`
          } else if (timeValue == '结算时间') {
            data['settleTimeBegin'] = `${data.time[0]}`
            data['settleTimeEnd'] = `${data.time[1]}`
          }
        }
        delete data.time
        return data
      }

      const merchantCodeList = ref<any>([])
      async function init() {
        const mlist = await getStoreList({ pageSize: 999999, limit: 999999 })
        merchantCodeList.value = mlist.list
        const form = await getForm()
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

      function handleSettled(record: Recordable) {
        openModal(true, {
          record: {
            ...record,
            withdrawId: record.id,
          },
          isUpdate: true,
        })
      }

      function handleSuccess() {
        reload()
      }

      function handleDetail(record: Recordable) {
        infoModal(true, {
          record,
          isUpdate: true,
        })
      }

      async function handleCancle(record: Recordable) {
        await updateSettled({
          withdrawId: record.id,
          applyStatus: 2,
        })
        createMessage.success(`取消成功`)
        handleSuccess()
      }

      onMounted(() => {
        init()
      })

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
        downloadByData(res.data, '提现记录.xlsx')
        exportExcelLoading.value = false
      }

      return {
        registerTable,
        hasPermission,
        handleDetail,
        handleSettled,
        registerModal,
        registerInfoModal,
        handleSuccess,
        handleCancle,
        exportExcelLoading,
        aoaToExcel,
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
