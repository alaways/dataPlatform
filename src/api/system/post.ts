import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetPostPage = '/v3/sysNewPost/page',
  GetPostList = '/v3/sysNewPost/list',
  AddPostItem = '/v3/sysNewPost/save',
  UpdatePostItem = '/v3/sysNewPost/update',
  DelPostItem = '/v3/sysNewPost/remove',
}

/**
 * 岗位列表 - 分页列表
 */
export const getPostPage = (params: any) => {
  return defHttp.get({ url: Api.GetPostPage, params })
}
/**
 * 岗位列表 - 列表
 */
export const getPostList = (params: any) => {
  return defHttp.get({ url: Api.GetPostList, params })
}
/**
 * 岗位列表 - 添加
 */
export const addPostItem = (data) => {
  return defHttp.post(
    { url: Api.AddPostItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 岗位列表 - 修改
 */
export const updatePostItem = (data) => {
  return defHttp.post(
    { url: Api.UpdatePostItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 岗位列表 - 删除
 */
export const delPostItem = (id) => {
  return defHttp.delete(
    { url: `${Api.DelPostItem}/${id}` },
    {
      errorMessageMode: 'message',
    },
  )
}
