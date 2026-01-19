import { formatNumber } from '/@/utils/tool'

/**
 *  处理数据
 */
export function handleTableData(data: any, number: number, total: any) {
  // 1.将数据分成第2期账单 和 第3期及以上
  // 2.区分 overdue_type 当天还款、提前还款 0-未还 1-当天 2-提前
  console.log(data)
  console.log(total)
  if (data && data.length) {
    const list = data.filter((v) => v.period_no == number && v.overdue_type != 0)

    if (list && list.length) {
      list.sort((a, b) => {
        if (a.overdue_type > b.overdue_type) return 1
        if (a.overdue_type == b.overdue_type) return 0
        if (a.overdue_type < b.overdue_type) return -1
      })
      // 计算合计
      const item = handleTotal(list)
      list.push(item)

      // 计算 率
      const dlist = list.map((v) => {
        let title = '合计'
        if (v.overdue_type == 1) {
          title = '当天还款'
        } else if (v.overdue_type == 2) {
          title = '提前还款'
        }
        // 账单还款率
        const billRate = `${(
          (v.paid_full_bill_count / Number(total.paid_bill_count)) *
          100
        ).toFixed(2)}%`
        // 金额还款率
        const amountRate = `${((v.paid_bill_amount / total.exp_bill_amount) * 100).toFixed(2)}%`

        Object.keys(v).forEach((k) => {
          if (k.indexOf('amount') != -1) {
            v[k] = formatNumber(v[k], 2)
          }
        })
        return {
          ...v,
          title,
          billRate,
          amountRate,
        }
      })
      return dlist
    }
    return []
  }
  return []
}
/**
 * 处理合计
 */
export function handleTotal(dlist) {
  const item = dlist.reduce(
    (acc: any, curr: any) => {
      acc.collects_paid_bill_amount += Number(curr.collects_paid_bill_amount)
      acc.collects_paid_bill_count += Number(curr.collects_paid_bill_count)
      acc.exp_bill_amount += Number(curr.exp_bill_amount)
      acc.paid_full_bill_count += Number(curr.paid_full_bill_count)
      acc.paid_partial_bill_count += Number(curr.paid_partial_bill_count)
      acc.paid_bill_amount += Number(curr.paid_bill_amount)
      acc.count_period_no += Number(curr.count_period_no)
      acc.user_paid_bill_count += Number(curr.user_paid_bill_count)
      acc.user_paid_bill_amount += Number(curr.user_paid_bill_amount)
      return acc
    },
    {
      collects_paid_bill_amount: 0,
      collects_paid_bill_count: 0,
      exp_bill_amount: 0,
      paid_full_bill_count: 0,
      paid_partial_bill_count: 0,
      paid_bill_amount: 0,
      count_period_no: 0,
      user_paid_bill_count: 0,
      user_paid_bill_amount: 0,
    },
  )
  return item
}
