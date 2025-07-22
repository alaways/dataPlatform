import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import dayjs from 'dayjs'
import { Tag } from 'ant-design-vue'

export const columns: BasicColumn[] = [
  {
    title: '订单编号',
    dataIndex: 'orderSn',
    width: 150,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '用户信息',
    dataIndex: 'nickName',
    width: 150,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, record.nickName || '-'),
        h('br'),
        h('span', {}, record.phone || '-'),
      ])
    },
  },
  {
    title: '周期代扣状态',
    dataIndex: 'agreementStatus',
    width: 80,
    customRender: ({ text }) => {
      if (!text && text != 0) {
        return h(Tag, { color: 'gray' }, '空')
      }
      return h(Tag, { color: text == 1 ? 'green' : 'red' }, text == 1 ? '正常' : '关闭')
    },
  },
  {
    title: '下期扣款日期',
    dataIndex: 'nextRepayDate',
    width: 180,
    customRender: ({ text }) => {
      return text ? dayjs(text).format('YYYY-MM-DD hh:mm:ss') : '-'
    },
  },
  {
    title: '扣款状态',
    dataIndex: 'lastTradeStatus',
    width: 80,
    customRender: ({ text }) => {
      if (!text && text != 0) {
        return h(Tag, { color: 'gray' }, '空')
      }
      return h(Tag, { color: text == 1 ? 'green' : 'red' }, text == 1 ? '成功' : '失败')
    },
  },
  {
    title: '最新扣款时间',
    dataIndex: 'lastPayTime',
    width: 180,
  },
  {
    title: '扣款失败原因',
    dataIndex: 'lastResponseMap',
    width: 180,
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
    field: 'agreementStatus',
    label: '周期代扣状态',
    labelWidth: 150,
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '空', value: -99 },
        { label: '正常', value: 1 },
        { label: '关闭', value: 0 },
      ],
    },
  },
  {
    field: 'lastTradeStatus',
    label: '扣款状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '成功', value: 1 },
        { label: '失败', value: 0 },
      ],
    },
  },
]
