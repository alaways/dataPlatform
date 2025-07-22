import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetAppList = '/applet/config/page',
  UpdateAppItem = '/applet/config',
  DelAppItem = '/applet/config',
}

/**
 * App列表 - 列表
 */
export const getAppList = (params = {}) => {
  return defHttp.get({ url: Api.GetAppList, params })
}

/**
 * App列表 - 详情
 */
export const getAppInfo = (params: any) => {
  return defHttp.get({ url: `${Api.UpdateAppItem}/find/${params.id}` })
}
/**
 * App列表 - 添加
 */
export const addAppItem = (data) => {
  return defHttp.post(
    { url: Api.UpdateAppItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * App列表 - 修改
 */
export const updateAppItem = (data) => {
  return defHttp.put(
    { url: `${Api.DelAppItem}/${data.id}`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * App列表 - 删除
 */
export const delAppItem = (data) => {
  return defHttp.delete(
    { url: `${Api.DelAppItem}/${data.id}`, data },
    {
      errorMessageMode: 'message',
    },
  )
}
