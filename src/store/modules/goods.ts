import { defineStore } from 'pinia'
import { store } from '/@/store'

export const useGoodsStore = defineStore({
  id: 'goods',
  state: () => ({
    updateReload: false, // 商品报错修改刷新
    allParams: {}, // 保存商品列表参数
    goodsLease: {}, // 保存全部订单参数 - 未使用
    goodsBase: {}, // 保存商品属性 - 未使用
  }),
  getters: {
    getUpdateReload(): any {
      return this.updateReload
    },
    getAllParams(): any {
      return this.allParams
    },
    getGoodsLease(): any {
      return this.goodsLease
    },
    getGoodsBase(): any {
      return this.goodsBase
    },
  },
  actions: {
    setUpdateReload(params: any): void {
      this.updateReload = params
    },
    setAllParams(params: any): void {
      this.allParams = params
    },
    setGoodsLease(data: any): void {
      this.goodsLease = data
    },
    setGoodsBase(data: any): void {
      this.goodsBase = data
    },
  },
})

export function useGoodsStoreWithOut() {
  return useGoodsStore(store)
}
