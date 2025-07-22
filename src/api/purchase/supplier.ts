import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetSupplierList = '/purchase/supplier/list',
  SetSupplier = '/purchase/supplier',
}

/**
 * 供应商列表 - 列表
 */
export const getSupplierList = (params = {}) => {
  return defHttp.get({ url: Api.GetSupplierList, params })
}

/**
 * 供应商列表 - 新增
 */
export const setSupplierItem = (data = {}) => {
  return defHttp.post({ url: Api.SetSupplier, data })
}
/**
 * 供应商列表 - 修改
 */
export const updateSupplierItem = (data: any) => {
  return defHttp.put({ url: `${Api.SetSupplier}/${data.id}`, data })
}
/**
 * 供应商列表 - 删除
 */
export const delSupplierItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.SetSupplier}/${id}` })
}
