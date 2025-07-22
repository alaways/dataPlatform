import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetIsurancePreviewList = '/proposal/page',
}

/**
 * 查询投保记录
 */
export const getIsurancePreviewList = (params) => {
  return defHttp.get({ url: Api.GetIsurancePreviewList, params })
}
