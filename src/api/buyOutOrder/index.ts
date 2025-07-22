import { defHttpRisk } from '/@/utils/http/axios'
import { UploadFileParams } from '/#/axios'
import { UploadApiResult } from '../sys/model/uploadModel'

/**
 * 支付宝数据 - 录入的列表
 */
export const getOrderStoreList = async (params) => {
  return defHttpRisk.get(
    { url: `/lxz/buyout/info/page`, params },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 支付宝数据 - 新增录入
 */
export const addOrderInfo = async (data) => {
  return defHttpRisk.post(
    { url: `/lxz/buyout/info/add`, data },
    {
      isReturnNativeResponse: true,
    },
  )
}
/**
 * 支付宝数据 - 更新录入
 */
export const updateOrderInfo = async (data) => {
  return defHttpRisk.post(
    { url: `/lxz/buyout/info/update`, data },
    {
      isReturnNativeResponse: true,
    },
  )
}
/**
 * 支付宝数据 - 删除某一列
 */
export const deleteOrderInfo = async (orderId) => {
  return defHttpRisk.get(
    { url: `/lxz/buyout/info//delete/${orderId}` },
    {
      isReturnNativeResponse: true,
    },
  )
}
/**
 * 支付宝数据 - 获取下载模版
 */
export const getTemplateInfo = async (params) => {
  return defHttpRisk.get(
    { url: `/lxz/buyout/info/template`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}
/**
 * 支付宝数据 - 导入数据
 */
export function importOrderData(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: any) => void,
) {
  return defHttpRisk.uploadFile<UploadApiResult>(
    {
      timeout: 60 * 60 * 1000,
      url: '/riskApi/lxz/buyout/info/importData',
      onUploadProgress,
    },
    params,
  )
}
