import { isChinese, isObject } from '/@/utils/is'
/**
 * @param mapList 网络返回的 kv数组
 * @param dataList 渲染的数组
 */
export function handleData(mapList, dataList) {
  const dlist: any = []
  Object.keys(mapList).forEach((keys) => {
    dataList.forEach((item) => {
      if (isChinese(keys)) {
        // 已经移除中文数据
        if (item.key == 'xxx') {
          dlist.push({
            value: mapList[keys] || '-',
            title: keys,
            key: keys,
          })
          item.children = dlist
        }
      } else if (isObject(mapList[keys])) {
        // 数据为对象处理
        let dot = []
        if (item.key.indexOf('.') != -1) {
          // 如 行为报告 raw_report_xy.apply_report_detail
          dot = item.key.split('.')
        }
        const len = dot.length
        if (keys == item.key || (len && keys == dot[0])) {
          let chKeys = Object.keys(mapList[keys])
          let chData = mapList[keys]
          if (len) {
            // 此时 chKeys = raw_report_xy里的
            // 此时 chData = raw_report_xy
            const data = chData[dot[1]]
            if (data) {
              chKeys = Object.keys(data)
              chData = data
            }
          }
          chKeys.forEach((ch) => {
            item.children.forEach((v) => {
              if (ch == v.key) {
                v.value = chData[ch] || '-'
                // 特殊处理此字段
                if (ch == 'result_code') {
                  const arr = {
                    '1': '逾期',
                    '2': '正常',
                    '3': '延期',
                    '4': '未知',
                  }
                  v.value = arr[String(chData[ch])] || '-'
                }
              }
            })
          })
        }
      } else {
        // 最外层数据
        item.children.forEach((v) => {
          if (keys == v.key) {
            v.value = mapList[keys] || '-'
          }
        })
      }
    })
  })
}

/**
 * 用于逾期报告表格和行为报告表格
 * @param dataSource 要转的表格数组
 * @param pdata 总数据数组
 * @param isNameArr 判断数组
 */
export function dataToTabel(dataSource, pdata, isNameArr) {
  pdata.forEach((item) => {
    if (isNameArr.includes(item.name)) {
      if (item.children) {
        item.children.forEach((ch) => {
          dataToTable(ch)
        })
      }
    }
  })
  return dataSource
  // 数据转成表格数据
  function dataToTable(dItem: any) {
    // 简化汉字“月”还是特殊字符“⽉” 所以两个月
    const regexTitle = /个[月⽉](.*)/
    dataSource = dataSource.map((item: any) => {
      const matchTitle = dItem.title.match(regexTitle)

      // 如果是1周内 则是w1
      if (dItem.title.indexOf('周') != -1 || dItem.title.indexOf('7天') != -1) {
        item[`w1`] = dItem.value
      } else if (matchTitle) {
        if (matchTitle[1] == item.title) {
          const regex = /(\d+)(?=个[月⽉])/
          const match = dItem.title.match(regex)
          const result = match ? parseInt(match[1]) : 0
          item[`m${result}`] = dItem.value
        }
      }
      return item
    })
  }
}
