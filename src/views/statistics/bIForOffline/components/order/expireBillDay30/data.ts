import { FormSchema } from '/@/components/Form'

export const searchFormSchema: FormSchema[] = [
  {
    field: 'countType',
    label: '维度',
    component: 'Select',
    labelWidth: 50,
    defaultValue: 5,
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '到期账单回款率', value: 5 },
        { label: '到期账单金额回款率', value: 4 },
      ],
    },
  },
]
