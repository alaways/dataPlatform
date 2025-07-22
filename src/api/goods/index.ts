import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetGoodsList = '/spu/page',
  CopyGoodsItem = '/v2/pmsSpu/cloneSpu',
}

/**
 * 商品列表 - 列表
 */
export const getGoodsList = (params = {}) => {
  return defHttp.get({ url: Api.GetGoodsList, params })
}
/**
 * 商品列表 - 删除
 */
export const delGoodsList = (id: any) => {
  return defHttp.delete(
    { url: `/spu/${id}` },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 商品列表 - 复制
 */
export const copyGoodsList = (data = {}) => {
  return defHttp.post(
    { url: Api.CopyGoodsItem, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 商品列表 - 显示状态
 */
export const showStatusGoods = (data: any) => {
  return defHttp.put(
    { url: `/spu/${data.id}/showStatus`, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 商品列表 - 上锁/解锁
 */
export const lockStatusGoods = (data: any) => {
  return defHttp.put(
    { url: `/spu/${data.id}/${data.ifLock}/ifLock`, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 商品列表 - 原周付商品业务 上锁/解锁
 */
export const changeWeekRentType = (data: any) => {
  return defHttp.put(
    { url: `/spu/${data.id}/commBusiness`, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 商品列表 - 上下架
 */
export const shelfStatusGoods = (data: any) => {
  return defHttp.put(
    { url: `/spu/${data.id}/shelfStatus`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 商品列表 - 获取详情
 */
export const getGoodsDetail = (id: any) => {
  return defHttp.get({ url: `/spu/find/${id}` })
}

/**
 * 商品列表 - 新增租赁属性
 */
export const addGoodsLease = (data: any) => {
  return defHttp.post(
    { url: `/v2/pmsSpu/createRentAttr`, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 商品列表 - 编辑租赁属性
 */
export const updateGoodsLease = (data: any) => {
  return defHttp.post(
    { url: `/v2/pmsSpu/updateRentAttr`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 商品列表 - 新增商品属性
 */
export const addGoodsBase = (data: any) => {
  return defHttp.post(
    { url: `/v2/pmsSpu/createSpu`, data },
    {
      errorMessageMode: 'message',
    },
  )
}
/**
 * 商品列表 - 编辑商品属性
 */
export const updateGoodsBase = (data: any) => {
  return defHttp.post(
    { url: `/v2/pmsSpu/updateSpu`, data },
    {
      errorMessageMode: 'message',
    },
  )
}

/**
 * 商品列表 - 生成二维码
 */
export const creatQRCode = (data: any) => {
  return defHttp.post({
    url: `/v2/pmsSpu/makeQRCode`,
    data,
  })
}
