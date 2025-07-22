import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatNumber, handleCurrentoDays } from '/@/utils/tool'
import { Tag } from 'ant-design-vue'
import { statusList } from '/@/views/order/utils'
import { isTradeNoOffline } from '/@/utils/is'
import { receivingList } from '/@/views/order/all/data'
import { usePermission } from '/@/hooks/web/usePermission'
const { hasPermission } = usePermission()

const allTime = handleCurrentoDays(6)

export const bizTypeAll = [
  { label: '线下支付', value: 'offlinePay' },
  { label: '合利宝支付', value: 'helibaoCreate' },
  { label: '银联支付', value: 'chinaumsWechatApp' },
  { label: '乐刷支付', value: 'LeposCreate' },
  { label: '乐刷二维码支付', value: 'LeposCreate_QRCode' },
  { label: '微信支付', value: 'TransCreate' },
  { label: '官方微信二维码支付', value: 'TransCreate_QRCODE' },
  { label: '支付宝支付', value: 'TradeCreate' },
  { label: '官方支付宝二维码支付', value: 'TradeCreate_QRCODE' },
  { label: '蚂蚁代扣', value: 'ato_pay' },
  { label: '支付宝-周期代扣', value: 'TradePay' },
  { label: '线下入账-合利宝支付', value: 'helibaoCreate_offline' },
  { label: '线下入账-官方支付宝支付', value: 'TradeCreate_QRCODE_offline' },
  { label: '线下入账-银联支付', value: 'chinaumsWechatApp_offline' },
  { label: '线下入账-官方微信支付', value: 'TransCreate_QRCODE_offline' },
  { label: '线下入账-乐刷二维码支付', value: 'LeposCreate_QRCode_offline' },
  { label: '线下入账-银联二维码支付', value: 'chinaumsWechatApp_QRCODE_offline' },
  { label: '线下入账-银行卡打款', value: 'bankCard_offline' },
]

export const pointTypeList = [
  { label: '待复核', value: 1, color: 'orange' },
  { label: '待提现', value: 2, color: 'orange' },
  { label: '审核中', value: 3, color: 'blue' },
  { label: '已结算', value: 4, color: 'green' },
]

export function handleAction(handleBalanceStatus, record) {
  return [
    {
      // 复核显示
      ifShow: record.reviewerStatus == 0,
      label: '确认复核',
      popConfirm: {
        title: '是否确认复核',
        placement: 'left',
        confirm: handleBalanceStatus.bind(null, record, 'Review'),
      },
    },
    {
      // 未付款显示
      ifShow: record.reviewerStatus == 1 && [0, 1].includes(record.payStatus),
      label: '确认付款',
      onClick: handleBalanceStatus.bind(null, record, 'PayConfirm'),
    },
    {
      // 已付款不显示
      ifShow: record.payStatus != 2,
      label: '修改',
      onClick: handleBalanceStatus.bind(null, record, 'Update'),
    },
    {
      // 已付款才显示
      ifShow: record.payStatus == 2,
      label: '撤销',
      popConfirm: {
        title: '是否确认取消',
        placement: 'left',
        confirm: handleBalanceStatus.bind(null, record, 'Revoke'),
      },
    },
  ]
}

export function columns(settleRate): BasicColumn[] {
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
      dataIndex: 'settleAmount',
      width: 120,
      helpMessage: '提现金额=(已还金额-锁费-公证费-催收成本费用)*平台手续费*货款结算比例',
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '平台手续费',
      dataIndex: 'settleFeeAmount',
      width: 120,
      customHeaderRender: () => {
        const settleFee = (100 - settleRate * 100).toFixed(2)
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
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '平台锁费',
      dataIndex: 'lockFee4Withdraw',
      width: 120,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '公证费用(元)',
      dataIndex: 'gzFee',
      width: 120,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '催收成本费用(元)',
      dataIndex: 'multiplierRoyaltyFee',
      width: 100,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '状态',
      dataIndex: 'pointType',
      width: 120,
      customRender: ({ record }) => {
        const find: any = { label: '', color: 'orange' }
        if (!record.financialConfirmation) {
          find.label = '待复核'
        } else if (!record.withdrawApplyStatus || record.withdrawApplyStatus == 2) {
          if (record.withdrawApplyStatus == 0) {
            find.label = '待审核'
            find.color = 'blue'
          } else {
            find.label = '待提现'
          }
        } else if (record.withdrawApplyStatus == 1 && !record.withdrawSettleStatus) {
          find.label = '待审核'
          find.color = 'blue'
        } else if (record.withdrawSettleStatus == 1) {
          find.label = '已结算'
          find.color = 'green'
        }
        return h(Tag, { color: find?.color || '' }, () => find?.label)
      },
    },
  ]
}

export const searchFormSchema: FormSchema[] = [
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
  // {
  //   field: 'status',
  //   label: '订单状态',
  //   defaultValue: '',
  //   component: 'Select',
  //   componentProps: { options: statusList },
  //   colProps: { span: 6 },
  // },
  {
    field: 'outTradeNo',
    label: '交易单号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'bizType',
    label: '支付来源',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: { options: bizTypeAll },
  },
  {
    show: hasPermission('FinanceStreamMerchantQuery'),
    label: '分配商家',
    field: 'merchantCode',
    component: 'Select',
    colProps: { span: 6 },
  },
  {
    field: 'time',
    label: '支付时间',
    component: 'RangePicker',
    defaultValue: allTime,
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
  // {
  //   field: 'timeSelect',
  //   label: '时间',
  //   defaultValue: '创建时间',
  //   fields: ['time'],
  //   component: 'Select',
  //   colProps: { span: 24 },
  //   renderColContent({ model, field }) {
  //     return (
  //       <Input.Group compact>
  //         <Select allowClear style="width: 120px;margin-left: 20px;" v-model:value={model[field]}>
  //           <Select.Option value="创建时间">创建时间</Select.Option>
  //           <Select.Option value="首付支付时间">首付支付时间</Select.Option>
  //           <Select.Option value="付款时间">付款时间</Select.Option>
  //         </Select>
  //         <FormItem name="time" label="">
  //           <DatePicker.RangePicker
  //             allowClear
  //             v-model:value={model['time']}
  //             valueFormat="YYYY-MM-DD"
  //             placeholder={['开始日期', '结束日期']}
  //           />
  //         </FormItem>
  //       </Input.Group>
  //     )
  //   },
  // },
]

export const modalSchema: FormSchema[] = [
  {
    field: 'payLogIdList',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'withdrawLimit',
    label: '提现最小金额',
    component: 'Input',
    show: false,
  },
  {
    label: '本次提现金额:',
    field: 'settleAmount',
    colProps: { span: 22 },
    component: 'Input',
    slot: 'settleAmount',
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
    required: true,
    component: 'Input',
  },
  {
    label: '开户银行:',
    field: 'bankName',
    colProps: { span: 22 },
    required: true,
    component: 'Input',
  },
  {
    label: '银行账号:',
    field: 'bankCardNo',
    colProps: { span: 22 },
    required: true,
    component: 'Input',
  },
]
