// 线形图
export interface LineParams {
  days: number
  type: string // 用户: USRE_COUNT_EVERY_DAY4_ECARD , 订单: ORDER_COUNT_EVERY_DAY4_ECARD
}

export interface OrederLineItem {
  expOrderCount: number //到期订单数
  newApplicantOrderCount: number // 新申请订单数
  newSignOrderCount: number // 新签约订单数
  overdueOrderCount: number // 逾期订单数
  repaidOrderCount: number // 已还款订单数
  signOrderCount: number // 签约订单数
}

// 地图
interface provinceItem {
  ipCountry?: string // 国家
  ipProvince: string // 省份
  count: string // 数量
  amount: string // 金额
}
