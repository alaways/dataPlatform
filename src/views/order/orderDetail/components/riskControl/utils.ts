/**
 * 处理 新颜和百融 数据格式
 * @param mapList 网络返回的 kv数组
 * @param dataList 渲染的数组
 */
export function handleData(mapList, dataList) {
  Object.keys(mapList).forEach((keys) => {
    dataList.forEach((item) => {
      item.children.forEach((v) => {
        if (mapList[keys] < 0) return // 有可能出现-0.1
        if (keys == v.key) {
          if (['nbank_overdue', 'nbank_bad', 'nbank_lost'].includes(v.key)) {
            const value = mapList[keys]
            v.value = value == 0 ? '命中' : value
          } else {
            v.value = mapList[keys]
          }
        }
      })
    })
  })
}

/**
 * 处理 反欺诈规则-特殊名单验证 数据
 * @param mapList 网络返回的 kv数组
 * @param dataList 渲染的数组
 */
export function handleRulesInfoData(mapList, dataList) {
  Object.keys(mapList).forEach((keys) => {
    dataList.forEach((item) => {
      item.children.forEach((v) => {
        if (mapList[keys] < 0) return // 有可能出现-0.1
        if (keys == v.key) {
          v.value = mapList[keys].weight
        }
      })
    })
  })
}

/**
 * 处理 小雨点 数据格式
 * @param mapList 网络返回的 kv数组
 * @param dataList 渲染的数组
 * body.data.b0644(不定).items.result.multiple_loans_info[{risk_code_value,risk_code}]
 */
export function handleXiaoYudian(mapList, dataList) {
  Object.keys(mapList).forEach((keys) => {
    const mlist = mapList[keys]?.items || []

    mlist.forEach((m) => {
      if (m.result) {
        m.result.forEach((r) => {
          if (r.multiple_loans_info) {
            r.multiple_loans_info.forEach((mli) => {
              dataList.forEach((d) => {
                d.children.forEach((c) => {
                  if (mli.risk_code_value < 0) return // 有可能出现-0.1
                  if (mli.risk_code == c.key) {
                    c.value = mli.risk_code_value
                  }
                })
              })
            })
          }
        })
      }
    })
  })
}

/**
 * 处理 法院 数据格式
 * @param mapList 网络返回的 kv数组
 */
export function handleExecutionData(ExecutionInfo) {
  const xg: any = [] // 失信
  const sx: any = [] // 限高
  Object.keys(ExecutionInfo).forEach((keys) => {
    if (keys.indexOf('xg') != -1) {
      xg.push(ExecutionInfo[keys])
    }
    if (keys.indexOf('sx') != -1) {
      sx.push(ExecutionInfo[keys])
    }
  })
  return {
    xg,
    sx,
  }
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
  // 数据转成表格数据
  function dataToTable(dItem: any) {
    dataSource.forEach((item: any) => {
      // 比较title字段
      if (dItem.title.indexOf(item.title) != -1) {
        // 如果是1周内 则是w1
        if (dItem.title.indexOf('周') != -1) {
          item[`w1`] = dItem.value
        } else {
          // 利用正则截取 获取月份数量
          const regex = /(\d+)(?=个月)/
          const match = dItem.title.match(regex)
          const result = match ? parseInt(match[1]) : 0
          item[`m${result}`] = dItem.value
        }
      }
    })
  }
}

/**
 * 处理 法院裁判文书 数据格式
 */
export function handleExecutionJudData(info) {
  const list: any = [] // 失信
  Object.keys(info).forEach((keys) => {
    list.push({
      ...info[keys],
      NO: keys, // 序号
    })
  })
  return list
}

/**
 * 处理 反欺诈规则-法院被执行人
 */
export function handleAntiFraudUserExecution(info) {
  const list: any = []
  Object.keys(info).forEach((keys) => {
    list.push({
      ...info[keys],
    })
  })
  return list
}

/**
 * 处理 法院被执行人—高级版
 */
export function handleExecutionProData(info) {
  const list: any = []
  Object.keys(info).forEach((keys) => {
    list.push({
      ...info[keys],
      casenum: info[keys]?.casenum || info[keys]?.caseNo || '',
      time: info[keys]?.time || info[keys]?.sortTime || '',
    })
  })
  return list
}

/**
 * 用于借贷多头、租赁多头
 * @param dataSource 要转的表格数组
 * @param pdata 总数据数组
 * @param name == 借贷多头 d7_{type}_{type2}
 */
export function dataToBullTabel(dataSource, pdata) {
  const days = ['d7', 'm1', 'm3', 'm6', 'm12']
  dataSource.forEach((item) => {
    days.forEach((d: any) => {
      if (String(item.type2).indexOf('bank') != -1) {
        item[d] = pdata[d]?.[item.type]?.[item.type2]?.allnum || '-'
      } else {
        item[d] = pdata[d]?.[item.type]?.[item.type2] || '-'
      }
    })
  })
}
