import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'
const getText = (text) => {
  if (text == null || text == 0 || text == '0') return '-'
  return text + '%'
}
export const columns: BasicColumn[] = [
  {
    title: '时间（周/月）',
    dataIndex: 'monthWeek',
    width: 160,
    fixed: 'left',
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
     customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd1 = getText(record.farg1)
      return h('div', { style:{ fontWeight: fpd1 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'amountfpd3',
    dataIndex: 'amountfpd3',
    width: 120,
     customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd3 = getText(record.farg3)
      return h('div', { style:{ fontWeight: fpd3 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'amountfpd7',
    dataIndex: 'amountfpd7',
    width: 100,
     customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd7 = getText(record.farg7)
      return h('div', { style:{ fontWeight: fpd7 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'amountfpd15',
    dataIndex: 'amountfpd15',
    width: 130,
     customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd15 = getText(record.farg15)
      return h('div', { style:{ fontWeight: fpd15 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'amountfpd30',
    dataIndex: 'amountfpd30',
    width: 130,
     customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd30 = getText(record.farg30)
      return h('div', { style:{ fontWeight: fpd30 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'fpd1',
    dataIndex: 'fpd1',
    width: 100,
     customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd1 = getText(record.farg1)
      return h('div', { style:{ fontWeight: fpd1 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'fpd3',
    dataIndex: 'fpd3',
    width: 100,
     customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd3 = getText(record.farg3)
      return h('div', { style:{ fontWeight: fpd3 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'fpd7',
    dataIndex: 'fpd7',
    width: 100,
     customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd7 = getText(record.farg7)
      return h('div', { style:{ fontWeight: fpd7 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'fpd15',
    dataIndex: 'fpd15',
    width: 100,
    customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd15 = getText(record.farg15)
      return h('div', { style:{ fontWeight: fpd15 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'fpd30',
    dataIndex: 'fpd30',
    width: 120,
     customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd30 = getText(record.farg30)
      return h('div', { style:{ fontWeight: fpd30 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'farg1',
    dataIndex: 'farg1',
    width: 120,
     customRender: ({ text }) => {
      const cutText = getText(text)
      return h('div', { style:{ fontWeight: cutText == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'farg3',
    dataIndex: 'farg3',
    width: 120,
     customRender: ({ text }) => {
      const cutText = getText(text)
      return h('div', { style:{ fontWeight: cutText == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'farg7',
    dataIndex: 'farg7',
    width: 120,
     customRender: ({ text }) => {
      const cutText = getText(text)
      return h('div', { style:{ fontWeight: cutText == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'farg15',
    dataIndex: 'farg15',
    width: 120,
    customRender: ({ text }) => {
      const cutText = getText(text)
      return h('div', { style:{ fontWeight: cutText == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'farg30',
    dataIndex: 'farg30',
    width: 120,
    customRender: ({ text }) => {
      const cutText = getText(text)
      return h('div', { style:{ fontWeight: cutText == '100%' ? 'bold' : 'none'} },cutText)
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
        { label: '电池', value: '4' },
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
