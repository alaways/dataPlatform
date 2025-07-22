// import type { RouteMeta } from 'vue-router'
export interface RouteItem {
  // path: string
  // component: any
  // meta: RouteMeta
  // name?: string
  // alias?: string | string[]
  // redirect?: string
  // caseSensitive?: boolean
  // children?: RouteItem[]
  icon: string
  menuCode: string //  name
  menuId: string
  menuName: string // title
  menuType: string // M目录 C菜单 F按钮
  orderNum: number // 显示顺序 - orderNo
  parentId: string // 父Id
  remark: string
  status: string //  0停用 1正常
  url: string // component
  visible: string // 0隐藏 1显示 - hideMenu
}

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[]
