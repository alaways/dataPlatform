import { FormSchema } from '/@/components/Form'

export const searchFormSchema: FormSchema[] = [
  {
    field: 'time',
    label: '日期时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 16 },
  },
]
