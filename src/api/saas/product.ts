import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetProductList = '/v2/sysMerchantTerminal/page',
  UpdateProductItem = '/v2/sysMerchantTerminal/saveOrUpdate',
  DelProductItem = '/v2/sysMerchantTerminal/remove',
}

/**
 * 产品端列表 - 列表
 */
export const getProductList = (params = {}) => {
  return defHttp.get({ url: Api.GetProductList, params })
}
/**
 * 产品端列表 - 修改or添加
 */
export const updateProductItem = (data) => {
  return defHttp.post(
    { url: Api.UpdateProductItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 产品端列表 - 删除
 */
export const delProductItem = (data) => {
  return defHttp.post(
    { url: Api.DelProductItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}
