import dayjs from 'dayjs'
import { floatToIntNumber, formatDecimal } from '/@/utils/tool'
import { usePermission } from '/@/hooks/web/usePermission'
const { hasPermission } = usePermission()
/**
 * 处理不是金额字段
 * 逾期罚金,可预付期数,分期间隔,总租期,租赁类型
 */
export const filterate = [
  'dailyDepreciation',
  'prepayPeriods',
  'periodInterval',
  'totalPeriods',
  'rentType',
  'id',
  'penaltyRate',
  'totalTenancy',
  'totalPeriodsNum',
  'type',
  'dayTn',
]
/**
 * day 间隔天数
 */
export const rentTypeList = [
  { label: '日付', value: 0, day: 1 },
  { label: '周付', value: 1, day: 7 },
  // { label: '月付', value: 2, day:  30 },
  { label: '月付', value: 3, day: 30 },
  { label: '十天', value: 4, day: 10 },
]
// 计价方式
export const goodTypeList = [
  // { label: '默认', value: 1 },
  { label: '计算器计价', value: 2 },
  { label: '地区政策表', value: 3 },
  // { label: '0首付', value: 4 },
]
/**
 * 处理金额
 * @param data 对象
 * @param multiplication 是否是乘法
 */
export function handlenAmount(data: any, multiplication: boolean) {
  Object.keys(data).forEach((e) => {
    if (filterate.includes(e)) return
    if (typeof data[e] != 'number') return
    if (multiplication) {
      data[e] = Number((data[e] * 100).toFixed(0))
    } else {
      data[e] = data[e] / 100
    }
  })
  return data
}
/**
 * 获取计划表格
 * @param e 改变的change值
 * @param formModel 其他字段
 * @param type 类型
 */
export function handleTable(e, formModel, type) {
  // 租期: periodNo  间隔天数: intervalDays 应付金额: repayAmount
  const table: any = []
  let totalAmount = floatToIntNumber(formModel.totalAmount)
  let totalTenancy = Number(formModel.totalTenancy)
  let dayInterval = formModel.rentType || formModel.rentType === 0
  let downPaymentRentAmount = floatToIntNumber(formModel.downPaymentRentAmount)
  let monthPayments = floatToIntNumber(formModel.monthPayments)
  let types = formModel.type
  let dayTn = formModel.dayTn || 0

  if (type == 'totalAmount') {
    // 总金额
    totalAmount = floatToIntNumber(e)
  } else if (type == 'totalTenancy') {
    // 总期数
    totalTenancy = e
  } else if (type == 'rentType') {
    dayInterval = e
  } else if (type == 'downPaymentRentAmount') {
    downPaymentRentAmount = floatToIntNumber(e)
  } else if (type == 'monthPayments') {
    monthPayments = floatToIntNumber(e)
  } else if (type == 'type') {
    types = e
  } else if (type == 'dayTn') {
    dayTn = e
  }
  // 非首付没有D+N
  if (types != 4) {
    dayTn = 0
  }
  const dayCount: any = rentTypeList.find((v) => v.value == dayInterval)
  switch (types) {
    case 1:
      const repayAmount = (parseInt(totalAmount / totalTenancy) / 100).toFixed(2) || 0
      for (let i = 0; i < totalTenancy; i++) {
        table.push({
          periodNo: i + 1,
          intervalDays: i * dayCount.day,
          repayAmount: Number(repayAmount),
          billDate: handleBillDate(i, dayInterval, dayTn),
          auto: true,
        })
      }
      // 计算表格金额-有可能除不尽小数（精确度丢失）
      let totalSum = table.reduce(
        (sum, currentObject) => Number(sum) + Number(currentObject.repayAmount),
        0,
      )
      totalSum = Number((totalSum * 100).toFixed(2))
      // 如果不等于，则不到首期
      if (totalSum != totalAmount) {
        const num = Number(((totalAmount - totalSum) / 100).toFixed(2))
        if (table[0]) {
          table[0].repayAmount = Number((table[0].repayAmount + num).toFixed(2))
        }
      }
      // table.unshift({
      //   periodNo: 1,
      //   intervalDays: dayCount.day,
      //   repayAmount: Number((downPaymentRentAmount / 100).toFixed(2)) || 0,
      //   billDate: handleBillDate(0, dayInterval, dayTn),
      //   auto: true,
      // })
      break
    case 2:
      // 计算总租金
      const sum = (totalTenancy - 1) * Number(monthPayments) + Number(downPaymentRentAmount)
      formModel.totalAmount = sum / 100
      for (let i = 1; i < totalTenancy; i++) {
        table.push({
          periodNo: i + 1,
          intervalDays: (i + 1) * dayCount.day,
          repayAmount: Number(monthPayments / 100),
          billDate: handleBillDate(i, dayInterval, dayTn),
          auto: true,
        })
      }
      table.unshift({
        periodNo: 1,
        intervalDays: dayCount.day,
        repayAmount: Number((downPaymentRentAmount / 100).toFixed(2)) || 0,
        billDate: handleBillDate(0, dayInterval, dayTn),
        auto: true,
      })
      break
    default:
      formModel.totalAmount = (totalTenancy * Number(monthPayments)) / 100
      for (let i = 0; i < totalTenancy; i++) {
        table.push({
          periodNo: i + 1,
          intervalDays: i * dayCount.day,
          repayAmount: Number(monthPayments / 100),
          billDate: handleBillDate(i, dayInterval, dayTn),
          auto: true,
        })
      }
      break
  }
  if (!dayInterval && dayInterval != 0) {
    return []
  }
  return table
}

// 重新处理表单的onChange方法，去处理展示表格
export function handleUpdateSchema(fromChange, planData, updateSchema, rentTypeLists) {
  updateSchema([
    {
      label: '租赁类型',
      field: 'rentType',
      componentProps: ({ formModel }) => {
        return {
          options: rentTypeList,
          onChange: (e: any) => {
            fromChange.value.rentType = e
            planData.value = handleTable(e, formModel, 'rentType')
            const find = rentTypeLists.find((v) => {
              if ((e == 2 || e == 3) && v.rentType == 2) {
                return true
              }
              return v.rentType == e
            })
            if (find) {
              formModel.penaltyRate = find.rentType
            }
          },
        }
      },
    },
    {
      label: '首付租金',
      field: 'downPaymentRentAmount',
      componentProps: ({ formModel }) => {
        return {
          step: 0.01,
          min: 0,
          addonBefore: '￥',
          addonAfter: '元',
          formatter: (value) => formatDecimal(value),
          parser: (value) => formatDecimal(value),
          onChange: (e: any) => {
            fromChange.value.downPaymentRentAmount = e
            if (!formModel.rentType && formModel.type != 1) {
              formModel.totalAmount = e
              fromChange.value.totalAmount = e
            }
            planData.value = handleTable(e, formModel, 'downPaymentRentAmount')
          },
          // onBlur: (e) => {
          //   const value = e.target.value
          //   if (Number(value) > formModel.totalAmount) {
          //     createMessage.error('首付租金不能大于总租金')
          //   }
          // },
        }
      },
    },
    {
      label: '月付租金',
      field: 'monthPayments',
      componentProps: ({ formModel }) => {
        return {
          step: 0.01,
          min: 0,
          addonBefore: '￥',
          addonAfter: '元',
          formatter: (value) => formatDecimal(value),
          parser: (value) => formatDecimal(value),
          onChange: (e: any) => {
            fromChange.value.monthPayments = e
            planData.value = handleTable(e, formModel, 'monthPayments')
          },
        }
      },
    },
    {
      label: '总租期',
      field: 'totalTenancy',
      componentProps: ({ formModel, formActionType }) => {
        return {
          step: 1,
          min: 1,
          max: 366,
          addonAfter: '期数',
          formatter: (value) => parseInt(value),
          parser: (value) => parseInt(value),
          onChange: (e: any) => {
            const options: any = []
            for (let i = 0; i < e; i++) {
              options.push({ label: `${i + 1}`, value: i + 1 })
            }
            console.log(e)

            const { updateSchema } = formActionType
            updateSchema({
              field: 'prepayable',
              componentProps: () => {
                return { options }
              },
            })
            fromChange.value.totalTenancy = e
            planData.value = handleTable(e, formModel, 'totalTenancy')
          },
        }
      },
    },
    {
      label: '总租金',
      field: 'totalAmount',
      helpMessage: fromChange.totalAmountMessage,
      componentProps: ({ formModel }) => {
        return {
          step: 0.01,
          min: 0,
          addonBefore: '￥',
          addonAfter: '元',
          disabled: formModel.type != 1,
          formatter: (value) => formatDecimal(value),
          parser: (value) => formatDecimal(value),
          onChange: (e: any) => {
            fromChange.value.totalAmount = e
            planData.value = handleTable(e, formModel, 'totalAmount')
          },
        }
      },
    },
    {
      field: 'dayTn',
      componentProps: ({ formModel }) => {
        return {
          step: 1,
          min: 0,
          addonAfter: '天后付第一期租金',
          disabled: !hasPermission('GoodsListLeaseDayTnUpdate'),
          onChange: (e: any) => {
            fromChange.value.dayTn = e
            planData.value = handleTable(e, formModel, 'dayTn')
          },
        }
      },
    },
  ])
}

/**
 * 获取账单日
 * @param totalTenancy
 * @param rentType 0.日付 1.周付 2.月份(按30天算) 3.月份(自然月)
 * @param dayTn D+dayTn天的账单日
 */
export function handleBillDate(totalTenancy, rentType: any, dayTn: any) {
  // 获取当天日期
  const currentDate = dayjs()
  let date = currentDate.add(dayTn, 'day')
  if (!totalTenancy) {
    return date.format('YYYY-MM-DD')
  }
  switch (rentType) {
    case 3:
      const nextMonthDate = date.add(totalTenancy, 'month')
      if (nextMonthDate.date() < date.date()) {
        date = nextMonthDate.endOf('month')
      } else {
        date = nextMonthDate
      }
      break
    default:
      const dayCount: any = rentTypeList.find((v) => v.value == rentType)
      date = date.add(totalTenancy * dayCount.day, 'day')
  }
  return date.format('YYYY-MM-DD')
}
