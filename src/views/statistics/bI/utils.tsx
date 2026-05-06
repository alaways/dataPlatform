import { getSysApiCache } from '/@/api/statistics/index'
import { ref } from 'vue'
const timer = ref<any>(null)
// 通过ID获取缓存数据
export const getDataForId = async (id, listData) => {
  if (!id) return
  // 第一次调用
  const res: any = await getSysApiCache({ id })
  listData.value = res
  // 轮训调用
  if (!res) setInterValTimer({ id, listData })
}
const setInterValTimer = ({ id, listData }) => {
  timer.value = setInterval(async () => {
    const res = await getSysApiCache({ id })
    listData.value = res
    // 如果没有值就清空定时器
    if (res) {
      clearInterval(timer.value)
    }
  }, 5000)
}
