import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetCollectionList = '/order/pay/record/settle/page',
  GetCollectionDetail = '/order/pay/record/settle/page',
}

/**
 * 收款对账 - 列表
 */
export const getCollectionList = (params = {}) => {
  return defHttp.get({ url: Api.GetCollectionList, params })
}
/**
 * 收款对账 - 总数
 */
export const getCollectionDetail = (params = {}) => {
  return defHttp.get({ url: Api.GetCollectionDetail, params })
}

/**
 * 收款计算
 */
export const getCollectionCount = (data = {}) => {
  return defHttp.post({ url: `/sysMerchantAccountWithdraw/financialConfirmation/balance`, data })
}

/**
 * 导出
 */
export const exportCollectionExcel = async (params) => {
  return defHttp.get(
    { url: `/order/pay/record/settle/export`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}

/**
 * 导出 - 申请收款汇总统计
 */

export const exportApplyForExcelCollection = async (params) => {
  return defHttp.get(
    { url: `/order/pay/record/settle/export/async`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
