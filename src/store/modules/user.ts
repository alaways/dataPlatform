import type { UserInfo } from '/#/store'
import type { ErrorMessageMode } from '/#/axios'
import { defineStore } from 'pinia'
import { store } from '/@/store'
import { RoleEnum } from '/@/enums/roleEnum'
import { PageEnum } from '/@/enums/pageEnum'
import { ROLES_CODE_KEY, ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum'
import { getAuthCache, setAuthCache } from '/@/utils/auth'
import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel'
import { getUserInfo, loginApi } from '/@/api/sys/user'
import { useI18n } from '/@/hooks/web/useI18n'
import { useMessage } from '/@/hooks/web/useMessage'
import { router } from '/@/router'
import { usePermissionStore } from '/@/store/modules/permission'
import { RouteRecordRaw } from 'vue-router'
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic'
import { isArray } from '/@/utils/is'
import { h } from 'vue'

interface UserState {
  userInfo: Nullable<UserInfo>
  token?: string
  roleList: RoleEnum[]
  sessionTimeout?: boolean
  lastUpdateTime: number
  roleCode: string
  isAdmin: boolean
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    roleCode: '', // 角色code值
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    isAdmin: false, // 是否是超级管理员
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {}
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY)
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY)
    },
    getRoleCode(): string {
      return this.roleCode
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime
    },
    getIsSupuerAdmin(): boolean {
      return this.isAdmin
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : '' // for null or undefined value
      setAuthCache(TOKEN_KEY, info)
    },
    // setRoleList(roleList: RoleEnum[]) {
    setRoleList(roleList: any[]) {
      this.roleList = roleList
      setAuthCache(ROLES_KEY, roleList)
    },
    setRoleCode(roleCode: string | undefined) {
      this.roleCode = roleCode ? roleCode : ''
      setAuthCache(ROLES_CODE_KEY, roleCode)
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
      this.lastUpdateTime = new Date().getTime()
      setAuthCache(USER_INFO_KEY, info)
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag
    },
    setIsSupuerAdmin(flag: boolean) {
      this.isAdmin = flag
    },
    resetState() {
      this.userInfo = null
      this.token = ''
      this.roleList = []
      this.sessionTimeout = false
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean
        mode?: ErrorMessageMode
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params
        const data = await loginApi(loginParams, mode)
        const { token } = data

        // save token
        this.setToken(`Bearer ${token}`)
        return this.afterLoginAction(goHome)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null
      // get user info
      const userInfo = await this.getUserInfoAction()

      const sessionTimeout = this.sessionTimeout
      if (sessionTimeout) {
        this.setSessionTimeout(false)
      } else {
        const permissionStore = usePermissionStore()
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction()
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw)
          })
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw)
          permissionStore.setDynamicAddedRoute(true)
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME))
      }
      return userInfo
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null
      const userInfo = await getUserInfo()
      userInfo.userId = userInfo.uid
      userInfo.realName = userInfo.nickName
      userInfo.username = userInfo.userName
      userInfo.role = userInfo.roles
      userInfo.roles = [] // 后端返回无需处理
      const { role = [] } = userInfo
      if (isArray(role)) {
        const roleCode = (role.map((item) => item.roleKey) as any[]).join(',')
        this.setRoleCode(roleCode)
        this.setIsSupuerAdmin(roleCode.indexOf('super_admin') != -1)
      } else {
        userInfo.role = []
        userInfo.roles = []
        this.setRoleList([])
      }
      this.setUserInfo(userInfo)
      return userInfo
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      // if (this.getToken) {
      //   try {
      //     await doLogout()
      //   } catch {
      //     console.log('注销Token失败')
      //   }
      // }
      this.setToken(undefined)
      this.setSessionTimeout(false)
      this.setUserInfo(null)
      this.setRoleList([])
      this.setRoleCode(undefined)
      window.location.reload()
      goLogin && router.push(PageEnum.BASE_LOGIN)
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage()
      const { t } = useI18n()
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.Tip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true)
        },
      })
    },
  },
})

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store)
}
