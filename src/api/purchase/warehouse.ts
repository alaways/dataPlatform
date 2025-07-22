import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetWarehouseList = '/purchase/warehouse/list',
  SetWarehouse = '/purchase/warehouse',
}

/**
 * 仓库列表 - 列表
 */
export const getWarehouseList = (params = {}) => {
  return defHttp.get({ url: Api.GetWarehouseList, params })
}

/**
 * 仓库列表 - 新增
 */
export const setWarehouseItem = (data = {}) => {
  return defHttp.post({ url: Api.SetWarehouse, data })
}
/**
 * 仓库列表 - 修改
 */
export const updateWarehouseItem = (data: any) => {
  return defHttp.put({ url: `${Api.SetWarehouse}/${data.id}`, data })
}
/**
 * 仓库列表 - 删除
 */
export const delWarehouseItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.SetWarehouse}/${id}` })
}
