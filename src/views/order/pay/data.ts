import { h } from 'vue'
import { BasicColumn, FormSchema } from '/@/components/Table'
import { platform } from '../utils'
import { formatNumber } from '/@/utils/tool'
import dayjs from 'dayjs'
import { spuTypeList } from '../../goods/goodsBase/data'
import { rentTypeList } from '../../goods/goodsLease/utils'

export const columns: BasicColumn[] = [
  {
    title: '订单编号',
    dataIndex: 'orderSn',
    width: 150,
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
    title: '渠道/平台',
    dataIndex: 'channelCode',
    width: 120,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, record.channelCode || '-'),
        h('br'),
        h('span', {}, record.appletName || '-'),
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
    title: '租赁类型',
    dataIndex: 'rentType',
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
    title: '商品名称',
    dataIndex: 'spuName',
    width: 180,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, record.skuName || '-'),
        h('br'),
        h('span', {}, record.spuName || '-'),
      ])
    },
  },
  {
    title: '设备IMEI',
    width: 120,
    dataIndex: 'deliverySerialNumber',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '首次支付金额(元)',
    // dataIndex: 'firstPay',
    dataIndex: 'downPaymentTotalAmount',
    width: 130,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '押金(元)',
    dataIndex: 'deposit',
    width: 100,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '收货信息',
    dataIndex: 'realName',
    width: 180,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, record.realName || '-'),
        h('br'),
        h('span', {}, record.receiverPhone || '-'),
        h('br'),
        h(
          'span',
          {},
          `${record.receiverProvince}${record.receiverCity}${record.receiverRegion}${record.receiverDetailAddress}`,
        ),
      ])
    },
  },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   width: 100,
  //   customRender: ({ record }) => {
  //     const find: any = statusList.find((v) => v.value == record.status)
  //     return h(Tag, { color: find?.color || '' }, () => find?.label)
  //   },
  // },
  {
    title: '发货时间/收货时间',
    dataIndex: 'createTime',
    width: 180,
    customRender: ({ record }) => {
      function handleTime(time) {
        if (time) {
          return dayjs(record.deliveryTime).format('YYYY-MM-DD hh:mm:ss')
        } else {
          return '-'
        }
      }
      return h('div', { textAlign: 'center' }, [
        h('span', {}, handleTime(record.deliveryTime)),
        h('br'),
        h('span', {}, handleTime(record.receiveTime)),
      ])
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '取消原因',
    dataIndex: 'closeRemark',
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
  {
    field: 'sourceFrom',
    label: '可见范围',
    component: 'Select',
    componentProps: { options: platform },
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
    field: 'time',
    label: '创建时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 8 },
  },
]
