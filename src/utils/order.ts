import dayjs from 'dayjs'

/**
 * 获取本月时间段
 */
export function handleMonth() {
  const today = dayjs()
  const lastMonthSameDay = today.subtract(1, 'month')
  return [lastMonthSameDay.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')]
}
