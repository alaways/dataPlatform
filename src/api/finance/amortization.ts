import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetAmortizationList = '/order/bill/settle/amortize/page',
}

/**
 * 摊销计算 - 列表
 */
export const getAmortizationList = (params = {}) => {
  return defHttp.get({ url: Api.GetAmortizationList, params })
}
/**
 * 导出 - 申请收款汇总统计
 */

export const exportApplyForExcelAmortization = async (params) => {
  return defHttp.get(
    { url: `/order/bill/settle/amortize/export`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
/**
 * 摊销计算 - 列表 - new
 */
export const getAmortizationListNew = (params = {}) => {
  return defHttp.get({ url: '/order/bill/settle/amortize/new/page', params })
}
/**
 * 导出 - 申请收款汇总统计 - new
 */

export const exportApplyForExcelAmortizationNew = async (params) => {
  return defHttp.get(
    { url: `/order/bill/settle/amortize/new/export`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
