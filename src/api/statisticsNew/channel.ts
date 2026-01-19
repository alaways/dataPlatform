import { defHttp2 } from '/@/utils/http/axios'

/**
 * 渠道统计
 */
export const getChannelCard = () => {
  return defHttp2.get({ url: '/v2/statistics4Ecard/channelMain' })
}
