import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetBrandList = '/brand/list',
  SetBrand = '/brand',
}

/**
 * 品牌列表 - 列表
 */
export const getBrandList = (params = {}) => {
  return defHttp.get({ url: Api.GetBrandList, params })
}

/**
 * 品牌列表 - 新增
 */
export const setBrandItem = (data = {}) => {
  return defHttp.post({ url: Api.SetBrand, data })
}
/**
 * 品牌列表 - 修改
 */
export const updateBrandItem = (data: any) => {
  return defHttp.put({ url: `${Api.SetBrand}/${data.id}`, data })
}
/**
 * 品牌列表 - 删除
 */
export const delBrandItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.SetBrand}/${id}` })
}
