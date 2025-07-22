import { defHttp } from '/@/utils/http/axios'

/**
 * 预览 - 投保接口
 */
export const getIsurancePreview = (params: any) => {
  return defHttp.get({ url: `/avatar/check/proposal/${params.merchantCode}/${params.orderId}` })
}

/**
 * 确认 - 投保接口
 */
export const getIsurancePreviewConfirm = (params: any) => {
  return defHttp.get({ url: `/avatar/general/proposal/${params.merchantCode}/${params.orderId}` })
}
