import { defHttp2 } from '/@/utils/http/axios'

/**
 * 订单卡片统计
 */
export const getOrderCard = () => {
  return defHttp2.get({ url: '/v2/statistics4Ecard/orderMain' })
}
