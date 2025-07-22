import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetRemitList = '/collects/task/returned/record/page',
}

/**
 * 回款列表 - 列表
 */
export const getRemitList = (params = {}) => {
  return defHttp.get({ url: Api.GetRemitList, params })
}

/**
 * 回款列表 - 导出
 */
export const exportExcel = async (params) => {
  return defHttp.get(
    {
      url: `/collects/task/returned/record/export`,
      params,
      responseType: 'blob',
      timeout: 60 * 1000,
    },
    { isReturnNativeResponse: true },
  )
}
