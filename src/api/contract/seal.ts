import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetSealList = '/contract/electronic/seal/page',
  GetSealLists = '/contract/electronic/seal/list',
  updateSealItem = '/contract/electronic/seal',
}

/**
 * 电子印章列表 - 分页列表
 */
export const getSealList = (params = {}) => {
  return defHttp.get({ url: Api.GetSealList, params })
}
/**
 * 电子印章列表 - 不分页
 */
export const getSealLists = (params = {}) => {
  return defHttp.get({ url: Api.GetSealLists, params })
}
/**
 * 电子印章列表 - 新增
 */
export const setSealItem = (data = {}) => {
  return defHttp.post({ url: `${Api.updateSealItem}`, data })
}
/**
 * 电子印章列表 - 修改
 */
export const updateSealItem = (data: any) => {
  return defHttp.put({ url: `${Api.updateSealItem}/${data.id}`, data })
}

/**
 * 电子印章列表 - 删除
 */
export const delContractItem = (id) => {
  return defHttp.delete(
    { url: `${Api.updateSealItem}/${id}` },
    {
      errorMessageMode: 'message',
    },
  )
}
