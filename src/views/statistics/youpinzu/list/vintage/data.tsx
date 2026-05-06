import { BasicColumn } from '/@/components/Table'
export const columns: BasicColumn[] = [
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 150,
  },
  {
    title: '等级',
    dataIndex: 'grade_new',
    width: 100,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: '订单数',
    dataIndex: 'count',
    width: 100,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  // {
  //   title: 'fpd1',
  //   dataIndex: 'fpd1',
  //   width: 100,
  //   customRender: ({ text }) => {
  //     return text || '-'
  //   },
  // },
  {
    title: 'fpd1%',
    dataIndex: 'fpd1Percent',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  // {
  //   title: 'fpd4',
  //   dataIndex: 'fpd4',
  //   width: 100,
  //   customRender: ({ text }) => {
  //     return text || '-'
  //   },
  // },
  {
    title: 'fpd4%',
    dataIndex: 'fpd4Percent',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  // {
  //   title: 'fpd15',
  //   dataIndex: 'fpd15',
  //   width: 100,
  //   customRender: ({ text }) => {
  //     return text || '-'
  //   },
  // },
  {
    title: 'fpd15%',
    dataIndex: 'fpd15Percent',
    width: 120,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  // {
  //   title: 'fpd30',
  //   dataIndex: 'fpd30',
  //   width: 100,
  //   customRender: ({ text }) => {
  //     return text || '-'
  //   },
  // },
  {
    title: 'fpd30%',
    dataIndex: 'fpd30Percent',
    width: 120,
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
]
export const searchFormSchema = [
  {
    field: 'term',
    label: '期数',
    component: 'Select',
    defaultValue: 2,
    componentProps: {
      options: [
        { label: '2期', value: 2 },
        { label: '3期', value: 3 },
        { label: '4期', value: 4 },
      ],
    },
    colProps: { span: 6 },
  },
]
