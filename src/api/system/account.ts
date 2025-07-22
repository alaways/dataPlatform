import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetUserList = '/v3/sysNewUser/page',
  AddUserItem = '/v3/sysNewUser/save',
  UpdateUserItem = '/v3/sysNewUser/update',
  DelUserItem = '/v3/sysNewUser/remove',

  UpdatePassword = '/v3/sysNewUser/resetPwd',
  UpdatePasswordAction = '/account/optPassword',
}

/**
 * 账号列表 - 列表
 */
export const getUserList = (params) => {
  return defHttp.get({ url: Api.GetUserList, params })
}
/**
 * 账号列表 - 添加
 */
export const addUserItem = (data) => {
  return defHttp.post(
    { url: Api.AddUserItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 账号列表 - 修改
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
 * 账号列表 - 删除
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
 * 修改密码
 */
export const updatePassword = (data) => {
  return defHttp.post({ url: Api.UpdatePassword, data })
}
/**
 * 修改操作密码
 */
export const updatePasswordAction = (data) => {
  return defHttp.post({
    url: Api.UpdatePasswordAction,
    data,
    // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  })
}
