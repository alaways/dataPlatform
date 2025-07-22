import { handleRiskDetails } from './utils'
import { canParseJSON } from '/@/utils/tool'

export function handleNewData(data) {
  if (data.originList && data.originList.length) {
    const item = data.originList[0]
    const pdata = item.dataJson
    const dataJson = (canParseJSON(pdata) && JSON.parse(pdata)) || {}
    if (dataJson.code == 200) {
      const pdata = dataJson.data
      const res = {
        ...pdata,
        ...handleRiskDetails(pdata.riskDetails),
      }
      return res
    }
  }
  return {}
}
