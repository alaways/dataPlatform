import { UploadApiResult } from '../sys/model/uploadModel'
import { UploadFileParams } from '/#/axios'
import { ContentTypeEnum } from '/@/enums/httpEnum'
import { defHttp, defHttpRisk } from '/@/utils/http/axios'

enum Api {
  GetOrderList = '/order/new/page',
  GetOrderAuditList = '/orderAudit/rent/page',
  GetOrderRepayList = '/order/repay/page',
  GetOrderSlippageList = '/order/overdue/page',
  GetOrderDeliveryList = '/order/delivery/page',
  GetOrderRecordList = '/order/pay/record/page',
  UpdateOrderListItem = '/v2/sysOrderList/saveOrUpdate',
  GetOrderDetail = '/order/detail/',
  GetFastMailList = '/kuaidi/list',
  UpdateDelivery = `/orderDelivery`,
  GetMerchantOrder = `/merchant/manage/order/allocat/new/page`,
}

/**
 * 订单列表 - 列表
 */
export const getOrderList = (params) => {
  return defHttp.get({ url: Api.GetOrderList, params })
}

/**
 * 订单列表 - 待审核列表
 */
export const getOrderAuditList = (params) => {
  return defHttp.get({ url: Api.GetOrderAuditList, params })
}

/**
 * 订单列表 - 待支付列表
 */
export const getOrderPayList = (params) => {
  return defHttp.get({ url: Api.GetOrderRepayList, params })
}

/**
 * 订单列表 - 待发货列表
 */
export const getOrderDeliveryList = (params) => {
  return defHttp.get({ url: Api.GetOrderDeliveryList, params })
}

/**
 * 订单列表 - 已支付列表
 */
export const getOrderPaidList = (params) => {
  return defHttp.get({ url: Api.GetOrderRecordList, params })
}

/**
 * 订单列表 - 逾期列表
 */
export const getOrderSlippageList = (params) => {
  return defHttp.get({ url: Api.GetOrderSlippageList, params })
}

/**
 * 订单列表 - 可分配商家列表
 */
export const getMerchantOrderList = (params) => {
  return defHttp.get({ url: Api.GetMerchantOrder, params })
}

/**
 * 订单列表 - 可分配商家列表 - 总数据统计
 */
export const getMerchantOrderDetailList = (params: any) => {
  // /merchant/manage/account/detail 旧接口
  return defHttp.get({ url: '/merchant/manage/account/new/detail', params })
}

/**
 * 订单列表 - 可分配商家列表 - 批量
 */
export const allocationBatchOrderStore = async (data) => {
  return defHttp.post(
    { url: `/merchant/manage/order/new/batch`, data },
    {
      errorMessageMode: 'message',
      isReturnNativeResponse: true,
    },
  )
}

/**
 * 订单列表 - 修改or添加
 */
export const updateOrderListItem = (data) => {
  return defHttp.post(
    { url: Api.UpdateOrderListItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 订单详情
 */
export const getOrderDetail = (id) => {
  return defHttp.get({ url: Api.GetOrderDetail + id })
}
/**
 * 确认支付
 */
export const getOrderCancle = async (data: any) => {
  return defHttp.put(
    { url: `/order/${data.id}/cancel`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 新增订单审核结果
 * ${data.id}/result
 */
export const updateOrderAudit = async (data: any) => {
  return defHttp.put(
    { url: `/orderAudit/${data.id}/result`, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 新增物流信息
 */
export const updateDelivery = async (data: any) => {
  return defHttp.post({ url: Api.UpdateDelivery, data }, { isReturnNativeResponse: true })
}
/**
 * 取消物流发货
 */
export const cancleDelivery = async (orderSn: any) => {
  return defHttp.get({ url: `${Api.UpdateDelivery}/cancelOrder/${orderSn}` })
}
/**
 * 打印快递面单
 */
export const getPrintExpressWaybill = async (orderId: any) => {
  return defHttp.get({ url: '/cloudAttachment', params: { orderId } })
}
/**
 * 打开快递面单
 */
export const getOpenPrintExpressWaybill = async (orderId: any) => {
  return defHttp.get({ url: '/orderDelivery/printOrder', params: { orderId } })
}
/**
 * 获取物流信息列表
 */
export const getFastMailList = async () => {
  return defHttp.get({ url: Api.GetFastMailList })
}
/**
 * 查询物流信息
 */
export const getSFLogisticsRoute = async (params) => {
  return defHttp.get({ url: '/sf/listOrderRoute', params })
}
/**
 * 查询顺丰物流信息
 */
export const getSFLogistics = async (params) => {
  return defHttp.get({ url: '/sf/getInfo', params })
}

/**
 * 确认支付
 */
export const getOffline = async (data) => {
  return defHttp.put({ url: `/order/${data.id}/offline` })
}
/**
 * 确认支付 - new
 */
export const getOfflineNew = async (data: any) => {
  // return defHttp.put({ url: `/order/${data.orderId}/${data.totalAmount * 100}/offline` })
  return defHttp.post({ url: `/order/offline`, data })
}
/**
 * 确认支付 - 获取支付二维码 - 乐刷
 */
export const getUploadAuthcode = async (data) => {
  return defHttp.post({ url: `/quickPay/lepos/uploadAuthcode`, data })
}
/**
 * 确认支付 - 获取支付二维码 - 银联
 */
export const getChinaumsAuthcode = async (data) => {
  return defHttp.post({ url: `/chinaums/qrCodePay`, data })
}

/**
 * 订单详情 - 修改渠道
 */
export const updateChannelCode = async (data) => {
  return defHttp.put({ url: `/order/channelCode/${data.id}/${data.channelCode}` })
}

/**
 * 订单详情 - 修改审核人员
 */
export const updateAuditOrder = async (data) => {
  return defHttp.post({ url: `/orderAudit/update`, data })
}
/**
 * 订单详情 - 修改收货地址
 */
export const updateAddress = async (data) => {
  return defHttp.put({ url: `/order/address/${data.id}`, data })
}
/**
 * 订单详情 - 校验串号
 */
export const checkIfSerialNumber = async (params) => {
  return defHttp.get({ url: `/order/checkIfSerialNumber`, params }, { isTransformResponse: false })
}

/**
 * 订单详情 - 修改备注
 */
export const updateRemarkApi = async (data) => {
  return defHttp.put({ url: `/order/${data.id}`, data })
}

/**
 * 订单导出全部订单excel - old
 */
export const exportExcel = async (params) => {
  return defHttp.get(
    { url: `/order/export`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}

/**
 * 订单导出全部订单excel - 异步导出
 */
export const export1Excel = async (params) => {
  return defHttp.get({ url: `/order/export1`, params, timeout: 60 * 1000 })
}
/**
 * 订单导出全部订单excel - 下载
 */
export const exportDownloadExcel = async (params) => {
  return defHttp.get(
    { url: `/order/export2`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}
/**
 * 订单导出全部订单excel3 - 异步导出 配合 下载列表
 */
export const export3Excel = async (params) => {
  return defHttp.get(
    { url: `/order/new/export3`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
/**
 * 订单导出逾期订单excel3 - 异步导出 配合 下载列表
 */
export const export3OverdueExcel = async (params) => {
  return defHttp.get(
    { url: `/order/overdue/export3`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
/**
 * 订单导出商家订单excel
 */
export const exportStoreExcel = async (params) => {
  return defHttp.get(
    { url: `/merchant/manage/order/export`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}
/**
 * 订单导出可分配订单excel
 */
export const exportAllocationExcel = async (params) => {
  return defHttp.get(
    {
      url: `/merchant/manage/order/allocat/new/pageExport`,
      params,
      responseType: 'blob',
      timeout: 60 * 1000,
    },
    { isReturnNativeResponse: true },
  )
}
/**
 * 订单导出 - 即将到期订单excel
 */
export const exportSoonExcel = async (params) => {
  return defHttp.get(
    { url: `/order/upcomingOrderPageExport`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}

/**
 * 订单导出 - 申请即将到期订单excel
 */
export const exportApplyForSoonExcel = async (params) => {
  return defHttp.get(
    { url: `/order/upcomingOrderPageExport/async`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
/**
 * 订单下载合同excel
 */
export const exportContract = async (params) => {
  return defHttp.get(
    { url: `/contract/download`, params, responseType: 'blob' },
    { isReturnNativeResponse: true },
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
      url: '/api/orderDelivery/importDelivery',
      onUploadProgress,
    },
    params,
  )
}

/**
 * 获取用户关系
 */
export const getUserConcern = async (params) => {
  return defHttp.get({ url: `/applet/config/find/label`, params })
}

/**
 * 获取用户关系
 */
export const updateOrderUser = async (data) => {
  return defHttp.post(
    { url: `/userIdentify/update`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 分配商家列表 - 分配商家
 */
export const allocationOrderStore = async (data) => {
  return defHttp.post(
    { url: `/merchant/manage/new/order`, data },
    {
      errorMessageMode: 'message',
      isReturnNativeResponse: true,
    },
  )
}

/**
 * 分配商家列表 - 分配
 */
export const allocationCancelOrderStore = async (data) => {
  return defHttp.post(
    { url: `/merchant/manage/order`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 商家订单列表 - 商家订单列表
 */
export const getOrderStoreList = async (params) => {
  return defHttp.get(
    { url: `/merchant/manage/order/page`, params },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 商家订单列表 - 是否接单
 */
export const uploadAllocationOrderStore = async (data) => {
  return defHttp.put(
    { url: `/merchant/manage/order/status/${data.id}/${data.ifOrder}` },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 订单 - 账单列表
 * 修改账单日期
 */
export const updateBillDate = async (data: any) => {
  return defHttp.post({ url: `/orderBillItem/update/repayDate`, data })
}
/**
 * 订单 - 账单列表
 * 修改账单逾期罚金
 */
export const updateBillPenaltyAmount = async (data: any) => {
  return defHttp.post({ url: `/orderBillItem/reducePenaltyAmount`, data })
}

/**
 * 订单 - 账单列表
 * 修改账单详情
 */
export const updatePayOutMerchantAccount = async (data: any) => {
  return defHttp.post({ url: `/orderBillItem/updatePayOutMerchantAccount`, data })
}

/**
 * 验证是否分配过该商家 - 分配列表
 * 0.未拒过 1以上拒过
 */
export const getAllocationStoreBool = async (params) => {
  return defHttp.get({ url: `/merchant/manage/checkMerchant/${params.merchantCode}/${params.id}` })
}

/**
 * 订单是否有支付
 */
export const getPayBool = async (params) => {
  return defHttp.get({ url: `/order/pay/record/find`, params })
}

/**
 * 即将到期订单
 */
export const getOrderUpcoming = async (params) => {
  return defHttp.get({ url: `/order/upcomingOrderPage`, params })
}

/**
 * 订单导出已支付订单excel
 */
export const exportPaidExcel = async (params) => {
  return defHttp.get(
    { url: `/order/pay/record/pageExport`, params, responseType: 'blob', timeout: 60 * 1000 * 10 },
    { isReturnNativeResponse: true },
  )
}

/**
 * 订单导出 - 申请已支付订单excel
 */
export const exportApplyForPaidExcel = async (params) => {
  return defHttp.get(
    { url: `/order/pay/record/pageExport/async`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}

/**
 * 撤销合同
 */
export const revokeContract = async (data) => {
  return defHttp.put(
    { url: `/order/status/${data.id}/301` },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 查询规格
 */
export const getSkuInfo = async (params) => {
  return defHttp.get({ url: `/specs/spu/${params.spuId}` })
}

/**
 * 修改规格
 */
export const updateSku = async (data) => {
  return defHttp.put(
    { url: `/orderItem/specs/${data.id}`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 查询紧急联系人 - 在其他订单作为紧急联系人
 */
export const getQueryEmergent = async (params) => {
  return defHttp.get({ url: `/order/emergentsCount`, params })
}
/**
 * 校验手机号状态
 * @param phone 手机号
 * @param expSeconds: 过期时间（加载时不用传，刷新传0即可）
 */
export const getQueryPhoneStatus = async (params) => {
  return defHttp.get({ url: `/sysUser/getSysPhoneStatus`, params })
}

/**
 * 校验交易单号
 * @param phone 手机号
 * @param expSeconds: 过期时间（加载时不用传，刷新传0即可）
 */
export const getPayLog = async (params) => {
  return defHttp.get({ url: `/order/getPayLog`, params })
}
/**
 * 校验身份证
 * @param id
 * @returns
 */
export function validateIdCard(id: string) {
  const regex = /^\d{15}$|^\d{17}(\d|X|x)$/
  return regex.test(id)
}

/**
 * 下载公证
 */
export const downloadEsnotary = async (params) => {
  return defHttp.get(
    { url: `/gz/download`, params, responseType: 'blob' },
    { isReturnNativeResponse: true },
  )
}

/**
 * 订单导出全部订单excel
 */
export const exportSlippageExcel = async (params) => {
  return defHttp.get(
    { url: `/order/overdue/pageExport`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}

/**
 * 纸质合同上传
 */
export const updateContract = async (data: any) => {
  return defHttp.post(
    { url: `/contract/upload`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 蚂蚁链 - 主动代扣重试
 */
export const getAntChainWithholding = async (params) => {
  return defHttp.get({ url: `/order/ato/retryWithholdPlan`, params })
}

/**
 * 蚂蚁链 - 用户解约审批申请
 */
export const getAntChainCancleContract = async (data) => {
  return defHttp.post({
    url: `/order/ato/confirmWithholdSignasyncunsign`,
    data,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  })
}

/**
 * 订单列表 - 订单批量收款
 */
export const getBatchCollectionOrderList = (params) => {
  return defHttp.get({ url: `/orderBillItem/page`, params })
}

/**
 * 订单列表 - 批量修改罚金
 */
export const getBatchCollectionFineOrder = (data: any) => {
  return defHttp.post({ url: `/orderBillItem/batch/reducePenaltyAmount`, data })
}

/**
 * 订单列表 - 批量修改罚金
 */
export const getBatchCollectionPaymentOrder = (data: any) => {
  return defHttp.post({ url: `/quickPay/batch/lepos/uploadAuthcode`, data })
}

/**
 * 订单导入起诉excel
 */
export function impExcelProsecutionApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: any) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      timeout: 60 * 60 * 1000,
      url: '/api/order/prosecute/import',
      onUploadProgress,
    },
    params,
  )
}

/**
 * 订单导入分配excel
 */
export function impExcelAllocationApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: any) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      timeout: 60 * 60 * 1000,
      url: '/api/collects/task/followBy/import',
      onUploadProgress,
    },
    params,
  )
}
// RISK 风控的征信查询接口 start
/**
 * 获取订单详情
 */
export const getRiskOrderDetail = (id) => {
  return defHttpRisk.get({ url: '/order/rs/approval/detail/new/' + id })
}

/**
 * 订单审批
 */
export const setOrderApproval = (data) => {
  return defHttpRisk.post(
    { url: '/order/rs/approval', data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 第三数据
 */
export const getRiskData = (data) => {
  return defHttpRisk.post({ url: `risk/info/queryRiskData`, data })
}
// 获取征信报告
export function getQueryFasoApi(data) {
  return defHttpRisk.post(
    { url: '/faso/report/queryFaso', data },
    {
      errorMessageMode: 'message',
      hideErrorMsg: true,
      isReturnNativeResponse: true,
    },
  )
}

// 获取征信用户数据
export function getUserInfoApi(data) {
  return defHttpRisk.post(
    { url: '/faso/report/applyOrderQuery', data },
    {
      errorMessageMode: 'message',
      isReturnNativeResponse: true,
    },
  )
}
// RISK 风控的征信查询接口 end
// 风控的接口
// 获取征信用户数据
export function getLlxzStatistic(data) {
  return defHttpRisk.get({ url: '/lxz/busShop/llxzStatistic', data })
}
// 订单最新页面
export const orderNewPage = (data: any) => {
  return defHttp.post({ url: `/order/new/page`, data })
}
/**
 * 法务起诉 - 列表
 */
export const getOrderCactratList = (params) => {
  return defHttp.get({ url: '/prosecute/contract/page', params })
}
/**
 * 订单列表锦州 - 订单批量收款
 */
export const orderBillItemPage = (params) => {
  return defHttp.get({ url: `/orderBillItem/new/page`, params })
}

/**
 * 订单列表锦州 - 批量修改罚金
 */
export const reducePenaltyAmount = (data: any) => {
  return defHttp.post({ url: `/orderBillItem/batch/reducePenaltyAmount`, data })
}

/**
 * 订单列表锦州 - 批量收款
 */
export const batchBillAmount = (data: any) => {
  return defHttp.post({ url: `/orderBillItem/batch/billAmount`, data })
}
