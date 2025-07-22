import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'

export const columns: BasicColumn[] = [
  {
    title: '查询时间',
    dataIndex: 'createTime',
  },
  {
    title: '姓名',
    dataIndex: 'userName',
  },
  {
    title: '身份证',
    dataIndex: 'idCard',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
  },
  {
    title: '地区',
    dataIndex: 'province',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'userName',
    label: '姓名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'mobile',
    label: '手机号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'idCard',
    label: '身份证',
    component: 'Input',
    colProps: { span: 8 },
  },
]
