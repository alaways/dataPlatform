import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetAgreementList = '/clauseTemplate/page',
  GetAgreementLists = '/clauseTemplate/list',
  updateAgreementItem = '/clauseTemplate',
}

/**
 * 协议列表 - 分页列表
 */
export const getAgreementList = (params = {}) => {
  return defHttp.get({ url: Api.GetAgreementList, params })
}
/**
 * 协议列表 - 不分页
 */
export const getAgreementLists = (params = {}) => {
  return defHttp.get({ url: Api.GetAgreementLists, params })
}
/**
 * 协议列表 - 新增
 */
export const setAgreementItem = (data = {}) => {
  return defHttp.post({ url: `${Api.updateAgreementItem}`, data })
}
/**
 * 协议列表 - 修改
 */
export const updateAgreementItem = (data: any) => {
  return defHttp.put({ url: `${Api.updateAgreementItem}/${data.id}`, data })
}

/**
 * 协议列表 - 删除
 */
export const delContractItem = (id) => {
  return defHttp.delete(
    { url: `${Api.updateAgreementItem}/${id}` },
    {
      errorMessageMode: 'message',
    },
  )
}
