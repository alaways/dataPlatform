import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetCategoryList = '/category/list',
  GetCategoryTree = '/category/tree',
  SetCategory = '/category',
}

/**
 * 分类列表 - 列表
 */
export const getCategoryList = (params = {}) => {
  return defHttp.get({ url: Api.GetCategoryList, params })
}
/**
 * 分类列表 - 树状列表
 */
export const getCategoryTree = (params = {}) => {
  return defHttp.get({ url: Api.GetCategoryTree, params })
}

/**
 * 品牌列表 - 新增
 */
export const setCategoryItem = (data = {}) => {
  return defHttp.post({ url: Api.SetCategory, data })
}
/**
 * 品牌列表 - 修改
 */
export const updateCategoryItem = (data: any) => {
  return defHttp.put({ url: `${Api.SetCategory}/${data.id}`, data })
}
/**
 * 品牌列表 - 删除
 */
export const delCategoryItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.SetCategory}/${id}` })
}
