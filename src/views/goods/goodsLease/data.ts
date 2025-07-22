import { FormSchema } from '/@/components/Form'
import { formatDecimal } from '/@/utils/tool'

const colProps1 = { xs: 20, ms: 20, md: 20, lg: 20, xl: 8, xxl: 8 }
export const schemas: FormSchema[] = [
  {
    label: '计价方式',
    field: 'type',
    component: 'RadioGroup',
    colProps: { span: 24 },
    required: true,
    defaultValue: 2,
  },
  {
    show: ({ values }) => values.type == 1,
    label: '可预付期数',
    field: 'prepayable',
    component: 'CheckboxGroup',
    defaultValue: [1],
    required: true,
    colProps: { span: 24 },
    componentProps: ({ formModel }) => {
      const options: any = []
      for (let i = 0; i < Number(formModel.totalTenancy); i++) {
        options.push({ label: `${i + 1}`, value: i + 1 })
      }
      return {
        options,
      }
    },
  },
  {
    label: '租赁类型',
    field: 'rentType',
    component: 'Select',
    colProps: { span: 8 },
    required: true,
  },
  {
    label: '',
    field: 'rentType2',
    component: 'Input',
    colProps: { span: 15 },
    slot: 'rentType2',
  },
  {
    show: ({ values }) => ![1, 4].includes(values.type),
    label: '首付租金',
    field: 'downPaymentRentAmount',
    component: 'InputNumber',
    helpMessage: '不含锁费/GPS、公证等,小程序支付或后台扫码支付时自动叠加计算得出。',
    colProps: colProps1,
    required: true,
  },
  {
    show: ({ values }) => values.type != 1,
    label: '月付租金',
    field: 'monthPayments',
    component: 'InputNumber',
    colProps: colProps1,
    required: true,
  },
  {
    label: '总租期',
    field: 'totalTenancy',
    component: 'InputNumber',
    required: true,
    colProps: colProps1,
  },
  {
    label: '总租金',
    field: 'totalAmount',
    component: 'InputNumber',
    required: true,
    colProps: colProps1,
  },
  {
    show: false,
    label: '商品押金',
    field: 'depositAmount',
    component: 'InputNumber',
    // required: true,
    colProps: colProps1,
    componentProps: {
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      step: 0.01,
      min: 0,
      addonBefore: '￥',
      addonAfter: '元',
    },
  },
  {
    label: '日付租金',
    field: 'dailyDeposit',
    component: 'InputNumber',
    colProps: colProps1,
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonBefore: '￥',
      addonAfter: '元/天',
    },
    show: false,
  },
  {
    label: '可预期天数选择',
    field: 'daySelect',
    component: 'Select',
    colProps: colProps1,
    ifShow: () => {
      // return values.rentType == 0
      return false
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: '全选', value: 'all' },
          { label: '7天', value: 7 },
          { label: '30天', value: 30 },
          { label: '60天', value: 60 },
          { label: '90天', value: 90 },
          { label: '120天', value: 120 },
          { label: '180天', value: 180 },
          { label: '270天', value: 270 },
        ],
        onChange: (e: any) => {
          const checkBox: any = []
          if (e) {
            if (e == 'all') {
              for (let i = 0; i < formModel.totalTenancy; i++) {
                checkBox.push(i + 1)
              }
            } else {
              const ft = formModel.totalTenancy < e ? formModel.totalTenancy : e
              for (let i = 0; i < ft; i++) {
                checkBox.push(i + 1)
              }
            }
          }
          formModel.prepayable = checkBox
        },
      }
    },
  },
  {
    show: false,
    label: '残留买断',
    field: 'residualDepreciation',
    component: 'InputNumber',
    // required: true,
    colProps: colProps1,
    componentProps: {
      step: 0.01,
      min: 0,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonBefore: '￥',
      addonAfter: '元',
    },
  },
  {
    label: '分期间隔',
    field: 'periodInterval',
    component: 'InputNumber',
    colProps: colProps1,
    componentProps: {
      addonAfter: '天',
    },
    show: false,
  },
  {
    label: '可预期反选',
    field: 'negationSelect',
    component: 'RadioGroup',
    defaultValue: 'front',
    colProps: colProps1,
    ifShow: () => {
      // return values.rentType == 0
      return false
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: '正选', value: 'front' },
          { label: '反选', value: 'rev' },
        ],
        onChange: (c: any) => {
          const checkBox: any = []
          if (!formModel.prepayable.length) return
          formModel.prepayable.forEach((e) => {
            checkBox.push(formModel.totalTenancy - e + 1)
          })
          if (c == 'rev') {
            formModel.prepayable = checkBox.reverse()
          } else {
            formModel.prepayable = checkBox
          }
        },
      }
    },
  },
  {
    label: '锁费/GPS',
    field: 'lockFee2',
    component: 'InputNumber',
    colProps: colProps1,
    required: true,
    defaultValue: 100,
    componentProps: {
      step: 0.01,
      min: 0,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonBefore: '￥',
      addonAfter: '元',
    },
  },
  {
    label: '公证费',
    field: 'gzFee',
    component: 'InputNumber',
    colProps: colProps1,
    required: true,
    defaultValue: 100,
    componentProps: {
      step: 0.01,
      min: 0,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonBefore: '￥',
      addonAfter: '元',
    },
  },
  {
    label: '押金',
    field: 'deposit',
    component: 'InputNumber',
    required: true,
    colProps: colProps1,
    componentProps: {
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      step: 0.01,
      min: 0,
      addonBefore: '￥',
      addonAfter: '元',
    },
  },
  {
    label: '逾期罚金',
    field: 'penaltyRate',
    component: 'InputNumber',
    colProps: colProps1,
    defaultValue: 1,
    componentProps: {
      disabled: true,
      addonBefore: '比例',
      addonAfter: '%/天',
    },
  },
  {
    show: false,
    label: '过期罚金',
    field: 'dailyPenalty',
    component: 'InputNumber',
    colProps: colProps1,
    componentProps: {
      step: 0.01,
      min: 0,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonBefore: '￥',
      addonAfter: '元/天',
    },
  },
  {
    show: ({ values }) => values.type == 4,
    label: 'D+',
    field: 'dayTn',
    component: 'InputNumber',
    required: true,
    defaultValue: 3,
    colProps: colProps1,
  },
]
