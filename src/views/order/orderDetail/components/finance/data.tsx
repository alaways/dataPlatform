import { DescItem } from '/@/components/Description/index'
import { formatDecimal, formatNumber } from '/@/utils/tool'
import { cityArray } from '/@/utils/cityData'
import { cloneDeep } from 'lodash-es'
import { FormSchema } from '/@/components/Form'

const cityDatas = cloneDeep(cityArray)
cityDatas.forEach((v) => {
  v.children = v.children.map((c) => {
    return {
      ...c,
      children: [],
    }
  })
})

export const financeSchema: DescItem[] = [
  {
    field: 'loanMoney',
    label: '货款',
    render: (value) => formatNumber(value, 2) || '-',
  },
  {
    field: 'royaltyFee',
    label: '业务员提成',
    render: (value) => formatNumber(value, 2) || '-',
  },
  {
    field: 'rebateFee',
    label: '商家返点',
    render: (value) => formatNumber(value, 2) || '-',
  },
  {
    field: 'city',
    label: '所属政策地区',
    render: (value, data) => `${data.province || ''}${value || ''}` || '-',
  },
  {
    field: '',
    label: '',
  },
  {
    field: '',
    label: '',
  },
  {
    field: 'mode',
    label: '付款方式',
    render: () => '银行卡',
  },
  {
    field: 'realName',
    label: '姓名',
    render: (value) => value || '-',
  },
  {
    field: 'bankCardNo',
    label: '账户',
    render: (value) => value || '-',
  },
  {
    field: 'bankName',
    label: '开户银行',
    render: (value) => value || '-',
  },
]

export const financeNewSchema: DescItem[] = [
  {
    field: 'modifyLoanMoney',
    label: '货款',
    render: (value) => formatNumber(value, 2) || '-',
  },
  {
    field: 'modifyRoyaltyFee',
    label: '业务员提成',
    render: (value) => formatNumber(value, 2) || '-',
  },
  {
    field: 'modifyRebateFee',
    label: '商家返点',
    render: (value) => formatNumber(value, 2) || '-',
  },
]
/**
 * 审核信息 - 填写信息
 */
export const examineFormSchema: FormSchema[] = [
  {
    label: 'ID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: 'orderId',
    field: 'orderId',
    component: 'Input',
    show: false,
  },
  // {
  //   label: '订单归属地区',
  //   field: 'ipCity',
  //   required: true,
  //   colProps: { span: 22 },
  //   component: 'Cascader',
  //   componentProps: { options: cityDatas },
  // },
  {
    label: '货款',
    field: 'loanMoney',
    required: true,
    colProps: { span: 22 },
    component: 'InputNumber',
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  {
    label: '业务员提成',
    field: 'royaltyFee',
    required: true,
    colProps: { span: 22 },
    component: 'InputNumber',
    defaultValue: 300,
    componentProps: {
      // disabled: true,
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  {
    label: '商家返点',
    field: 'rebateFee',
    required: true,
    colProps: { span: 22 },
    component: 'InputNumber',
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  {
    label: '所属政策地区',
    field: 'city',
    required: true,
    colProps: { span: 22 },
    component: 'Cascader',
    componentProps: { options: cityDatas },
  },
  // {
  //   label: '付款方式:',
  //   field: 'mode',
  //   colProps: { span: 22 },
  //   component: 'Input',
  //   slot: 'mode',
  // },
  // {
  //   label: '姓名',
  //   field: 'realName',
  //   colProps: { span: 22 },
  //   required: true,
  //   component: 'Input',
  // },
  // {
  //   label: '付款账户',
  //   field: 'bankCardNo',
  //   colProps: { span: 22 },
  //   required: true,
  //   component: 'Input',
  // },
  // {
  //   label: '开户银行',
  //   field: 'bankName',
  //   colProps: { span: 22 },
  //   required: true,
  //   component: 'Input',
  // },
]
