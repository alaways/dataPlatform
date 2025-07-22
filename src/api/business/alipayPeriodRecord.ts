import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetAlipayPeriodList = '/order/aliTradePayPage',
}

/**
 * 支付宝周期代扣列表 - 列表
 */
export const getAlipayPeriodList = (params = {}) => {
  return defHttp.get({ url: Api.GetAlipayPeriodList, params })
}

/**
 * 导出
 */
export const exportAlipayPeriodExcel = async (params) => {
  return defHttp.get(
    {
      url: `/order/overdueOrderExport`,
      params,
      responseType: 'blob',
      timeout: 60 * 1000,
    },
    { isReturnNativeResponse: true },
  )
}
