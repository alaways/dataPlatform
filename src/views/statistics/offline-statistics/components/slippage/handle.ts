import { cloneDeep } from 'lodash-es'
import { handleToFixed2 } from '/@/utils/tool'
/**
 * @param data 接口数据
 * @param list 展示数据
 */
export function handleData(data: any, list: any) {
  const dlist = cloneDeep(list)
  data.forEach((res) => {
    dlist.forEach((v) => {
      Object.keys(res).forEach((o) => {
        if (v.key && v.key == o) {
          v.num = res[o]
        }
      })
    })
  })
  return dlist
}

/**
 * 处理总数据
 * @param res 接口数据
 */
export function handleDetailsAll(res: any) {
  // 总数据直接匹配
  Object.keys(res).forEach((o) => {
    if (o.indexOf('Amount') != -1) {
      res[o] = res[o] / 100
    } else {
      res[o] = res[o]
    }
  })
  // 逾期率
  const yq = Number(res.overdueOrderCount) / Number(res.countExpireOrderWithSettle)
  // 账单回款比例
  const hkRate = handleToFixed2((1 - Number(yq)) * 100)
  // 到期买断订单
  const maturityCompletionOrder =
    Number(res['settleOrderCount']) - Number(res['buyOutOrderCount']) || 0
  return { ...res, hkRate, maturityCompletionOrder }
}

/**
 * @param res 接口数据
 * @param spuType 商品品类 1.手机 2.d电动车
 */
export function handleDetailsSpuType(res: any, spuType: number) {
  let overdueRate = Number(res.overdueOrderCount) / Number(res.countExpireOrderWithSettle)
  overdueRate = handleToFixed2(overdueRate * 100)
  return {
    [`overdueRateSpuType${spuType}`]: overdueRate, // 订单逾期率 - 实时
    [`overdueOrderCountSpuType${spuType}`]: res.overdueOrderCount, // 逾期订单数量
  }
}

/**
 * @param res 接口数据
 */
export function handleMainAll(res: any) {
  // 尾期订单逾期率
  let lastBillOrderRate = Number(res['countLastBillOverdue']) / Number(res['lastExpCount'])
  lastBillOrderRate = Number((lastBillOrderRate * 100).toFixed(2))

  // 尾期金额逾期率
  let lastBillAmountRate = Number(res['lastBillOverdueAmount']) / Number(res['lastExpAmount'])
  lastBillAmountRate = Number((lastBillAmountRate * 100).toFixed(2))
  return {
    overDueOrderCountGe5: res.overDueOrderCountGe5, // 逾期订单数(时间≥5天)
    countOverdueAmountGe5: res.countOverdueAmountGe5, // 逾期金额(时间≥5天)
    overdueAmountGe30: res.overdueAmountGe30, // 逾期金额(时间≥30天)
    overdueAmountGe180: res.overdueAmountGe180, // 逾期金额(时间≥180天)
    lastBillOrderRate, // 尾期订单逾期率
    lastBillAmountRate, // 尾期金额逾期率
  }
}

/**
 * @param res 接口数据
 * @param spuType 商品品类 1.手机 2.d电动车
 */
export function handleMainSpuType(res: any, spuType: number) {
  const countExpireOrder = Number(res['countExpireOrderWithSettle']) || 0
  const countExpireTotalAmount2 = Number(res['countExpireTotalAmount2']) || 0
  // 5天订单逾期率
  let overdueRate5 = Number(res['overDueOrderCountGe5']) / countExpireOrder
  overdueRate5 = Number((overdueRate5 * 100).toFixed(2))
  // 15天订单逾期率
  let overdueRate15 = Number(res['overDueOrderCountGe15']) / countExpireOrder
  overdueRate15 = Number((overdueRate15 * 100).toFixed(2))
  // 金额逾期率
  let sumAmountrRate = Number(res['countOverdueAmount']) / countExpireTotalAmount2
  sumAmountrRate = Number((sumAmountrRate * 100).toFixed(2))
  // 15天逾期率
  let sumAmountrRate15 = Number(res['overdueAmountGe15']) / countExpireTotalAmount2
  sumAmountrRate15 = Number((sumAmountrRate15 * 100).toFixed(2))
  // 30天金额逾期率
  let sumAmountrRate30 = Number(res['overdueAmountGe30']) / countExpireTotalAmount2
  sumAmountrRate30 = Number((sumAmountrRate30 * 100).toFixed(2))
  // 180天金额逾期率
  let sumAmountrRate180 = Number(res['overdueAmountGe180']) / countExpireTotalAmount2
  sumAmountrRate180 = Number((sumAmountrRate180 * 100).toFixed(2))

  return {
    [`overdueRate5SpuType${spuType}`]: overdueRate5,
    [`overdueRate15SpuType${spuType}`]: overdueRate15,
    [`sumAmountrRateSpuType${spuType}`]: sumAmountrRate,
    [`sumAmountrRate15SpuType${spuType}`]: sumAmountrRate15,
    [`sumAmountrRate30SpuType${spuType}`]: sumAmountrRate30,
    [`sumAmountrRate180SpuType${spuType}`]: sumAmountrRate180,
  }
}
