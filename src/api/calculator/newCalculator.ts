import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetNewCalculatorList = '/new/region/rent/page',
  SetNewCalculatorItem = '/new/region/rent/save',
  uploadNewCalculatorItem = '/new/region/rent/update',
}

/**
 * 新计算器 - 列表
 */
export const getNewCalculatorList = (params = {}) => {
  return defHttp.get({ url: Api.GetNewCalculatorList, params })
}

/**
 * 新计算器 - 新增
 */
export const setNewCalculatorItem = (data = {}) => {
  return defHttp.post({ url: Api.SetNewCalculatorItem, data })
}
/**
 * 新计算器 - 修改
 */
export const updateNewCalculatorItem = (data: any) => {
  return defHttp.post({ url: `${Api.uploadNewCalculatorItem}`, data })
}
/**
 * 新计算器 - 生成二维码
 */
export const creatNewCalculatorQRCode = (data: any) => {
  return defHttp.post({
    url: `/new/region/rent/createQRCode`,
    data,
  })
}
