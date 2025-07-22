import { DescItem } from '/@/components/Description/index'
import { formatNumber } from '/@/utils/tool'

export const carrySchema: DescItem[] = [
  {
    field: 'deliveryMethod',
    label: '配送方式',
  },
  {
    field: 'logisticsCompany',
    label: '物流公司',
  },
]
export const deliverySchema: DescItem[] = [
  {
    field: 'jContact',
    label: '寄件人',
    render: (value) => value || '-',
  },
  {
    field: 'jMobile',
    label: '手机号',
    render: (value) => value || '-',
  },
  {
    field: 'createTime',
    label: '寄件时间',
    render: (value) => value || '-',
  },
  {
    field: 'jAddress',
    label: '寄件地址',
    render: (value) => value || '-',
    span: 3,
  },
  {
    field: 'hr',
    label: '',
    span: 3,
  },
  {
    field: 'dContact',
    label: '收件人',
    render: (value) => value || '-',
  },
  {
    field: 'dMobile',
    label: '手机号',
    render: (value) => value || '-',
    span: 2,
  },
  {
    field: 'dAddress',
    label: '收件地址',
    render: (value) => value || '-',
    span: 3,
  },
]
export const goodsSchema: DescItem[] = [
  {
    field: 'spuName',
    label: '商品名称',
    render: (value) => value || '-',
  },
  {
    field: 'deliverySerialNumber',
    label: '序列号',
    render: (value) => value || '-',
  },
  {
    field: 'orderDeliveryRecordVO.supplierPrice',
    label: '供应商价格',
    render: (value) => formatNumber(value, 2, '.', ',', '', '元'),
  },
]

export const ticketsSchema: DescItem[] = [
  {
    field: 'mailNo',
    label: '物流单号',
    render: (value) => value || '-',
    span: 3,
  },
]
