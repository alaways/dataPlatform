import { isPre } from '/@/utils/is'
import { formatNumber } from '/@/utils/tool'

/**
 * 按产品形态统计
 */
export const shapeList = [
  '预付12期-iPhone 15 Pro 128G',
  // "预付6期-iPhone 15 Pro Max 256G"
]
/**
 * 汇总统计
 * type 1.数量 2.价格 3.百分比
 */
export const colorList = ['#d53023', '#4d8fd5', '#f50', '#2db7f5']
export function summaryList() {
  let list = [
    {
      title: '总在租订单金额',
      num: 0,
      key: 'orderTotalAmount',
      type: 2,
      show: true,
      span: 6,
    },
    {
      title: '首付总金额',
      num: 0,
      key: 'downTotalAmount',
      type: 2,
      show: true,
      span: 6,
    },
    {
      title: '账单回款总金额',
      num: 0,
      key: 'paidNoDownTotalAmount',
      type: 1,
      show: true,
      span: 6,
    },
    {
      title: '账单回款比例',
      num: 0,
      key: 'hkRate',
      type: 3,
      show: true,
      span: 6,
    },
    {
      title: '逾期订单数(时间≥5天)',
      num: 0,
      key: 'overDueOrderCountGe5',
      type: 1,
      show: true,
      span: 6,
    },
    {
      title: '逾期金额(时间≥5天)',
      num: 0,
      key: 'countOverdueAmountGe5',
      type: 1,
      show: true,
      span: 6,
    },
    {
      title: '逾期金额(时间≥30天)',
      num: 0,
      key: 'overdueAmountGe30',
      type: 1,
      show: true,
      span: 6,
    },
    {
      title: '逾期金额(时间≥180天)',
      num: 0,
      key: 'overdueAmountGe180',
      type: 1,
      show: true,
      span: 6,
    },
    {
      title: '逾期总金额',
      num: 0,
      key: 'penaltyTotalAmount',
      type: 1,
      span: 6,
      show: true,
    },
    // {
    //   title: '已到期订单数',
    //   num: 0,
    //   key: 'countExpireOrder',
    //   type: 1,
    //   show: true,
    // },
    // {
    //   title: '已到期总金额',
    //   num: 0,
    //   key: 'countExpireTotalAmount',
    //   type: 1,
    //   show: true,
    // },
    {
      title: '在租订单数',
      num: 0,
      key: 'onRentOrderCount',
      type: 1,
      span: 6,
      show: true,
    },
    {
      title: '提前买断订单',
      num: 0,
      key: 'buyOutOrderCount',
      type: 1,
      span: 6,
      show: true,
    },
    {
      title: '到期买断订单',
      num: 0,
      key: 'maturityCompletionOrder',
      type: 1,
      span: 6,
      show: true,
    },
    {
      title: '已买断订单数',
      color: '',
      num: 0,
      span: 6,
      key: 'settleOrderCount',
      type: 1,
      show: true,
    },
    {
      title: '尾期订单逾期率',
      num: 0,
      span: 6,
      key: 'lastBillOrderRate',
      type: 3,
      show: true,
      tooltip: '尾期订单逾期率 = 尾期到期逾期订单数/尾期到期订单数',
    },
    {
      title: '尾期金额逾期率',
      num: 0,
      span: 6,
      key: 'lastBillAmountRate',
      type: 3,
      show: true,
      tooltip: '尾期金额逾期率 = 尾期到期逾期金额/尾期到期订单总额',
    },
    {
      // 占位
      title: '',
      num: 0,
      span: 6,
      key: '',
      show: true,
    },
    {
      title: '订单逾期率(实时)',
      num: 0,
      key: 'yqRate',
      type: 3,
      show: true,
      span: 6,
      tooltip:
        '逾期订单(实时)/2期已到期的有效订单【有效订单指：租赁生效、已逾期、已买断、已完结订单】',
    },
    {
      title: '订单逾期率(时间≥5)',
      num: 0,
      key: 'overdueRate5',
      type: 3,
      span: 6,
      show: true,
      tooltip:
        '逾期订单(时间≥5天)/2期已到期的有效订单【有效订单指：租赁生效、已逾期、已买断、已完结订单】',
    },
    {
      title: '订单逾期率(时间≥15)',
      num: 0,
      span: 6,
      key: 'overdueRate15',
      type: 3,
      show: true,
      tooltip:
        '逾期订单(时间≥15天)/2期已到期的有效订单【有效订单指：租赁生效、已逾期、已买断、已完结订单】',
    },
    {
      title: '金额逾期率(实时)',
      num: 0,
      span: 6,
      key: 'sumAmountrRate',
      type: 3,
      show: true,
      tooltip:
        '逾期未还金额(实时)/2期到期的有效订单租金金额【1、排除首付金额;2、有效订单指：租赁生效、已逾期、已买断、已完结订单】',
    },
    {
      title: '金额逾期率(时间≥15天)',
      num: 0,
      span: 6,
      key: 'sumAmountrRate15',
      type: 3,
      show: true,
      tooltip:
        '逾期未还金额(时间≥15天)/2期到期的有效订单租金金额【1、排除首付金额;2、有效订单指：租赁生效、已逾期、已买断、已完结订单】',
    },
    {
      title: '金额逾期率(时间≥30天)',
      num: 0,
      span: 6,
      key: 'sumAmountrRate30',
      type: 3,
      show: true,
      tooltip:
        '逾期未还金额(时间≥30天)/2期到期的有效订单租金金额【1、排除首付金额;2、有效订单指：租赁生效、已逾期、已买断、已完结订单】',
    },
    {
      title: '金额逾期率(时间≥180天)',
      num: 0,
      span: 6,
      key: 'sumAmountrRate180',
      type: 3,
      show: true,
      tooltip:
        '逾期未还金额(时间≥180天)/2期到期的有效订单租金金额【1、排除首付金额;2、有效订单指：租赁生效、已逾期、已买断、已完结订单】',
    },
    {
      title: '逾期订单数量',
      num: 0,
      span: 6,
      key: 'overdueOrderCount',
      type: 1,
      show: true,
    },
  ]
  list = updateColors(list, colorList)
  return list
}

/**
 * 租期统计
 */
export const getTableColumns = () => {
  let table: BasicColumn = [
    {
      title: '租期',
      width: 100,
      dataIndex: 'periodNo',
    },
    {
      title: '总订单',
      // width: 100,
      dataIndex: 'orderCount',
      customRender: ({ text }) => formatNumber(text * 100 || 0),
    },
    {
      title: '到期订单',
      // width: 120,
      dataIndex: 'expOrderCount',
      customRender: ({ text }) => formatNumber(text * 100 || 0),
    },
    {
      title: '到期金额',
      // width: 120,
      dataIndex: 'expOrderTotalAmount',
      customRender: ({ text }) => formatNumber(text * 100 || 0, 2),
    },
    {
      title: '到期已还订单', // = 已收到金额（到期金额-逾期金额） + 首付（第6、9、12期要加上）
      // width: 120,
      dataIndex: 'expPaidOrderCount',
      customRender: ({ text }) => formatNumber(text * 100 || 0),
    },
    {
      title: '到期已还金额',
      // width: 120,
      dataIndex: 'expPaidOrderTotalAmount',
      customRender: ({ text }) => formatNumber(text * 100 || 0, 2),
    },
    {
      title: '到期未还订单', // 逾期订单
      // width: 120,
      dataIndex: 'expNoPaidOrderCount',
      customRender: ({ text }) => formatNumber(text * 100 || 0),
    },
    {
      title: '到期未还金额', // 逾期金额
      // width: 120,
      dataIndex: 'expNoPaidOrderTotalAmount',
      customRender: ({ text }) => formatNumber(text * 100 || 0, 2),
    },
    {
      title: '提前还订单数',
      // width: 120,
      dataIndex: 'prepaymentOrderCount',
      customRender: ({ text }) => formatNumber(text * 100 || 0),
    },
    {
      title: '提前已还金额',
      // width: 120,
      dataIndex: 'prepaymentOrderTotalAmount',
      customRender: ({ text }) => formatNumber(text * 100 || 0, 2),
    },
    {
      title: '未到期提前还订单数',
      // width: 120,
      dataIndex: 'UnexpiredOrderTotal',
      customRender: ({ record }) => {
        const text = record.prepaymentOrderCount - record.prepaymentExpOrderCount
        return text
      },
    },
    {
      title: '未到期提前还金额',
      // width: 120,
      dataIndex: 'UnexpiredOrderTotalAmount',
      customRender: ({ record }) => {
        const text = record.prepaymentOrderTotalAmount - record.prepaymentExpOrderTotalAmount
        return formatNumber(text * 100 || 0, 2)
      },
    },
    {
      title: '部分还款订单数',
      // width: 120,
      dataIndex: 'partialPayOrderCount',
      customRender: ({ text }) => formatNumber(text * 100 || 0),
    },
    {
      title: '部分还款金额',
      // width: 120,
      dataIndex: 'partialPayRepaidAmount',
      customRender: ({ text }) => formatNumber(text * 100 || 0, 2),
    },
    // {
    //   title: '订单总金额',
    //   dataIndex: 'orderTotalAmount',
    // },
    {
      title: '订单逾期率',
      width: 100,
      dataIndex: 'yql',
    },
    {
      title: '回款率', // 1-逾期率
      width: 100,
      dataIndex: 'hkRate',
    },
  ]

  // 如果是是pre环境就不显示
  if (isPre()) {
    table = table.filter(
      (v) =>
        ![
          '提前还订单数',
          '提前已还金额',
          '未到期提前还订单数',
          '未到期提前还金额',
          '部分还款订单数',
          '部分还款金额',
        ].includes(v.title),
    )
  }

  return table
}
function updateColors(originalArray, colorArray) {
  const len = colorArray.length
  const list = originalArray
    .filter((v) => v.show)
    .map((e, i) => {
      const index = parseInt(i / len) % len
      return {
        ...e,
        color: e.color || colorArray[index],
      }
    })
  return list
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'rentType',
    label: '维度',
    labelWidth: 50,
    component: 'Select',
    defaultValue: 2,
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '全部', value: '' },
        { label: '日付', value: 0 },
        { label: '周付', value: 1 },
        { label: '月付', value: 2 },
        { label: '十天', value: 4 },
      ],
    },
  },
  {
    field: 'spuType',
    label: '品类',
    component: 'Select',
    defaultValue: '',
    colProps: { span: 7 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '全部', value: '' },
        { label: '手机', value: 1 },
        { label: '电动车', value: 2 },
      ],
    },
  },
]
