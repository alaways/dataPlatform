import { usePermission } from '/@/hooks/web/usePermission'

const { hasPermission } = usePermission()

export const antChianOptions = [
  { label: '同意', value: 1 },
  { label: '拒绝', value: 0 },
]

export const menuList = [
  {
    tab: '数据资产',
    key: 'HomeTotal', // 对应组件名
    ifShow: hasPermission('offlineDataInfo'),
  },
  {
    tab: 'Vintage指标',
    key: 'VintageTarget', // 对应组件名
    ifShow: hasPermission('dataVintageIndex'),
  },
  {
    tab: '资金统计',
    key: 'ZijinTongJi', // 对应组件名
    ifShow: hasPermission('dataZijinTotal'),
  },
  {
    tab: '逾期统计',
    key: 'YuQiTongJi', // 对应组件名
    ifShow: hasPermission('dataYuQiTongJi'),
  },
  {
    tab: '订单统计',
    key: 'OrderTongJi', // 对应组件名
    ifShow: hasPermission('dataOrderTongJi'),
  },
  {
    tab: '订单BI',
    key: 'orderBI', // 对应组件名
    ifShow: hasPermission('orderBI'),
  },
  {
    tab: '等级',
    key: 'orderLevel', // 对应组件名
    ifShow: hasPermission('orderLevel'),
  },
]?.filter((item: any) => item?.ifShow)
