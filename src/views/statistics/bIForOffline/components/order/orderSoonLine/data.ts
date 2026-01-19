import { FormSchema } from '/@/components/Form'
export const searchFormSchema: FormSchema[] = [
  {
    field: 'countType',
    label: '维度',
    component: 'Select',
    labelWidth: 50,
    defaultValue: 1,
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '即将到期账单数', value: 1 },
        { label: '即将到期金额', value: 2 },
        { label: '即将到期订单数', value: 3 },
      ],
    },
  },
  {
    field: 'statusList',
    label: '状态',
    component: 'Select',
    defaultValue: '',
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '全部', value: '' },
        { label: '逾期', value: 901 },
        { label: '未有逾期', value: 801 },
        { label: '已完结', value: 1201 },
        { label: '已买断', value: 1101 },
      ],
    },
  },
  {
    field: 'spuType',
    label: '品类',
    component: 'Select',
    defaultValue: 1,
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
      options: [
        { label: '全部', value: '' },
        { label: '月付', value: 2 },
        { label: '周付', value: 1 },
      ],
    },
  },
  {
    ifShow: ({ values }) => values.countType == 2,
    // 总金额
    field: 'amount',
    label: '',
    labelWidth: 0,
    component: 'Input',
    colProps: { span: 18 },
    slot: 'amount',
  },
]
