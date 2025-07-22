import { ContentTypeEnum } from '/@/enums/httpEnum'
import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetBusinessStoreList = '/order/expOrderInfoGroupByStoreMerchantName',
  GetStoreList = '/omsStoreMerchant/page',
  UpdateStoreItem = '/omsStoreMerchant/saveOrUpdate',
  DelStoreItem = '/omsStoreMerchant/remove',
}

/**
 * 门店统计 - 商家列表
 */
export const getBusinessStoreList = (params = {}) => {
  return defHttp.get({ url: Api.GetBusinessStoreList, params })
}

/**
 * 门店列表 - 门店列表
 */
export const getStoreList = (params = {}) => {
  return defHttp.get({ url: Api.GetStoreList, params })
}

/**
 * 门店列表 - 修改or添加
 */
export const updateOrderStore = (data) => {
  return defHttp.post(
    { url: Api.UpdateStoreItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 门店列表 - 删除
 */
export const delStoreItem = (data) => {
  return defHttp.post(
    {
      url: Api.DelStoreItem,
      data,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    },
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
    {
      url: `/order/expOrderInfoGroupByStoreMerchantNameExport`,
      params,
      responseType: 'blob',
      timeout: 60 * 1000,
    },
    { isReturnNativeResponse: true },
  )
}
