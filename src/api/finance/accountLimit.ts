import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetAccountLimitList = '/merchant/manage/account/detail/page',
}

/**
 * 账户余额充值记录
 */
export const getAccountLimitList = (params = {}) => {
  return defHttp.get({ url: Api.GetAccountLimitList, params })
}

/**
 * 账户余额充值记录
 */
export const getAccountDetail = (params = {}) => {
  return defHttp.get({ url: '/merchant/manage/account/detail', params })
}

/**
 * 导出
 */
export const exportExcel = async (params) => {
  return defHttp.get(
    {
      url: `/merchant/manage/account/detail/pageExport`,
      params,
      responseType: 'blob',
      timeout: 60 * 1000,
    },
    { isReturnNativeResponse: true },
  )
}
