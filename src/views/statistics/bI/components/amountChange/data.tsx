import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { handleMonth } from '/@/utils/order'

export const columns: BasicColumn[] = [
  {
    title: '创建时间',
    dataIndex: 'createDate',
    width: 150,
  },
  {
    title: '应收金额(元)',
    width: 150,
    dataIndex: 'orderAmount',
    customRender: ({ text }) => {
      return text / 100 ||  '-'
    },
  },
  {
    title: 'MOB1',
    dataIndex: 'mob1',
    width: 160,
  },
  {
    title: 'MOB2',
    dataIndex: 'mob2',
    width: 160,
  },
  {
    title: 'MOB3',
    dataIndex: 'mob3',
    width: 160,
  },
  {
    title: 'MOB4',
    dataIndex: 'mob4',
    width: 160,
  },
  {
    title: 'MOB5',
    dataIndex: 'mob5',
    width: 160,
  },
  {
    title: 'MOB6',
    dataIndex: 'mob6',
    width: 160,
  },
  {
    title: 'MOB7',
    dataIndex: 'mob7',
    width: 160,
  },
  {
    title: 'MOB8',
    dataIndex: 'mob8',
    width: 160,
  },
  {
    title: 'MOB9',
    dataIndex: 'mob9',
    width: 160,
  },
  {
    title: 'MOB10',
    dataIndex: 'mob10',
    width: 160,
  },
  {
    title: 'MOB11',
    dataIndex: 'mob11',
    width: 160,
  },
  {
    title: 'MOB12',
    dataIndex: 'mob12',
    width: 160,
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
