import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetOperationList = '/v2/statistics/orderOperateInto',
}
/**
 * 运营统计 - 表格
 */
export const getOperationList = (params) => {
  return defHttp.get({ url: Api.GetOperationList, params })
}
