import { h } from 'vue'
import { BasicColumn, FormSchema } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'
import { rentTypeList } from '../../goods/goodsLease/utils'
import { Tag } from 'ant-design-vue'
import { statusList } from '../utils'
import { getStoreList } from '/@/api/store'
import { receivingList } from '../all/data'
import { getSalespersonStoreList } from '/@/api/business/salesperson'
export const columns: BasicColumn[] = [
  {
    title: '订单编号/创建时间',
    dataIndex: 'orderSn',
    width: 180,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, record.orderSn || '-'),
        h('br'),
        h('span', {}, record.createTime || '-'),
      ])
    },
  },
  {
    title: '姓名/手机号',
    width: 130,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, `${record.nickName || '-'}`),
        h('br'),
        h('span', {}, record.phone || '-'),
      ])
    },
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    width: 100,
    fixed: 'right',
    customRender: ({ record }) => {
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
      return h(Tag, { color: find?.color || '' }, () => find?.label)
    },
  },
  {
    title: '业务员',
    dataIndex: 'salesperson',
    width: 120,
    customRender: ({ text }) => {
      return (
        <>
          <div>{text || '-'}</div>
        </>
      )
    },
  },
  {
    title: '租赁类型',
    dataIndex: 'rentType',
    width: 100,
    customRender: ({ text }) => {
      if (text == 2) {
        return '月付'
      }
      const find = rentTypeList.find((v) => v.value == text)
      return find?.label
    },
  },
  {
    title: '最新到期日期',
    dataIndex: 'repayDate',
    width: 120,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '到期还款期数',
    dataIndex: 'periodNo',
    width: 120,
  },
  {
    title: '到期应还金额(元)',
    dataIndex: 'repayAmount',
    width: 130,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '罚金金额(元)',
    dataIndex: 'penaltyAmount',
    width: 130,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '分配商家',
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
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 8 },
  },
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
  // {
  //   field: 'rentTypeList',
  //   label: '租赁类型',
  //   component: 'Select',
  //   componentProps: { options: rentTypeList },
  //   colProps: { span: 8 },
  // },
  {
    field: 'repayDate',
    label: '到期时间',
    component: 'DatePicker',
    colProps: { span: 8 },
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    field: 'merchantCode',
    label: '商家名称',
    component: 'ApiSelect',
    colProps: { span: 6 },
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getStoreList,
      params: { pageSize: 999999, limit: 999999 },
      resultField: 'list',
      labelField: 'merchantName',
      valueField: 'merchantCode',
    },
  },
  {
    label: '业务员',
    field: 'salespersonId',
    component: 'ApiSelect',
    colProps: { span: 6 },
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getSalespersonStoreList,
      params: { pageSize: 999999, cursor: 999999, ignoreChild: 1 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'id',
    },
  },
]

export const paidFormSchema: FormSchema[] = [
  {
    label: '账单编号',
    field: 'billItemSn',
    component: 'Input',
    show: false,
  },
  {
    label: '入账合计金额',
    field: 'totalAmount',
    component: 'InputNumber',
    colProps: { span: 15 },
    slot: 'totalAmount',
  },
  {
    label: '到期应还金额',
    field: 'repayAmount',
    component: 'InputNumber',
    colProps: { span: 15 },
    slot: 'repayAmount',
  },
  {
    label: '罚金金额',
    field: 'penaltyAmount',
    component: 'InputNumber',
    colProps: { span: 15 },
    slot: 'penaltyAmount',
  },
  {
    label: '主流水单号',
    field: 'outTradeNo',
    component: 'Input',
    colProps: { span: 15 },
    required: true,
  },
  {
    label: '入账时间',
    field: 'payTime',
    component: 'DatePicker',
    required: true,
    colProps: { span: 22 },
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '入账来源',
    field: 'bizType',
    component: 'Input',
    defaultValue: 'bankCard_offline',
    render: () => '线下-银行卡打款',
  },
  {
    label: '收款账户',
    field: 'payAccount',
    component: 'Input',
    colProps: { span: 15 },
    required: true,
  },
]
