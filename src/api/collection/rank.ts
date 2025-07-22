import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetRankList = '/order/collectionRanking',
  getCollectionRankList2 = '/order/collectionRanking2',
  GetRankCount = '/order/collectionRankingInfo',
}

/**
 * 排行榜 - 列表
 */
export const getCollectionRankList = (params = {}) => {
  return defHttp.get({ url: Api.GetRankList, params })
}

/**
 * 排行榜 - 列表2
 */
export const getCollectionRankList2 = (params = {}) => {
  return defHttp.get({ url: Api.getCollectionRankList2, params })
}

/**
 * 排行榜 - 列表2
 */
export const getCollectionRankCount = (params = {}) => {
  return defHttp.get({ url: Api.GetRankCount, params })
}
