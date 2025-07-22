import { UploadApiResult } from './model/uploadModel'
import { defHttp, defHttpRisk } from '/@/utils/http/axios'
import { UploadFileParams } from '/#/axios'
import { useGlobSetting } from '/@/hooks/setting'

const { uploadUrl = '', apiUrl } = useGlobSetting()

/**
 * @description: 上传接口
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: any) => void,
  url = '',
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      timeout: 60 * 60 * 1000,
      url: url || uploadUrl,
      onUploadProgress,
    },
    params,
  )
}

/**
 * @description: 身份认证
 */
export function uploadOCRApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: any) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      timeout: 60 * 60 * 1000,
      url: '/api/ocr/stateless2',
      onUploadProgress,
    },
    params,
  )
}
// 上传身份证（多张）
export function uploadOCRApiNew(params) {
  return defHttp.post(
    {
      url: '/ocr/stateless3',
      params,
      headers: { captchaVerifyParam: params?.captchaVerifyParam },
    },
    { isTransformResponse: false },
  )
}
/**
 * 预览
 */
export function getPreviewPDF(url: string) {
  let api = 'api'
  const environmentName = localStorage.getItem('environment-name')
  if (environmentName == 'api8088') {
    api = 'api8088'
  }
  return `${apiUrl}/${api}/pdf/print?url=${url}`
}
// 根据地址下载
export function downloadForUrl(url) {
  const params = { url }
  return defHttpRisk.get(
    { url: `/common/downloadByUrl`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}
