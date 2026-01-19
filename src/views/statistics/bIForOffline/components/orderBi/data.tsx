import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
const getText = (text) => {
  if (text == null || text == 0 || text == '0') return '-'
  return text + '%'
}
export const columns: BasicColumn[] = [
  {
    title: '时间（周/月）',
    dataIndex: 'monthWeek',
    width: 160,
    customRender: ({ text }) => {
      return `(${text.indexOf('W') > -1 ? '周' : '月'}) ${text}`
    },
  },
  {
    title: '订单数',
    width: 130,
    dataIndex: 'count',
  },
  {
    title: '总签约价',
    dataIndex: 'totalAmount',
    width: 140,
    customRender: ({ text }) => {
      return text + '元'
    },
  },
  // {
  //   title: '排除城市',
  //   width: 130,
  //   dataIndex: 'ipCityList',
  // },
  // {
  //   title: '排除业务员',
  //   width: 130,
  //   dataIndex: 'salesPersonNameList',
  // },
  // {
  //   title: '排除商户',
  //   width: 130,
  //   dataIndex: 'storeMerchantNameList',
  // },
  {
    title: 'amountfpd1',
    dataIndex: 'amountfpd1',
    width: 120,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'amountfpd3',
    dataIndex: 'amountfpd3',
    width: 120,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'amountfpd7',
    dataIndex: 'amountfpd7',
    width: 100,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'amountfpd15',
    dataIndex: 'amountfpd15',
    width: 130,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'amountfpd30',
    dataIndex: 'amountfpd30',
    width: 130,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'fpd1',
    dataIndex: 'fpd1',
    width: 100,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'fpd3',
    dataIndex: 'fpd3',
    width: 100,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'fpd7',
    dataIndex: 'fpd7',
    width: 100,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'fpd15',
    dataIndex: 'fpd15',
    width: 100,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'fpd30',
    dataIndex: 'fpd30',
    width: 120,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'farg1',
    dataIndex: 'farg1',
    width: 120,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'farg3',
    dataIndex: 'farg3',
    width: 120,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'farg7',
    dataIndex: 'farg7',
    width: 120,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'farg15',
    dataIndex: 'farg15',
    width: 120,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
  {
    title: 'farg30',
    dataIndex: 'farg30',
    width: 120,
    customRender: ({ text }) => {
      return getText(text)
    },
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'queryType',
    label: '周期类型',
    component: 'Select',
    defaultValue: 'MONTH',
    componentProps: {
      options: [
        { label: '按周', value: 'WEEK' },
        { label: '按月', value: 'MONTH' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'spuType',
    label: '品类',
    component: 'Select',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '手机', value: '1' },
        { label: '电动车', value: '2' },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'ipcity',
    label: '城市',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'storeMerchantName',
    label: '商户名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'salesPersonName',
    label: '业务员名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  // {
  //   field: 'ipCity',
  //   label: '排除',
  //   component: 'Input',
  //   colProps: { span: 6 },
  // },
]
