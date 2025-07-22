import { BasicColumn } from '/@/components/Table'

export const columns: BasicColumn[] = [
  {
    title: '平台名称',
    dataIndex: 'label',
    editRow: true,
    editRule: true,
  },
  {
    title: '端号',
    dataIndex: 'field',
    editRow: true,
    editRule: true,
  },
  {
    // 字段要和支付类型一样
    title: '所属小程序',
    dataIndex: 'applet',
    editRow: true,
    editRule: true,
  },
]
