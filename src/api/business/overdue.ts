import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetOverdueProvinceList = '/order/expOrderInfoGroupByProvince',
  GetOverdueCityList = '/order/expOrderInfoGroupByCity',
  GetOverdueProvinceAndCityList = '/order/expOrderInfoGroupByProvinceAndCity/list',
  GetOverdueSalesPersonList = '/order/expOrderInfoGroupBySalesPerson/list',
  GetOverdueStoreMerchantNameList = '/order/expOrderInfoGroupByStoreMerchantName/list',
}

/**
 * 逾期管理省列表 - 列表
 */
export const getOverdueProvinceList = (params = {}) => {
  return defHttp.get({ url: Api.GetOverdueProvinceList, params })
}

/**
 * 逾期管理市列表 - 列表
 */
export const getOverdueCityList = (params = {}) => {
  return defHttp.get({ url: Api.GetOverdueCityList, params })
}

/**
 * 逾期详情列表 - 业务员统计订单信息
 */
export const getOverdueSalesPersonList = (params = {}) => {
  return defHttp.get({ url: Api.GetOverdueSalesPersonList, params })
}

/**
 * 逾期详情列表 - 门店统计订单信息
 */
export const getOverdueStoreMerchantNameList = (params = {}) => {
  return defHttp.get({ url: Api.GetOverdueStoreMerchantNameList, params })
}

/**
 * 逾期详情列表 - 省市统计订单信息列表
 */
export const getOverdueProvinceAndCityList = (params = {}) => {
  return defHttp.get({ url: Api.GetOverdueProvinceAndCityList, params })
}

/**
 * 订单导出可分配订单excel
 */
export const exportOverdueExcel = async (params) => {
  const url =
    params.type == 'city'
      ? `/order/expOrderInfoGroupByCityExport`
      : '/order/expOrderInfoGroupByProvinceExport'
  return defHttp.get(
    {
      url,
      params,
      responseType: 'blob',
      timeout: 60 * 1000,
    },
    { isReturnNativeResponse: true },
  )
}
