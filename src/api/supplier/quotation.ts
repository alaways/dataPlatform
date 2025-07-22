import { UploadApiResult } from '../sys/model/uploadModel'
import { UploadFileParams } from '/#/axios'
import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetQuotationList = '/spu/purchase/supplier/page',
}

/**
 * 供应商报价 - 列表
 */
export const getQuotationList = (params) => {
  return defHttp.get({ url: Api.GetQuotationList, params })
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
      url: '/api/spu/purchase/supplier/import',
      onUploadProgress,
    },
    params,
  )
}
