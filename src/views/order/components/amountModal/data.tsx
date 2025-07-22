import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { Tag } from 'ant-design-vue'
import { formatNumber } from '/@/utils/tool'

const state: any = {
  0: { title: '未生效', color: 'volcano' },
  1: { title: '待支付', color: 'red' },
  2: { title: '逾期未支付', color: 'red' },
  3: { title: '逾期已支付', color: 'green' },
  4: { title: '已支付', color: 'green' },
  5: { title: '已取消', color: '' },
}

// 已付总统计表格
export const paidCountColumns: BasicColumn[] = [
  {
    title: '签约总金额（元）',
    dataIndex: 'totalMoney',
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '签约金额明细',
    dataIndex: 'totalRentAmount',
    customRender: ({ record }) => {
      return h('div', {}, [
        h('span', {}, `订单总租金: ${formatNumber(record.totalRentAmount, 2) || '-'}`),
        h('br'),
        h('span', {}, `增值服务: ${formatNumber(record.valueAddedServiceAmount, 2) || '-'}`),
      ])
    },
  },
  {
    title: '首次支付金额（元）',
    dataIndex: 'downPaymentMoney',
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '首付租金（元）',
    dataIndex: 'downPaymentRentAmount',
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '首付租期数',
    dataIndex: 'periodNo',
    width: 100,
    customRender: ({ text }) => `${text}期` || '-',
  },
  {
    title: '其他费用（元）',
    dataIndex: 'valueAddedServiceAmount',
    customRender: ({ record }) => {
      return h('div', {}, [
        h('span', {}, `增值服务: ${formatNumber(record.valueAddedServiceAmount, 2) || '-'}`),
      ])
    },
  },
  {
    title: '支付时间',
    dataIndex: 'payTime',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
]

// 已付表格
export const paidColumns: BasicColumn[] = [
  {
    title: '账单信息',
    dataIndex: 'billItemSn',
    width: 230,
    customRender: ({ record }) => {
      return h('div', {}, [
        h('span', {}, `账单ID: ${record.billId || '-'}`),
        h('br'),
        h('span', {}, `账单编号: ${record.billItemSn || '-'}`),
        h('br'),
        h('span', {}, `创建时间: ${record.createTime || '-'}`),
      ])
    },
  },
  {
    title: '是否首付',
    dataIndex: 'sourceType',
    width: 80,
    customRender: ({ text }) =>
      h(Tag, { color: text == 0 ? 'green' : 'red' }, text == 0 ? '是' : '否'),
  },
  {
    title: '租期',
    dataIndex: 'periodNo',
    width: 80,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '账单金额（元）',
    dataIndex: 'repayAmount',
    width: 120,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '到期日',
    dataIndex: 'repayDate',
    width: 130,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '还款状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text, record }) => {
      if (record.repayAmount - record.repaidAmount == 0) {
        text = 4
      }
      if (text || text == 0) {
        return h(Tag, { color: state[text].color }, state[text].title)
      }
      return '-'
    },
  },
  {
    title: '逾期信息',
    dataIndex: 'overdueDays',
    width: 180,
    customRender: ({ record }) => {
      const money = record.repaidPenaltyAmount + record.penaltyAmount
      return h('div', {}, [
        h('span', {}, `逾期天数: ${record.overdueDays || '-'}`),
        h('br'),
        h('span', {}, `逾期罚金: ${formatNumber(money, 2) || '-'}`),
      ])
    },
  },
  {
    title: '应还/已还金额',
    dataIndex: 'repaidAmount',
    width: 180,
    customRender: ({ record }) => {
      return h('div', {}, [
        h('span', {}, `应还金额: ${formatNumber(record.repayAmount, 2) || '-'}`),
        h('br'),
        h('span', {}, `已还金额: ${formatNumber(record.repaidAmount, 2) || '-'}`),
      ])
    },
  },
  {
    title: '还款时间',
    dataIndex: 'payDate',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
]
