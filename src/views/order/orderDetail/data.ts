import { usePermission } from '/@/hooks/web/usePermission'

const { hasPermission } = usePermission()

export const antChianOptions = [
  { label: '同意', value: 1 },
  { label: '拒绝', value: 0 },
]

export const menuList = [
  {
    tab: '基本信息',
    key: 'Detail', // 对应组件名
    ifShow: hasPermission('orderInfoTab'),
  },
  {
    tab: '征信查询',
    key: 'ZxSearch', // 对应组件名
    ifShow: hasPermission('orderZxSearch'),
  },
  // {
  //   tab: '租后管理',
  //   key: 'RentOut',
  // },
  {
    tab: '风控信息',
    key: 'RiskControl',
    ifShow: hasPermission('orderRiskInfo'),
  },
  {
    tab: '补全资料',
    key: 'Information',
    ifStore: 1,
    ifShow: hasPermission('orderSetInfo'),
  },
  {
    tab: '审核信息',
    key: 'Examine',
    ifStore: 1,
    ifShow: hasPermission('orderShInfo'),
  },
  {
    tab: '货款信息',
    key: 'Finance',
    ifShow: hasPermission('orderDkInfo'),
  },
  {
    tab: '账单信息',
    key: 'Bill',
    ifShow: hasPermission('orderBillInfo'),
  },
  {
    tab: '用户资质',
    key: 'Qualifications',
    ifShow: hasPermission('orderUserZZ'),
  },
  {
    tab: '物流信息',
    key: 'Logistics',
    ifShow: hasPermission('orderAddressInfo'),
  },
  {
    tab: '诉讼材料',
    key: 'ProsecuteFiles',
    ifShow: hasPermission('orderSsInfo'),
  },
  {
    tab: '催收记录',
    key: 'CollectionRecord',
    ifShow: hasPermission('orderCsInfo'),
  },
]?.filter((item: any) => item.ifShow)

function handleShow(arr, status) {
  return arr.some((v) => v == status)
}

/**
 *
 * @param detailInfo 订单详情
 * @param other 其他数据 Object
 */
export function showIconAction(detailInfo: any, other: any) {
  return [
    {
      show: handleShow([401], detailInfo.status) && hasPermission('OrderDetailPayModal'),
      title: '收款',
      name: '确认收款',
      icon: 'material-symbols:paid-outline',
      action: 'handlePaid',
    },
    {
      show:
        handleShow([501], detailInfo.status) &&
        ((detailInfo.needEsnotary == 1 && detailInfo.esnotaryPersonSign == 1) ||
          !detailInfo.needEsnotary) &&
        hasPermission('OrderDetailDeliveryModal'),
      title: '发货',
      name: '发货',
      icon: 'iconamoon:delivery',
      action: 'handleDelivery',
    },
    {
      show: handleShow([502, 601], detailInfo.status) && hasPermission('OrderDetailDeliveryModal'),
      title: '取消发货',
      name: '取消发货',
      icon: 'hugeicons:delivery-return-01',
      action: 'handleCancleDelivery',
    },
    {
      show: handleShow([502, 601], detailInfo.status) && hasPermission('OrderDetailDeliveryModal'),
      title: '打印快递面单',
      name: '打印快递面单',
      icon: 'material-symbols:print-outline-rounded',
      action: 'handlePrint',
    },
    {
      show: handleShow([502, 601], detailInfo.status) && hasPermission('OrderDetailDeliveryModal'),
      title: '预览快递面单',
      name: '预览快递面单',
      icon: 'material-symbols:file-open-outline-sharp',
      action: 'handleOpenPrint',
    },
    {
      show:
        handleShow([103, 201, 202], detailInfo.status) && hasPermission('OrderDetailAuditModal'),
      title: '审核',
      name: '审核',
      icon: 'ph:stamp',
      action: 'handleExamin',
    },
    {
      show: other.ifAllot == 0 && hasPermission('OrderDetailAllocationModal'),
      title: '分配商家',
      name: '分配',
      icon: 'material-symbols:safety-divider-rounded',
      action: 'handleStore',
    },
  ]
}
