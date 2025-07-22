import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetModelList = '/order/device/page',
}

/**
 * 机型关联统计 - 列表
 */
export const getModelList = (params = {}) => {
  return defHttp.get({ url: Api.GetModelList, params })
}
