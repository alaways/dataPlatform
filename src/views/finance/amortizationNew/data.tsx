import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { statusList } from '../../order/utils'
import { rentTypeList } from '../../goods/goodsLeaseMore/components/utils'
import dayjs from 'dayjs'
import { getStoreList } from '/@/api/store'
// 计价方式
export const goodTypeList = [
  { label: '默认', value: 1 },
  { label: '计算器计价', value: 2 },
  { label: '地区政策表', value: 3 },
  { label: '0首付', value: 4 },
]
export const columns: BasicColumn[] = [
  {
    title: '商家名称',
    width: 130,
    dataIndex: 'merchantName',
    fixed: 'left',
  },
  {
    title: '订单编号/订单状态',
    customHeaderRender: () => {
      return (
        <div>
          <div>订单编号</div>
          <div>订单状态</div>
        </div>
      )
    },
    dataIndex: 'orderSn',
    width: 145,
    fixed: 'left',
    customRender: ({ text, record }) => {
      const find: any = statusList.find((v) => v.value == record.status)
      return h('div', {}, text, [h('br'), h('Tag', {}, find?.label)])
    },
  },
  {
    title: '创建时间',
    width: 130,
    dataIndex: 'createTime',
    fixed: 'left',
  },
  {
    title: '计价方式/租赁类型',
    customHeaderRender: () => {
      return (
        <div>
          <div>计价方式</div>
          <div>租赁类型</div>
        </div>
      )
    },
    dataIndex: 'goodsLeaseType',
    width: 110,
    fixed: 'left',
    customRender: ({ text, record }) => {
      const find: any = goodTypeList.find((v) => v.value == text)
      let rentText: any = null
      if (text == 2) {
        rentText = '月付'
      }
      const rentFind = rentTypeList.find((v) => v.value == record?.rentType)
      return h('div', {}, find?.label, [h('br'), h('div', {}, rentText || rentFind?.label)])
    },
  },
  {
    title: '订单总金额(元）',
    dataIndex: 'totalMoney',
    width: 120,
    fixed: 'left',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '货款(元)',
    width: 120,
    dataIndex: 'modifyLoanMoney',
    fixed: 'left',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '总期数',
    dataIndex: 'totalPeriodsNum',
    width: 60,
    fixed: 'left',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '首付金额(元）',
    dataIndex: 'downPaymentRentAmount',
    width: 120,
    fixed: 'left',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '首付对应期数（首付金额/订单总金额)*总期数）',
    dataIndex: 'downPaymentRentPeriodsNum',
    width: 110,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '剩余货款对应期数（总期数-首付对应期数）',
    dataIndex: 'repayPeriodsNum',
    width: 110,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '首次摊销（货款/总期数*首付对应期数）',
    dataIndex: 'downPaymentAmortizeAmount',
    width: 130,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '剩余摊销成本（货款-首次摊销）',
    dataIndex: 'repayPaymentAmortizeAmount',
    width: 120,
    customRender: ({ text }) => text || '-',
  },
]
export const searchFormSchema: FormSchema[] = [
  {
    field: 'date',
    label: '创建时间',
    component: 'MonthPicker',
    defaultValue: dayjs(new Date()).format('YYYY-MM'),
    componentProps: {
      valueFormat: 'YYYY-MM',
      placeholder: '创建时间',
      width: '100%',
    },
    colProps: { span: 9 },
  },
  {
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 9 },
    componentProps: {
      allowClear: true,
    },
  },
  {
    field: 'merchantCode',
    label: '商家名称',
    component: 'ApiSelect',
    colProps: { span: 6 },
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getStoreList,
      params: { pageSize: 999999, limit: 999999 },
      resultField: 'list',
      labelField: 'merchantName',
      valueField: 'merchantCode',
    },
  },
]
