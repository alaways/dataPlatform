import { FormSchema } from '/@/components/Form'

export const formSchema: FormSchema[] = [
  {
    show: false,
    label: '订单Id',
    field: 'orderId',
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    show: false,
    label: '跟进人',
    field: 'followBy',
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    show: false,
    label: '类型',
    field: 'type', // 1-催收 2-订单
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    ifShow: ({ values }) => values.type == 1,
    label: '催收状态',
    field: 'status',
    component: 'RadioButtonGroup',
    colProps: { span: 22 },
    required: true,
  },
  {
    ifShow: ({ values }) => values.type == 1,
    label: '催收记录',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 22 },
  },
  {
    ifShow: ({ values }) => values.type == 2,
    label: '备注记录',
    field: 'remark',
    required: true,
    component: 'InputTextArea',
    colProps: { span: 22 },
  },
  {
    label: '协商还款时间',
    field: 'repayDate',
    component: 'DatePicker',
    colProps: { span: 22 },
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
    },
  },
]
