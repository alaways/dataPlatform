import { getAppEnvConfig } from '/@/utils/env'
const { VITE_GLOB_API_URL } = getAppEnvConfig()
const toString = Object.prototype.toString

/**
 * 判断是否pre环境
 */
export function isPre() {
  return VITE_GLOB_API_URL && VITE_GLOB_API_URL.indexOf('pre') != -1
}
/**
 * 判断是否test环境
 */
export function isTest() {
  return VITE_GLOB_API_URL && VITE_GLOB_API_URL.indexOf('test') != -1
}
/**
 * 判断是否admin环境
 */
export function isAdmin() {
  return VITE_GLOB_API_URL && VITE_GLOB_API_URL.indexOf('admin') != -1
}

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}

export function isNull(val: unknown): val is null {
  return val === null
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export function isString(val: unknown): val is string {
  return is(val, 'String')
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp')
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName
}

export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map')
}

/**
 * 是否是IE浏览器
 */
export function isIEBrowse() {
  const ua = window.navigator.userAgent
  const msie = ua.indexOf('MSIE ') // IE 10 及更早版本
  const trident = ua.indexOf('Trident/') // IE 11
  return msie > -1 || trident > -1
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export function isUrl(path: string): boolean {
  const reg =
    /^(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?(\/#\/)?(?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

/**
 * 判断交易单号
 * 有线下 offline 字段使用 tradeNo 否则只用 outTradeNo
 * @param record 对象
 */
export function isTradeNoOffline(record) {
  return (
    String(record.bizType).indexOf('线下入账-') != -1 ||
    String(record.bizType).indexOf('_offline') != -1
  )
}
export function isGMTFormat(date) {
  const gmtRegex = /^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/
  if (typeof date === 'string' && gmtRegex.test(date)) {
    return true
  }
  return false
}
/**
 * 是否包含中文
 */
export function isChinese(str) {
  const chineseRegex = /[\u4e00-\u9fff]/
  return chineseRegex.test(str)
}
