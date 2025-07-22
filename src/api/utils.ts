import { ContentTypeEnum } from '../enums/httpEnum'
import { defHttp } from '../utils/http/axios'
/**
 * 验证码图片链接
 */
export const getCodeUrl = () => {
  return defHttp.get(
    {
      url: `/system/captcha/captchaImage?timestamp=${Date.now()}`,
      responseType: 'blob',
      headers: { Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8' },
    },
    { isReturnNativeResponse: true },
  )
}
export const getCaptcha = () => {
  return defHttp.get(
    {
      url: `/system/captcha/getCaptcha?type=ocrStateless3`,
      // headers: { Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8' },
    },
    { isReturnNativeResponse: true },
  )
}
/**
 * 操作密码
 */
export const operationPassword = (data: any) => {
  return defHttp.post({
    url: `/v2/sysMerchant/checkPassword`,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    data,
  })
}

/**
 * 商家自定义操作密码
 */
export const storePassword = (data: any) => {
  return defHttp.post({
    url: `/merchant/manage/checkPassword`,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    data,
  })
}

/**
 * 同一操作密码
 */
export const samePassword = (data: any) => {
  return defHttp.post(
    {
      url: `/account/checkOptPassword`,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      data,
    },
    { isTransformResponse: false },
  )
}

export const getDownloadList = (params: any) => {
  return defHttp.get({
    url: `/download/list`,
    params,
  })
}

export const getDownloadFile = (params: any) => {
  return defHttp.get(
    { url: `/download/start`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}
