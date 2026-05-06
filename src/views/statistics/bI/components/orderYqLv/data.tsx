import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import dayjs from 'dayjs'
export const columns: BasicColumn[] = [
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
    customRender: ({ text }) => {
      return dayjs(text).format('YYYY-MM')
    },
  },
  {
    title: '期数',
    width: 130,
    dataIndex: 'periodNo',
  },
  {
    title: '当前逾期率',
    width: 130,
    dataIndex: 'currentDueLv',
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '当前7天逾期率',
    width: 130,
    dataIndex: 'lt7DueLv',
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '当前M1逾期率',
    width: 130,
    dataIndex: 'currentM1DueLv',
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '当前M2逾期率',
    width: 130,
    dataIndex: 'currentM2DueLv',
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '整体催回率',
    width: 130,
    dataIndex: 'totalReturnLv',
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: '7天催回率',
    width: 130,
    dataIndex: 'lt7ReturnLv',
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
  {
    title: 'M1天催回率',
    width: 130,
    dataIndex: 'ltM1ReturnLv',
    customRender: ({ text }) => {
      return text ? `${(text * 100).toFixed(2)}%` : '-'
    },
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'categoryInfoType',
    label: '品类',
    component: 'Select',
    componentProps: {
      options: [
        { label: '二手机', value: 1 },
        { label: '全新机', value: 2 },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'rentModeNameType',
    label: '租赁模式',
    component: 'Select',
    componentProps: {
      options: [
        { label: '租赁模式/租完即送', value: 1 },
        { label: '租赁模式/租完租完归还', value: 2 },
      ],
    },
    colProps: { span: 6 },
  },
]
