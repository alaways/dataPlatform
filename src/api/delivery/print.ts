import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetPrintList = '/orderDelivery/print/page',
}

/**
 * 打印面单 - 列表
 */
export const getPrintList = (params = {}) => {
  return defHttp.get({ url: Api.GetPrintList, params })
}
