import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'

export const columns: BasicColumn[] = [
  {
    title: '月份',
    dataIndex: 'monthWeek',
    width: 160,
    // customRender: ({ text }) => {
    //   return `(${text.indexOf('W') > -1 ? '周' : '月'}) ${text}`
    // },
  },
  {
    title: '用户等级',
    dataIndex: 'grade',
    width: 160,
  },
  {
    title: '占比',
    width: 130,
    dataIndex: 'ratio',
  },
  //  {
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
    title: 'amt-fpd1',
    dataIndex: 'fpd1',
    width: 100,
    customRender: ({ text }) => {
      return text + '%'
    },
  },
  {
    title: 'amt-fpd4',
    dataIndex: 'fpd3',
    width: 100,
    customRender: ({ text }) => {
      return text + '%'
    },
  },
  {
    title: 'amt-fpd15',
    dataIndex: 'fpd15',
    width: 100,
    customRender: ({ text }) => {
      return text + '%'
    },
  },
  {
    title: 'amt-fpd30',
    dataIndex: 'fpd30',
    width: 100,
    customRender: ({ text }) => {
      return text + '%'
    },
  },
  {
    title: 'per-fpd1',
    dataIndex: 'amountfpd1',
    width: 120,
    customRender: ({ text }) => {
      return text + '%'
    },
  },
  {
    title: 'per-fpd4',
    dataIndex: 'amountfpd3',
    width: 120,
    customRender: ({ text }) => {
      return text + '%'
    },
  },
  {
    title: 'per-fpd15',
    dataIndex: 'amountfpd15',
    width: 120,
    customRender: ({ text }) => {
      return text + '%'
    },
  },
  {
    title: 'per-fpd30',
    dataIndex: 'amountfpd30',
    width: 100,
    customRender: ({ text }) => {
      return text + '%'
    },
  },
]

export const searchFormSchema: FormSchema[] = [
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
]
