import { h } from 'vue'
import { FormSchema } from '/@/components/Table'
import { formatNumber, handleCurrentoDays } from '/@/utils/tool'
import { Tag } from 'ant-design-vue'
import { receivingList } from '../all/data'
import { statusList } from '../utils'
// import { isTradeNoOffline } from '/@/utils/is'
import { spuTypeList } from '../../goods/goodsBase/data'
import { rentTypeList } from '../../goods/goodsLease/utils'
import { usePermission } from '/@/hooks/web/usePermission'
import { goodTypeList } from '../../goods/goodsLeaseMore/components/utils'
import { bizTypeAll } from '../../finance/stream/components/data'
const { hasPermission } = usePermission()
import { getTextArr } from '/@/utils'

const allTime = handleCurrentoDays(6)
const orderStatus = {
  商户订单号: hasPermission('paiddiyRow_tradeNo'),
  交易流水号: hasPermission('paiddiyRow_outTradeNo'),
}
const userStatus = {
  姓名: hasPermission('paiddiyRow_name'),
  手机号: hasPermission('paiddiyRow_phone'),
}
export const columns = () => {
  const uinfo = getTextArr(userStatus)
  return [
    {
      title: '订单编号',
      dataIndex: 'orderSn',
      ifShow: hasPermission('paiddiyRow_orderSn'),
      customHeaderRender: () => {
        return (
          <div>
            <div>订单编号</div>
            <div>订单状态</div>
          </div>
        )
      },
      width: 150,
      customRender: ({ text, record }) => {
        if (record.status == 501 && !record?.atoStatus && record.goodsLeaseType == 4) {
          record.status = 3012
        } else if (
          record.needEsnotary == 1 &&
          !record.esnotaryPersonSign &&
          record.status >= 501 &&
          record.status < 1000
        ) {
          record.status = 3011
        }
        const find: any = statusList.find((v) => v.value == record.status)
        return (
          <>
            <div>{text}</div>
            <div>
              <Tag color={find?.color || ''}>{find?.label}</Tag>
            </div>
          </>
        )
      },
    },
    {
      title: uinfo,
      width: 130,
      ifShow: userStatus['姓名'] || userStatus['手机号'],
      customRender: ({ record }) => {
        const name = userStatus['姓名'] ? `${record.name || '-'}` : ''
        const phone = userStatus['手机号'] ? record.phone || '-' : ''
        return h('div', { textAlign: 'center' }, [
          h('span', {}, name),
          h('br'),
          h('span', {}, phone),
        ])
      },
    },
    {
      title: '计价方式',
      dataIndex: 'goodsLeaseType',
      ifShow: hasPermission('paiddiyRow_goodsLeaseType'),
      width: 100,
      customRender: ({ text }) => {
        const find: any = goodTypeList.find((v) => v.value == text)
        return (find && find.label) || ''
      },
    },
    {
      title: '订单分配信息',
      dataIndex: 'ifOrder',
      ifShow: hasPermission('paiddiyRow_ifOrder'),
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
      title: '支付来源',
      dataIndex: 'bizTypeName',
      ifShow: hasPermission('paiddiyRow_bizTypeName'),
      width: 120,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '账单编号',
      dataIndex: 'billItemSn',
      ifShow: hasPermission('paiddiyRow_billItemSn'),
      width: 120,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '商户订单号',
      dataIndex: 'outTradeNo',
      ifShow: orderStatus['交易流水号'] || orderStatus['商户订单号'],
      width: 200,
      customHeaderRender: () => {
        return (
          <div>
            {orderStatus['商户订单号'] ? <div>商户订单号</div> : null}
            {orderStatus['交易流水号'] ? <div>交易流水号</div> : null}
          </div>
        )
      },
      customRender: ({ record }) => {
        // const bool = isTradeNoOffline(record)
        return (
          <div>
            {orderStatus['商户订单号'] ? <div>{record.tradeNo || '-'}</div> : null}
            {orderStatus['交易流水号'] ? <div>{record.outTradeNo || '-'}</div> : null}
          </div>
        )
      },
    },
    {
      title: '商品信息',
      dataIndex: 'spuName',
      ifShow: hasPermission('paiddiyRow_spuName'),
      customRender: ({ record }) => {
        const find: any = spuTypeList.find((v) => v.value == record.spuType)
        return (
          <>
            <div>商品类目: {find.label || ''}</div>
            <div>商品名称: {record.spuName}</div>
            <div>商品规格: {record.skuName}</div>
          </>
        )
      },
    },
    {
      title: '租赁类型',
      dataIndex: 'rentType',
      ifShow: hasPermission('paiddiyRow_rentType'),
      width: 100,
      customRender: ({ text }) => {
        if (text == 2) {
          return '月付'
        }
        const find = rentTypeList.find((v) => v.value == text)
        return find?.label || '-'
      },
    },
    {
      title: '支付金额(元)',
      dataIndex: 'payMoney',
      ifShow: hasPermission('paiddiyRow_payMoney'),
      width: 100,
      customRender: ({ text, record }) => {
        const txt = [h('span', {}, formatNumber(text, 2) || '-')]
        if (record.ifActual) {
          if (record.couponMoney) {
            txt.push(h(Tag, { color: 'red', style: { marginLeft: '3px' } }, '券后'))
          } else {
            txt.push(h(Tag, { color: 'green', style: { marginLeft: '3px' } }, '减免实收'))
          }
        }
        return h('div', { textAlign: 'center' }, txt)
      },
    },
    // {
    //   title: '交易单号',
    //   dataIndex: 'outTradeNo',
    //   width: 230,
    //   customRender: ({ text }) => text || '-',
    // },
    {
      title: '首次支付金额(元)',
      // dataIndex: 'firstPay',
      dataIndex: 'downPaymentTotalAmount',
      ifShow: hasPermission('paiddiyRow_downPaymentTotalAmount'),
      width: 130,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '押金(元)',
      dataIndex: 'deposit',
      ifShow: hasPermission('paiddiyRow_deposit'),
      width: 100,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '锁费(元)',
      dataIndex: 'lockFee',
      ifShow: hasPermission('paiddiyRow_lockFee'),
      width: 100,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '公证费用(元)',
      dataIndex: 'gzFee',
      ifShow: hasPermission('paiddiyRow_gzFee'),
      width: 100,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '是否买断',
      dataIndex: 'ifBuyOut',
      ifShow: hasPermission('paiddiyRow_ifBuyOut'),
      width: 80,
      customRender: ({ text }) => {
        return h(Tag, { color: text == 1 ? 'green' : 'red' }, text == 1 ? '是' : '否')
      },
    },
    {
      title: '支付时间',
      dataIndex: 'payTime',
      ifShow: hasPermission('paiddiyRow_payTime'),
      width: 180,
    },
    {
      title: '收款账户',
      width: 180,
      dataIndex: 'payAccount',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ifShow: hasPermission('paiddiyRow_remark'),
    },
  ]
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'status',
    label: '订单状态',
    defaultValue: '',
    component: 'RadioButtonGroup',
    colProps: { span: 24 },
    componentProps: {
      options: [
        { value: '', label: '全部' },
        { value: '801', label: '生效中' },
        { value: '901', label: '逾期' },
        { value: '1101', label: '买断' },
        { value: '1201', label: '完结' },
        { value: '1301', label: '取消订单' },
      ],
    },
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
    field: 'outTradeNo',
    label: '商户订单号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'tradeNo',
    label: '交易流水号',
    component: 'Input',
    colProps: { span: 6 },
  },
  // {
  //   field: 'channelCode',
  //   label: '渠道',
  //   component: 'Select',
  //   colProps: { span: 6 },
  //   componentProps: {
  //     placeholder: '请选择',
  //     getPopupContainer: () => document.body,
  //   },
  // },
  // {
  //   field: 'sourceFrom',
  //   label: '可见范围',
  //   component: 'Select',
  //   componentProps: { options: platform },
  //   colProps: { span: 6 },
  // },
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
    field: 'rentTypeList',
    label: '租赁类型',
    component: 'Select',
    componentProps: { options: rentTypeList },
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
    field: 'bizType',
    label: '支付来源',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: { options: bizTypeAll },
  },
  {
    field: 'time',
    label: '支付时间',
    defaultValue: allTime,
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]
