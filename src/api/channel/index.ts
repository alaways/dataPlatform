import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetChannelList = '/channel/page',
  UpdateChannelItem = '/channel',
  DelChannelItem = '/v2/sysChannel/remove',
  GetLandingUVList = '/channel/landingUV/page',
  GetLandingUserList = '/channel/landingUser/page',
  GetLandingOrderList = '/channel/landingOrder/page',
}

/**
 * 渠道列表 - 列表
 */
export const getChannelList = (params = {}) => {
  return defHttp.get({ url: Api.GetChannelList, params })
}

/**
 * 渠道列表 - 新增
 */
export const setChannelItem = (params = {}) => {
  return defHttp.post({ url: Api.UpdateChannelItem, params })
}

/**
 * 渠道列表 - 修改
 */
export const updateChannelItem = (params: any) => {
  return defHttp.put({ url: `${Api.UpdateChannelItem}/${params.id}`, params })
}

/**
 * 渠道列表 - 删除
 */
export const delChannelItem = (id: any) => {
  return defHttp.delete({ url: `${Api.UpdateChannelItem}/${id}` })
}

/**
 * 落地UV
 */
export const getLandingUVList = (params = {}) => {
  return defHttp.get({ url: Api.GetLandingUVList, params })
}

/**
 * 落地用户
 */
export const getLandingUserList = (params = {}) => {
  return defHttp.get({ url: Api.GetLandingUserList, params })
}

/**
 * 落地订单
 */
export const getLandingOrderList = (params = {}) => {
  return defHttp.get({ url: Api.GetLandingOrderList, params })
}
