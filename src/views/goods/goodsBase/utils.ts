/**
 * 旧后台那边做的
 * 生成UUID, 用于生成唯一的key
 * 生成随机ID。
 * @param {number} [length=8] - 指定生成ID的长度。
 * @return {string} 生成的随机ID。
 */
export function generateRandomID(length = 8) {
  // 可用字符集
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  // 获取字符集的长度，用于后续随机索引
  const charactersLength = characters.length

  // 初始化结果字符串
  let result = ''

  // 循环指定次数（length），每次从字符集中随机选择一个字符，添加到结果字符串中
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    result += characters[randomIndex]
  }

  // 返回生成的随机ID
  return result
}

// 商品规格
export interface specsItem {
  id?: number
  pic?: string
  name: string
  sort: number
  spuId: string
  uniqueId: string
  value: string
}

// 商品规格 存储
export interface skuItem {
  name: string
  pic: string
  spuId: string
  specsIds: string
}
