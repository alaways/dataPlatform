import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetStatisticsList = '/order/bill/settle/collect',
  GetStatisticsCollectList = '//order/bill/pay/log/collect',
}

/**
 * 货款汇总统计 - 列表
 */
export const getStatisticsList = (params = {}) => {
  return defHttp.get({ url: Api.GetStatisticsList, params }, { isTransformResponse: false })
}

/**
 * 收款汇总统计 - 列表
 */
export const getStatisticsCollectList = (params = {}) => {
  return defHttp.get({ url: Api.GetStatisticsCollectList, params }, { isTransformResponse: false })
}

/**
 * 导出
 */
export const exportExcel = async (params) => {
  return defHttp.get(
    { url: `/order/bill/settle/collect/export`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}

/**
 * 导出 - 收款汇总统计
 */
export const exportExcelCollection = async (params) => {
  return defHttp.get(
    { url: `/order/bill/pay/log/collect/export`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}
