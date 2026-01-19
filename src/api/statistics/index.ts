import { defHttpOffline, defHttpOnline, defHttp } from '/@/utils/http/axios'
// 获取 曲线图 30天内的数据
export const orderDataLineChart = async (params) => {
  return defHttpOffline.get(
    { url: `/v2/statistics/new/orderDataLineChart`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
// 获取线下 数据汇总
export const getBIwMain = async (params) => {
  return defHttpOffline.get(
    { url: `/v2/statistics/new/bi/main`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
// 获取线下 数据汇总
export const getBIwMainForOnline = async (params) => {
  return defHttpOnline.get(
    { url: `/v2/statistics/new/bi/main`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
// 获取 曲线图 30天内的数据
export const orderDataLineChartByMayi = async (params) => {
  return defHttpOnline.get(
    { url: `/v2/statistics/new/orderDataLineChart`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
// 获取 曲线图 30天内的数据
export const orderDataLineChartByApi = async (params) => {
  return defHttpOffline.get(
    { url: `/v2/statistics/new/orderDataLineChart`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
export const getBIwMainByMayi = async (params) => {
  return defHttpOnline.get(
    { url: `/v2/statistics/new/bi/main`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
// 获取用户信息
export const getNewUserCountInfo = async (params) => {
  return defHttpOnline.get({ url: `/bi/getUserCountInfo`, params, timeout: 60 * 1000 })
}
// 获订单总数信息
export const getNewOrderCountInfo = async (params) => {
  return defHttpOnline.get({ url: `/bi/getOrderCountInfo`, params, timeout: 60 * 1000 })
}
// 获订单数
export const getOrderCountByStatus = async (params) => {
  return defHttpOnline.get({ url: `/bi/getOrderCountByStatus`, params, timeout: 60 * 1000 })
}
// 获订单总金额信息
export const getOrderAmountInfo = async (params) => {
  return defHttpOnline.get({ url: `/bi/getOrderAmountInfo`, params, timeout: 60 * 1000 })
}
// 获订单总金额信息
export const getOrderInfo = async (params) => {
  return defHttpOnline.get({ url: `/statistic/orderInfo`, params, timeout: 60 * 1000 })
}
// 导出订单总金额信息
export const exportOrderInfo = async (params) => {
  return defHttpOnline.get(
    {
      url: `/statistic/orderInfoExport`,
      params,
      responseType: 'blob',
      timeout: 60 * 1000,
    },
    { isReturnNativeResponse: true },
  )
}
export const getCategoryTree = (params = {}) => {
  return defHttpOnline.get({ url: '/category/tree', params })
}
// 获取时间维度数据
export const getTimerOrder = async (params) => {
  return defHttpOnline.get({ url: `/sysTH/test01`, params, timeout: 60 * 1000 }, {isTransformResponse: false})
}
// 获取产品数据
export const getProjectOrder = async (params) => {
  return defHttpOnline.get({ url: `/sysTH/test02`, params, timeout: 60 * 1000 }, {isTransformResponse: false})
}
// 获取产品渠道数据
export const getProjectChannelOrder = async (params) => {
  return defHttpOnline.get({ url: `/sysTH/test03`, params, timeout: 60 * 1000 }, {isTransformResponse: false})
}
// 获取免押数据
export const getOrderTest04 = async (params) => {
  return defHttpOnline.get({ url: `/sysTH/test04`, params, timeout: 60 * 1000 }, {isTransformResponse: false})
}
// 获取套餐数据
export const getOrderTest05 = async (params) => {
  return defHttpOnline.get({ url: `/sysTH/test05`, params, timeout: 60 * 1000 }, {isTransformResponse: false})
}
// 获取性别数据
export const getOrderTest06 = async (params) => {
  return defHttpOnline.get({ url: `/sysTH/test06`, params, timeout: 60 * 1000 }, {isTransformResponse: false})
}
// 获取年龄数据
export const getOrderTest07 = async (params) => {
  return defHttpOnline.get({ url: `/sysTH/test07`, params, timeout: 60 * 1000 }, {isTransformResponse: false})
}
// 获取细化风险等级数据
export const getOrderTest08 = async (params) => {
  return defHttpOnline.get({ url: `/sysTH/test08`, params, timeout: 60 * 1000 }, {isTransformResponse: false})
}
// 获取用户等级数据
export const getOrderTest09 = async (params) => {
  return defHttpOnline.get({ url: `/sysTH/test09`, params, timeout: 60 * 1000 }, {isTransformResponse: false})
}
// 获取订单成熟数据
export const getOrderTest10 = async (params) => {
  return defHttpOnline.get({ url: `/sysTH/test10`, params, timeout: 60 * 1000 }, {isTransformResponse: false})
}
// 获取数据
export const getOrderTest11 = async (params) => {
  return defHttpOnline.get({ url: `/sysTH/test11`, params, timeout: 60 * 1000 }, {isTransformResponse: false})
}
export const getOrderTest12 = async (params) => {
  return defHttpOnline.get({ url: `/sysTH/test12`, params, timeout: 60 * 1000 }, {isTransformResponse: false})
}
// 余额衰减表
export const getVintageRemaining = async (params) => {
  return defHttpOnline.get({ url: `/vintageRemaining/main`, params, timeout: 60 * 1000 }, {isTransformResponse: false})
}
/**
 * Vintage 指标 金额列表
 */
export const getVintageAmountListOnline = (params = {}) => {
  return defHttpOnline.get({ url: '/vintage/overdueAmountList', params })
}
/**
 * Vintage 指标 订单列表
 */
export const getVintageOrderListOnline = (params = {}) => {
  return defHttpOnline.get({ url: '/vintage/overdueCountList', params })
}
/**
 * 首页顶部卡片统计
 */
export const getMainCardOnline = (params = {}) => {
  return defHttpOnline.get({ url: '/v2/statistics/main', params }, { isTransformResponse: false })
}
/**
 * 逾期订单详情
 */
export const getOverDueOrderDetailsOnline = (params = {}) => {
  return defHttpOnline.get(
    { url: '/v2/statistics/overDueOrderDetails', params },
    { isTransformResponse: false },
  )
}
/**
 * 逾期统计
 */
export const getOverDueOrderInfoOnline = (params = {}) => {
  return defHttpOnline.get({ url: '/v2/statistics/overDueOrderInfo', params })
}
/**
 * vintage 表格导出 - 异步导出 配合 下载列表
 */
export const exportVintageTableExcelOnline = async (params) => {
  return defHttpOnline.get(
    { url: `/v2/statistics/overDueOrderInfo/export`, params, timeout: 5 * 60 * 1000 },
    { isTransformResponse: false },
  )
}
/**
 * 首页顶部卡片统计 - 读缓存，快的
 */
export const getMainCacheCard = () => {
  return defHttpOffline.get({ url: '/v2/statistics/mainCache' }, { isTransformResponse: false })
}

/**
 * 首页顶部卡片统计
 */
export const getMainCard = (params = {}) => {
  return defHttpOffline.get({ url: '/v2/statistics/main', params }, { isTransformResponse: false })
}

/**
 * 首页订单折线图
 */
export const getOrderMainLine = () => {
  return defHttpOffline.get({ url: '/v2/statistics/orderDataLineChart' }, { isTransformResponse: false })
}

/**
 * 首页用户级别
 */
export const getUserRank = () => {
  return defHttpOffline.get(
    { url: '/v2/statistics/userLevelDistribution' },
    { isTransformResponse: false },
  )
}
/**
 * 首页用户认证信息
 */
export const getUserCountInfo = () => {
  return defHttpOffline.get({ url: '/v2/statistics/userCountInfo' }, { isTransformResponse: false })
}
/**
 * 首页用户认证信息-统计表
 */
export const getUserCount = () => {
  return defHttpOffline.get({ url: '/v2/statistics/userCount' }, { isTransformResponse: false })
}

/**
 * 首页用户年龄
 */
export const getUserAge = () => {
  return defHttpOffline.get(
    { url: '/v2/statistics/customerAgeDistribution' },
    { isTransformResponse: false },
  )
}

/**
 * 逾期统计
 */
export const getOverDueOrderInfo = (params = {}) => {
  return defHttpOffline.get({ url: '/v2/statistics/overDueOrderInfo', params })
}

/**
 * 逾期订单详情
 */
export const getOverDueOrderDetails = (params = {}) => {
  return defHttpOffline.get(
    { url: '/v2/statistics/overDueOrderDetails', params },
    { isTransformResponse: false },
  )
}

/**
 * 订单统计
 */
export const getOrderCount = () => {
  return defHttpOffline.get({ url: '/v2/statistics/orderCount' }, { isTransformResponse: false })
}

/**
 * 订单统计折线图
 */
export const getOrderCountForMonth = () => {
  return defHttpOffline.get(
    { url: '/v2/statistics/orderDataLineChartForMonth' },
    { isTransformResponse: false },
  )
}

/**
 * 订单统计折线图
 */
export const getOverDueOrderCountForMonth = () => {
  return defHttpOffline.get(
    { url: '/v2/statistics/overDueOrderLineChart' },
    { isTransformResponse: false },
  )
}
/**
 * 统计折线图 - 即将到期账单
 */
export const getUpcomingBills = (params: any) => {
  return defHttpOffline.get(
    { url: '/v2/statistics/expireLineChartForMonth2', params },
    { isTransformResponse: false },
  )
}
/**
 * 统计折线图 - 产品逾期账单数据/产品逾期账单回款数据
 */
export const getProductOverdueBill = (params: any) => {
  return defHttpOffline.get(
    { url: '/v2/statistics/overdueLineChart2', params },
    { isTransformResponse: false },
  )
}
/**
 * 即将到期订单统计折线图 - 过往30天到期账单回款
 */
export const getExpireBillDay30 = (params: any) => {
  return defHttpOffline.get(
    { url: '/v2/statistics/expireBillItemSnInfo', params },
    { isTransformResponse: false },
  )
}
/**
 * 订单统计 - 当天到期账单
 */
export const getExpireBillsRepay = (params: any) => {
  return defHttpOffline.get({ url: '/v2/statistics/orderDayRepayInto', params })
}

/**
 * 即将到期订单统计折线图 - 过往30天账单还款情况
 */
export const getOrderLast30daysBill = (params: any) => {
  return defHttpOffline.get(
    { url: '/v2/statistics/expireInfoLineChart', params },
    { isTransformResponse: false },
  )
}
/**
 * 即将到期订单统计折线图 - 过往30天每日收款数据
 */
export const getOrderLast30days = (params: any) => {
  return defHttpOffline.get(
    { url: '/v2/statistics/paidInfoLineChart2', params },
    { isTransformResponse: false },
  )
}
/**
 * 即将到期订单统计折线图 - 过往60天数据
 */
export const getOrderLast60days = (params: any) => {
  return defHttpOffline.get(
    { url: '/v2/statistics/orderDayRepayIntoLineChart', params },
    { isTransformResponse: false },
  )
}

/**
 * 资金统计（在租）
 */
export const getRentFunding = (params = {}) => {
  return defHttpOffline.get({ url: '/v2/statistics/rentFunding', params }, { isTransformResponse: false })
}

/**
 * 资金统计（总额）
 */
export const getRentFundingTotal = (params = {}) => {
  return defHttpOffline.get(
    { url: '/v2/statistics/rentFundingTotal', params },
    { isTransformResponse: false },
  )
}

/**
 * 租后订单统计
 */
export const getRentOrderCount = () => {
  return defHttpOffline.get({ url: '/v2/statistics/rentOrderCount' }, { isTransformResponse: false })
}

/**
 * 订单统计-已结清数量
 */
export const getOrderCountSettleOrder = () => {
  return defHttpOffline.get({ url: '/v2/statistics/countSettleOrder' }, { isTransformResponse: false })
}

/**
 * 订单统计 - 地区数据总览
 * @param startTime 开始时间
 * @param endTime 结束时间
 */
export const getMapMain = (params = {}) => {
  return defHttpOffline.get({ url: '/v2/statistics/mainGroupByRegion', params })
}

/**
 * Vintage 指标 订单列表
 */
export const getVintageOrderList = (params = {}) => {
  return defHttpOffline.get({ url: '/vintage/overdueCountList', params })
}
/**
 * Vintage 指标 金额列表
 */
export const getVintageAmountList = (params = {}) => {
  return defHttpOffline.get({ url: '/vintage/overdueAmountList', params })
}

/**
 * 昨日到期数据
 */
export const getDueYesterdayData = (params: any) => {
  return defHttpOffline.get({ url: '/v2/statistics/expireInfo2', params })
}

/**
 * vintage 表格导出 - 异步导出 配合 下载列表
 */
export const exportVintageTableExcel = async (params) => {
  return defHttpOffline.get(
    { url: `/v2/statistics/overDueOrderInfo/export`, params, timeout: 5 * 60 * 1000 },
    { isTransformResponse: false },
  )
}
// 获取线下 数据汇总
export const getNewMain = async (params) => {
  return defHttpOffline.get(
    { url: `/v2/statistics/new/main`, params, timeout: 5 * 60 * 1000 },
    { isTransformResponse: false },
  )
}
/**
 * 在租余额 曲线图
 */
export const getOrderDataLineChart = (params: any) => {
  return defHttpOffline.get({ url: '/v2/statistics/new/rental/orderDataLineChart', params }, { isTransformResponse: false })
}
// 线上bi数据 获取曲线图数据
export const getOrderOfLine = (params: any) => {
  return defHttpOnline.get({ url: '/statistic/chartStatisticInfo', params }, { isTransformResponse: false })
}
// 线下BI数据
export const orderCountWeekBi = (data: any) => {
  if (data?.orderCreateTimeBegin) delete data.orderCreateTimeBegin
  if (data?.orderCreateTimeEnd) delete data.orderCreateTimeEnd
  return defHttpOffline.post({ url: '/vintage/orderCountWeekBi', data }, { isTransformResponse: false })
}
// 获取线下数据
export const querySearchData = (params: any) => {
  return defHttpOffline.get({ url: '/vintage/querySearchData', params }, { isTransformResponse: false })
}

