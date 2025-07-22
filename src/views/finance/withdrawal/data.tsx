import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'
import { DatePicker, FormItem, Input, Select, Tag } from 'ant-design-vue'
import { statusList } from '../../order/utils'
import { isTradeNoOffline } from '/@/utils/is'
import { usePermission } from '/@/hooks/web/usePermission'
const { hasPermission } = usePermission()

export const columns: BasicColumn[] = [
  {
    title: '提现记录ID',
    dataIndex: 'id',
    width: 120,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '商家名称/编号',
    dataIndex: 'merchantName',
    width: 130,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, `${record.merchantName || '-'}`),
        h('br'),
        h('span', {}, record.merchantCode || '-'),
      ])
    },
  },
  {
    title: '提现金额',
    dataIndex: 'withdrawAmount',
    helpMessage: '提现金额=(已还金额-锁费-公证费-催收成本费用)*平台手续费*货款结算比例',
    width: 120,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '平台手续费',
    dataIndex: 'serviceFee',
    width: 120,
    // customHeaderRender: () => {
    //   return (
    //     <div>
    //       <div>平台手续费</div>
    //       <div style={{ color: 'red' }}>(6%)</div>
    //     </div>
    //   )
    // },
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '平台锁费',
    dataIndex: 'lockFee',
    width: 120,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '公证费用(元)',
    dataIndex: 'gzFee',
    width: 100,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '催收成本费用(元)',
    dataIndex: 'multiplierRoyaltyFee',
    width: 100,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '收款账户信息',
    dataIndex: 'realName',
    customRender: ({ record }) => {
      return (
        <>
          <div>开户名称: {record.realName}</div>
          <div>开户银行: {record.bankName}</div>
          <div>银行账户: {record.bankCardNo}</div>
        </>
      )
    },
  },
  {
    title: '状态',
    dataIndex: 'applyStatus',
    width: 120,
    customRender: ({ text }) => {
      const find: any = { label: '审核中', color: 'orange' }
      if (text == 1) {
        find.label = '已结算'
        find.color = 'green'
      } else if (text == 2) {
        find.label = '取消结算'
        find.color = 'red'
      }
      return h(Tag, { color: find?.color || '' }, () => find?.label)
    },
  },
  {
    title: '发起时间',
    dataIndex: 'createTime',
    width: 120,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '结算时间',
    dataIndex: 'settleTime',
    width: 120,
    customRender: ({ text }) => text || '-',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    show: hasPermission('Finance.loanMoney.platform'),
    field: 'merchantCode',
    label: '商家名称',
    component: 'Select',
    colProps: { span: 6 },
  },
  {
    field: 'applyStatus',
    label: '状态',
    defaultValue: '',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '审核中', value: 0 },
        { label: '已结算', value: 1 },
        { label: '取消结算', value: 2 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'timeSelect',
    label: '时间',
    defaultValue: '发起时间',
    fields: ['time'],
    component: 'Select',
    colProps: { span: 24 },
    renderColContent({ model, field }) {
      return (
        <Input.Group compact>
          <Select allowClear style="width: 120px;margin-left: 20px;" v-model:value={model[field]}>
            <Select.Option value="发起时间">发起时间</Select.Option>
            <Select.Option value="结算时间">结算时间</Select.Option>
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
]

export const modalSchema: FormSchema[] = [
  {
    field: 'withdrawId',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    label: '结算提现金额:',
    field: 'withdrawAmount',
    colProps: { span: 22 },
    component: 'Input',
    slot: 'withdrawAmount',
  },
  {
    label: '提现账号:',
    field: 'merchantName',
    colProps: { span: 22 },
    component: 'Input',
    slot: 'merchantName',
  },
  {
    label: '开户名称:',
    field: 'realName',
    colProps: { span: 22 },
    slot: 'realName',
    component: 'Input',
  },
  {
    label: '开户银行:',
    field: 'bankName',
    colProps: { span: 22 },
    slot: 'bankName',
    component: 'Input',
  },
  {
    label: '银行账号:',
    field: 'bankCardNo',
    colProps: { span: 22 },
    slot: 'bankCardNo',
    component: 'Input',
  },
  // {
  //   label: '结算流水号:',
  //   field: 'settleTradeNo',
  //   colProps: { span: 22 },
  //   required: true,
  //   component: 'Input',
  // },
]

export function infoColumns(settleRate): BasicColumn[] {
  return [
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
      title: '姓名/手机号',
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
            <div>应还金额</div>
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
          h('br'),
          h('span', {}, formatNumber(record.repayAmount, 2) || '-'),
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
      title: '还款期数',
      dataIndex: 'repaidPeriodsNum',
      width: 100,
      customRender: ({ text }) => text || '-',
    },
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
      title: '交易单号',
      dataIndex: 'outTradeNo',
      width: 120,
      customRender: ({ record }) => {
        const bool = isTradeNoOffline(record)
        return bool ? record.tradeNo : record.outTradeNo
      },
    },
    {
      title: '提现金额',
      dataIndex: 'withdrawAmount',
      helpMessage: '提现金额=(已还金额-锁费-公证费-催收成本费用)*平台手续费*货款结算比例',
      width: 120,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '平台手续费',
      dataIndex: 'totalAmountSubActualAmount',
      width: 120,
      customHeaderRender: () => {
        const settleFee = (100 - settleRate * 100).toFixed(2)
        console.log(settleFee)
        return (
          <div>
            <div>平台手续费</div>
            <div
              style={{
                color: 'red',
                display: hasPermission('Finance.loanMoney.platform') ? 'none' : 'display',
              }}
            >
              ({settleFee}%)
            </div>
          </div>
        )
      },
      customRender: ({ text }) => formatNumber(text || 0, 2) || '-',
    },
    {
      title: '平台锁费',
      dataIndex: 'lockFee4Withdraw',
      width: 120,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    // {
    //   title: '状态',
    //   dataIndex: 'applyStatus',
    //   width: 120,
    //   customRender: ({ text }) => {
    //     const find: any = { label: '审核中', color: 'orange' }
    //     if (text == 1) {
    //       find.label = '已结算'
    //       find.color = 'green'
    //     } else if (text == 2) {
    //       find.label = '取消结算'
    //       find.color = 'red'
    //     }
    //     return h(Tag, { color: find?.color || '' }, () => find?.label)
    //   },
    // },
    // {
    //   title: '结算时间',
    //   dataIndex: 'settleTime',
    //   width: 120,
    //   customRender: ({ text }) => text || '-',
    // },
  ]
}
