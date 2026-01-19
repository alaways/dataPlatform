import { usePermission } from '/@/hooks/web/usePermission'

const { hasPermission } = usePermission()

export const antChianOptions = [
  { label: '同意', value: 1 },
  { label: '拒绝', value: 0 },
]

export const menuList = [
  {
    tab: '数据总览',
    key: 'HomeTotal', // 对应组件名
    ifShow: hasPermission('StatisticsHomeRouter'),
  },
  {
    tab: 'Vintage指标',
    key: 'VintageTarget', // 对应组件名
    ifShow: hasPermission('VintagePage'),
  },
  {
    tab: '资金统计',
    key: 'ZijinTongJi', // 对应组件名
    ifShow: hasPermission('StatisticsFinancePage'),
  },
  {
    tab: '逾期统计',
    key: 'YuQiTongJi', // 对应组件名
    ifShow: hasPermission('StatisticsSlippageRouter'),
  },
  {
    tab: '订单统计',
    key: 'OrderTongJi', // 对应组件名
    ifShow: hasPermission('StatisticsOrderPage'),
  },
  {
    tab: '运营统计',
    key: 'YunYingTongJi', // 对应组件名
    ifShow: hasPermission('StatisticsOperate'),
  },
  {
    tab: '用户统计',
    key: 'UserTongJi', // 对应组件名
    ifShow: hasPermission('StatisticsUserPage'),
  },
]?.filter((item: any) => item?.ifShow)
