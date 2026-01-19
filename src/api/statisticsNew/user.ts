import { defHttp2 } from '/@/utils/http/axios'

/**
 * 用户卡片统计
 */
export const getUserCard = () => {
  return defHttp2.get({ url: '/v2/statistics4Ecard/userMain' })
}
