import { ContentTypeEnum } from '/@/enums/httpEnum'
import { defHttp } from '/@/utils/http/axios'

enum Api {
  QueryRiskControl = '/v2/risk/startRisk',
  GetRiskControl = '/v2/risk/getRiskInfo',
  QueryNewRiskControl = '/risk240909/score',
  GetNewRiskControl = '/risk240909/getScoreInfo',
  GetOrangeRiskControl = '/risk240909/ycRiskInfo',
  GetRejectMap = '/v2/risk/getRejectMap',
  GetElements = '/risk/newcal/twoElements',
}

/**
 * 风控用户查询
 */
export const queryRiskControl = (data = {}) => {
  return defHttp.post(
    {
      url: Api.QueryRiskControl,
      data,
      timeout: 30000,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    },
    { isTransformResponse: false },
  )
}

/**
 * 获取风控信息
 */
export const getRiskControl = (params = {}) => {
  return defHttp.get({ url: Api.GetRiskControl, params })
}

/**
 * 新-风控用户查询 - 随心洗风控
 */
export const queryNewRiskControl = (params = {}) => {
  return defHttp.get(
    {
      url: Api.QueryNewRiskControl,
      params,
      timeout: 30000,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    },
    { isTransformResponse: false },
  )
}

/**
 * 新-获取风控信息 - 随心洗风控
 */
export const getNewRiskControl = (params = {}) => {
  return defHttp.get({ url: Api.GetNewRiskControl, params }, { isTransformResponse: false })
}

/**
 * 风控 - 错误码 k,v
 */
export const getRiskMap = (params = {}) => {
  return defHttp.get({ url: Api.GetRejectMap, params })
}

/**
 * 二要素查询
 */
export const queryElements = (params = {}) => {
  return defHttp.get({
    url: Api.GetElements,
    params,
    timeout: 30000,
  })
}

/**
 * 三要素查询列表
 */
export const getThreeQueryList = (params) => {
  return defHttp.get({ url: '/risk/new/jiTang/page', params })
}
/**
 * 三要素导出
 */
export const exportThreeQueryExcel = async (params) => {
  return defHttp.get(
    { url: `/risk/new/jiTang/export `, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}

/**
 * 三要素查询列表 - 旧
 */
export const getThreeQueryOldList = (params) => {
  return defHttp.get({ url: '/risk/jiTang/page', params })
}
/**
 * 三要素导出 - 旧
 */
export const exportThreeQueryOldExcel = async (params) => {
  return defHttp.get(
    { url: `/risk/jiTang/export`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}

/**
 * 获取风控信息 - 有橙
 */
export const getOrangeRiskControl = (params) => {
  return defHttp.get({
    url: Api.GetOrangeRiskControl,
    params: {
      ruleGroup: 'xian_shang',
      ...params,
    },
  })
}
