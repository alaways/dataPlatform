import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { Tinymce } from '/@/components/Tinymce'

export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    customRender: ({ record }) => `${record.userName}(${record.uid})材料` || '-',
  },
  {
    title: '订单编号',
    dataIndex: 'orderSn',
  },
  {
    title: '用户信息',
    dataIndex: 'userName',
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, `用户名称: ${record.userName}(${record.uid})` || '-'),
        h('br'),
        h('span', {}, '手机号码: ' + record.phone || '-'),
        h('br'),
        h('span', {}, '身份证: ' + record.idCard || '-'),
      ])
    },
  },
  {
    title: '生成时间',
    dataIndex: 'updateTime',
    width: 180,
    customRender: ({ text, record }) => text || record.createTime || '-',
  },
  {
    title: '状态',
    dataIndex: 'contractStatus',
    width: 180,
    customRender: ({ text }) =>
      text == 0 ? '处理中' : text == 1 ? '处理成功' : text == 2 ? '处理失败' : '-',
  },
]
export const searchFormSchema: FormSchema[] = [
  {
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'userName',
    label: '用户名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'idCard',
    label: '身份证',
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
