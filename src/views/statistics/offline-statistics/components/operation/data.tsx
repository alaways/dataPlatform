import { goodTypeList } from '/@/views/goods/goodsLeaseMore/components/utils'
import { BasicColumn, FormSchema } from '/@/components/Table'

export const columns: BasicColumn[] = [
  {
    title: '日期',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '下单数',
    dataIndex: 'orderCount',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '审核通过数',
    dataIndex: 'auditPassOrderCount',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '审核拒绝数',
    dataIndex: 'auditFailOrderCount',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '通过率',
    dataIndex: 'passRate',
    customRender: ({ text }) => {
      if (!text && text != 0) return '-'
      return `${(text * 100).toFixed(2)}%`
    },
  },
  {
    title: '通过后取消',
    dataIndex: 'auditPassCancelOrderCount',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '通过后取消率',
    dataIndex: 'passCancelRate',
    customRender: ({ text }) => {
      if (!text && text != 0) return '-'
      return `${(text * 100).toFixed(2)}%`
    },
  },
  {
    title: '发货数',
    dataIndex: 'deliveryPassOrderCount',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '发货率',
    dataIndex: 'deliveryPassRate',
    customRender: ({ text }) => {
      if (!text && text != 0) return '-'
      return `${(text * 100).toFixed(2)}%`
    },
  },
  {
    title: '审核中',
    dataIndex: 'reviewOrderCount',
    customRender: ({ text }) => text || '-',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'date',
    label: '查询时间',
    component: 'DatePicker',
    colProps: { span: 6 },
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    field: 'goodsLeaseType',
    label: '租赁业务',
    component: 'Select',
    defaultValue: '',
    colProps: { span: 6 },
    componentProps: {
      options: goodTypeList,
    },
  },
  {
    field: 'rentType',
    label: '租赁类型',
    component: 'Select',
    defaultValue: 2,
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '月付', value: 2 },
        { label: '周付', value: 1 },
        { label: '十天', value: 4 },
        { label: '日付', value: 0 },
      ],
    },
  },
]
