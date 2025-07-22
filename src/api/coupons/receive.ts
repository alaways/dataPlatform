import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetReceiveList = '/userCouponRecord/page',
  UpdateReceive = '/userCouponRecord',
}

/**
 * 领取列表 - 列表
 */
export const getReceiveList = (params = {}) => {
  return defHttp.get({ url: Api.GetReceiveList, params })
}

/**
 * 领取列表 - 删除
 */
export const delReceiveItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.UpdateReceive}/${id}` })
}

/**
 * 领取列表 - 回收
 */
export const recycleReceiveItem = (id: number | string) => {
  return defHttp.put({ url: `${Api.UpdateReceive}/recycle/${id}` })
}
