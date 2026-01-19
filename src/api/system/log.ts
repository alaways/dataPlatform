import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetLogList = '/v3/sysNewOperLog/page',
}

/**
 * 部门列表 - 列表
 */
export const getLogList = (params: any) => {
  return defHttp.get({ url: Api.GetLogList, params })
}
/**
 * 获取蚂蚁token
 */
export const getMayiToken = () => {
  const params = { type: 'mayi' }
  return defHttp.get({ url: '/token/takeToken', params })
}
