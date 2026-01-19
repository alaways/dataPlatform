import { ContentTypeEnum } from '/@/enums/httpEnum'
import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetTaskList = '/collects/task/page',
  SetTask = '/collects/task',
  GetTaskRecordList = '/collects/task/record/page',
  SetTaskRecord = '/collects/task/record',
  GetTaskLockCount = '/collects/lockStatus',
}

/**
 * 任务列表 - 列表
 */
export const getTaskList = (params = {}) => {
  return defHttp.get({ url: Api.GetTaskList, params }, { isReturnNativeResponse: true })
}

/**
 * 任务列表 - 新增
 */
export const setTaskItem = (data = {}) => {
  return defHttp.post({ url: Api.SetTask, data })
}
/**
 * 任务列表 - 释放客户
 */
export const delTaskItem = (id: number | string, params) => {
  return defHttp.delete({ url: `${Api.SetTask}/remove/${id}`, params })
}
/**
 * 任务列表 - 上锁/解锁 用户
 */
export const lockTaskItem = (data: any) => {
  return defHttp.post({
    url: `/collects/lock`,
    data,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  })
}

/**
 * 任务列表 - 导出
 */
export const exportExcel = async (params) => {
  return defHttp.get(
    { url: `/collects/task/export`, params, responseType: 'blob', timeout: 60 * 1000 },
    { isReturnNativeResponse: true },
  )
}

/**
 * 任务列表 - 记录列表
 */
export const getTaskRecordList = (params = {}) => {
  return defHttp.get({ url: Api.GetTaskRecordList, params })
}
/**
 * 任务列表 - 新增
 */
export const setTaskRecordItem = (data = {}) => {
  return defHttp.post({ url: Api.SetTaskRecord, data })
}
/**
 * 任务列表 - 删除催收记录
 */
export const delTaskRecordItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.SetTaskRecord}/remove/${id}` })
}
/**
 * 任务列表 - 删除催收记录
 */
export const getTaskLockCount = (params: any) => {
  return defHttp.get({ url: Api.GetTaskLockCount, params })
}

/**
 * 起诉标识列表
 */
export const getProsecuteList = (params = {}) => {
  return defHttp.get({ url: `/prosecute/status/config/list`, params })
}
/**
 * 催收状态列表
 */
export const getCollectsStatusList = (params = {}) => {
  return defHttp.get({ url: `/collects/status/config/list`, params })
}
/**
 * 批量解锁 批量锁定
 */
export const batchLock = (data = {}) => {
  return defHttp.post(
    { url: `/collects/lock/batch?taskIds=${data.taskIds}&lock=${data.lock}&dataSources=${data.dataSources}`, data },
    { isReturnNativeResponse: true },
  )
}
