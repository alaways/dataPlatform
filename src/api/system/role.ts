import { defHttp } from '/@/utils/http/axios'

enum Api {
  // GetRoleList = '/v2/sysRole/page',
  GetRoleList = '/v3/sysNewRole/page',
  AddRoleItem = '/v3/sysNewRole/save',
  UpdateRoleItem = '/v3/sysNewRole/update',
  DelRoleItem = '/v3/sysNewRole/remove',
  GetRoleMenuList = '/v3/sysNewRole/role/menu/list',
}

/**
 * 角色列表 - 列表
 */
export const getRoleList = (params: any) => {
  return defHttp.get({ url: Api.GetRoleList, params })
}
/**
 * 角色列表 - 添加
 */
export const addRoleItem = (data) => {
  return defHttp.post(
    { url: Api.AddRoleItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 角色列表 - 修改
 */
export const updateRoleItem = (data) => {
  return defHttp.post(
    { url: Api.UpdateRoleItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 角色列表 - 删除
 */
export const delRoleItem = (id) => {
  return defHttp.delete(
    { url: `${Api.DelRoleItem}/${id}` },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 角色列表 - 菜单
 */
export const getRoleMenuList = (params: any) => {
  return defHttp.get({ url: Api.GetRoleMenuList, params })
}
