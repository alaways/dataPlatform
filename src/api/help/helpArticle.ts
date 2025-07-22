import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetArticleList = '/helpArticle/page',
  updateArticleItem = '/helpArticle',
}

/**
 * 帮助文章列表 - 列表
 */
export const getArticleList = (params = {}) => {
  return defHttp.get({ url: Api.GetArticleList, params })
}
/**
 * 帮助文章列表 - 新增
 */
export const setArticleItem = (data = {}) => {
  return defHttp.post({ url: Api.updateArticleItem, data })
}
/**
 * 帮助文章列表 - 修改
 */
export const updateArticleItem = (data: any) => {
  return defHttp.put({ url: `${Api.updateArticleItem}/${data.id}`, data })
}
/**
 * 帮助文章列表 - 删除
 */
export const delArticleItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.updateArticleItem}/${id}` })
}
/**
 * 帮助文章列表 - 领取记录
 */
export const getArticleRecordList = (params = {}) => {
  return defHttp.get({ url: `/userCouponRecord/page`, params })
}
