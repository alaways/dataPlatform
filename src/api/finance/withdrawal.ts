import { defHttp } from '/@/utils/http/axios'

enum Api {
  // GetWithdrawlList = '/sysMerchantAccountWithdraw/withdrawPage',
  // GetStoreWithdrawlList = '/sysMerchantAccountWithdraw/withdrawPage',
  GetWithdrawlList = '/sysMerchantAccountWithdraw/withdrawPage4MerchantAccount',
  GetStoreWithdrawlList = '/sysMerchantAccountWithdraw/withdrawPage4MerchantAccount',
  GetWithdrawlDetail = '/sysMerchantAccountWithdraw/getWithdrawDetail',
  UpdateSettled = '/sysMerchantAccountWithdraw/applyWithdrawUpdate4Apply',
}

/**
 * 财务
 * 商家结算信息
 */
export const getWithdrawlList = (params = {}) => {
  return defHttp.get({ url: Api.GetWithdrawlList, params })
}

/**
 * 商家
 * 商家结算信息
 */
export const getStoreWithdrawlList = (params = {}) => {
  return defHttp.get({ url: Api.GetStoreWithdrawlList, params })
}

/**
 * 商家查询
 */
export const getWithdrawlDetail = (params = {}) => {
  return defHttp.get({ url: Api.GetWithdrawlDetail, params }, { isTransformResponse: false })
}

/**
 * 确认结算
 */
export const updateSettled = (data) => {
  return defHttp.post(
    { url: `${Api.UpdateSettled}`, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 商家结算提现
 */
export const exportExcel = async (params) => {
  return defHttp.get(
    {
      url: `/sysMerchantAccountWithdraw/withdrawPage4MerchantAccountExport`,
      params,
      responseType: 'blob',
      timeout: 60 * 1000,
    },
    { isReturnNativeResponse: true },
  )
}
