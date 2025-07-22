import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetPenaltyList = '/config/getConfigValue',
  SetPenaltyList = '/spu/updatePenaltyRate',
}

/**
 * 罚息列表 - 列表
 */
export const getPenaltyList = (params = {}) => {
  return defHttp.get({ url: Api.GetPenaltyList, params })
}

/**
 * 罚息列表 - 新增/修改
 */
export const setPenaltyItem = (data = {}) => {
  return defHttp.post({ url: Api.SetPenaltyList, data })
}
