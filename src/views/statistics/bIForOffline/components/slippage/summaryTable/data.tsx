import { cloneDeep } from 'lodash-es'
import { FormSchema } from '/@/components/Form'
import { BasicColumn } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'
import { goodTypeList } from '/@/views/goods/goodsLeaseMore/components/utils'
function getGoodsLeaseOptions() {
  const goodsLeaseOptions: any = cloneDeep(goodTypeList)
  goodsLeaseOptions.unshift({ label: '全部', value: '' })
  return goodsLeaseOptions
}
export const columns: BasicColumn[] = [
  {
    title: '租期',
    width: 100,
    dataIndex: 'periodNo',
  },
  {
    title: '总订单',
    // width: 100,
    dataIndex: 'orderCount',
    customRender: ({ text }) => formatNumber(text * 100 || 0),
  },
  {
    title: '到期订单',
    // width: 120,
    dataIndex: 'expOrderCount',
    customRender: ({ text }) => formatNumber(text * 100 || 0),
  },
  {
    title: '到期金额',
    // width: 120,
    dataIndex: 'expOrderTotalAmount',
    customRender: ({ text }) => formatNumber(text * 100 || 0, 2),
  },
  {
    title: '到期已还订单', // = 已收到金额（到期金额-逾期金额） + 首付（第6、9、12期要加上）
    // width: 120,
    dataIndex: 'expPaidOrderCount',
    customRender: ({ text }) => formatNumber(text * 100 || 0),
  },
  {
    title: '到期已还金额',
    // width: 120,
    dataIndex: 'expPaidOrderTotalAmount',
    customRender: ({ text }) => formatNumber(text * 100 || 0, 2),
  },
  {
    title: '到期未还订单', // 逾期订单
    // width: 120,
    dataIndex: 'expNoPaidOrderCount',
    customRender: ({ text }) => formatNumber(text * 100 || 0),
  },
  {
    title: '到期未还金额', // 逾期金额
    // width: 120,
    dataIndex: 'expNoPaidOrderTotalAmount',
    customRender: ({ text }) => formatNumber(text * 100 || 0, 2),
  },
  {
    title: '提前还订单数',
    // width: 120,
    dataIndex: 'prepaymentOrderCount',
    customRender: ({ text }) => formatNumber(text * 100 || 0),
  },
  {
    title: '提前已还金额',
    // width: 120,
    dataIndex: 'prepaymentOrderTotalAmount',
    customRender: ({ text }) => formatNumber(text * 100 || 0, 2),
  },
  {
    title: '未到期提前还订单数',
    // width: 120,
    dataIndex: 'UnexpiredOrderTotal',
    customRender: ({ record }) => {
      const text = record.prepaymentOrderCount - record.prepaymentExpOrderCount
      return text
    },
  },
  {
    title: '未到期提前还金额',
    // width: 120,
    dataIndex: 'UnexpiredOrderTotalAmount',
    customRender: ({ record }) => {
      const text = record.prepaymentOrderTotalAmount - record.prepaymentExpOrderTotalAmount
      return formatNumber(text * 100 || 0, 2)
    },
  },
  {
    title: '部分还款订单数',
    // width: 120,
    dataIndex: 'partialPayOrderCount',
    customRender: ({ text }) => formatNumber(text * 100 || 0),
  },
  {
    title: '部分还款金额',
    // width: 120,
    dataIndex: 'partialPayRepaidAmount',
    customRender: ({ text }) => formatNumber(text * 100 || 0, 2),
  },
  // {
  //   title: '订单总金额',
  //   dataIndex: 'orderTotalAmount',
  // },
  {
    title: '订单逾期率',
    width: 100,
    dataIndex: 'yql',
  },
  // {
  //   title: '金额回款率', // 1-逾期率
  //   width: 100,
  //   dataIndex: 'amountRate',
  // },
  {
    title: '金额逾期率',
    width: 100,
    dataIndex: 'amountYql',
  },
  // {
  //   title: '订单回款率', // 1-逾期率
  //   width: 100,
  //   dataIndex: 'hkRate',
  // },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'rentType',
    label: '维度',
    labelWidth: 50,
    component: 'Select',
    defaultValue: 2,
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '全部', value: '' },
        { label: '日付', value: 0 },
        { label: '十天', value: 4 },
        { label: '周付', value: 1 },
        { label: '月付', value: 2 },
      ],
    },
  },
  {
    field: 'spuType',
    label: '品类',
    component: 'Select',
    defaultValue: '',
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '全部', value: '' },
        { label: '手机', value: 1 },
        { label: '电动车', value: 2 },
      ],
    },
  },
  {
    field: 'goodsLeaseType',
    label: '租赁业务',
    component: 'Select',
    defaultValue: '',
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: getGoodsLeaseOptions(),
    },
  },
  {
    field: 'totalPeriodsNum',
    label: '总期数',
    component: 'InputNumber',
    colProps: { span: 6 },
    componentProps: {
      step: 1,
      min: 0,
    },
  },
  {
    field: 'time',
    label: '创建时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]
