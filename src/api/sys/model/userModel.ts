/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  loginName: string
  password: string
  code: string
}

export interface RoleInfo {
  roleName: string
  value: string
  code: string
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number
  token: string
  role: RoleInfo
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: any // RoleInfo[]
  role?: any // RoleInfo[]
  // 用户id
  userId: string | number
  uid: string | number
  // 用户名
  username: string
  // 真实名字
  realName: string
  // 头像
  avatar: string
  // 介绍
  desc?: string
  nickName: string
  userName: string
}
