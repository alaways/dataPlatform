import { cloneDeep, uniq } from 'lodash-es'

// 递归处理菜单列表值
export function filterMenuTree(data: any) {
  const newTree = cloneDeep(data).map((v) => {
    return {
      key: v.menuId,
      value: v.menuId,
      title: v.menuName,
      parentId: v.parentId,
      children: v.children,
    }
  })
  newTree.forEach((v) => v.children && (v.children = filterMenuTree(v.children)))
  return newTree
}

/**
 * 菜单处理 - 剔除父级
 * 1. 剔除未勾选的菜单，只留下子级(原因: 组件勾选父级，其子级默认都勾选)
 */
export function recursionMenus(data, menuIds) {
  const mlist = cloneDeep(menuIds)
  filterChildren(data, mlist)
  return mlist
}
// 第二次都有，但是第三次有一个是没有的，则会导致全选
function filterChildren(data, menuIds) {
  if (data && data.length) {
    data.forEach((v) => {
      if (menuIds.includes(v.key)) {
        // 判断children的勾选是否全选
        if (v.children && v.children.length) {
          filterChildren(v.children, menuIds)
          menuIds.splice(menuIds.indexOf(v.key), 1)
        }
      }
    })
  }
}

/**
 * 菜单处理 - 获取父级
 */
export function recursionPidMenus(data, menuIds) {
  const dlist: any = []
  const menuList = cloneDeep(data)
  menuIds.forEach((m) => {
    dlist.push(...filterPidChildren(menuList, m))
  })
  return uniq([...dlist, ...menuIds])
}
// 递归菜单父级添加
function filterPidChildren(data, mid) {
  const dlist: any = []
  data.forEach((v) => {
    if (mid == v.menuId && v.parentId && v.parentId != 0) {
      dlist.push(v.parentId)
      dlist.push(...filterPidChildren(data, v.parentId))
    }
  })
  return dlist
}
