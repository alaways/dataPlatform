import { defHttp } from '/@/utils/http/axios'

enum Api {
  UpdateReview = '/sysMerchantAccountWithdraw/financialConfirmation',
  UpdateWithdraw = '/sysMerchantAccountWithdraw/applyWithdraw',
  GetWithdrawAmount = '/sysMerchantAccountWithdraw/getWithdrawAmount',
  GetMerchantAccount = '/merchant/manage/curSysMerchantAccount',
}

/**
 * 修改状态
 */
export const updateStreamReview = (data) => {
  return defHttp.post(
    { url: `${Api.UpdateReview}`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 汇总统计 - 总数据
 */
export const getWithdrawAmount = (params = {}) => {
  return defHttp.get({ url: Api.GetWithdrawAmount, params })
}

/**
 * 当前商家信息
 */
export const getMerchantAccount = (params = {}) => {
  return defHttp.get({ url: Api.GetMerchantAccount, params })
}

/**
 * 提现
 */
export const updateWithdraw = (data) => {
  return defHttp.post(
    { url: `${Api.UpdateWithdraw}`, data },
    {
      errorMessageMode: 'message',
    },
  )
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
