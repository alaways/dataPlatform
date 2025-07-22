import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { Tag } from 'ant-design-vue'
import { statusList } from '../../order/utils'
import { goodTypeList, rentTypeList } from '../../goods/goodsLeaseMore/components/utils'
import { getStoreList } from '/@/api/store'
import { receivingList } from '../../order/all/data'

export const statusSearch2 = [
  {
    value: '',
    label: '全部',
  },
  {
    value: 801,
    label: '租赁生效',
  },
  {
    value: 901,
    label: '已逾期',
  },
  {
    value: 1101,
    label: '已买断',
  },
  {
    value: 1201,
    label: '已完结',
  },
]

export const columns: BasicColumn[] = [
  {
    title: '商家名称',
    width: 130,
    dataIndex: 'merchantName',
    fixed: 'left',
  },
  {
    title: '订单编号',
    dataIndex: 'orderSn',
    width: 150,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      const find: any = statusList.find((v) => v.value == text)
      return h(Tag, { color: find?.color || '' }, () => find?.label)
    },
  },
  {
    title: '创建时间',
    width: 180,
    dataIndex: 'createTime',
  },
  {
    title: '计价方式',
    dataIndex: 'goodsLeaseType',
    width: 100,
    customRender: ({ text }) => {
      const find: any = goodTypeList.find((v) => v.value == text)
      return (find && find.label) || ''
    },
  },
  {
    title: '租赁类型',
    dataIndex: 'rentType',
    width: 100,
    customRender: ({ text }) => {
      if (text == 2) {
        return '月付'
      }
      const find = rentTypeList.find((v) => v.value == text)
      return find?.label || '-'
    },
  },
  {
    title: '货款(元)',
    dataIndex: 'modifyLoanMoney',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '总租金期数',
    dataIndex: 'totalPeriodsNum',
    width: 100,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '首付租金金额(元)',
    dataIndex: 'downPaymentRentAmount',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '首付租金期数',
    dataIndex: 'downPaymentRentPeriodsNum',
    width: 110,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '剩余租金期数',
    dataIndex: 'repayPeriodsNum',
    width: 110,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '首期摊销金额(元)',
    dataIndex: 'downPaymentAmortizeAmount',
    width: 130,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '月摊销金额(元)',
    dataIndex: 'monthlyAmortizeAmount',
    width: 120,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '分配商家',
    dataIndex: 'ifOrder',
    width: 230,
    align: 'left',
    customRender: ({ record }) => {
      const ifOrder = receivingList[record.ifOrder]
      const merchantName = record.merchantCode && record.merchantName ? record.merchantName : '-'
      return h('div', {}, [
        h('span', {}, `商家名称:${merchantName}`),
        h('br'),
        h('span', {}, `分配时间:${record.allocatTime || '-'}`),
        h('br'),
        h('span', {}, [
          h('span', {}, `接单状态:`),
          ifOrder ? h(Tag, { color: ifOrder?.color || '' }, () => ifOrder?.label) : '-',
        ]),
        h('br'),
        h('span', {}, `接单时间:${record.receivtTime || '-'}`),
      ])
    },
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'status',
    label: '订单状态',
    defaultValue: '',
    component: 'RadioButtonGroup',
    componentProps: { options: statusSearch2 },
    colProps: { span: 24 },
  },
  {
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'rentTypeList',
    label: '租赁类型',
    component: 'Select',
    componentProps: { options: rentTypeList },
    colProps: { span: 6 },
  },
  {
    field: 'goodsLeaseType',
    label: '计价方式',
    component: 'Select',
    componentProps: { options: goodTypeList },
    colProps: { span: 6 },
  },
  {
    field: 'merchantCode',
    label: '商家名称',
    component: 'ApiSelect',
    colProps: { span: 6 },
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getStoreList,
      params: { pageSize: 999999, limit: 999999 },
      resultField: 'list',
      labelField: 'merchantName',
      valueField: 'merchantCode',
    },
  },
  {
    field: 'time',
    label: '创建时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]
