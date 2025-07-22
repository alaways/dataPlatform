import { uploadApi } from '/@/api/sys/upload'
import { FormSchema } from '/@/components/Form'

export const schemas: FormSchema[] = [
  {
    label: '订单Id',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '上传材料',
    field: 'prosecuteFiles',
    component: 'Upload',
    colProps: { span: 22 },
    componentProps: {
      api: uploadApi,
      showPreviewProps: true,
    },
  },
]
