import { cloneDeep } from 'lodash-es'
import { FormSchema } from '/@/components/Form'
import { goodTypeList } from '/@/views/goods/goodsLeaseMore/components/utils'
import dayjs from 'dayjs'
function getGoodsLeaseOptions() {
  const goodsLeaseOptions: any = cloneDeep(goodTypeList)
  goodsLeaseOptions.unshift({ label: '全部', value: '' })
  return goodsLeaseOptions
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'spuType',
    label: '品类',
    component: 'Select',
    labelWidth: 50,
    defaultValue: '',
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '全部', value: '' },
        { label: '手机', value: 1 },
        { label: '电动车', value: 2 },
      ],
    },
  },
  {
    field: 'rentType',
    label: '租赁类型',
    component: 'Select',
    defaultValue: 2,
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: [{ label: '月付', value: 2 }],
    },
  },
  {
    field: 'goodsLeaseType',
    label: '租赁业务',
    component: 'Select',
    defaultValue: '',
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: getGoodsLeaseOptions(),
    },
  },
]

export const colors = [
  '#fff',
  // '#f8e3c5',
  '#f8e3c5',
  '#f8e3c5',
  '#f8e3c5',
  // '#e0f9e0',
  '#e0f9e0',
  '#e0f9e0',
  '#fffe92',
  '#fffe92',
  '#fffe92',
  '#fffe92',
]

// 标题
export function tableTitleColumns() {
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  return [
    { title: `日期: ${yesterday}`, description: '', key: 'title' },
    // { title: '已到期账单数', description: '', key: 'paid_bill_count' },
    { title: '已还账单数（整单)', description: '', key: 'paid_full_bill_count' },
    { title: '已还账单数（部分)', description: '', key: 'paid_partial_bill_count' },
    { title: '账单还款率', description: '', key: 'billRate' },
    // { title: '已到期账单金额(元)', description: '', key: 'exp_bill_amount' },
    { title: '已还账单金额(元)', description: '(注：整单+部分)', key: 'paid_bill_amount' },
    { title: '金额还款率', description: '', key: 'amountRate' },
    { title: '用户主动还款账单', description: '(注：整单+部分)', key: 'user_paid_bill_count' },
    { title: '用户主动还款金额(元)', description: '(注：整单+部分)', key: 'user_paid_bill_amount' },
    { title: '催收还款账单', description: '(注：整单+部分)', key: 'collects_paid_bill_count' },
    { title: '催收还款金额(元)', description: '(注：整单+部分)', key: 'collects_paid_bill_amount' },
  ]
}
