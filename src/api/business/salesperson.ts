import { ContentTypeEnum } from '/@/enums/httpEnum'
import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetSalespersonList = '/omsSalesPerson/page',
  GetSalespersonStoreList = '/omsSalesPerson/page4MerchantAccount',
  UpdateSalespersonItem = '/omsSalesPerson/saveOrUpdate4MerchantAccount',
  DelSalespersonItem = '/omsSalesPerson/removeOrderSalesPerson',
  UpdateOrderSalesPerson = '/omsSalesPerson/updateOrderSalesPerson',
  GetSalespersonStatisticsList = '/order/expOrderInfoGroupBySalesPerson',
}

/**
 * 业务员列表 - 管理员
 */
export const getSalespersonList = (params = {}) => {
  return defHttp.get({ url: Api.GetSalespersonList, params })
}

/**
 * 业务员列表 - 业务员所属地区
 */
export const getSalespersonAreaList = (id) => {
  return defHttp.get({ url: `/orderAudit/${id}/result` })
}
/**
 * 业务员列表 - 商家列表
 */
export const getSalespersonStoreList = (params = {}) => {
  return defHttp.get({ url: Api.GetSalespersonStoreList, params })
}

/**
 * 业务员列表 - 修改or添加
 */
export const updateSalespersonItem = (data) => {
  return defHttp.post(
    { url: Api.UpdateSalespersonItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 业务员列表 - 批量修改上级
 */
export const updateBatchSalespersonItem = (data) => {
  return defHttp.post(
    {
      url: `/omsSalesPerson/updateParentId`,
      data,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 业务员列表 - 修改or添加
 */
export const updateOrderSalesPerson = (data) => {
  return defHttp.post(
    { url: Api.UpdateOrderSalesPerson, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 业务员列表 - 删除
 */
export const delSalespersonItem = (data) => {
  return defHttp.post(
    {
      url: Api.DelSalespersonItem,
      data,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 业务员统计列表
 */
export const getSalespersonStatisticsList = (params = {}) => {
  return defHttp.get({ url: Api.GetSalespersonStatisticsList, params })
}

/**
 * 导出
 */
export const exportExcel = async (params) => {
  return defHttp.get(
    {
      url: `/order/expOrderInfoGroupBySalesPersonExport`,
      params,
      responseType: 'blob',
      timeout: 60 * 1000,
    },
    { isReturnNativeResponse: true },
  )
}
