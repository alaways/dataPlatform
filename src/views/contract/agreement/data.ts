import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'
import { Tinymce } from '/@/components/Tinymce'
// const typeList = [
//   { label: '个人信息采集同意书', value: 1 },
//   { label: '个人信用信息查询及报送授权书', value: 2 },
//   { label: '租赁服务协议', value: 3 },
//   { label: '合并展示协议', value: 5 },
//   { label: '数字证书授权使用协议', value: 6 },
//   { label: '签字签章授权书-咸阳华瑞', value: 8 },
//   { label: '债权转让协议', value: 9 },
//   { label: '隐私协议', value: 10 },
//   { label: '用户注册协议', value: 11 },
//   { label: '淘宝隐私协议', value: 12 },
//   { label: '手机共享保电子保单', value: 20 },
//   { label: '手机共享保合作协议（投保协议）', value: 21 },
// ]

export const agreementColumns: BasicColumn[] = [
  {
    title: '协议名称',
    dataIndex: 'descs',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '内容',
    dataIndex: 'content',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'descs',
    label: '协议名称',
    component: 'Input',
    colProps: { span: 6 },
  },
]

export const userFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'Id',
    component: 'Input',
    show: false,
  },
  {
    field: 'descs',
    label: '协议名称',
    required: true,
    component: 'Input',
    colProps: { span: 23 },
  },
  {
    field: 'content',
    label: '内容',
    required: true,
    component: 'Input',
    colProps: { span: 23 },
    render: ({ model, field }) => {
      return h(Tinymce, {
        value: model[field],
        onChange: (value: string) => {
          model[field] = value
        },
      })
    },
  },
]
