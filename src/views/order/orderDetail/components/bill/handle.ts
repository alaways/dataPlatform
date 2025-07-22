export function handleAntChainBill(list: any) {
  // 获取第一期租金
  const periodNoItem = list.find((v: any) => v.periodNo == 1)
  // 获取首付
  const dlist = list.filter((v: any) => v.sourceType == 0 || v.periodNo == 1)

  // 其他
  const otherList = list.filter((v: any) => v.sourceType != 0 && v.periodNo != 1)

  // 首条账单
  const downPayBill = dlist.reduce(
    (acc: any, curr: any) => {
      acc.billId += (acc.billId ? ',' : '') + curr.billId
      acc.billSn += (acc.billSn ? ',' : '') + curr.billSn
      acc.billItemSn += (acc.billItemSn ? ',' : '') + curr.billItemSn
      acc.sourceBizSn += (acc.sourceBizSn ? ',' : '') + curr.sourceBizSn
      acc.actualAmout += curr.actualAmout
      acc.repaidAmount += curr.repaidAmount
      acc.totalAmount += curr.totalAmount
      if (![3, 4].includes(curr.status)) {
        acc.penaltyAmount += curr.penaltyAmount
        acc.repaidPenaltyAmount += curr.repaidPenaltyAmount
        acc.repayAmount += curr.repayAmount
      }
      return acc
    },
    {
      ...periodNoItem,
      billId: '',
      billSn: '',
      billItemSn: '',
      sourceBizSn: '',
      actualAmout: 0,
      penaltyAmount: 0,
      repaidAmount: 0,
      repaidPenaltyAmount: 0,
      repayAmount: 0,
      totalAmount: 0,
    },
  )

  if ([3, 4].includes(downPayBill.status)) {
    otherList.push(downPayBill)
  } else {
    otherList.unshift(downPayBill)
  }
  return otherList
}

/**
 * 处理其他账单
 * 1.锁费+公证费用 = 监管锁及公证费
 * 2.同时提交的时候要转 锁费+公证费用的账单
 * @param billItemList 返回列表
 */
export function handleOhterBill(billItemList: any) {
  const lockList = billItemList.filter((v) => [21, 22].includes(v.type))
  if (lockList.length >= 2) {
    const filterList: any = billItemList.filter((v) => ![21, 22].includes(v.type))
    // 其他数据获取第一条
    // 叠加金额
    filterList.push({
      ...lockList[0],
      type: 100,
      id: lockList.map((v) => v.id).join(','),
      billId: lockList.map((v) => v.billId).join(','),
      billSn: lockList.map((v) => v.billSn).join(','),
      billItemSn: lockList.map((v) => v.billItemSn).join(','),
      actualAmout: lockList.reduce((sum, item) => sum + item.actualAmout, 0),
      penaltyAmount: lockList.reduce((sum, item) => sum + item.penaltyAmount, 0),
      repaidAmount: lockList.reduce((sum, item) => sum + item.repaidAmount, 0),
      repaidPenaltyAmount: lockList.reduce((sum, item) => sum + item.repaidPenaltyAmount, 0),
      repayAmount: lockList.reduce((sum, item) => sum + item.repayAmount, 0),
      totalAmount: lockList.reduce((sum, item) => sum + item.totalAmount, 0),
    })
    return filterList
  }
  return billItemList
}
