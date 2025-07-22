import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { Tag } from 'ant-design-vue'
const statusList = [
  { label: '未完成', value: 0, color: 'orange' },
  { label: '已完成', value: 1, color: 'green' },
  { label: '失败', value: 2, color: 'red' },
]

export const columns: BasicColumn[] = [
  {
    title: '请求时间',
    dataIndex: 'createTime',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '文件名',
    dataIndex: 'fileName',
    width: 120,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '下载状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ text }) => {
      const find = statusList.find((v) => v.value == text)
      return h(Tag, { color: find?.color }, find?.label)
    },
  },
]
