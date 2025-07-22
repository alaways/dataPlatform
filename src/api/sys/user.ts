import { defHttp, defHttpV3 } from '/@/utils/http/axios'
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel'

import { ErrorMessageMode } from '/#/axios'

enum Api {
  Login = '/account/password/login',
  Logout = '/logout',
  // GetUserInfo = '/sysUser/current/info',
  GetUserInfo = '/sysNewUser/current/info',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttpV3.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  )
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttpV3.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' })
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode })
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout })
}

/**
 * 获取绑银行卡列表
 */
export function getBindCardList(params: any) {
  return defHttp.get({ url: '/userBankCard/list', params })
}

/**
 * 合利宝解绑银行卡
 */
export function getUnBindCard(params: any) {
  return defHttp.get({ url: '/quickPay/bankCardUnbind', params })
}
// 获取地址列表
export function getAddressList(params: any) {
  console.log(params, 'addressListPrams')
  return defHttp.get({ url: '/sys/address/list', params })
}
