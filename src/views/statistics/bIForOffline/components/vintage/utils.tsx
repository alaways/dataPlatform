/**
 * 毕竟数据
 * @param pdata 当前日期的数据
 * @param thanData 比较日期的数据
 */
export function handleThanData(pdata, thanData) {
  if (pdata && pdata.length) {
    const item = pdata[0]
    // 获取所有 MOB 的key
    const key = Object.keys(item).filter((v) => v.indexOf('MOB') != -1)
    // 1.值比较 获取 mob1status
    pdata.forEach((v: any) => {
      thanData.forEach((o: any) => {
        if (v.业务月份 == o.业务月份) {
          key.forEach((k) => {
            let value = v[k]
            if (String(value).indexOf('%') != -1) {
              value = Number(String(value).replace('%', ''))
            }
            // 指标 0.相等 1.当前大于比较 2.当前小于比较
            if (value == o[k]) {
              v[`${k}status`] = 0
            } else if (value > o[k]) {
              v[`${k}status`] = 1
            } else {
              v[`${k}status`] = 2
            }
          })
        }
      })
    })
    // 2. 将原有的mob 值回 xx.xx%
    console.log(pdata)

    return handleMobValue(pdata, true)
  }
  return []
}

/**
 * 处理 MOB 的值
 * @param data  数据
 * @param isStr true转为字符串，false转为数值
 * @returns
 */
export function handleMobValue(data: any, isStr = false) {
  if (data && data.length) {
    data.forEach((item) => {
      const mobKey = Object.keys(item)
      // 处理 MOB 数值会带 %
      if (mobKey && mobKey.length) {
        mobKey.forEach((v) => {
          if (v.indexOf('MOB') != -1 && v.indexOf('status') == -1) {
            if (isStr) {
              const value = item[v]
              if (value && String(value).indexOf('%') == -1) {
                item[v] = `${value}%`
              }
            } else {
              const value = item[v]
              item[v] = Number(String(value).replace('%', ''))
            }
          }
        })
      }
    })
    return data
  }
  return []
}
