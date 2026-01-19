<template>
  <div class="mt-3">
    <div class="ml-3 text-base font-bold">汇总每期统计</div>
    <BasicTable @register="registerTable" bordered>
      <template #toolbar>
        <div class="flex flex-1 items-center justify-between">
          <div class="flex flex-col"> </div>
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
    <div class="flex flex-col mt-3 p-6 text-lg">
      <div>提示说明: </div>
      <div>以下数据取值【除第1期之外;不含罚金、增值服务、锁费等账单租金外费用】</div>
      <p>
        1、总订单、到期订单、到期订单金额、到期已还订单:
        取值【含租赁生效、已逾期、已买断、已完结状态下订单和订单的账单租金;不含部分还款】<br />
        2、提前还订单数、提前已还金额、未到期提前还订单数、未到期提前还金额:
        取值【含租赁生效、已逾期、已买断、已完结状态下订单和订单的账单租金;不含部分还款】<br />
        3、到期未还订单: 取值【仅租赁生效、已逾期订单;不含部分还款】 <br />
        4、到期已还金额:
        取值【含租赁生效、已逾期、已买断、已完结状态下订单的账单租金;不含部分还款】<br />
        5、到期未还金额: 取值【仅租赁生效、已逾期状态下订单的账单租金;不含部分还款】<br />
        6、部分还款订单数、部分还款金额:
        取值【仅租赁生效、已逾期状态下已到期的订单和订单的账单租金;含部分还款】
      </p>
      <div>计算公式调整: </div>
      <p>
        1、订单逾期率=到期未还订单/到期订单】<br />
        2、金额逾期率=到期未还金额-部分还款金额/到期金额
      </p>
    </div>
    <DownloadModal @register="downloadModal" />
  </div>
</template>

<script lang="ts" setup name="statisticsSlippage">
  import { exportVintageTableExcel, getOverDueOrderInfo } from '/@/api/statistics'
  import { columns, searchFormSchema } from './data'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useModal } from '/@/components/Modal'
  import DownloadModal from '/@/components/DownloadModal/index.vue'
  import { isIEBrowse } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import { Button } from 'ant-design-vue'
  import { isValidISO8601 } from '/@/utils/tool'

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
    api: getOverDueOrderInfo,
    afterFetch,
    formConfig: {
      labelWidth: 80,
      schemas: searchFormSchema,
      actionColOptions: {
        span: 6,
      },
    },
    useSearchForm: props.search,
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
    const pdata = cloneDeep(data)
    if (pdata.time) {
      pdata['startTime'] = `${isValidISO8601(pdata.time[0], 'YYYY-MM-DD')}`
      pdata['endTime'] = `${isValidISO8601(pdata.time[1], 'YYYY-MM-DD')}`
    }
    if (pdata.totalPeriodsNum) {
      pdata['totalPeriodsNum'] = parseInt(pdata.totalPeriodsNum)
    }
    delete pdata.time
    return pdata
  }

  function afterFetch(data) {
    const res = data.map((v) => {
      Object.keys(v).forEach((o) => {
        if (o.indexOf('Amount') != -1) {
          v[o] = Number(v[o]) / 100
        }
      })
      // 订单逾期率=到期未还订单/到期订单
      const yq = Number(v.expNoPaidOrderCount) / Number(v.expOrderCount)
      v['yql'] = handleToFixed2(yq * 100) + '%'

      // 金额逾期率=到期未还金额-部分还款金额/到期金额
      const amountYq =
        (Number(v.expNoPaidOrderTotalAmount) - Number(v.partialPayRepaidAmount)) /
        Number(v.expOrderTotalAmount)
      v['amountYql'] = handleToFixed2(amountYq * 100) + '%'
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
    const res = await exportVintageTableExcel(params)
    if (res.code == 200) {
      createMessage.success('已添加进下载暂存列表')
    } else {
      createMessage.success('申请失败')
    }
  }
</script>
