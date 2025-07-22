import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'
import { FormItem, Input, Select, Tag, DatePicker } from 'ant-design-vue'
import { usePermission } from '/@/hooks/web/usePermission'
import { rentTypeList } from '../../goods/goodsLease/utils'
const { hasPermission } = usePermission()

// 是否接单
const receivingList = [
  { label: '待确认', value: 0, color: 'orange' },
  { label: '已确认', value: 1, color: 'green' },
  { label: '已拒绝', value: 2, color: 'red' },
]
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

export function columns(other: any): BasicColumn[] {
  return [
    {
      title: '订单信息',
      dataIndex: 'orderSn',
      width: 230,
      customRender: ({ record }) => {
        const rentFind = rentTypeList?.find((item) => record.rentType === item.value)
        const find: any = statusAllocationList.find((v) => v.value == record.status)
        let ntext = rentFind?.label
        if (record.rentType == 2) {
          ntext = '月付'
        }
        return h('div', {}, [
          h('span', {}, `订单编号: ${record.orderSn || '-'}`),
          // h('br'),
          // h('span', {}, `订单渠道: ${record.channelCode || '-'}`),
          h('br'),
          h('span', {}, `租赁类型: ${ntext || '-'}`),
          h('br'),
          h('span', {}, `创建时间: ${record.createTime || '-'}`),
          h('br'),
          h(Tag, { color: find?.color || '' }, () => find?.label),
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
      width: 300,
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
    {
      title: '订单分配信息',
      dataIndex: 'ifOrder',
      width: 230,
      fixed: 'right',
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
    // {
    //   title: '订单状态',
    //   dataIndex: 'status',
    //   width: 100,
    //   fixed: 'right',
    //   customRender: ({ record }) => {
    //     const find: any = statusAllocationList.find((v) => v.value == record.status)
    //     return h(Tag, { color: find?.color || '' }, () => find?.label)
    //   },
    // },
  ]
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'limit',
    label: '',
    component: 'Input',
    defaultValue: 10,
    colProps: { span: 6 },
    show: false,
  },
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
    colProps: { span: 6 },
  },

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
    colProps: { span: 6 },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'idCard',
    label: '身份证',
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
    field: 'payOutMerchantAccountPeriodNoList',
    label: '已分账期数',
    component: 'Input',
    colProps: { span: 6 },
  },
  // {
  //   field: 'time',
  //   label: '分配时间',
  //   component: 'RangePicker',
  //   componentProps: {
  //     valueFormat: 'YYYY-MM-DD',
  //     placeholder: ['开始日期', '结束日期'],
  //   },
  //   colProps: { span: 8 },
  // },
  {
    field: 'timeSelect',
    label: '时间',
    defaultValue: '创建时间',
    fields: ['time'],
    component: 'Select',
    renderColContent({ model, field }) {
      return (
        <Input.Group compact>
          <Select allowClear style="width: 120px" v-model:value={model[field]}>
            <Select.Option value="创建时间">创建时间</Select.Option>
            <Select.Option value="分配时间">分配时间</Select.Option>
            <Select.Option value="接单时间">接单时间</Select.Option>
            <Select.Option value="还款时间">还款时间</Select.Option>
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
