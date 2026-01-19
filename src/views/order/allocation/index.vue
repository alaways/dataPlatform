<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <div class="flex items-center justify-end">
          <div
            class="flex flex-col items-end"
            v-if="hasPermission('Finance.loanMoney.platform') && isShowNav"
          >
            <div class="count">
              <span class="w1">已选订单数/总分配订单:</span>
              <div class="w2">
                <span class="text-[#e11d48]">{{ selectOrder }}</span>
                <span>/{{ orderCount }}</span>
              </div>
              <span class="w3">比例: {{ orderScale }}%</span>
            </div>
            <div class="count">
              <span class="w1">已选签约总金额/总签约金额:</span>
              <div class="w2">
                <span class="text-[#e11d48]">{{ formatNumber(selectTotalMoney, 2) }}</span>
                <span>/{{ formatNumber(totalMoney, 2) }}</span>
              </div>
              <span class="w3">比例: {{ totalMoneyScale }}%</span>
            </div>
            <div class="count">
              <span class="w1">已选货款（仅货款）/货款（仅货款）:</span>
              <div class="w2">
                <span class="text-[#e11d48]">{{ formatNumber(loanMoneySelect, 2) }}</span>
                <span>/{{ formatNumber(totalLoanMoney, 2) }}</span>
              </div>
              <span class="w3">比例: {{ totalLoanMoneyScale }}%</span>
            </div>
          </div>
          <Button
            type="primary"
            class="mr-3"
            @click="handleBatch"
            v-if="hasPermission('Finance.loanMoney.platform')"
          >
            批量分配
          </Button>
          <Button
            :loading="exportExcelLoading"
            @click="aoaToExcel"
            v-if="hasPermission('OrderAllocationExport')"
          >
            <template #icon><DownloadOutlined /></template>
            申请下载Excel
          </Button>
          <Button @click="handleDownload" v-if="hasPermission('OrderAllocationExport')">
            <template #icon><UnorderedListOutlined /></template>
            下载暂存列表
          </Button>
        </div>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('OrderAllocationDetail'),
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderAllocationModal'),
              label: '商家分配',
              ifShow: record.ifAllot == 0,
              onClick: handleAllocation.bind(null, record),
            },
            // {
            //   label: '取消分配',
            //   ifShow: record.ifAllot != 0 && record.ifOrder != 1,
            //   popConfirm: {
            //     title: '是否确认取消',
            //     placement: 'left',
            //     confirm: handleCancle.bind(null, record),
            //   },
            // },
          ]"
        />
      </template>
    </BasicTable>
    <AllocationModal @register="registerModal" @success="handleSuccess" />
    <AmountModla @register="amountRegisterModal" />
    <BatchModal @register="batchModalRegister" @success="handleSuccess" />
    <DownloadModal @register="downloadModal" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import DownloadModal from '/@/components/DownloadModal/index.vue'
  import {
    exportAllocationExcel,
    getMerchantOrderDetailList,
    getMerchantOrderList,
    impExcelApi,
    uploadAllocationOrderStore,
  } from '/@/api/order'
  import { useGo } from '/@/hooks/web/usePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { handleBillList } from '../utils'
  import { Recordable } from 'vite-plugin-mock'
  import { useModal } from '/@/components/Modal'
  import AllocationModal from './AllocationModal.vue'
  import BatchModal from './BatchModal.vue'
  import AmountModla from '../components/amountModal/index.vue'
  import { getChannelList } from '/@/api/channel'
  import { Button } from 'ant-design-vue'
  import { cloneDeep } from 'lodash-es'
  import { isIEBrowse } from '/@/utils/is'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { formatNumber } from '/@/utils/tool'

  export default defineComponent({
    name: 'OrderAllocationPage',
    components: {
      BasicTable,
      DownloadModal,
      TableAction,
      AllocationModal,
      AmountModla,
      BatchModal,
      Button,
    },
    setup() {
      const go = useGo()
      const exportExcelLoading = ref(false)
      const fileList = ref([])
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()

      const orderCount = ref(0) // 总分配订单
      const totalMoney = ref(0) // 总签约金额
      const totalLoanMoney = ref(0) //总货款（仅货款）

      const rowList = ref<any>([]) // 选中的列表

      // 已选择订单
      const selectOrder = computed(() => {
        return rowList.value.length
      })

      // 已选择签约总金额
      const selectTotalMoney = computed(() => {
        if (!rowList.value.length) return 0
        const totalAmount = rowList.value.reduce(
          (accumulator, currentValue) => accumulator + currentValue.totalMoney,
          0,
        )
        return totalAmount
      })
      // 已选择签约总金额
      const loanMoneySelect = computed(() => {
        if (!rowList.value.length) return 0
        const totalAmount = rowList.value.reduce(
          (accumulator, currentValue) => accumulator + currentValue.loanMoney,
          0,
        )
        return totalAmount
      })
      // 订单比例
      const orderScale = computed(() => {
        if (!selectOrder.value) return 0
        return ((selectOrder.value / orderCount.value) * 100).toFixed(2)
      })

      // 总签约金额比例
      const totalMoneyScale = computed(() => {
        if (!selectTotalMoney.value) return 0
        return ((selectTotalMoney.value / totalMoney.value) * 100).toFixed(2)
      })
      const totalLoanMoneyScale = computed(() => {
        if (!selectTotalMoney.value) return 0
        return ((selectTotalMoney.value / totalMoney.value) * 100).toFixed(2)
      })
      const [registerModal, { openModal }] = useModal()
      const [amountRegisterModal, { openModal: amountOpenModal }] = useModal()
      const [batchModalRegister, { openModal: batchModal }] = useModal()
      const [downloadModal, { openModal: openDownloadModal }] = useModal()
      const [registerTable, { reload, getDataSource, getPaginationRef, getForm }] = useTable({
        title: '分配订单列表',
        beforeFetch,
        api: getMerchantOrderList,
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
          width: 150,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
        rowKey: 'id',
        clickToRowSelect: false,
        rowSelection: {
          type: 'checkbox',
          onSelect: rowSelectionSelect,
          onSelectAll: rowSelectionSelectAll,
        },
      })
      const isShowNav = ref(false)
      // 处理参数
      async function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        if (pdata.rentTypeList == 2 || pdata.rentTypeList == 3) {
          pdata.rentTypeList = '2,3'
        }
        if (pdata.time) {
          pdata['beginCreateTime'] = `${pdata.time[0]}`
          pdata['endCreateTime'] = `${pdata.time[1]}`
        }

        if (pdata.isNewAllocat == 0) {
          isShowNav.value = true
        } else {
          isShowNav.value = false
        }
        delete pdata.time
        getOrderAndAmount(pdata)
        return pdata
      }
      // 处理返回数据
      function afterFetch(data) {
        data.forEach((v) => {
          const res: any = handleBillList(v.orderBillItemList)
          v['firstPay'] = res.firstPay
          v['deposit'] = res.deposit
        })
        rowList.value = []
        return data
      }
      // 多选
      function rowSelectionSelect(e) {
        const find = rowList.value.find((v) => v.id == e.id)
        // 如果有则移除，否则获取
        if (find) {
          rowList.value = rowList.value.filter((v) => v.id != e.id)
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

      /**
       * 获取 分配订单总数和总签约金额
       */
      function getOrderAndAmount(params: any) {
        getMerchantOrderDetailList(params).then((res) => {
          totalMoney.value = res?.allocateOrderAmount || 0
          orderCount.value = res?.allocateOrderCount || 0
          totalLoanMoney.value = res?.loanMoney || 0
        })
      }

      onMounted(() => init())

      async function init() {
        const form = await getForm()

        // 修改搜索的渠道和商家的选择
        getChannelList().then((res) => {
          const channelList = res.list.map((v) => {
            return { label: `${v.code} - ${v.name}`, value: v.code }
          })
          form.updateSchema([
            {
              field: 'channelCode',
              componentProps: { options: channelList },
            },
            {
              field: 'status',
              componentProps: {
                onChange: () => {
                  form.submit()
                },
              },
            },
          ])
        })
      }

      function handleSuccess() {
        reload()
      }

      function handleAllocation(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        })
      }

      function handlePayModal(record: Recordable) {
        amountOpenModal(true, {
          record,
          isUpdate: true,
        })
      }

      function handleBatch(record: Recordable) {
        if (!rowList.value.length) {
          createMessage.error(`请先选择订单`)
          return
        }
        const orderIds = rowList.value.map((v) => v.id).join(',')
        batchModal(true, {
          record,
          orderIds,
          rowList,
          isUpdate: true,
        })
      }

      async function handleCancle(record: Recordable) {
        await uploadAllocationOrderStore({
          orderId: record.id,
          ifOrder: 2,
          merchantCode: record.merchantCode,
        })
        createMessage.success(`取消成功`)
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
        const res = await exportAllocationExcel(params)
        if (res.code == 200) {
          createMessage.success('已添加进下载暂存列表')
        } else {
          createMessage.success('申请失败')
        }
        exportExcelLoading.value = false
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.id}?uid=${record.uid}&name=${record.nickName}&ifAllot=${record.ifAllot}&isAllocation=1&back=/order/allocationOrder`,
        )
      }
      function handleDownload() {
        openDownloadModal(true)
      }
      return {
        registerTable,
        handleSuccess,
        handleCancle,
        handleDetail,
        handleAllocation,
        exportExcelLoading,
        fileList,
        registerModal,
        impExcelApi,
        aoaToExcel,
        amountRegisterModal,
        hasPermission,
        handleBatch,
        selectOrder,
        selectTotalMoney,
        orderCount,
        totalMoney,
        orderScale,
        totalMoneyScale,
        formatNumber,
        batchModalRegister,
        loanMoneySelect,
        totalLoanMoney,
        totalLoanMoneyScale,
        downloadModal,
        handleDownload,
        isShowNav,
      }
    },
  })
</script>

<style lang="less" scoped>
  .count {
    display: flex;
    flex-direction: row;
    align-items: center;

    .w1 {
      width: 180px;
      text-align: right;
    }

    .w2 {
      min-width: 200px;
      text-align: center;
    }

    .w3 {
      width: 80px;
      text-align: right;
      margin-right: 50px;
    }
  }
</style>
