export const RentTypeOptions = [
  { label: '日付', value: 0, day: 1 },
  { label: '周付', value: 1, day: 7 },
  { label: '月付', value: 3, day: 30 },
  { label: '十天', value: 4, day: 10 },
]

/**
 * 类型
 */
export const SpuTypeOptions = [
  { label: '手机', value: 'MOBILE' },
  { label: '电动车', value: 'CAR' },
]

/**
 * 成色列表
 */
export const SpuQualityOptions = [
  { label: '全新', value: '全新' },
  { label: '准新', value: '准新' },
  { label: '99新', value: '99新' },
  { label: '98新', value: '98新' },
  { label: '95新', value: '95新' },
  { label: '90新', value: '90新' },
  { label: '80新', value: '80新' },
  { label: '70新', value: '70新' },
  { label: '60新', value: '60新' },
  { label: '50新及以下', value: '50新及以下' },
]
/**
 * 配送方式
 */
export const DeliverWayOptions = [
  { label: '顺丰包邮/寄回自付', value: 'SFBY' },
  { label: '顺丰到付/寄回自付', value: 'SFDF' },
  { label: '快递包邮/寄回自付', value: 'KDBY' },
  { label: '寄出自付/寄回自付', value: 'JCZF' },
  { label: '线下自提 ', value: 'XXZT' },
]

/**
 * 租赁方式
 * 1.ZWJS:租满即送
 * 2.ZM:租满归还/续租/买断
 * 3.ZMXZ:组满续租
 */
export const RentModeOptions = [
  { label: '租满即送', value: 'ZWJS' },
  { label: '租满归还/续租/买断', value: 'ZM' },
  { label: '组满续租', value: 'ZMXZ' },
]
