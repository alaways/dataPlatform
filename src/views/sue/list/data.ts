import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { Tinymce } from '/@/components/Tinymce'

export const columns: BasicColumn[] = [
  {
    title: '模版名称',
    dataIndex: 'name',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '最后修改时间',
    dataIndex: 'updateTime',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '标题',
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
    field: 'name',
    label: '模版名称',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    label: '正文',
    field: 'content',
    component: 'Input',
    colProps: { span: 20 },
    render: ({ model, field }) => {
      return h(Tinymce, {
        value: model[field],
        onChange: (value: string) => {
          model[field] = value
        },
      })
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'Input',
    colProps: { span: 20 },
  },
]
