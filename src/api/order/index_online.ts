import { UploadApiResult } from '../sys/model/uploadModel'
import { UploadFileParams } from '/#/axios'
import { defHttpOnline } from '/@/utils/http/axios'

enum Api {
  GetOrderList = '/order/page',
  GetOrderAuditList = '/orderAudit/rent/page',
  GetOrderRepayList = '/order/repay/page',
  GetOrderSlippageList = '/order/overdue/page',
  GetOrderDeliveryList = '/order/delivery/page',
  GetOrderRecordList = '/order/pay/record/page',
  UpdateOrderListItem = '/v2/sysOrderList/saveOrUpdate',
  GetOrderDetail = '/order/detail/',
  GetFastMailList = '/kuaidi/list',
  UpdateDelivery = `/orderDelivery`,
  GetMerchantOrder = `/merchant/manage/order/allocat/page`,
}
/**
 * 订单导出全部订单excel3 - 异步导出 配合 下载列表
 */
export const export3Excel = async (params) => {
  return defHttpOnline.get(
    { url: `/order/export3`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
/**
 * 订单列表 - 列表
 */
export const getOrderList = (params) => {
  return defHttpOnline.get({ url: Api.GetOrderList, params })
}
/**
 * 订单导入excel
 */
export function impExcelApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: any) => void,
) {
  return defHttpOnline.uploadFile<UploadApiResult>(
    {
      timeout: 60 * 60 * 1000,
      url: '/api/orderDelivery/importDelivery',
      onUploadProgress,
    },
    params,
  )
}
// 获取订单管理的商品spu 数据
export const orderApprovalLock = async (orderId) => {
  return defHttpOnline.post(
    { url: `/oms/admin/order/approvalLock?orderId=${orderId}` },
    { isReturnNativeResponse: true },
  )
}
