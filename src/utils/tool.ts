import dayjs from 'dayjs'
import { isNumber } from '/@/utils/is'
import { getPreviewPDF } from '../api/sys/upload'

/**
 * 格式化数值
 * @param num 数值
 * @param decimals 要显示的小数位数
 * @param decimal 十进制分割
 * @param separator 分隔符
 * @param prefix 前缀
 * @param suffix 后缀
 * @param isNot100 是否除100
 * @returns
 */
export function formatNumber(
  num,
  decimals = 0,
  decimal = '.',
  separator = ',',
  prefix = '',
  suffix = '',
  isNot100 = false,
) {
  if (!num && num !== 0) {
    return ''
  }
  if (!isNot100) {
    num = num / 100
  }
  num = Number(num).toFixed(decimals)
  num += ''

  const x = num.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? decimal + x[1] : ''

  const rgx = /(\d+)(\d{3})/
  if (separator && !isNumber(separator)) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + separator + '$2')
    }
  }
  return prefix + x1 + x2 + suffix
}

/**
 * 小数转整数 处理精确度
 * 即 元转分
 */
export function floatToIntNumber(num: number) {
  return Number((num * 100).toFixed(0))
}

// 超出两位小数时进行格式转换
export function formatDecimal(value) {
  // 将非数字字符替换为空字符串
  const numericValue = value.replace(/[^\d.]/g, '')

  // 提取小数点前后的数字
  const parts = numericValue.split('.')
  const integerPart = parts[0]
  let decimalPart = parts[1] || ''

  // 限制小数点后两位
  decimalPart = decimalPart.slice(0, 2)

  // 拼接格式化后的值
  const formattedValue = decimalPart.length > 0 ? `${integerPart}.${decimalPart}` : integerPart

  return Number(formattedValue)
}
/**
 * 判断是否可以JSON
 */
export function canParseJSON(jsonString) {
  try {
    JSON.parse(jsonString)
    return true
  } catch (error) {
    return false
  }
}

// 在指定位置index插入数据value
export function insertAt(arr, index, value) {
  return arr.slice(0, index).concat(value).concat(arr.slice(index))
}

export type imgUploadFormat = {
  name: string
  status: string
  uid: string
  url: string
}
/**
 * 处理图片返回
 * 转成和imageUpload组件格式一样
 * @param fileList
 */
export function handleImgAfter(fileList) {
  const resultItems: imgUploadFormat[] = []
  fileList.forEach((v: any) => {
    if (v.url) {
      resultItems.push(v)
    } else {
      const response: any = v.response
      if (response.code == 200) {
        resultItems.push({
          name: v.name,
          status: v.status,
          uid: v.uid,
          url: response.data,
        })
      }
    }
  })
  return resultItems
}

/**
 * 处理图片返回格式
 */
export function handleImgUploadFormat(imgList: imgUploadFormat[]) {
  if (imgList && imgList.length) {
    return imgList.map((v) => {
      if (typeof v == 'string') {
        return v
      } else {
        return v.url
      }
    })
  }
  return []
}

/**
 * 处理金额
 * @param data 对象
 * @param multiplication false.分转元 true.元转分
 */
export function handlenAmount(data: any, multiplication: boolean) {
  Object.keys(data).forEach((e) => {
    if (typeof data[e] != 'number') return
    if (multiplication) {
      data[e] = Number((data[e] * 100).toFixed(0))
    } else {
      data[e] = Number(data[e]) / 100
    }
  })
  return data
}

export const validatePhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

export const handleTodayThan = (time) => {
  const targetTimeDayjs = dayjs(time, 'YYYY-MM-DD HH:mm:ss')
  const currentTime = dayjs()
  const isToday = currentTime.isSame(targetTimeDayjs, 'day')
  return isToday
}
export function handleImage(img: any) {
  if (!img) return ''
  if (typeof img != 'string') {
    const data = img.map((v) => v.url || v)
    return data.join(',')
  }
}

export function handleMonthToDay(date: string) {
  if (!date) return
  const str: string[] = date.split('-')
  const lastDay = dayjs(new Date(Number(str[0]), Number(str[1]) - 1))
    .endOf('month')
    .format('YYYY-MM-DD')
  return lastDay
}

export function handleToFixed2(num, toFixed = 2) {
  if (!num) num = 0
  return num.toFixed(toFixed)
}

/**
 * 判断时间是否为ISO格式并转成自己想要的时间格式
 * @param dateString 日期时间
 * @param formats 需要转的格式
 */
export function isValidISO8601(dateString: string, formats: string) {
  const date = dayjs(dateString)
  if (!isNaN(date.valueOf())) {
    return date.format(formats)
  }
  return dateString
}

/**
 * 获取 当前时间 至 某天 的 起始时间
 */
export function handleCurrentoDays(day: number) {
  const today = dayjs()
  const ago = today.subtract(day, 'day')
  return [ago.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')]
}

/**
 * 获取 当前时间 至 某月 的 起始时间
 * @param month 需要几个月份 如3则获取前3个月
 */
export function handleCurrentMonthToDays(month: number) {
  const today = dayjs()
  const monthsAgo = today.subtract(month, 'month')
  return [monthsAgo.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')]
}

/**
 *
 * @param url 预览
 */
export function handlePreviewPDF(url: any) {
  window.open(getPreviewPDF(url), '_blank')
}

/**
 * 分转元
 */
export function fenToYuan(num: number) {
  return Number((Number(num) / 100).toFixed(2))
}

/**
 * 元转分
 */
export function yuanToFen(num: number) {
  return Number((Number(num) * 100).toFixed(0))
}
