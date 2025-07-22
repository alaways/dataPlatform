import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetDeptTree = '/v3/sysNewDept/tree',
  GetDeptList = '/v3/sysNewDept/list',
  AddDeptItem = '/v3/sysNewDept/save',
  UpdateDeptItem = '/v3/sysNewDept/update',
  DelDeptItem = '/v3/sysNewDept/remove',
}

/**
 * 部门列表 - 树状
 */
export const getDeptList = (params: any) => {
  return defHttp.get({ url: Api.GetDeptTree, params })
}
/**
 * 部门列表 - 列表
 */
export const getDeptLists = (params: any) => {
  return defHttp.get({ url: Api.GetDeptList, params })
}
/**
 * 部门列表 - 添加
 */
export const addDeptItem = (data) => {
  return defHttp.post(
    { url: Api.AddDeptItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 部门列表 - 修改
 */
export const updateDeptItem = (data) => {
  return defHttp.post(
    { url: Api.UpdateDeptItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 部门列表 - 删除
 */
export const delDeptItem = (id) => {
  return defHttp.delete(
    { url: `${Api.DelDeptItem}/${id}` },
    {
      errorMessageMode: 'message',
    },
  )
}
