import { defHttp2 } from '/@/utils/http/axios'

/**
 * 资金统计
 */
export const getFinanceCard = () => {
  return defHttp2.get({ url: '/v2/statistics4Ecard/fundsMain' })
}
