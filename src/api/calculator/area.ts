import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetAreaTree = '/region/rent/list',
  SetAreaItem = '/region/rent/save',
  uploadAreaItem = '/region/rent/update',
}

/**
 * 地区列表 - 树状列表
 */
export const getAreaTree = (params = {}) => {
  return defHttp.get({ url: Api.GetAreaTree, params })
}

/**
 * 品牌列表 - 新增
 */
export const setAreaItem = (data = {}) => {
  return defHttp.post({ url: Api.SetAreaItem, data })
}
/**
 * 品牌列表 - 修改
 */
export const updateAreaItem = (data: any) => {
  return defHttp.post({ url: `${Api.uploadAreaItem}`, data })
}
/**
 * 品牌列表 - 删除
 */
export const delAreaItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.SetAreaItem}/${id}` })
}
