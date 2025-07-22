import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetMangerPage = '/helpArticleCategory/page',
  MangerPage = '/prosecute/manage/page',
  updateMangerItem = '/prosecute/manage',
}

/**
 * 法务列表
 */
export const getMangerList = (params = {}) => {
  return defHttp.get({ url: Api.MangerPage, params })
}
/**
 * 法务管理列表 - 新增
 */
export const setMangerItem = (data = {}) => {
  return defHttp.post({ url: Api.updateMangerItem, data })
}
/**
 * 法务管理列表 - 修改
 */
export const updateMangerItem = (data: any) => {
  return defHttp.put({ url: `${Api.updateMangerItem}/${data.id}`, data })
}
/**
 * 法务管理列表 - 删除
 */
export const delMangerItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.updateMangerItem}/${id}` })
}
/**
 * 下载管理列表
 */
export const getDownLoadMangerList = (params = {}) => {
  return defHttp.get({ url: '/prosecute/contract/page', params })
}
// 生成法务起诉材料
export const prosecuteCreate = (id: number | string) => {
  return defHttp.get(
    { url: `/prosecute/create/${id}` },
    {
      isTransformResponse: false,
    },
  )
}
