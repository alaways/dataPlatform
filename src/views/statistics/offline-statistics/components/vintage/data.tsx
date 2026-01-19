import { BasicColumn, FormSchema } from '/@/components/Table'

export const columns: BasicColumn[] = [
  {
    title: '',
    dataIndex: '',
  },
]
const isPro = location.href.indexOf('pro') > -1
export const searchFormSchema: FormSchema[] = [
  {
    field: 'overdueDays',
    label: '筛选范围',
    labelWidth: 64,
    defaultValue: 3,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { label: '3+', value: 3 },
        { label: '30+', value: 30 },
        { label: '60+', value: 60 },
        { label: '90+', value: 90 },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'rentType',
    label: '维度',
    component: 'Select',
    labelWidth: 64,
    defaultValue: 2,
    colProps: { span: 3 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '全部', value: '' },
        { label: '日付', value: 0 },
        { label: '周付', value: 1 },
        { label: '月付', value: 2 },
        { label: '十天', value: 4 },
      ],
    },
  },
  {
    field: 'spuType',
    label: '品类',
    labelWidth: 50,
    component: 'Select',
    defaultValue: '',
    colProps: { span: 3 },
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
    field: 'historyAttachment',
    label: '数据对比',
    fields: ['historyAttachment2'],
    component: 'DatePicker',
    colProps: { span: 10 },
  },
  {
    show: false,
    field: 'historyAttachment2',
    label: '对比日期',
    component: 'Input',
  },
  {
    field: 'merchantCode',
    label: '商家',
    component: 'Select',
    colProps: { span: 6 },
    defaultValue: 'All',
    componentProps: {
      options: [
        {
          label: '全部',
          value: 'All',
        },
        {
          label: '其他',
          value: 'Other',
        },
        {
          label: isPro ? '云享租' : 'YXZ',
          value: 'YXZ',
        },
      ],
    },
  },
]

export const searchAmountFormSchema: FormSchema[] = [
  {
    field: 'pointType',
    label: '订单总租金是否含首付',
    defaultValue: 2,
    labelWidth: 148,
    component: 'Select',
    componentProps: {
      allowClear: false,
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 2 },
      ],
    },
    colProps: { span: 5 },
  },
  {
    field: 'overdueDays',
    label: '筛选范围',
    labelWidth: 90,
    defaultValue: 3,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { label: '3+', value: 3 },
        { label: '30+', value: 30 },
        { label: '60+', value: 60 },
        { label: '90+', value: 90 },
      ],
    },
    colProps: { span: 7 },
  },
  {
    field: 'rentType',
    label: '维度',
    component: 'Select',
    defaultValue: 2,
    colProps: { span: 5 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '全部', value: '' },
        { label: '日付', value: 0 },
        { label: '周付', value: 1 },
        { label: '月付', value: 2 },
        { label: '十天', value: 4 },
      ],
    },
  },
  {
    field: 'spuType',
    label: '品类',
    labelWidth: 50,
    component: 'Select',
    defaultValue: '',
    colProps: { span: 5 },
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
    field: 'historyAttachment',
    label: '数据对比',
    fields: ['historyAttachment2'],
    component: 'DatePicker',
    colProps: { span: 10 },
  },
  {
    show: false,
    field: 'historyAttachment2',
    label: '对比日期',
    component: 'Input',
  },
  {
    field: 'merchantCode',
    label: '商家',
    component: 'Select',
    colProps: { span: 6 },
    defaultValue: 'All',
    componentProps: {
      options: [
        {
          label: '全部',
          value: 'All',
        },
        {
          label: '其他(排除云享租)',
          value: 'Other',
        },
        {
          label: '其他(排除锦州月付)',
          value: 'JZYFOther',
        },
        {
          label: isPro ? '云享租' : 'YXZ',
          value: 'YXZ',
        },
      ],
    },
  },
]
