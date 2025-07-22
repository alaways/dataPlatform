import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetStoreList = '/merchant/manage/account/page',
  GetStoreNoPage = '/merchant/manage/account/list',
  UpdateStoreItem = '/merchant/manage/account',
  DelStoreItem = '/v2/sysStore/remove',
}

/**
 * 商户列表 - 列表
 */
export const getStoreList = (params) => {
  return defHttp.get({ url: Api.GetStoreList, params })
}

/**
 * 商户列表 - 列表-不需要分页
 */
export const getStoreNoPageList = () => {
  return defHttp.get({ url: Api.GetStoreNoPage })
}
/**
 * 商户列表 - 添加
 */
export const addStoreItem = (data) => {
  return defHttp.post(
    { url: Api.UpdateStoreItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 商户列表 - 修改
 */
export const updateStoreItem = (data) => {
  return defHttp.put(
    { url: `${Api.UpdateStoreItem}/${data.id}`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 商户列表 - 删除
 */
export const delStoreItem = (data) => {
  return defHttp.post(
    { url: Api.DelStoreItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 商户订单列表 - 列表
 */
export const getOrderStoreList = (params) => {
  return defHttp.get({ url: `/merchant/manage/order/receivt/page`, params })
}

/**
 * 商家余额充值
 */
export const updateStoreBalanceRecharge = (data) => {
  return defHttp.post({ url: `/merchant/manage/account/recharge`, data })
}
/**
 * 批量接单
 */
export const batchIfOrder = (data) => {
  // /merchant/manage/order/new/batch

  return defHttp.post(
    { url: '/merchant/manage/order/batch/ifOrder', data },
    { isReturnNativeResponse: true },
  )
}
/**
 * 充值列表
 */
export const rechargeList = (params) => {
  return defHttp.get({ url: '/merchant/manage/account/confirm/recharge', params })
}
/**
 * 充值列表 确认 取消的操作
 * 确认充值状态 0-处理中 1-已确认 2-已取消
 */
export const rechargeStatus = (data) => {
  return defHttp.put(
    { url: `/merchant/manage/account/confirm/recharge/status/${data.id}/${data?.status}` },
    { isReturnNativeResponse: true },
  )
}
/**
 * 商户列表 - 列表
 */
export const manageOrder = (params) => {
  return defHttp.get({ url: '/merchant/manage/new/order', params })
}
