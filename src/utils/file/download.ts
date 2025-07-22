import { openWindow } from '..'
import { canParseJSON } from '../tool'
import { dataURLtoBlob, urlToBase64 } from './base64Conver'

/**
 * Download online pictures
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(url: string, filename: string, mime?: string, bom?: BlobPart) {
  urlToBase64(url).then((base64) => {
    downloadByBase64(base64, filename, mime, bom)
  })
}

/**
 * Download pictures based on base64
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(buf: string, filename: string, mime?: string, bom?: BlobPart) {
  const base64Buf = dataURLtoBlob(buf)
  downloadByData(base64Buf, filename, mime, bom)
}

/**
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' })

  const blobURL = window.URL.createObjectURL(blob)
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = blobURL
  tempLink.setAttribute('download', filename)
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank')
  }
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
  window.URL.revokeObjectURL(blobURL)
}

/**
 * Download file according to file address
 * @param {*} sUrl
 */
export function downloadByUrl({
  url,
  target = '_blank',
  fileName,
}: {
  url: string
  target?: TargetContext
  fileName?: string
}): boolean {
  const isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1
  const isSafari = window.navigator.userAgent.toLowerCase().indexOf('safari') > -1

  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!')
    return false
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a')
    link.href = url
    link.target = target

    if (link.download !== undefined) {
      link.download = fileName || url.substring(url.lastIndexOf('/') + 1, url.length)
    }

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      link.dispatchEvent(e)
      return true
    }
  }
  if (url.indexOf('?') === -1) {
    url += '?download'
  }

  openWindow(url, { target })
  return true
}

/**
 * 下载Url并修改名称
 */
export async function downloadByUrlChangeName({
  url,
  fileName,
}: {
  url: string
  fileName?: string
}): Promise<boolean> {
  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!')
    return false
  }

  try {
    // 使用 fetch 下载文件内容
    const response = await fetch(url)
    const blob = await response.blob()

    // 创建一个 Blob URL
    const blobUrl = window.URL.createObjectURL(blob)

    // 创建一个 <a> 元素用于下载
    const link = document.createElement('a')
    link.href = blobUrl

    // 使用提供的文件名或从 URL 中提取文件名
    link.download = fileName || url.substring(url.lastIndexOf('/') + 1, url.length)

    // 触发下载
    document.body.appendChild(link)
    link.click()

    // 移除链接
    document.body.removeChild(link)

    // 释放 Blob URL
    window.URL.revokeObjectURL(blobUrl)

    return true
  } catch (error) {
    console.error('Download failed!', error)
    return false
  }
}

/**
 * 校验是否可以下载 - 暂时只有全部订单使用
 * @param data 返回的数据
 * @param fn
 */
export async function checkBlobByData(data: BlobPart, fn: Function) {
  // 假设你的 Blob 对象叫做 blob
  const blob = new Blob([data], { type: 'application/json' })
  // 创建一个 FileReader 实例
  const reader = new FileReader()
  // 当文件读取完成时触发的事件处理函数
  reader.onload = function (event: any) {
    // event.target.result 是读取后的文本内容
    const jsonString = event.target.result
    if (canParseJSON(jsonString)) {
      fn(JSON.parse(jsonString))
    } else {
      fn({ code: 200 })
    }
  }
  reader.readAsText(blob)
}
