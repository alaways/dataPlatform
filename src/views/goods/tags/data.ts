import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'

export const columns: BasicColumn[] = [
  {
    title: '标签名称',
    dataIndex: 'name',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '排序',
    width: 120,
    dataIndex: 'sort',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '标签名称',
    component: 'Input',
    colProps: { span: 6 },
  },
]

export const userFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'createUid',
    label: '创建ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'status',
    label: '状态',
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '标签名称',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber',
    required: true,
    colProps: { span: 20 },
  },
]
