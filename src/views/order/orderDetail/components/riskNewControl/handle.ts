import { handleData } from './utils'
import { canParseJSON } from '/@/utils/tool'

export function handleNewData(data, riskControlData, type = '') {
  const pdata = data.respData || {}
  const dataJson = (canParseJSON(pdata) && JSON.parse(pdata)) || {}
  if (type == 'reports') {
    // 整体表格数据
    const reports = dataJson.reports
    if (reports) {
      handleData(reports, riskControlData)
    }
  } else {
    return dataJson
  }
}
