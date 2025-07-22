import { h } from 'vue'
import { DescItem } from '/@/components/Description/index'
import { Tag } from 'ant-design-vue'
import { formatNumber } from '/@/utils/tool'

export const examineSchema: DescItem[] = [
  {
    field: 'state',
    label: '机审结果',
    render: (value) => {
      if (value == 101) {
        return h(Tag, { color: 'orange' }, '待机审')
      } else {
        return h(Tag, { color: value != 103 ? 'green' : 'red' }, value != 103 ? '已通过' : '未通过')
      }
    },
  },
  {
    field: 'status',
    label: '人审结果',
    render: (value, data) => {
      if (data.state <= 201) {
        return h(Tag, { color: 'orange' }, '待审核')
      }
      if (value == 1) {
        return h(Tag, { color: 'green' }, '审核通过')
      } else if ((value = 2)) {
        return h(Tag, { color: 'red' }, '审核不通过')
      } else {
        return h(Tag, { color: 'orange' }, '待审核')
      }
    },
  },
  {
    field: 'showReason',
    label: '审核原因',
    render: (value) => value || '-',
    span: 3,
  },
]
export const paymentsSchema: DescItem[] = [
  {
    field: 'downPaymentAmount',
    label: '当前首次支付金额',
    render: (value) => formatNumber(value, 2, '.', ',', '￥', '元'),
  },
  {
    field: 'downPaymentAmountStatus',
    label: '是否付款',
    render: (value) => h(Tag, { color: value ? 'green' : 'orange' }, value ? '已付款' : '未付款'),
  },
]
export const deliverySchema: DescItem[] = [
  {
    field: '',
    label: '',
    render: () => h('h1', {}, '发货信息'),
    span: 3,
  },
  {
    field: 'deliverySn',
    label: '物流单号',
    render: (value) => value || '-',
  },
  {
    field: 'deliveryCompany',
    label: '快递公司',
    render: (value) => value || '-',
  },
  {
    field: 'createTime',
    label: '发货时间',
    render: (value) => value || '-',
  },
  {
    field: '',
    label: '',
    render: () => h('h1', { style: { marginTop: '10px' } }, '收货信息'),
    span: 3,
  },
  {
    field: 'deliverMode;',
    label: '发货方式',
    render: (_, data) => {
      if (data.id) {
        return data.deliverySn ? '物流发货' : '线下提货'
      } else {
        return '-'
      }
    },
  },
  {
    field: 'receiveTime',
    label: '提货时间',
    render: (value) => value || '-',
  },
]
