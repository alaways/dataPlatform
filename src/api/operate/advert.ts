import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetAdvertList = '/advert/page',
  SetAdvert = '/advert',
}

/**
 * 广告列表 - 列表
 */
export const getAdvertList = (params = {}) => {
  return defHttp.get({ url: Api.GetAdvertList, params })
}

/**
 * 广告列表 - 新增
 */
export const setAdvertItem = (data = {}) => {
  return defHttp.post({ url: Api.SetAdvert, data })
}
/**
 * 广告列表 - 修改
 */
export const updateAdvertItem = (data: any) => {
  return defHttp.put({ url: `${Api.SetAdvert}/${data.id}`, data })
}
/**
 * 广告列表 - 删除
 */
export const delAdvertItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.SetAdvert}/${id}` })
}
