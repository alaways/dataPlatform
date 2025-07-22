import { defHttpOffline } from '/@/utils/http/axios'
// 获取 曲线图 30天内的数据
export const orderDataLineChart = async (params) => {
  return defHttpOffline.get(
    { url: `/v2/statistics/new/orderDataLineChart`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
// 获取线下 数据汇总
export const getBIwMain = async (params) => {
  return defHttpOffline.get(
    { url: `/v2/statistics/new/bi/main`, params, timeout: 60 * 1000 },
    { isTransformResponse: false },
  )
}
