import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetPolicyList = '/settle/policy/file/page',
  UpdatePolicyArea = '/settle/policy/file',
  GetPolicyFileList = '/settle/policy/file/ext/list',
  UpdatePolicyFile = '/settle/policy/file/ext',
}

/**
 * 结算政策 - 列表
 */
export const getPolicyList = (params: any) => {
  return defHttp.get({ url: Api.GetPolicyList, params })
}

/**
 * 结算政策 - 新增地区
 */
export const setPolicyArea = (data) => {
  return defHttp.post(
    { url: Api.UpdatePolicyArea, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 结算政策 - 删除地区
 */
export const delPolicyArea = (data) => {
  return defHttp.delete(
    { url: `${Api.UpdatePolicyArea}/${data.id}`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 结算政策 - 文件列表
 */
export const getPolicyFileList = (params: any) => {
  return defHttp.get({ url: Api.GetPolicyFileList, params })
}

/**
 * 结算政策 - 新增文件
 */
export const AddPolicyFile = (data) => {
  return defHttp.post(
    { url: Api.UpdatePolicyFile, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 结算政策 - 删除文件
 */
export const delPolicyFile = (data) => {
  return defHttp.delete(
    { url: `${Api.UpdatePolicyFile}/${data.extId}`, data },
    {
      errorMessageMode: 'message',
    },
  )
}
