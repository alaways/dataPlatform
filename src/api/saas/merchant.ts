import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetMerchantList = '/v2/sysMerchant/page',
  UpdateMerchantItem = '/v2/sysMerchant/saveOrUpdate',
  DelMerchantItem = '/v2/sysMerchant/remove',
}

/**
 * 商户列表 - 列表
 */
export const getMerchantList = () => {
  return defHttp.get({ url: Api.GetMerchantList })
}
/**
 * 商户列表 - 修改or添加
 */
export const updateMerchantItem = (data) => {
  return defHttp.post(
    { url: Api.UpdateMerchantItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 商户列表 - 删除
 */
export const delMerchantItem = (data) => {
  return defHttp.post(
    { url: Api.DelMerchantItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}
