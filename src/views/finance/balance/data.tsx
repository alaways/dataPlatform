import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatDecimal, formatNumber, handleCurrentoDays } from '/@/utils/tool'
import { DatePicker, FormItem, Input, Select, Tag } from 'ant-design-vue'
import { DescItem } from '/@/components/Description'
import { statusList } from '../../order/utils'
import { receivingList } from '../../order/all/data'
import { usePermission } from '/@/hooks/web/usePermission'
import { spuTypeList } from '../../goods/goodsBase/data'
import { rentTypeList } from '../../goods/goodsLease/utils'
// import { goodTypeList } from '../../goods/goodsLeaseMore/components/utils'
const { hasPermission } = usePermission()
const allTime = handleCurrentoDays(6)
export const payStatusList = [
  { label: '全部', value: -1, color: 'orange' },
  { label: '待复核', value: 0, color: 'orange' },
  { label: '待付款', value: 1, color: 'orange' },
  { label: '待付款（提成未付）', value: 2, color: 'orange' },
  { label: '已付款', value: 3, color: 'green' },
]
const goodTypeList = [
  { label: '默认', value: 1 },
  { label: '计算器计价', value: 2 },
  { label: '地区政策表', value: 3 },
  { label: '0首付', value: 4 },
]
export function handleAction(handleBalanceStatus, record) {
  return [
    {
      // 复核显示
      ifShow: record.reviewerStatus == 0 && hasPermission('FinanceBalanceReview'),
      label: '确认复核',
      popConfirm: {
        title: '是否确认复核',
        placement: 'left',
        confirm: handleBalanceStatus.bind(null, record, 'Review'),
      },
    },
    {
      // 未付款显示
      ifShow:
        record.reviewerStatus == 1 &&
        [0, 1].includes(record.payStatus) &&
        hasPermission('FinanceBalanceConfirm'),
      label: '确认付款',
      onClick: handleBalanceStatus.bind(null, record, 'PayConfirm'),
    },
    {
      // 修改，未分配给商家的
      // ifShow: record.payStatus != 2,
      ifShow: record.ifOrder != 1 && hasPermission('FinanceBalanceUpdate'),
      label: '修改',
      onClick: handleBalanceStatus.bind(null, record, 'Update'),
    },
    {
      // 修改，分配给商家后的数据
      ifShow: record.ifOrder == 1 && hasPermission('FinanceBalanceUpdate'),
      label: '修改',
      onClick: handleBalanceStatus.bind(null, record, 'UpdateAfter'),
    },
    {
      // 已付款才显示
      ifShow: record.payStatus == 2 && hasPermission('FinanceBalanceRevoke'),
      label: '撤销',
      popConfirm: {
        title: '是否确认取消',
        placement: 'left',
        confirm: handleBalanceStatus.bind(null, record, 'Revoke'),
      },
    },
  ]
}

export const columns: BasicColumn[] = [
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    customHeaderRender: () => {
      return (
        <div>
          <div>创建时间/</div>
          <div>首付支付时间</div>
        </div>
      )
    },
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, `${record.createTime || '-'}`),
        h('br'),
        h('span', {}, record.firstPayTime || '-'),
      ])
    },
  },
  {
    title: '订单编号',
    dataIndex: 'orderSn',
    width: 180,
    customHeaderRender: () => {
      return (
        <div>
          <div>订单编号</div>
          <div>租赁类型</div>
          <div>创建时间</div>
          <div>订单状态</div>
        </div>
      )
    },
    customRender: ({ record }) => {
      const find: any = statusList.find((v) => v.value == record.status)
      const rentFind = rentTypeList?.find((item) => record.rentType === item.value)
      console.log(rentFind, 'nextListat')
      let ntext = rentFind?.label

      if (record.rentType == 2) {
        ntext = '月付'
      }
      return h('div', { textAlign: 'center' }, [
        h('span', {}, `${record.orderSn || '-'}`),
        h('br'),
        h('span', {}, `${ntext || '-'}`),
        h('br'),
        h('span', {}, record.createTime || '-'),
        h('br'),
        h(Tag, { color: find?.color || '' }, () => find?.label),
      ])
    },
  },
  {
    title: '计价方式',
    dataIndex: 'goodsLeaseType',
    width: 100,
    customRender: ({ text }) => {
      const find: any = goodTypeList.find((v) => v.value == text)
      return (find && find.label) || ''
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
    title: '订单分配信息',
    dataIndex: 'ifOrder',
    width: 230,
    align: 'left',
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
    title: '姓名/性别/手机号',
    width: 130,
    customRender: ({ record }) => {
      const gender = record.gender == 1 ? '女' : '男'
      return h('div', { textAlign: 'center' }, [
        h('span', {}, `${record.nickName || '-'} ${gender}`),
        h('br'),
        h('span', {}, record.phone || '-'),
      ])
    },
  },
  {
    title: '地区',
    dataIndex: 'province',
    width: 120,
    customRender: ({ record }) => {
      return record.province ? `${record.province || ''}${record.city || ''}` : '-'
    },
  },
  {
    ifShow:
      !hasPermission('Finance.loanMoney.merchant') || hasPermission('Finance.loanMoney.platform'),
    title: '货款',
    dataIndex: 'loanMoney',
    width: 200,
    customRender: ({ record }) => {
      return (
        <div class={'text-left'}>
          <div>货款: {formatNumber(record.loanMoney || 0, 2) || '-'}</div>
          <div>业务员提成: {formatNumber(record.royaltyFee || 0, 2) || '-'}</div>
          <div>商家返点: {formatNumber(record.rebateFee || 0, 2) || '-'}</div>
          <div>
            接单商家合计承担:{' '}
            <span style={{ color: 'red' }}>
              {formatNumber(record.merchantTotalLoanMoney, 2) || '-'}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    ifShow:
      hasPermission('Finance.loanMoney.platform') || hasPermission('Finance.loanMoney.merchant'),
    title: hasPermission('Finance.loanMoney.platform') ? '修改后货款' : '货款',
    dataIndex: 'modifyLoanMoney',
    width: 200,
    customRender: ({ record }) => {
      return (
        <div class={'text-left'}>
          <div>货款: {formatNumber(record.modifyLoanMoney || 0, 2) || '-'}</div>
          <div>业务员提成: {formatNumber(record.modifyRoyaltyFee || 0, 2) || '-'}</div>
          <div>商家返点: {formatNumber(record.modifyRebateFee || 0, 2) || '-'}</div>
          <div>
            接单商家合计承担:{' '}
            <span style={{ color: 'red' }}>
              {formatNumber(record.modifyMerchantTotalLoanMoney, 2) || '-'}
            </span>
          </div>
        </div>
      )
    },
  },
  // {
  //   title: '业务员提成',
  //   dataIndex: 'royaltyFee',
  //   width: 100,
  //   customRender: ({ text }) => formatNumber(text, 2) || '-',
  // },
  // {
  //   title: '商家返点',
  //   dataIndex: 'rebateFee',
  //   width: 100,
  //   customRender: ({ text }) => formatNumber(text, 2) || '-',
  // },
  // {
  //   title: '小计',
  //   dataIndex: 'totalMoney',
  //   width: 100,
  //   customRender: ({ text }) => formatNumber(text, 2) || '-',
  // },
  {
    title: '姓名/付款账户',
    dataIndex: 'realName',
    width: 120,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, `${record.realName || '-'}`),
        h('br'),
        h('span', {}, record.bankCardNo || '-'),
      ])
    },
  },
  {
    title: '开户银行',
    dataIndex: 'bankName',
  },
  {
    title: '付款状态',
    dataIndex: 'payStatus1',
    width: 150,
    customRender: ({ record }) => {
      const find = payStatusList.find((v) => v.value - 1 == record.payStatus)
      return h(Tag, { color: find?.color || '' }, find?.label || '-')
    },
  },
  {
    title: '付款日期',
    dataIndex: 'payTime',
    width: 180,
  },
  {
    title: '业务复核',
    dataIndex: 'reviewerStatus',
    customRender: ({ text }) => {
      return h(Tag, { color: text == 1 ? 'green' : 'orange' }, text == 1 ? '已复核' : '待复核')
    },
  },
  {
    title: '财务付款',
    dataIndex: 'payStatus',
    width: 150,
    customRender: ({ text }) => {
      const find = payStatusList.find((v) => v.value - 1 == text)
      return h(Tag, { color: find?.color || '' }, find?.label || '-')
    },
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'payStatus',
    label: '状态',
    defaultValue: -1,
    component: 'RadioButtonGroup',
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
    componentProps: { options: statusList, placeholder: '请选择' },
    colProps: { span: 6 },
  },
  {
    ifShow: hasPermission('GoodsSpuType'),
    field: 'spuType',
    label: '商品类目',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: spuTypeList,
    },
    colProps: { span: 6 },
  },
  {
    field: 'goodsLeaseType',
    label: '计价方式',
    component: 'Select',
    componentProps: { options: goodTypeList },
    colProps: { span: 6 },
  },
  {
    field: 'timeSelect',
    label: '时间',
    defaultValue: '创建时间',
    fields: ['time'],
    defaultValueObj: { time: allTime },
    component: 'Select',
    colProps: { span: 10 },
    renderColContent({ model, field }) {
      return (
        <Input.Group compact>
          <Select allowClear style="width: 120px" v-model:value={model[field]}>
            <Select.Option value="创建时间">创建时间</Select.Option>
            <Select.Option value="首付支付时间">首付支付时间</Select.Option>
            <Select.Option value="付款时间">付款时间</Select.Option>
          </Select>
          <FormItem name="time" label="">
            <DatePicker.RangePicker
              allowClear
              v-model:value={model['time']}
              valueFormat="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
            />
          </FormItem>
        </Input.Group>
      )
    },
  },
  {
    field: 'rentTypeList',
    label: '租赁类型',
    component: 'Select',
    componentProps: { options: rentTypeList },
    colProps: { span: 6 },
  },
]

export const refundSchema: DescItem[] = [
  {
    field: 'orderSn',
    label: '订单编号',
    render: (value) => value || '-',
  },
  {
    field: 'createTime',
    label: '创建时间',
    span: 2,
    render: (value) => value || '-',
  },
  {
    field: 'nickName',
    label: '用户信息',
    span: 3,
    render: (_, data) => {
      const gender = data.gender == 1 ? '女' : '男'
      return `${data.nickName || '-'} ${gender} ${data.phone || '-'}`
    },
  },
]

export const modalSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'orderId',
    label: 'orderId',
    component: 'Input',
    show: false,
  },
  {
    field: 'orderSn',
    label: 'orderSn',
    component: 'Input',
    show: false,
  },
  {
    field: 'province',
    label: '省',
    component: 'Input',
    show: false,
  },
  {
    field: 'city',
    label: '市',
    component: 'Input',
    show: false,
  },
  {
    field: 'isAfter',
    label: '修改-修改后数据',
    component: 'Input',
    show: false,
  },
  {
    ifShow: ({ values }) => values.isAfter == 0,
    label: '货款',
    field: 'loanMoney',
    required: true,
    colProps: { span: 8 },
    component: 'InputNumber',
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  {
    ifShow: ({ values }) => values.isAfter == 0,
    label: '业务员提成',
    field: 'royaltyFee',
    required: true,
    colProps: { span: 8 },
    defaultValue: 300,
    component: 'InputNumber',
    componentProps: {
      // disabled: true,
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  {
    ifShow: ({ values }) => values.isAfter == 0,
    label: '商家返点',
    field: 'rebateFee',
    required: true,
    colProps: { span: 8 },
    component: 'InputNumber',
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  {
    ifShow: ({ values }) => values.isAfter == 1,
    label: '货款',
    field: 'modifyLoanMoney',
    required: true,
    colProps: { span: 8 },
    component: 'InputNumber',
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  {
    ifShow: ({ values }) => values.isAfter == 1,
    label: '业务员提成',
    field: 'modifyRoyaltyFee',
    required: true,
    colProps: { span: 8 },
    defaultValue: 300,
    component: 'InputNumber',
    componentProps: {
      // disabled: true,
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  {
    ifShow: ({ values }) => values.isAfter == 1,
    label: '商家返点',
    field: 'modifyRebateFee',
    required: true,
    colProps: { span: 8 },
    component: 'InputNumber',
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  {
    label: '付款方式:',
    field: 'mode',
    colProps: { span: 22 },
    component: 'Input',
    slot: 'mode',
  },
  {
    label: '姓名',
    field: 'realName',
    colProps: { span: 9 },
    required: true,
    component: 'Input',
  },
  {
    label: '付款账户',
    field: 'bankCardNo',
    colProps: { span: 9 },
    required: true,
    component: 'Input',
  },
  {
    label: '开户银行',
    field: 'bankName',
    colProps: { span: 18 },
    required: true,
    component: 'Input',
  },
]

export const payModalSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'orderId',
    label: 'orderId',
    component: 'Input',
    show: false,
  },
  {
    field: 'orderSn',
    label: 'orderSn',
    component: 'Input',
    show: false,
  },
  {
    field: 'showAction',
    label: '菜单',
    component: 'Input',
    show: false,
  },
  {
    field: 'loanMoney',
    label: '已付货款:',
    component: 'Input',
    colProps: { span: 24 },
    slot: 'loanMoney',
  },
  {
    field: 'rebateFee',
    label: '商家返点:',
    component: 'Input',
    colProps: { span: 24 },
    slot: 'rebateFee',
  },
  {
    // ifShow: ({ values }) => {
    //   return values.payStatus == 3 || values.showAction == 2
    // },
    field: 'royaltyFee',
    label: '业务员提成:',
    component: 'Input',
    colProps: { span: 24 },
    slot: 'royaltyFee',
  },
  {
    label: '状态',
    field: 'payStatus',
    required: true,
    component: 'RadioGroup',
    defaultValue: 2,
    colProps: { span: 24 },
  },
]
