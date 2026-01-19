import { isPre } from '/@/utils/is'

/**
 * 申请数量
 */
export const applyList = [
  {
    title: '机审通过数量',
    content: '机审通过率',
    key: 'countRiskPassOrder',
    count: 0,
    scale: 0,
  },
  {
    title: '人审通过数量',
    content: '人审通过率',
    key: 'countAuditPassOrder',
    count: 0,
    scale: 0,
  },
  {
    title: '总付款数量',
    content: '下单率',
    key: 'countPaidOrder',
    count: 0,
    scale: 0,
  },
  {
    title: '签约数量',
    content: '签约率',
    key: 'countSignOrder',
    count: 0,
    scale: 0,
  },
  {
    title: '成交数量',
    content: '成交率',
    key: 'countDeliveryOrder',
    count: 0,
    scale: 0,
  },
]

/**
 * 租后订单
 */
export function leaseList() {
  let list = [
    {
      title: '正常还款订单数',
      content: '还款率',
      count: 0,
      scale: 0,
      key: 'normalOrder',
      color: '#57bedb',
    },
    {
      title: '逾期数量',
      content: '逾期率',
      count: 0,
      scale: 0,
      key: 'overDueOrder',
      color: '#d63023',
    },
    {
      title: '已到期数量',
      content: '完结率',
      count: 0,
      scale: 0,
      key: 'expOrder',
      color: '#5594df',
    },
    {
      title: '已结清数量',
      count: 0,
      key: 'countSettleOrder',
      color: '#d28a90',
    },
  ]

  // pre环境处理
  if (isPre()) {
    list = list.filter((v) => v.title != '已到期数量')
  }
  return list
}

export const duYesterdayList = [
  {
    title: '到期账单数',
    content: '',
    count: 0,
    scale: 0,
    key: 'expBillCount',
    color: '#57bedb',
  },
  {
    title: '到期账单金额',
    content: '',
    count: 0,
    scale: 0,
    key: 'expBillAmount',
    color: '#d63023',
  },
  {
    title: '已还账单数',
    content: '',
    count: 0,
    scale: 0,
    key: 'paidBillCount',
    color: '#5594df',
  },
  {
    title: '已还账单金额',
    count: 0,
    key: 'paidBillAmount',
    color: '#d28a90',
  },
  {
    title: '账单还款率',
    count: 0,
    key: 'paidCountScale',
    color: '#f59e0b',
  },
  {
    title: '账单金额还款率',
    count: 0,
    key: 'paidAmountScale',
    color: '#10b981',
  },
]
