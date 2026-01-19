import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { handleMonth } from '/@/utils/order'
import dayjs from 'dayjs'

export const columns: BasicColumn[] = [
  {
    title: '创建时间',
    dataIndex: '创建时间',
    width: 150,
    customRender: ({ text }) => {
      return dayjs(text).format('YYYY-MM-DD')
    },
  },
  {
    title: '下单数',
    width: 130,
    dataIndex: '下单数',
  },
  {
    title: '预审数',
    dataIndex: '预审数',
    width: 140,
  },
  {
    title: '预审通过数',
    dataIndex: '预审通过数',
    width: 100,
  },
  {
    title: '预审通过率',
    dataIndex: '预审通过率',
    width: 100,
    customRender: ({ text }) => {
      return `${(text * 100).toFixed(2)}%` || '-'
    },
  },
  {
    title: '咨询数',
    dataIndex: '咨询数',
    width: 100,
  },
  {
    title: '预授权通过数',
    dataIndex: '预授权通过数',
    width: 100,
  },
  {
    title: '预授权通过率',
    dataIndex: '预授权通过率',
    width: 120,
    customRender: ({ text }) => {
      return `${(text * 100).toFixed(2)}%` || '-'
    },
  },
  {
    title: '申请数',
    dataIndex: '申请数',
    width: 120,
  },
  {
    title: '机审通过',
    dataIndex: '机审通过',
    width: 120,
  },
  {
    title: '机审通过率',
    dataIndex: '机审通过率',
    width: 100,
    customRender: ({ text }) => {
      return `${(text * 100).toFixed(2)}%` || '-'
    },
  },
  {
    title: '人审通过数',
    dataIndex: '人审通过数',
    width: 100,

  },
  {
    title: '拒绝数',
    dataIndex: '拒绝数',
    width: 100,
  },
  {
    title: '取消数',
    dataIndex: '取消数',
    width: 100,
  },
  {
    title: '人审通过率',
    dataIndex: '人审通过率',
    width: 100,
    customRender: ({ text }) => {
      return `${(text * 100).toFixed(2)}%` || '-'
    },
  },
  {
    title: '成交数',
    dataIndex: '成交数',
    width: 100,
  },
  {
    title: '已发货',
    dataIndex: '已发货',
    width: 140,
  },
  {
    title: '申请通过率',
    dataIndex: '申请通过率',
    width: 100,
    customRender: ({ text }) => {
      return `${(text * 100).toFixed(2)}%` || '-'
    },
  },
  {
    title: '申请成交率',
    dataIndex: '申请成交率',
    width: 140,
    customRender: ({ text }) => {
      return `${(text * 100).toFixed(2)}%` || '-'
    },
  },
  {
    title: '申请发货率',
    dataIndex: '申请发货率',
    width: 140,
    customRender: ({ text }) => {
      return `${(text * 100).toFixed(2)}%` || '-'
    },
  },
  {
    title: '咨询成交率',
    dataIndex: '咨询成交率',
    width: 100,
    customRender: ({ text }) => {
      return `${(text * 100).toFixed(2)}%` || '-'
    },
  },
  {
    title: '咨询发货率',
    dataIndex: '咨询发货率',
    width: 100,
    customRender: ({ text }) => {
      return `${(text * 100).toFixed(2)}%` || '-'
    },
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'time',
    label: '创建时间',
    defaultValue: handleMonth(),
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]
