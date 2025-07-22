import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatDecimal, formatNumber } from '/@/utils/tool'
import { Tag, FormItem } from 'ant-design-vue'
import { spuTypeList } from '../../goods/goodsBase/data'
import { rentTypeList } from '../../goods/goodsLease/utils'
import { Input, Select } from 'ant-design-vue'

// 是否接单
// const receivingList = [
//   { label: '待确认', value: 0, color: 'orange' },
//   { label: '已确认', value: 1, color: 'green' },
//   { label: '已拒绝', value: 2, color: 'red' },
// ]

export const statusAllocationList = [
  {
    value: 801,
    label: '租赁生效中',
    color: 'green',
  },
  {
    value: 901,
    label: '已逾期',
    color: 'red',
  },
  {
    value: 1101,
    label: '已买断',
    color: 'green',
  },
  {
    value: 1201,
    label: '已完结',
    color: 'green',
  },
  {
    value: 1301,
    label: '取消订单',
    color: 'default',
  },
]
const statusOptions = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
]
export function columns(other: any): BasicColumn[] {
  return [
    {
      title: '订单信息',
      dataIndex: 'orderSn',
      width: 230,
      customRender: ({ record }) => {
        return h('div', {}, [
          h('span', {}, `订单编号: ${record.orderSn || '-'}`),
          h('br'),
          h('span', {}, `订单渠道: ${record.channelCode || '-'}`),
          h('br'),
          h('span', {}, `创建时间: ${record.createTime || '-'}`),
        ])
      },
    },
    {
      title: '用户信息',
      width: 240,
      dataIndex: 'nickName',
      customRender: ({ record }) => {
        const gender = record.gender == 1 ? '女' : '男'
        return h('div', {}, [
          h('span', {}, `姓名: ${record.nickName || '-'}`),
          h('br'),
          h('span', {}, `性别: ${gender}`),
          h('br'),
          h('span', {}, `手机号: ${record.phone || '-'}`),
          h('br'),
          h('span', {}, `身份证号: ${record.idCard || '-'}`),
        ])
      },
    },
    {
      title: '业务员',
      dataIndex: 'salesperson',
      width: 160,
    },
    {
      title: '商品信息',
      dataIndex: 'spuName',
      customRender: ({ record }) => {
        return h('div', {}, [
          h('span', {}, `商品名称: ${record.spuName || '-'}`),
          h('br'),
          h('span', {}, `商品规格: ${record.skuName || '-'}`),
        ])
      },
    },
    {
      title: '商品类目',
      dataIndex: 'spuType',
      width: 100,
      customRender: ({ text }) => {
        const find: any = spuTypeList.find((v) => v.value == text)
        return find?.label || '-'
      },
    },
    {
      title: '租金类型',
      dataIndex: 'rentType',
      width: 100,
      customRender: ({ text }) => {
        const find: any = rentTypeList.find((v) => v.value == text)
        return find?.label || '-'
      },
    },
    {
      // ifShow:
      // !hasPermission('Finance.loanMoney.merchant') || hasPermission('Finance.loanMoney.platform'),
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
    // {
    //   ifShow:
    //   hasPermission('Finance.loanMoney.platform') || hasPermission('Finance.loanMoney.merchant'),
    //   title: hasPermission('Finance.loanMoney.platform') ? '修改后货款' : '货款',
    //   dataIndex: 'modifyLoanMoney',
    //   width: 300,
    //   customRender: ({ record }) => {
    //     return (
    //       <div class={'text-left'}>
    //         <div>货款: {formatNumber(record.modifyLoanMoney || 0, 2) || '-'}</div>
    //         <div>业务员提成: {formatNumber(record.modifyRoyaltyFee || 0, 2) || '-'}</div>
    //         <div>商家返点: {formatNumber(record.modifyRebateFee || 0, 2) || '-'}</div>
    //         <div>
    //           接单商家合计承担:{' '}
    //           <span style={{ color: 'red' }}>
    //             {formatNumber(record.modifyMerchantTotalLoanMoney, 2) || '-'}
    //           </span>
    //         </div>
    //       </div>
    //     )
    //   },
    // },
    {
      title: '租金',
      dataIndex: 'downPaymentMoney',
      width: 200,
      customRender: ({ record }) => {
        return (
          <div style={{ cursor: 'pointer' }} onClick={() => other.payModal(record)}>
            <div>
              首次支付金额:{' '}
              <span style={{ color: '#48a6ea' }}>
                {formatNumber(record.downPaymentMoney, 2) || '-'}
              </span>
            </div>
            <div>
              已付总金额:{' '}
              <span style={{ color: '#48a6ea' }}>
                {formatNumber(record.repaidAmount, 2) || '-'}
              </span>
            </div>
            <div>
              签约总金额:{' '}
              <span style={{ color: '#48a6ea' }}>{formatNumber(record.totalMoney, 2) || '-'}</span>
            </div>
          </div>
        )
      },
    },
    {
      title: '是否已分单',
      dataIndex: 'isNewAllocat',
      width: 130,
      customRender: ({ text }) => {
        return text == 1 ? '是' : '否'
      },
    },
    {
      title: '租期',
      dataIndex: 'repayPeriodsNum',
      width: 130,
      customRender: ({ record }) => {
        return h('div', {}, [
          h('span', {}, `剩余租期: ${record.repayPeriodsNum || '-'}`),
          h('br'),
          h('span', {}, `总租期: ${record.totalPeriodsNum || '-'}`),
        ])
      },
    },
    {
      title: '账单周期',
      dataIndex: 'repayPeriodsNum',
      width: 130,
      customRender: ({ record }) => {
        return h('div', {}, [
          h('span', {}, `${record.rentDate || '-'}`),
          h('br'),
          h('span', {}, `至 ${record.revertDate || '-'}`),
        ])
      },
    },
    // {
    //   title: '订单分配信息',
    //   dataIndex: 'ifOrder',
    //   width: 230,
    //   fixed: 'right',
    //   customRender: ({ record }) => {
    //     const ifOrder = receivingList[record.ifOrder]
    //     const merchantName = record.merchantCode && record.merchantName ? record.merchantName : '-'
    //     return h('div', {}, [
    //       h('span', {}, `商家名称:${merchantName}`),
    //       h('br'),
    //       h('span', {}, `分配时间:${record.allocatTime || '-'}`),
    //       h('br'),
    //       h('span', {}, [
    //         h('span', {}, `接单状态:`),
    //         ifOrder ? h(Tag, { color: ifOrder?.color || '' }, () => ifOrder?.label) : '-',
    //       ]),
    //       h('br'),
    //       h('span', {}, `接单时间:${record.receivtTime || '-'}`),
    //     ])
    //   },
    // },
    {
      title: '订单状态',
      dataIndex: 'status',
      width: 100,
      fixed: 'right',
      customRender: ({ record }) => {
        const find: any = statusAllocationList.find((v) => v.value == record.status)
        return h(Tag, { color: find?.color || '' }, () => find?.label)
      },
    },
  ]
}
const numLabelList: Array<any> = [
  { label: '大于', value: '1' },
  { label: '等于', value: '2' },
  { label: '小于', value: '3' },
  { label: '大于等于', value: '4' },
  { label: '小于等于', value: '5' },
]
export const searchFormSchema: FormSchema[] = [
  {
    field: 'status',
    label: '订单状态',
    defaultValue: '',
    component: 'RadioButtonGroup',
    componentProps: { options: statusAllocationList },
    colProps: { span: 24 },
  },
  {
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'channelCode',
    label: '渠道',
    component: 'Select',
    colProps: { span: 8 },
    componentProps: {
      placeholder: '请选择',
      getPopupContainer: () => document.body,
    },
  },
  // {
  //   field: 'merchantCode',
  //   label: '商家名称',
  //   component: 'Select',
  //   colProps: { span: 8 },
  //   componentProps: {
  //     placeholder: '请选择',
  //     getPopupContainer: () => document.body,
  //   },
  // },
  // {
  //   field: 'ifAllot',
  //   label: '是否分配',
  //   component: 'Select',
  //   componentProps: {
  //     options: [
  //       { label: '是', value: 1 },
  //       { label: '否', value: 0 },
  //     ],
  //   },
  //   colProps: { span: 8 },
  // },
  {
    field: 'nickName',
    label: '姓名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'idCard',
    label: '身份证',
    component: 'Input',
    colProps: { span: 8 },
  },
  // {
  //   field: 'payOutMerchantAccountPeriodNoList',
  //   label: '已分账期数',
  //   component: 'Input',
  //   colProps: { span: 8 },
  // },
  {
    field: 'time',
    label: '创建时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 8 },
  },
  {
    field: 'spuType',
    label: '商品类目',
    component: 'Select',
    colProps: { span: 8 },
    componentProps: {
      options: spuTypeList,
    },
  },
  {
    field: 'rentTypeList',
    label: '租赁类型',
    component: 'Select',
    componentProps: { options: rentTypeList },
    colProps: { span: 8 },
  },
  {
    field: 'operators',
    label: '总期数',
    component: 'InputGroup',
    colProps: { span: 8 },
    renderColContent({ model }) {
      return (
        <div style="display:flex;">
          <div style="min-width: 50px;margin-left:30px;">总期数</div>
          <Input.Group compact style={{ display: 'flex' }}>
            <Select
              style="width: 140px;"
              placeholder="请选择"
              v-model:value={model['operators']}
              options={numLabelList}
              dropdownMatchSelectWidth={150}
            ></Select>
            <FormItem>
              <Input
                placeholder="请输入期数"
                style="max-width:200px"
                v-model:value={model['totalPeriodsNum']}
              />
            </FormItem>
          </Input.Group>
        </div>
      )
    },
  },
  {
    field: 'salesperson',
    label: '业务员',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'isNewAllocat',
    label: '是否已分单',
    component: 'Select',
    componentProps: { options: statusOptions },
    colProps: { span: 8 },
    defaultValue: 0,
  },
]

/**
 * 分配 - 填写信息
 */
export const allocationFormSchema: FormSchema[] = [
  {
    label: '订单ID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '订单ID',
    field: 'orderId',
    component: 'Input',
    show: false,
  },
  {
    field: 'merchantCode',
    label: '分配商家',
    component: 'ApiSelect',
    colProps: { span: 18 },
  },
  // {
  //   ifShow: ({ values }) => values.merchantCode,
  //   label: '',
  //   field: 'merchantTips',
  //   component: 'Input',
  //   colProps: { span: 24 },
  //   slot: 'merchantTips',
  // },
  {
    label: '',
    field: 'ordermodifyLoanMoney',
    component: 'Input',
    colProps: { span: 18 },
    slot: 'ordermodifyLoanMoney',
  },
  {
    label: '货款',
    field: 'modifyLoanMoney',
    required: true,
    colProps: { span: 18 },
    component: 'InputNumber',
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  {
    label: '业务员提成',
    field: 'modifyRoyaltyFee',
    required: true,
    colProps: { span: 18 },
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
    label: '商家返点',
    field: 'modifyRebateFee',
    required: true,
    colProps: { span: 18 },
    component: 'InputNumber',
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
]

export const batchFormSchema: FormSchema[] = [
  {
    label: '订单ID',
    field: 'orderIds',
    component: 'Input',
    show: false,
  },
  {
    field: 'merchantCode',
    label: '分配商家',
    component: 'ApiSelect',
    colProps: { span: 20 },
    required: true,
  },
  {
    label: '',
    field: 'merchantTips',
    component: 'Input',
    colProps: { span: 20 },
    slot: 'merchantTips',
  },
  {
    label: '',
    field: 'ordermodifyLoanMoney',
    component: 'Input',
    colProps: { span: 18 },
    slot: 'ordermodifyLoanMoney',
  },
  {
    label: '业务员提成',
    field: 'modifyRoyaltyFee',
    component: 'Input',
    // required: true,
    defaultValue: null,
    colProps: { span: 20 },
    componentProps: {
      type: 'number',
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
]
