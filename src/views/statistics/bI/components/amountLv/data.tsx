import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { handleMonth } from '/@/utils/order'

export const columns: BasicColumn[] = [
  {
    title: '创建时间',
    dataIndex: '创建时间',
    width: 150,
  },
  {
    title: 'fpd1%',
    width: 130,
    dataIndex: 'amt-fpd1%',
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'fpd3%',
    dataIndex: 'amt-fpd3%',
    width: 140,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'fpd7%',
    dataIndex: 'amt-fpd7%',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'fpd15%',
    dataIndex: 'amt-fpd15%',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'fpd30%',
    dataIndex: 'amt-fpd30%',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '人数类-fpd1%',
    dataIndex: 'pers-fpd1%',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '人数类-fpd3%',
    dataIndex: 'pers-fpd3%',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '人数类-fpd7%',
    dataIndex: 'pers-fpd7%',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '人数类-fpd15%',
    dataIndex: 'pers-fpd15%',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '人数类-fpd30%',
    dataIndex: 'pers-fpd30%',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
]
export const columns1: BasicColumn[] = [
  {
    title: '创建时间',
    dataIndex: '创建时间',
    width: 150,
  },
  {
    title: 'fpd1%',
    width: 130,
    dataIndex: 'amt-spd1%',
    customRender: ({ text }) => {
      return text ||  '-'
    },
  },
  {
    title: 'fpd3%',
    dataIndex: 'amt-spd3%',
    width: 140,
    customRender: ({ text }) => {
      return text ||  '-'
    },
  },
  {
    title: 'fpd7%',
    dataIndex: 'amt-spd7%',
    width: 100,
    customRender: ({ text }) => {
      return text ||  '-'
    },
  },
  {
    title: 'fpd15%',
    dataIndex: 'amt-spd15%',
    width: 100,
    customRender: ({ text }) => {
      return text ||  '-'
    },
  },
  {
    title: 'fpd30%',
    dataIndex: 'amt-spd30%',
    width: 100,
    customRender: ({ text }) => {
      return text ||  '-'
    },
  },
  {
    title: '人数类-fpd1%',
    dataIndex: 'pers-spd1%',
    width: 100,
    customRender: ({ text }) => {
      return text ||  '-'
    },
  },
  {
    title: '人数类-fpd3%',
    dataIndex: 'pers-spd3%',
    width: 100,
    customRender: ({ text }) => {
      return text ||  '-'
    },
  },
  {
    title: '人数类-fpd7%',
    dataIndex: 'pers-spd7%',
    width: 100,
    customRender: ({ text }) => {
      return text ||  '-'
    },
  },
  {
    title: '人数类-fpd15%',
    dataIndex: 'pers-spd15%',
    width: 100,
    customRender: ({ text }) => {
      return text ||  '-'
    },
  },
  {
    title: '人数类-fpd30%',
    dataIndex: 'pers-spd30%',
    width: 100,
    customRender: ({ text }) => {
      return text ||  '-'
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
  {
    field: 'type',
    label: '逾期率类型',
    defaultValue: 1,
    component: 'Select',
    componentProps: {
      options: [
        {label: 'FPD逾期率', value: 1},
        {label: 'SPD逾期率', value: 2},
      ]
    },
    colProps: { span: 6 },
  },
]
