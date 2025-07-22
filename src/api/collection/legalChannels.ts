import { defHttp } from '/@/utils/http/axios'

enum Api {
  LegalChannelsPage = '/lawsuit/channel/config/page',
  LegalChannelsList = '/lawsuit/channel/config/list',
  SetLegalChannels = '/lawsuit/channel/config',
}

/**
 * 法诉渠道 - 分页列表
 */
export const getLegalChannelsPage = (params = {}) => {
  return defHttp.get({ url: Api.LegalChannelsPage, params })
}

/**
 * 法诉渠道 - 列表
 */
export const getLegalChannelsList = (params = {}) => {
  return defHttp.get({ url: Api.LegalChannelsList, params })
}

/**
 * 法诉渠道 - 新增
 */
export const setLegalChannelsItem = (data = {}) => {
  return defHttp.post({ url: Api.SetLegalChannels, data })
}
/**
 * 法诉渠道 - 修改
 */
export const updateLegalChannelsItem = (data: any) => {
  return defHttp.put({ url: `${Api.SetLegalChannels}/${data.id}`, data })
}
/**
 * 法诉渠道 - 删除
 */
export const delLegalChannelsItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.SetLegalChannels}/${id}` })
}
