/**
 * 平台
 */
export const platform = [
  { value: '', label: '全平台' },
  { value: 1, label: 'IOS' },
  { value: 2, label: 'Android' },
  { value: 3, label: 'H5' },
  { value: 4, label: '微信小程序' },
  { value: 5, label: '支付宝小程序' },
  { value: 6, label: '线下' },
]
/**
 * 全部订单的筛选状态
 */
export const statusSearch = [
  {
    value: '',
    label: '全部',
  },
  {
    value: 103,
    label: '机审拒绝',
  },
  {
    value: 201,
    label: '待审核',
  },
  {
    value: 202,
    label: '人审拒绝',
  },
  {
    value: 203,
    label: '用户取消',
  },
  {
    value: 401,
    label: '待付款',
  },
  {
    value: 501,
    label: '待发货',
  },
  {
    value: 801,
    label: '租赁生效',
  },
  {
    value: 901,
    label: '已逾期',
  },
  {
    value: 902,
    label: '续期生效中',
  },
  {
    value: 1101,
    label: '已买断',
  },
  {
    value: 1201,
    label: '已完结',
  },
  {
    value: 1301,
    label: '取消订单',
  },
]

/**
 * 所有订单状态
 */
export const statusList = [
  {
    value: 101,
    label: '待风控',
    color: 'blue',
  },
  {
    value: 102,
    label: '用户取消风控',
    color: 'default',
  },
  {
    value: 103,
    label: '机审拒绝',
    color: 'red',
  },
  {
    value: 201,
    label: '待审核',
    color: 'orange',
  },
  {
    value: 202,
    label: '人审拒绝',
    color: 'red',
  },
  {
    value: 203,
    label: '用户取消审核',
    color: 'default',
  },
  {
    value: 301,
    label: '待签约',
    color: 'blue',
  },
  {
    value: 302,
    label: '用户取消签约',
    color: 'default',
  },
  {
    value: 303,
    label: '签约取消',
    color: 'default',
  },
  {
    value: 401,
    label: '待支付',
    color: '#108ee9',
  },
  {
    value: 402,
    label: '用户取消付押',
    color: 'default',
  },
  {
    value: 403,
    label: '待押取消',
    color: 'default',
  },
  {
    value: 501,
    label: '待发货',
    color: 'orange',
  },
  {
    value: 502,
    label: '已发货',
    color: 'blue',
  },
  {
    value: 601,
    label: '待收货',
    color: 'blue',
  },
  {
    value: 701,
    label: '退款中',
    color: 'orange',
  },
  {
    value: 702,
    label: '退款失败',
    color: 'red',
  },
  {
    value: 801,
    label: '租赁生效中',
    color: 'green',
  },
  {
    value: 901,
    label: '已逾期',
    color: 'red',
  },
  {
    value: 902,
    label: '续期生效中',
    color: 'green',
  },
  {
    value: 903,
    label: '待归还',
    color: 'red',
  },
  {
    value: 904,
    label: '归还中',
    color: 'orange',
  },
  {
    value: 905,
    label: '验机中',
    color: 'orange',
  },
  {
    value: 906,
    label: '待赔付',
    color: 'orange',
  },
  {
    value: 1001,
    label: '已退款',
    color: 'purple',
  },
  {
    value: 1002,
    label: '退款失败',
    color: 'red',
  },
  {
    value: 1101,
    label: '已买断',
    color: 'green',
  },
  {
    value: 1201,
    label: '已完结',
    color: 'green',
  },
  {
    value: 1301,
    label: '取消订单',
    color: 'default',
  },
]

/**
 * 从账单列表中获取 首付 和 押金
 */
export const handleBillList = (list: any) => {
  let firstPay = 0, // 首付
    deposit = 0 // 押金
  if (list) {
    /**
     * 处理获取首次支付金额
     * sourceType 0首付 1押金（押金也可能在下面）
     * type 0押金 1增值服务 2租金
     */
    const dlist = list.filter((v) => [0, 1, 2].some((s) => s == v.type))
    dlist.forEach((item) => {
      if (item.sourceType == 1) {
        if (item.type == 0) deposit += item.repayAmount
      } else {
        firstPay += item.repayAmount
        if (item.type == 0) {
          deposit += item.repayAmount
        }
      }
    })
  }
  return {
    firstPay,
    deposit,
  }
}
