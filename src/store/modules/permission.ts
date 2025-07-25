import type { AppRouteRecordRaw, Menu } from '/@/router/types'

import { defineStore } from 'pinia'
import { store } from '/@/store'
import { useI18n } from '/@/hooks/web/useI18n'
import { useUserStore } from './user'
import { useAppStoreWithOut } from './app'
import { toRaw } from 'vue'
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper'
import { transformRouteToMenu } from '/@/router/helper/menuHelper'

import projectSetting from '/@/settings/projectSetting'

import { PermissionModeEnum } from '/@/enums/appEnum'

import { asyncRoutes } from '/@/router/routes'
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic'

import { filter } from '/@/utils/helper/treeHelper'

import { getPermCode } from '/@/api/sys/user'

import { useMessage } from '/@/hooks/web/useMessage'
import { PageEnum } from '/@/enums/pageEnum'
import { getMenuList } from '/@/api/system/menu'

interface PermissionState {
  // Permission code list
  // 权限代码列表
  permCodeList: string[] | number[]
  // Whether the route has been dynamically added
  // 路由是否动态添加
  isDynamicAddedRoute: boolean
  // To trigger a menu update
  // 触发菜单更新
  lastBuildMenuTime: number
  // Backstage menu list
  // 后台菜单列表
  backMenuList: Menu[]
  // 菜单列表
  frontMenuList: Menu[]
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    // 权限代码列表
    permCodeList: [],
    // Whether the route has been dynamically added
    // 路由是否动态添加
    isDynamicAddedRoute: false,
    // To trigger a menu update
    // 触发菜单更新
    lastBuildMenuTime: 0,
    // Backstage menu list
    // 后台菜单列表
    backMenuList: [],
    // menu List
    // 菜单列表
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list
      list?.length > 0 && this.setLastBuildMenuTime()
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime()
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added
    },
    resetState(): void {
      this.isDynamicAddedRoute = false
      this.permCodeList = []
      this.backMenuList = []
      this.lastBuildMenuTime = 0
    },
    async changePermissionCode() {
      const codeList = await getPermCode()
      this.setPermCodeList(codeList)
    },

    // 构建路由
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const { t } = useI18n()
      const userStore = useUserStore()
      const appStore = useAppStoreWithOut()

      let routes: AppRouteRecordRaw[] = []
      const roleList = toRaw(userStore.getRoleList) || []
      const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig

      // 路由过滤器 在 函数filter 作为回调传入遍历使用
      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route
        // 抽出角色
        const { roles } = meta || {}
        if (!roles) return true
        // 进行角色权限判断
        return roleList.some((role) => roles.includes(role))
      }

      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route
        // ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
        const { ignoreRoute } = meta || {}
        // arr.filter 返回 true 表示该元素通过测试
        return !ignoreRoute
      }

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return
        let homePath: string = userStore.getUserInfo.homePath || PageEnum.BASE_HOME

        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/'
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route
            const currentPath = path.startsWith('/') ? path : parentPath + path
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true })
                throw new Error('end')
              }
            }
            children && children.length > 0 && patcher(children, currentPath)
          })
        }

        try {
          patcher(routes)
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return
      }

      switch (permissionMode) {
        // 角色权限
        case PermissionModeEnum.ROLE:
          // 对非一级路由进行过滤
          routes = filter(asyncRoutes, routeFilter)
          // 对一级路由根据角色权限过滤
          routes = routes.filter(routeFilter)
          // Convert multi-level routing to level 2 routing
          // 将多级路由转换为 2 级路由
          routes = flatMultiLevelRoutes(routes)
          break

        // 路由映射， 默认进入该case
        case PermissionModeEnum.ROUTE_MAPPING:
          // 对非一级路由进行过滤
          routes = filter(asyncRoutes, routeFilter)
          // 对一级路由再次根据角色权限过滤
          routes = routes.filter(routeFilter)
          // 将路由转换成菜单
          const menuList = transformRouteToMenu(routes, true)
          // 移除掉 ignoreRoute: true 的路由 非一级路由
          routes = filter(routes, routeRemoveIgnoreFilter)
          // 移除掉 ignoreRoute: true 的路由 一级路由；
          routes = routes.filter(routeRemoveIgnoreFilter)
          // 对菜单进行排序
          menuList.sort((a, b) => {
            return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0)
          })

          // 设置菜单列表
          this.setFrontMenuList(menuList)

          // Convert multi-level routing to level 2 routing
          // 将多级路由转换为 2 级路由
          routes = flatMultiLevelRoutes(routes)
          break

        //  If you are sure that you do not need to do background dynamic permissions, please comment the entire judgment below
        //  如果确定不需要做后台动态权限，请在下方评论整个判断
        case PermissionModeEnum.BACK:
          const { createMessage } = useMessage()

          createMessage.loading({
            content: t('sys.app.menuLoading'),
            duration: 1,
          })

          // !Simulate to obtain permission codes from the background,
          // 模拟从后台获取权限码，
          // this function may only need to be executed once, and the actual project can be put at the right time by itself
          // 这个功能可能只需要执行一次，实际项目可以自己放在合适的时间
          let routeList: AppRouteRecordRaw[] = [
            {
              path: '/welcome',
              name: 'Welcome',
              component: '/dashboard/index',
              meta: {
                title: '欢迎',
                affix: true,
                icon: 'ant-design:home-outlined',
              },
            },
          ]
          // 旧菜单
          // try {
          //   // await this.changePermissionCode()
          //   const menuList = (await getMenuList()) as AppRouteRecordRaw[]
          //   const codeList: string[] = []
          //   // 递归替换为自定义好的extTxt值
          //   function filterTree(data: AppRouteRecordRaw[]) {
          //     const newTree = cloneDeep(data)
          //       .filter((v) => {
          //         if (v.type == 3) {
          //           codeList.push(v.name)
          //         }
          //         return v.extTxt && v.type != 3
          //       })
          //       .map((v) => {
          //         const item = JSON.parse(v.extTxt!)
          //         item.children = v.children

          //         // 设置页面不缓存
          //         if (clearRouteKeepList.includes(item.name)) {
          //           item.meta.ignoreKeepAlive = true
          //         }
          //         return item
          //       })
          //     newTree.forEach((v) => v.children && (v.children = filterTree(v.children)))
          //     return newTree
          //   }
          //   const permissionStore = usePermissionStore()
          //   // 细粒度权限
          //   permissionStore.setPermCodeList(codeList)
          //   console.log(permissionStore.getPermCodeList)

          //   // 路由
          //   routeList = [...routeList, ...filterTree(menuList)]
          // } catch (error) {
          //   console.error(error)
          // }

          try {
            const mdata: any = await getMenuList({ status: 1 })
            // 获取父级层
            const menuList = mdata.filter((v) => !v.parentId || v.parentId == 0)
            // 处理数据
            function filterTree(data) {
              return data.map((v) => {
                const path = !v.parentId || v.parentId == 0 ? '/' : ''
                return {
                  menuId: v.menuId,
                  parentId: v.parentId,
                  name: v.menuCode,
                  path: `${path}${v.menuCode}`,
                  component: v.url,
                  meta: {
                    hideMenu: v.visible != 1,
                    icon: v.icon,
                    orderNo: v.orderNum,
                    title: v.menuName,
                  },
                  children: filterTree(
                    mdata.filter((ch) => ch.parentId == v.menuId && ch.menuType != 'F'),
                  ),
                }
              })
            }

            // 获取菜单层
            routeList = [...routeList, ...filterTree(menuList)]

            // 细粒度权限
            const codeList = mdata.filter((v) => v.menuType == 'F') || []
            const permissionStore = usePermissionStore()
            permissionStore.setPermCodeList(codeList.map((v) => v.menuCode))
          } catch (error) {
            console.error(error)
          }

          // Dynamically introduce components
          // 动态引入组件
          routeList = transformObjToRoute(routeList)

          //  Background routing to menu structure
          //  后台路由到菜单结构
          const backMenuList = transformRouteToMenu(routeList)
          this.setBackMenuList(backMenuList)

          // remove meta.ignoreRoute item
          // 删除 meta.ignoreRoute 项
          routeList = filter(routeList, routeRemoveIgnoreFilter)
          routeList = routeList.filter(routeRemoveIgnoreFilter)

          routeList = flatMultiLevelRoutes(routeList)
          routes = [PAGE_NOT_FOUND_ROUTE, ...routeList]
          break
      }

      patchHomeAffix(routes)
      return routes
    },
  },
})

// Need to be used outside the setup
// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store)
}
