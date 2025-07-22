import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetUserList = '/user/page',
  UpdateUserItem = '/user/updateUserWithIdentify',
  UpdateUserStatusItem = '/v2/account/statue',
  DelUserItem = '/user',
}

/**
 * 用户列表 - 列表
 */
export const getUserList = (params) => {
  return defHttp.get({ url: Api.GetUserList, params })
}

/**
 * 用户列表 - 修改or添加
 */
export const updateUserItem = (data) => {
  return defHttp.post(
    { url: Api.UpdateUserItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 修改用户状态
 */
export const updateUserStatusItem = (data) => {
  return defHttp.put(
    { url: `${Api.UpdateUserStatusItem}?uid=${data.uid}&status=${data.status}` },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 用户列表 - 删除
 */
export const delUserItem = (id) => {
  return defHttp.delete(
    { url: `${Api.DelUserItem}/${id}` },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 订单导出全部订单excel - 异步导出 配合 下载列表
 */
export const exportExcel = async (params) => {
  return defHttp.get(
    { url: `/user/pageExport/async`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
