import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetTagsList = '/label/page',
  SetTags = '/label',
}

/**
 * 标签列表 - 列表
 */
export const getTagsList = (params = {}) => {
  return defHttp.get({ url: Api.GetTagsList, params })
}
/**
 * 标签列表 - 新增
 */
export const setTagsItem = (data = {}) => {
  return defHttp.post({ url: Api.SetTags, data })
}
/**
 * 标签列表 - 修改
 */
export const updateTagsItem = (data: any) => {
  return defHttp.put({ url: `${Api.SetTags}/${data.id}`, data })
}
/**
 * 标签列表 - 删除
 */
export const delTagsItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.SetTags}/${id}` })
}
