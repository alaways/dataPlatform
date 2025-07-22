import { ContentTypeEnum } from '/@/enums/httpEnum'
import { defHttp } from '/@/utils/http/axios'

enum Api {
  GetCommissionList = '/collects/royalty/fee/config/page',
  SetCommission = '/collects/royalty/fee/config',
}

/**
 * 提成设置列表 - 列表
 */
export const getCommissionList = (params = {}) => {
  return defHttp.get({ url: Api.GetCommissionList, params })
}

/**
 * 提成设置列表 - 新增
 */
export const setCommissionItem = (data = {}) => {
  return defHttp.post({ url: Api.SetCommission, data })
}
/**
 * 提成设置列表 - 修改
 */
export const updateCommissionItem = (data: any) => {
  return defHttp.put({ url: `${Api.SetCommission}/${data.id}`, data })
}
/**
 * 提成设置列表 - 修改状态
 */
export const updateCommissionStatusItem = (data: any) => {
  return defHttp.put({ url: `${Api.SetCommission}/${data.id}/${data.status}` })
}
/**
 * 提成设置列表 - 删除
 */
export const delCommissionItem = (id: number | string) => {
  return defHttp.delete({ url: `${Api.SetCommission}/${id}` })
}

/**
 * 即将到期设置 - 列表
 */
export const getExpireSetting = (params: any) => {
  return defHttp.get({ url: `/sysExpression/listByCode?code=collection-rule&dataSources=${params?.dataSources}` })
}

/**
 * 即将到期设置 - 添加 or 修改
 */
export const setExpireSetting = (data: any) => {
  return defHttp.post({ url: `/sysExpression/saveOrUpdate`, data })
}

/**
 * 即将到期设置 - 删除
 */
export const delExpireSetting = (id: any, dataSources: any) => {
  return defHttp.post({
    url: `/sysExpression/remove`,
    data: { id, dataSources },
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  })
}

/**
 * 催收规则设置 - 获取数据
 */
export const getRuleSetting = (params: any) => {
  return defHttp.get({ url: `/getConfig?label=collection.config&dataSources=${params.dataSources}` })
}

/**
 * 催收规则设置 - 修改
 */
export const setRuleSetting = (data) => {
  return defHttp.post({
    url: `/saveConfig`,
    data: {
      label: 'collection.config',
      val: JSON.stringify(data),
    },
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  })
}
// 获取催收配置
export const getCollectsPage = () => {
  return defHttp.get({ url: `/collects/config/page` })
}
