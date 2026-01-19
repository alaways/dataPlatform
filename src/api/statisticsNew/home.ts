import { LineParams } from './model/home'
import { defHttp2 } from '/@/utils/http/axios'

/**
 * 首页顶部卡片统计
 */
export const getMainCard = () => {
  return defHttp2.get({ url: '/v2/statistics4Ecard/main' })
}

/**
 * 折线图
 * @param type 用户: USRE_COUNT_EVERY_DAY4_ECARD , 订单: ORDER_COUNT_EVERY_DAY4_ECARD
 * @param days 天数
 */
export const getOrderMainLine = (params: LineParams) => {
  return defHttp2.get({ url: '/v2/statistics4Ecard/chartForDay', params })
}

/**
 * 地图 - 省
 * @param type 用户: USRE_COUNT_EVERY_DAY4_ECARD , 订单: ORDER_COUNT_EVERY_DAY4_ECARD
 * @param days 天数
 */
export const getMapMainLine = (params = {}) => {
  return defHttp2.get({ url: '/v2/statistics4Ecard/mainGroupByRegion', params })
}
