import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'
const getText = (text) => {
  if (text == null || text == 0 || text == '0') return '-'
  return text + '%'
}
export const columns: BasicColumn[] = [
  {
    title: '月份',
    dataIndex: 'monthWeek',
    width: 160,
    fixed: 'left',
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
  {
    title: 'amt-fpd1',
    dataIndex: 'amountfpd1',
    width: 100,
    customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd1 = getText(record.farg1)
      return h('div', { style:{ fontWeight: fpd1 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'amt-fpd4',
    dataIndex: 'amountfpd3',
    width: 100,
    customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd3 = getText(record.farg3)
      return h('div', { style:{ fontWeight: fpd3 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'amt-fpd15',
    dataIndex: 'amountfpd15',
    width: 100,
    customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd15 = getText(record.farg15)
      return h('div', { style:{ fontWeight: fpd15 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'amt-fpd30',
    dataIndex: 'amountfpd30',
    width: 100,
    customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd30 = getText(record.farg30)
      return h('div', { style:{ fontWeight: fpd30 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'per-fpd1',
    dataIndex: 'fpd1',
    width: 120,
    customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd1 = getText(record.farg1)
      return h('div', { style:{ fontWeight: fpd1 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'per-fpd4',
    dataIndex: 'fpd3',
    width: 120,
    customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd3 = getText(record.farg3)
      return h('div', { style:{ fontWeight: fpd3 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'per-fpd15',
    dataIndex: 'fpd15',
    width: 120,
    customRender: ({ text, record }) => {
      const cutText = getText(text)
      const fpd15 = getText(record.farg15)
      return h('div', { style:{ fontWeight: fpd15 == '100%' ? 'bold' : 'none'} },cutText)
    },
  },
  {
    title: 'per-fpd30',
    dataIndex: 'fpd30',
    width: 100,
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
