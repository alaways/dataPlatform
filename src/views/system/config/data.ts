import { Tag } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'

export const columns: BasicColumn[] = [
  {
    title: '配置名称',
    dataIndex: 'name',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '配置字段',
    dataIndex: 'label',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '配置值',
    dataIndex: 'value',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      const color = text ? 'green' : 'red'
      const txt = text ? '开启' : '关闭'
      return h(Tag, { color }, txt)
    },
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '配置名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
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
    field: 'name',
    label: '配置名称',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'label',
    label: '配置字段',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'value',
    label: '配置值',
    component: 'InputTextArea',
    colProps: { span: 20 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioGroup',
    colProps: { span: 20 },
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 20 },
  },
]
