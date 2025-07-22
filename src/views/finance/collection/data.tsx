import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatNumber, handleCurrentoDays } from '/@/utils/tool'
import { Tag } from 'ant-design-vue'
import { statusList } from '../../order/utils'
import { receivingList } from '../../order/all/data'
import { isTradeNoOffline } from '/@/utils/is'
import { spuTypeList } from '../../goods/goodsBase/data'
import { usePermission } from '/@/hooks/web/usePermission'
import { cloneDeep } from 'lodash-es'
import { cityCoding } from '/@/utils/cityData2'
const { hasPermission } = usePermission()

const allTime = handleCurrentoDays(6)

const cityDatas = cloneDeep(cityCoding)
cityDatas.forEach((v) => {
  v.children = v.children.map((c) => {
    return {
      ...c,
      children: [],
    }
  })
})

export const columns: BasicColumn[] = [
  {
    title: '支付时间',
    dataIndex: 'payTime',
    width: 120,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '支付来源',
    dataIndex: 'bizTypeName',
    width: 120,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '商户订单号',
    dataIndex: 'outTradeNo',
    width: 200,
    customHeaderRender: () => {
      return (
        <div>
          <div>商户订单号</div>
          <div>交易流水号</div>
        </div>
      )
    },
    customRender: ({ record }) => {
      const bool = isTradeNoOffline(record)
      return (
        <div>
          <div>{(bool && record.tradeNo) || '-'}</div>
          <div>{(!bool && record.outTradeNo) || '-'}</div>
        </div>
      )
    },
  },
  // {
  //   title: '交易单号',
  //   dataIndex: 'outTradeNo',
  //   width: 180,
  //   customRender: ({ text, record }) => text || record.outTradeNo || '-',
  // },
  {
    title: '订单编号',
    dataIndex: 'orderSn',
    width: 180,
    customHeaderRender: () => {
      return (
        <div>
          <div>订单编号</div>
          <div>创建时间</div>
          <div>订单状态</div>
        </div>
      )
    },
    customRender: ({ record }) => {
      const find: any = statusList.find((v) => v.value == record.status)
      return h('div', { textAlign: 'center' }, [
        h('span', {}, `${record.orderSn || '-'}`),
        h('br'),
        h('span', {}, record.createTime || '-'),
        h('br'),
        h(Tag, { color: find?.color || '' }, () => find?.label),
      ])
    },
  },
  {
    title: '订单分配信息',
    dataIndex: 'ifOrder',
    width: 230,
    customRender: ({ record }) => {
      const ifOrder = receivingList[record.ifOrder]
      const merchantName = record.merchantCode && record.merchantName ? record.merchantName : '-'
      return h('div', {}, [
        h('span', {}, `商家名称:${merchantName}`),
        h('br'),
        h('span', {}, `分配时间:${record.allocatTime || '-'}`),
        h('br'),
        h('span', {}, [
          h('span', {}, `接单状态:`),
          ifOrder ? h(Tag, { color: ifOrder?.color || '' }, () => ifOrder?.label) : '-',
        ]),
        h('br'),
        h('span', {}, `接单时间:${record.receivtTime || '-'}`),
      ])
    },
  },
  {
    title: '姓名/手机号',
    dataIndex: 'name',
    width: 130,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, `${record.name || '-'}`),
        h('br'),
        h('span', {}, record.phone || '-'),
      ])
    },
  },
  {
    ifShow: hasPermission('GoodsSpuType'),
    title: '商品类目',
    dataIndex: 'spuType',
    width: 100,
    customRender: ({ text }) => {
      const find: any = spuTypeList.find((v) => v.value == text)
      return (find && find.label) || ''
    },
  },
  {
    title: '商品名称',
    dataIndex: 'spuName',
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, record.skuName || '-'),
        h('br'),
        h('span', {}, record.spuName || '-'),
      ])
    },
  },
  {
    title: '已还金额',
    dataIndex: 'repaidAmount',
    width: 100,
    customHeaderRender: () => {
      return (
        <div>
          <div>已还金额</div>
          {/* <div>应还金额</div> */}
        </div>
      )
    },
    customRender: ({ record }) => {
      const txt = [h('span', {}, formatNumber(record.payMoney, 2) || '-')]
      if (record.ifActual) {
        if (record.couponMoney) {
          txt.push(h(Tag, { color: 'red', style: { marginLeft: '3px' } }, '券后'))
        } else {
          txt.push(h(Tag, { color: 'green', style: { marginLeft: '3px' } }, '减免实收'))
        }
      }
      return h('div', { textAlign: 'center' }, [
        txt,
        // h('br'),
        // h('span', {}, formatNumber(record.repayAmount, 2) || '-'),
      ])
    },
  },
  {
    title: '优惠金额',
    dataIndex: 'couponMoney',
    width: 100,
    customRender: ({ text }) => (text && formatNumber(text, 2)) || '-',
  },
  {
    title: '总期数',
    dataIndex: 'totalPeriodsNum',
    width: 100,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '还款期数',
    dataIndex: 'repaidPeriodsNum',
    width: 100,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '首次支付金额(元)',
    // dataIndex: 'firstPay',
    dataIndex: 'downPaymentTotalAmount',
    width: 140,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    // ifShow: hasPermission('Finance.loanMoney.platform'),
    title: '锁费(元)',
    dataIndex: 'lockFee',
    width: 100,
    customRender: ({ text }) => {
      if (!text) return '-'
      return formatNumber(text, 2)
    },
  },
  {
    title: '公证费用(元)',
    dataIndex: 'gzFee',
    width: 100,
    customRender: ({ text }) => {
      if (!text) return '-'
      return formatNumber(text, 2)
    },
  },
  {
    title: '待还总金额(元)',
    dataIndex: 'repayTotalAmount',
    helpMessage: '订单待还总金额(不含罚金)',
    width: 140,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '逾期罚金(元)',
    dataIndex: 'overduePenaltyAmount',
    width: 100,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '是否买断',
    dataIndex: 'ifBuyOut',
    width: 80,
    customRender: ({ text }) => {
      return h(Tag, { color: text == 1 ? 'green' : 'red' }, text == 1 ? '是' : '否')
    },
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'status',
    label: '订单状态',
    defaultValue: '',
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { value: '', label: '全部' },
        { value: 301, label: '待签约' },
        { value: 501, label: '待发货' },
        { value: 801, label: '租赁生效' },
        { value: 901, label: '已逾期' },
        { value: 1101, label: '已买断' },
        { value: 1201, label: '已完结' },
        { value: 1301, label: '取消订单' },
      ],
    },
    colProps: { span: 24 },
  },
  {
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'nickName',
    label: '姓名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    show: hasPermission('Finance.loanMoney.platform'),
    field: 'merchantCode',
    label: '商家名称',
    component: 'Select',
    colProps: { span: 6 },
  },
  {
    field: 'ifOrder',
    label: '接单状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: receivingList,
    },
  },
  {
    field: 'status',
    label: '订单状态',
    defaultValue: '',
    component: 'Select',
    componentProps: { options: statusList },
    colProps: { span: 6 },
  },
  {
    ifShow: hasPermission('GoodsSpuType'),
    field: 'spuType',
    label: '商品类目',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: spuTypeList,
    },
  },
  {
    field: 'tradeNo',
    label: '交易流水号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'city',
    label: '地区',
    component: 'TreeSelect',
    colProps: { span: 6 },
    componentProps: () => {
      return {
        treeNodeFilterProp: 'label',
        treeData: cityDatas,
        treeCheckable: true,
        allowClear: true,
        showSearch: true,
      }
    },
  },
  {
    field: 'createTime',
    label: '创建时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
  {
    field: 'payTime',
    label: '支付时间',
    component: 'RangePicker',
    defaultValue: allTime,
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]
