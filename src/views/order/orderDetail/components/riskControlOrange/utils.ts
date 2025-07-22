import { cloneDeep } from 'lodash-es'

/**
 * @param mapList 网络返回的 kv数组
 * @param dataList 渲染的数组
 */
export function handleData(mapList, dataList) {
  Object.keys(mapList).forEach((keys) => {
    dataList.forEach((item) => {
      item.children.forEach((v) => {
        if (keys == v.key) {
          v.value = mapList[keys] || '-'
        }
      })
    })
  })
}

/**
 * 处理 riskDetails 数据
 */
export function handleRiskDetails(riskDetails) {
  const data: any = {
    mobile_operator: '',
    list: [],
  }
  if (riskDetails && riskDetails.length) {
    const detail = riskDetails[0]

    const productDetails = detail?.productDetails || []

    const keyName: any = [] // 用于同名排序
    let list: any = []
    productDetails.forEach((v) => {
      if (v.ruleCode == 'mobile_operator') {
        // const obj = { CM: '移动', CU: '联通', CT: '电信' }
        // data['mobile_operator'] = obj[v.score] || v.score
        data['mobile_operator'] = v.score
        return
      }
      // 处理 名称存储 - 用于排序
      const matchName =
        v.ruleName.indexOf('贷款金额在') == -1 ? handleMatchName(v.ruleName) : v.ruleName
      if (matchName && !keyName.includes(matchName)) {
        keyName.push(matchName)
      }
      if (v.score == 'null' || !v.score) {
        v.score = '-'
      }
      const item = {
        value: v.score,
        title: v.ruleName,
        key: v.ruleCode,
        span: 5,
      }
      // 对应分类分组
      if (matchName.indexOf('逾期贷款笔数') != -1) {
        list = handleItemData(list, item, '逾期报告', true, 1)
      } else if (matchName.indexOf('金额') != -1) {
        list = handleItemData(list, item, '行为报告', false, 2)
      } else if (matchName.indexOf('申请') != -1) {
        list = handleItemData(list, item, '申请多头', false, 3)
      }
    })

    data['list'] = handleGroupBy(list, keyName)
  }
  return data
}

/**
 * 处理 近x天/月数据 名称
 */
export function handleMatchName(ruleName: any) {
  const regexTitle = /天(.*)|个[月⽉](.*)/
  const matchName = ruleName.match(regexTitle)
  if (matchName) {
    return matchName[1] || matchName[2] || ''
  }
  return ''
}

/**
 *
 * @param list 列表
 * @param item 分组children数据
 * @param name 分组名称
 * @param hide 隐藏
 * @param sort 排序
 */
export function handleItemData(list: any, item: any, name: string, hide: boolean, sort: number) {
  const dlist = cloneDeep(list)
  const find = dlist.find((v) => v.name == name)
  item['hide'] = hide
  if (find) {
    find.children.push(item)
  } else {
    dlist.push({
      name: name,
      span: 8,
      children: [item],
      sort,
    })
  }
  return dlist
}

/**
 * 分组排序
 * @param list 数据列表
 * @param keyName 名称列表
 */
export function handleGroupBy(list: any, keyName: any) {
  const dlist = cloneDeep(list)
  // 内层相同排序
  const sortArr = ['3天', '7天', '15天', '1个月', '3个月', '6个月', '12个月', '24个月']
  dlist.forEach((v) => {
    const children: any = []
    keyName.forEach((k: string) => {
      if (v.children && v.children.length) {
        const filter = v.children.filter((f) => k == handleMatchName(f.title))
        const len = filter.length
        if (filter && filter.length) {
          const itemArr: any = []
          // 获取名字的总集
          v.children.forEach((ch) => {
            const title = handleMatchName(ch.title)
            if (title && k == title && ch.title.indexOf('贷款金额在') == -1) {
              itemArr.push({ ...ch, span: (24 / len).toFixed(0) })
            }
          })

          itemArr.sort((a, b) => {
            const indexA = sortArr.findIndex((item) => a.title.includes(item))
            const indexB = sortArr.findIndex((item) => b.title.includes(item))
            return indexA - indexB
          })
          children.push(...itemArr)
        }
      }
    })
    v.children = children
  })

  // 外层标题排序
  dlist.sort(function (a, b) {
    if (a.sort > b.sort) return 1
    if (a.sort == b.sort) return 0
    if (a.sort < b.sort) return -1
  })
  return dlist
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
