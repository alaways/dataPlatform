<template>
  <div class="mt-3">
    <div class="ml-3 text-base font-bold">汇总每期统计</div>
    <BasicTable @register="registerTable" bordered>
      <template #toolbar>
        <div class="flex flex-1 items-center justify-between">
          <div class="flex flex-col">
            <div>提示说明： </div>
            <div>订单数据：统计截止昨日到期的订单（不含当天）；剔除已买断、已完结订单 </div>
            <div>
              金额数据：取值账单租金金额及整单还款金额（仅账单租金，不含部分还款、罚金、增值服务、锁费等）
            </div>
          </div>
          <Button @click="handleDownload" v-if="hasPermission('VintageExport')">
            <template #icon><UnorderedListOutlined /></template>
            下载暂存列表
          </Button>
        </div>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('VintageExport'),
              label: '下载明细',
              onClick: aoaToExcel.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <DownloadModal @register="downloadModal" />
  </div>
</template>

<script lang="ts" setup name="statisticsSlippage">
  import { exportVintageTableExcelOnline, getOverDueOrderInfoOnline } from '/@/api/statistics'
  import { columns, searchFormSchema } from './data'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useModal } from '/@/components/Modal'
  import DownloadModal from '/@/components/DownloadModal/index.vue'
  import { isIEBrowse } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import { Button } from 'ant-design-vue'

  const props = defineProps({
    search: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Boolean,
      default: false,
    },
  })
  const { hasPermission } = usePermission()
  const { createMessage } = useMessage()
  const [downloadModal, { openModal: openDownloadModal }] = useModal()

  const [registerTable, { getForm, getPaginationRef }] = useTable({
    columns,
    beforeFetch,
    api: getOverDueOrderInfoOnline,
    afterFetch,
    formConfig: {
      labelWidth: 80,
      schemas: searchFormSchema,
      actionColOptions: {
        span: 6,
      },
    },
    useSearchForm: false,
    showIndexColumn: false,
    scroll: { y: '100%' },
    pagination: false,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
    },
  })

  function beforeFetch(data) {
    return data
  }

  function afterFetch(data) {
    const res = data.map((v) => {
      Object.keys(v).forEach((o) => {
        if (o.indexOf('Amount') != -1) {
          v[o] = Number(v[o]) / 100
        }
      })
      // 订单逾期率 = 逾期订单 / 到期订单
      const yq = Number(v.expNoPaidOrderCount) / Number(v.expOrderCount)
      v['yql'] = handleToFixed2(yq * 100) + '%'
      v['hkRate'] = handleToFixed2((1 - Number(yq)) * 100) + '%'

      // 金额回款率=到期已还/到期金额
      const amountYq = Number(v.expPaidOrderTotalAmount) / Number(v.expOrderTotalAmount)
      v['amountRate'] = handleToFixed2(amountYq * 100) + '%'
      v['amountYql'] = handleToFixed2((1 - Number(amountYq)) * 100) + '%'
      return {
        ...v,
      }
    })
    return res
  }

  function handleToFixed2(num, toFixed = 2) {
    if (!num) num = 0
    return num.toFixed(toFixed)
  }

  function handleDownload() {
    openDownloadModal(true)
  }

  async function aoaToExcel(record: Recordable) {
    if (isIEBrowse()) {
      createMessage.error('请使用除IE之外的浏览器导出Excel')
      return
    }
    const form = await getForm()
    const value = form.getFieldsValue()
    const formValue = await beforeFetch(cloneDeep(value))

    const pageData: any = getPaginationRef()
    const params = {
      ...formValue,
      limit: pageData.total,
      periodNo: record.periodNo,
    }
    const res = await exportVintageTableExcelOnline(params)
    if (res.code == 200) {
      createMessage.success('已添加进下载暂存列表')
    } else {
      createMessage.success('申请失败')
    }
  }
</script>
