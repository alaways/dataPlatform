import { defineStore } from 'pinia'
import { store } from '/@/store'

export const useOrderStore = defineStore({
  id: 'order',
  state: () => ({
    allParams: {}, // 保存全部订单参数
    allPageParams: {}, // 保存全部订单的底部页数
    allocationParams: {}, // 保存分配订单列表参数
    allocationpageParams: {}, // 保存分配订单列表页数
  }),
  getters: {
    getAllParams(): any {
      return this.allParams
    },
    getAllPageParams(): any {
      return this.allPageParams
    },
    getAllocationParams(): any {
      return this.allocationParams
    },
    getAllocationPageParams(): any {
      return this.allocationpageParams
    },
  },
  actions: {
    setAllParams(params: any): void {
      this.allParams = params
    },
    setAllPageParams(params: any): void {
      this.allPageParams = params
    },
    setAllocationParams(params: any): void {
      this.allocationParams = params
    },
    setAllocationPageParams(params: any): void {
      this.allocationpageParams = params
    },
  },
})

export function useOrderStoreWithOut() {
  return useOrderStore(store)
}
