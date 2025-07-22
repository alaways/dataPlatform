import {
  handleAntiFraudUserExecution,
  handleData,
  handleExecutionData,
  handleExecutionJudData,
  handleExecutionProData,
  handleRulesInfoData,
  handleXiaoYudian,
} from './utils'
import { canParseJSON } from '/@/utils/tool'

/**
 * 处理新颜数据
 * riskInfo?.riskOriginalInfoXinYanC1009002 - 旧
 * riskInfo?.riskoriginalInfoxinYanunify - 新
 * @param riskInfo 接口的数据
 * @param riskControlData 整体数据
 */
export function handleXinYan(riskInfo, riskControlData) {
  // const xinYanObj = riskInfo.riskOriginalInfoXinYanC1009002 || {}
  const xinYanObj = riskInfo.riskOriginalInfoXinYanUnify || {}
  const xinYanJson = (canParseJSON(xinYanObj.data) && JSON.parse(xinYanObj.data)) || {}
  // const xinYanList: any = xinYanJson?.info?.score || {} // 存在多个key
  const xinYanList: any = xinYanJson?.result_detail || {} // 存在多个key
  let xinYanInfo = {}
  Object.keys(xinYanList).forEach((v) => {
    xinYanInfo = { ...xinYanInfo, ...xinYanList[v] }
  })
  handleData(xinYanInfo, riskControlData)
}

/**
 * 处理新颜探针C数据
 * riskInfo?.riskOriginalInfoXinYanPayRiskBehavior
 * @param riskInfo 接口的数据
 * @param riskControlData 整体数据
 */
export function handleXinYanBehavior(riskInfo, riskControlData) {
  const xinYanBehaviorObj = riskInfo?.riskOriginalInfoXinYanPayRiskBehavior || {}
  const xinYanBehaviorJson =
    (canParseJSON(xinYanBehaviorObj.data) && JSON.parse(xinYanBehaviorObj.data)) || {}
  const xinYanBehaviorInfo: any =
    (xinYanBehaviorJson?.code == 0 && xinYanBehaviorJson?.result_detail) || {} // 存在多个key
  handleData(xinYanBehaviorInfo, riskControlData)
}

/**
 * 处理百融数据
 * riskInfo?.riskOriginalInfoBaiRongSpecialListC
 * @param riskInfo 接口的数据
 * @param riskControlData 整体数据
 */
export function handleBaiRong(riskInfo, riskControlData) {
  const bairRongObj = riskInfo?.riskOriginalInfoBaiRongSpecialListC || {}
  const bairRongJson = (canParseJSON(bairRongObj.data) && JSON.parse(bairRongObj.data)) || {}
  const bairRongInfo = bairRongJson?.SpecialList_c?.id || {}
  handleData(bairRongInfo, riskControlData)
}

/**
 * 处理小雨点2数据
 * riskInfo?.riskOriginalInfoXiaoYuDian2
 * @param riskInfo 接口的数据
 * @param riskControlData 整体数据
 */
export function handleXinYuDian2(riskInfo, riskControlData) {
  const xiaoyudian2Obj = riskInfo?.riskOriginalInfoXiaoYuDian2 || {}
  const xiaoyudian2Json =
    (canParseJSON(xiaoyudian2Obj.data) && JSON.parse(xiaoyudian2Obj.data)) || {}
  const xiaoyudian2Info = xiaoyudian2Json?.body?.data || {}
  handleXiaoYudian(xiaoyudian2Info, riskControlData)
}

/**
 * 处理小雨点3数据
 * riskInfo?.riskOriginalInfoXiaoYuDian3
 * @param riskInfo 接口的数据
 * @param riskControlData 整体数据
 */
export function handleXinYuDian3(riskInfo, riskControlData) {
  const xiaoyudian3Obj = riskInfo?.riskOriginalInfoXiaoYuDian3 || {}
  const xiaoyudian3Json =
    (canParseJSON(xiaoyudian3Obj.data) && JSON.parse(xiaoyudian3Obj.data)) || {}
  const xiaoyudian3Info = xiaoyudian3Json?.body?.data || {}
  handleXiaoYudian(xiaoyudian3Info, riskControlData)
}

/**
 * 处理 百融 - 法院 数据
 * riskInfo?.riskOriginalInfoBaiRongExecutionLimited
 * @param riskInfo 接口的数据
 * @param riskControlData 整体数据
 */
export function handleExecution(riskInfo) {
  const ExecutionObj = riskInfo?.riskOriginalInfoBaiRongExecutionLimited || {}
  const ExecutionJson = (canParseJSON(ExecutionObj.data) && JSON.parse(ExecutionObj.data)) || {}
  const ExecutionInfo = ExecutionJson?.ExecutionLimited || {}
  return handleExecutionData(ExecutionInfo)
}

/**
 * 处理百融数据 - 非银类型 数据
 * riskInfo?.riskOriginalInfoBaiRongRuleSpecialListC
 * @param riskInfo 接口的数据
 * @param riskControlData 整体数据
 */
export function handleBaiRongRule(riskInfo, riskControlData) {
  const bairRongObj = riskInfo?.riskOriginalInfoBaiRongRuleSpecialListC || {}
  const bairRongJson = (canParseJSON(bairRongObj.data) && JSON.parse(bairRongObj.data)) || {}
  //  非银类型 数据
  const bairRongInfo = bairRongJson?.SpecialList_c?.id || {}
  handleData(bairRongInfo, riskControlData)
  // 反欺诈规则-特殊名单验证
  const bairRongRulesInfo = bairRongJson?.Rule?.hit_rules?.rulespeciallist_c || {}
  handleRulesInfoData(bairRongRulesInfo, riskControlData)
}

/**
 * 处理 百融 - 法院信息详情-个人高级版
 * riskInfo?.riskOriginalInfoBaiRongCourtDetailPro
 * @param riskInfo 接口的数据
 * @param riskControlData 整体数据
 */
export function handleBaiRongCourtDetailPro(riskInfo) {
  const ExecutionObj = riskInfo?.riskOriginalInfoBaiRongCourtDetailPro || {}
  const ExecutionJson = (canParseJSON(ExecutionObj.data) && JSON.parse(ExecutionObj.data)) || {}
  const ExecutionInfo = ExecutionJson?.CourtDetailPro || {}
  return ExecutionInfo.entryList || []
}

/**
 * 处理 百融 - 法院裁判文书
 * riskInfo?.riskOriginalInfoBaiRongExecutionJud
 * @param riskInfo 接口的数据
 * @param riskControlData 整体数据
 */
export function handleBaiRongExecutionJud(riskInfo) {
  const ExecutionObj = riskInfo?.riskOriginalInfoBaiRongExecutionJud || {}
  const ExecutionJson = (canParseJSON(ExecutionObj.data) && JSON.parse(ExecutionObj.data)) || {}
  const ExecutionInfo = ExecutionJson?.ExecutionJud || {}
  return handleExecutionJudData(ExecutionInfo)
}

/**
 * 处理 百融 - 反欺诈规则-法院被执行人
 * riskInfo?.riskOriginalInfoBaiRongRuleExecution
 * @param riskInfo 接口的数据
 * @param riskControlData 整体数据
 */
export function handleBaiRongExecution(riskInfo) {
  const ExecutionObj = riskInfo?.riskOriginalInfoBaiRongRuleExecution || {}
  const ExecutionJson = (canParseJSON(ExecutionObj.data) && JSON.parse(ExecutionObj.data)) || {}
  const ExecutionInfo = ExecutionJson?.Execution || {}
  return handleAntiFraudUserExecution(ExecutionInfo)
}

/**
 * 处理 百融 - 法院被执行人—高级版
 * riskInfo?.riskOriginalInfoBaiRongExecutionPro
 * @param riskInfo 接口的数据
 * @param riskControlData 整体数据
 */
export function handleBaiRongExecutionPro(riskInfo) {
  const ExecutionObj = riskInfo?.riskOriginalInfoBaiRongExecutionPro || {}
  const ExecutionJson = (canParseJSON(ExecutionObj.data) && JSON.parse(ExecutionObj.data)) || {}
  const ExecutionInfo = ExecutionJson?.ExecutionPro || {}
  return handleExecutionProData(ExecutionInfo)
}

/**
 * 处理 百融 - 借贷多头
 * riskInfo?.riskOriginalInfoBaiRongApplyLoanStr
 * @param riskInfo 接口的数据
 * @param riskControlData 整体数据
 */
export function handleBaiRongBullBorrow(riskInfo) {
  const dataObj = riskInfo?.riskOriginalInfoBaiRongApplyLoanStr || {}
  const dataJson = (canParseJSON(dataObj.data) && JSON.parse(dataObj.data)) || {}
  const dataInfo = dataJson?.ApplyLoanStr || {}
  return dataInfo
}

/**
 * 处理 百融 - 租赁多头
 * riskInfo?.riskOriginalInfoBaiRongApplyLoanC
 * @param riskInfo 接口的数据
 * @param riskControlData 整体数据
 */
export function handleBaiRongBullLease(riskInfo) {
  const dataObj = riskInfo?.riskOriginalInfoBaiRongApplyLoanC || {}
  const dataJson = (canParseJSON(dataObj.data) && JSON.parse(dataObj.data)) || {}
  const dataInfo = dataJson?.ApplyLoanC || {}
  return dataInfo
}
