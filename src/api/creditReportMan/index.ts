import { defHttp, defHttpRisk } from '/@/utils/http/axios'

/**
 * 征信管理列表
 */
export const getIsurancePreviewList = (params) => {
  return defHttp.get({ url: '/order/leasing/page', params })
}

/**
 * 查询各期还款上报
 */
export const getStageList = (params) => {
  return defHttp.get({ url: `/order/leasing/stage/${params?.orderId}` })
}
/**
 * 账单还款上报接口
 */
export const applyUpdate = (data) => {
  return defHttp.post(
    { url: '/leasing/apply/contract/apply', data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 手动上报接口
 */
export const LeasingRepayUpdate = (data) => {
  return defHttp.post({ url: '/order/leasing/repay', data })
}

// 下载 获取风控数据的详情
export const getDetail = (orderSn) => {
  return defHttpRisk.get({ url: '/order/rs/approval/detail/new/' + orderSn })
}
// 根据地址下载
export function downloadForUrl(url) {
  const params = { url }
  return defHttpRisk.get(
    { url: `/common/downloadByUrl`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}
