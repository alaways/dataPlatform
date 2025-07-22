import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetOverdueLockList = '/order/page',
}

/**
 * 逾期管理锁列表 - 列表
 */
export const getOverdueLockList = (params = {}) => {
  return defHttp.get({ url: Api.GetOverdueLockList, params })
}

/**
 * 逾期管理锁列表 - 状态
 */
export const updateLock = (data) => {
  return defHttp.put({ url: `/order/${data.id}`, data })
}

/**
 * 订单导出可分配订单excel
 */
export const exportOverdueExcel = async (params) => {
  return defHttp.get(
    {
      url: `/order/overdueOrderExport`,
      params,
      responseType: 'blob',
      timeout: 60 * 1000,
    },
    { isReturnNativeResponse: true },
  )
}
