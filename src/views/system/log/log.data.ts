import { Tag } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'

export const columns: BasicColumn[] = [
  {
    title: '操作模块',
    dataIndex: 'logComment',
    width: 180,
  },
  {
    title: '操作方法',
    dataIndex: 'method',
    width: 150,
  },
  {
    title: '操作类型',
    dataIndex: 'methodName',
    width: 150,
    customRender: ({ text }) => {
      const status = {
        新增: 'success',
        修改: 'processing',
        删除: 'error',
      }
      return h(Tag, { color: status[text] || 'default' }, text)
    },
  },
  {
    title: '操作人',
    dataIndex: 'createBy',
    width: 100,
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    width: 120,
  },
  {
    title: '类名',
    dataIndex: 'className',
  },
  {
    title: '参数',
    dataIndex: 'params',
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '错误信息',
    dataIndex: 'logError',
  },
  {
    title: 'URL',
    dataIndex: 'url',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'createBy',
    label: '操作人',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'params',
    label: '参数',
    component: 'Input',
    colProps: { span: 8 },
  },
]
