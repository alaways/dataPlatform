import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetPreferentialList = '/coupon/page',
  updatePreferentialItem = '/coupon',
}

/**
 * 优惠券列表 - 列表
 */
export const getPreferentialList = (params = {}) => {
  return defHttp.get({ url: Api.GetPreferentialList, params })
}
/**
 * 优惠券列表 - 新增
 */
export const setPreferentialItem = (data = {}) => {
  return defHttp.post({ url: Api.updatePreferentialItem, data })
}
/**
 * 优惠券列表 - 修改
 */
export const updatePreferentialItem = (data: any) => {
  return defHttp.put({ url: `${Api.updatePreferentialItem}/${data.id}`, data })
}
/**
 * 优惠券列表 - 删除
 */
export const delPreferentialItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.updatePreferentialItem}/${id}` })
}
/**
 * 优惠券列表 - 领取记录
 */
export const getPreferentialRecordList = (params = {}) => {
  return defHttp.get({ url: `/userCouponRecord/page`, params })
}
/**
 * 优惠券列表 - 修改
 */
export const updatePreferentialStatusItem = (data: any) => {
  return defHttp.put({ url: `/coupon/${data.id}/${data.status}` })
}
