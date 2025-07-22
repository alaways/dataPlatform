import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetConfigPage = '/config/page', // 分页查询
  GetConfigList = '/config/list', // 条件查询
  UpdateConfigItem = '/config',
}

/**
 * 配置列表 - 列表
 */
export const getConfigPage = (params: any) => {
  return defHttp.get({ url: Api.GetConfigPage, params })
}

/**
 * 配置列表 - 列表 - 条件查询
 */
export const getConfigList = (params: any) => {
  return defHttp.get({ url: Api.GetConfigList, params })
}

/**
 * 配置列表 - 添加
 */
export const addConfigItem = (data) => {
  return defHttp.post(
    { url: Api.UpdateConfigItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 配置列表 - 修改
 */
export const updateConfigItem = (data) => {
  return defHttp.put(
    { url: `${Api.UpdateConfigItem}/${data.id}`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 配置列表 - 删除
 */
export const delConfigItem = (id: any) => {
  return defHttp.delete(
    { url: `${Api.UpdateConfigItem}/${id}` },
    {
      errorMessageMode: 'message',
    },
  )
}
