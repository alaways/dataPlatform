import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { handleMonth } from '/@/utils/order'
import dayjs from 'dayjs'
import { getCategoryTree } from '/@/api/statistics/index'
import { getAppList } from '/@/api/saas/app'
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
    title: '订单数',
    width: 130,
    dataIndex: '订单数',
  },
  {
    title: '当前逾期订单',
    width: 130,
    dataIndex: '当前逾期订单',
  },
  {
    title: '当前逾期率',
    width: 130,
    dataIndex: '当前逾期率',
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
