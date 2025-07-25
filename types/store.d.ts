import { ErrorTypeEnum } from '/@/enums/exceptionEnum'
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum'

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum
  // Error file
  file: string
  // Error name
  name?: string
  // Error message
  message: string
  // Error stack
  stack?: string
  // Error detail
  detail: string
  // Error url
  url: string
  // Error time
  time?: string
}

export interface UserInfo {
  uid: string | number
  userId: string | number
  username: string
  realName: string
  nickName: string
  userName: string
  avatar: string
  desc?: string
  homePath?: string
  roles: any // RoleInfo[]
  role?: any // RoleInfo[]
  loginName?: any
  roleId?: any
  appletValue?: any
  tenantCode?: string // 租户标识
}

export interface BeforeMiniState {
  menuCollapsed?: boolean
  menuSplit?: boolean
  menuMode?: MenuModeEnum
  menuType?: MenuTypeEnum
}
