import { defHttp } from '/@/utils/http/axios'
/**
 * 通过订单编码查询用户信息
 */
export const searchUserOrder = (params = {}) => {
  return defHttp.get({ url: '/order/supp/contract/get', params })
}
/**
 * 补充协议回调通知
 */
export const contractNotifyUrl = (params = {}) => {
  return defHttp.get({ url: '/order/supp/contract/notifyUrl', params })
}

/**
 * 生成E签宝的签约链接
 */
export const createEsgineLink = (params) => {
  return defHttp.get({ url: '/order/supp/contract/create', params })
}
/**
 * 获取记录列表数据
 */
export const getContractPage = (params: any) => {
  return defHttp.get({ url: `/order/supp/contract/page`, params })
}
/**
 * 获取记录列表数据
 */
export const downloadContractList = async (orderSn) => {
  const params = {}
  return defHttp.get(
    { url: `/order/supp/contract/download/${orderSn}`, params, responseType: 'blob' },
    { isReturnNativeResponse: true },
  )
}
