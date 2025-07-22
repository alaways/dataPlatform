import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetCategoryPage = '/helpArticleCategory/page',
  GetCategoryList = '/helpArticleCategory/list',
  updateCategoryItem = '/helpArticleCategory',
}

/**
 * 文章分类列表 - 列表
 */
export const getCategoryPage = (params = {}) => {
  return defHttp.get({ url: Api.GetCategoryPage, params })
}
/**
 * 文章分类列表 - 列表
 */
export const getCategoryList = (params = {}) => {
  return defHttp.get({ url: Api.GetCategoryList, params })
}
/**
 * 文章分类列表 - 新增
 */
export const setCategoryItem = (data = {}) => {
  return defHttp.post({ url: Api.updateCategoryItem, data })
}
/**
 * 文章分类列表 - 修改
 */
export const updateCategoryItem = (data: any) => {
  return defHttp.put({ url: `${Api.updateCategoryItem}/${data.id}`, data })
}
/**
 * 文章分类列表 - 删除
 */
export const delCategoryItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.updateCategoryItem}/${id}` })
}
/**
 * 文章分类列表 - 领取记录
 */
export const getCategoryRecordList = (params = {}) => {
  return defHttp.get({ url: `/userCouponRecord/page`, params })
}
