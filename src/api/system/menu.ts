import { defHttpV3 } from '/@/utils/http/axios'

enum Api {
  // GetMenuList = '/v2/sysMenu/menuList',
  // UpdateMenuItem = '/v2/sysMenu/saveOrUpdate',
  // DelMenuItem = '/v2/sysMenu/remove',
  // GetMenuList = '/sysNewMenu/list',
  GetMenuList = '/sysNewUser/curUserMenuList',
  AddMenuItem = '/sysNewMenu/save',
  UpdateMenuItem = '/sysNewMenu/update',
  DelMenuItem = '/sysNewMenu/remove',
}

/**
 * 菜单列表 - 列表
 */
export const getMenuList = (params) => {
  return defHttpV3.get({ url: Api.GetMenuList, params })
}
/**
 * 菜单列表 - 新增
 */
export const addMenuItem = (data) => {
  return defHttpV3.post(
    { url: Api.AddMenuItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 菜单列表 - 修改
 */
export const updateMenuItem = (data) => {
  return defHttpV3.post(
    { url: Api.UpdateMenuItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 菜单列表 - 删除
 */
export const delMenuItem = (id) => {
  return defHttpV3.delete(
    { url: `${Api.DelMenuItem}/${id}` },
    {
      errorMessageMode: 'message',
    },
  )
}
