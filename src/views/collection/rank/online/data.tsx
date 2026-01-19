import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'

export const columns: BasicColumn[] = [
  {
    title: '姓名',
    dataIndex: 'userName',
    width: 130,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '即将到期-系统分配',
    dataIndex: 'eq0Count',
    width: 160,
    sorter: true,
    customRender: ({ text }) => text || '0',
  },
  {
    title: '即将到期-已回款',
    dataIndex: 'eq0CompleteCount',
    width: 150,
    sorter: true,
    customRender: ({ text }) => text || '0',
  },
  {
    title: '即将到期-完成率',
    dataIndex: 'eq0CompleteCountRate',
    width: 150,
    sorter: true,
    customRender: ({ record }) => {
      if (Number(record.eq0CompleteCount) && Number(record.eq0Count)) {
        const rate = Number(record.eq0CompleteCount) / Number(record.eq0Count)
        return `${Number(rate * 100).toFixed(2)}%`
      }
      return `0%`
    },
  },
  {
    title: '未处理订单',
    dataIndex: 'eq0NotCompleteCount',
    width: 130,
    sorter: true,
    customRender: ({ text }) => text,
  },
  {
    title: '订单回款金额',
    dataIndex: 'eq0RepaidAmount',
    width: 130,
    sorter: true,
    customRender: ({ text }) => formatNumber(text, 2) || '0',
  },
  {
    title: '催收订单-总量',
    dataIndex: 'taskCount',
    width: 130,
    customRender: ({ text }) => text || '0',
  },
  {
    title: '催收订单-系统分配',
    dataIndex: 'sysTaskCount',
    width: 160,
    sorter: true,
    customRender: ({ text }) => text || '0',
  },
  {
    title: '催收订单-手领',
    dataIndex: 'userTaskCount',
    width: 130,
    sorter: true,
    customRender: ({ text }) => text || '0',
  },
  {
    title: '催收回款订单',
    dataIndex: 'taskCompleteCount',
    width: 130,
    sorter: true,
    customRender: ({ text }) => text || '0',
  },
  {
    title: '催收回款金额',
    dataIndex: 'repaidAmount',
    width: 130,
    sorter: true,
    customRender: ({ text }) => formatNumber(text, 2) || '0',
  },
  {
    title: '未催收订单',
    dataIndex: 'taskNotCompleteCount',
    width: 130,
    sorter: true,
    customRender: ({ text }) => text,
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'time',
    label: '时间筛选',
    component: 'DatePickerSelect',
    colProps: { span: 8 },
  },
  // {
  //   field: 'amount',
  //   label: '催收回款金额',
  //   component: 'Input',
  //   colProps: { span: 8 },
  // },
]
