import { defHttp, defHttpOnline } from '/@/utils/http/axios'

enum Api {
  GetOperatorStoreList = '/v3/sysNewUser/riskAuditStatistics',
  UpdateOperatorItem = '/omsSalesPerson/saveOrUpdate4MerchantAccount',
  DelOperatorItem = '/omsSalesPerson/removeOrderSalesPerson',
}
/**
 * 审单风控列表 - 商家列表
 */
export const getOperatorStoreList = (params = {}) => {
  return defHttp.get({ url: Api.GetOperatorStoreList, params })
}
// export const getOperatorStoreList = (params = {}) => {
//   return defHttp.get({ url: Api.GetOperatorStoreList, params })
// }
// defHttpOnline
/**
 * 导出
 */
export const exportExcel = async (params) => {
  return defHttp.get(
    {
      url: `/v3/sysNewUser/riskAuditStatisticsExport`,
      params,
      responseType: 'blob',
      timeout: 60 * 1000,
    },
    { isReturnNativeResponse: true },
  )
}
