import { BasicColumn } from '/@/components/Table'

export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'label',
    editRow: true,
    editRule: true,
  },
  {
    title: '英文名',
    helpMessage: '唯一标识,不要随意更改,更改后必须去支付设置提交配置',
    dataIndex: 'field',
    editRow: true,
    editRule: true,
  },
]
