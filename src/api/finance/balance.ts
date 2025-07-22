import { UploadApiResult } from '../sys/model/uploadModel'
import { UploadFileParams } from '/#/axios'
import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetBalanceList = '/order/bill/settle/page',
  UpdateBalance = '/order/bill/settle',
}

/**
 * 货款结算对账 - 列表
 */
export const getBalanceList = (params = {}) => {
  return defHttp.get({ url: Api.GetBalanceList, params })
}

/**
 * 导出
 */
export const exportExcel = async (params) => {
  return defHttp.get(
    { url: `/order/bill/settle/export`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}

/**
 * 修改状态
 */
export const updateBalance = (data) => {
  return defHttp.put(
    { url: `${Api.UpdateBalance}/status`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 修改数据
 */
export const updateBalanceModal = (data) => {
  return defHttp.put(
    { url: `${Api.UpdateBalance}/${data.id}`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 修改，修改后的数据
 */
export const updateBalanceAfterModal = (data) => {
  return defHttp.put(
    { url: `${Api.UpdateBalance}2/${data.id}`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 订单导入excel
 */
export function impExcelApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: any) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      timeout: 60 * 60 * 1000,
      url: '/api/order/bill/settle/import',
      onUploadProgress,
    },
    params,
  )
}
