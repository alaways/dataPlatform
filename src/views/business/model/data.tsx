import { Tag } from 'ant-design-vue'
import { statusList } from '../../order/utils'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'

const serialList = [
  { value: 1, label: '在租', color: 'green' },
  { value: 2, label: '已回收', color: 'blue' },
  { value: 3, label: '已退机', color: 'gray' },
  { value: 4, label: '已买断', color: 'green' },
]

export const columns: BasicColumn = [
  {
    title: '设备序列号',
    dataIndex: 'deliverySerialNumber',
    width: 230,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '订单编号',
    dataIndex: 'orderSn',
    width: 150,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '姓名',
    dataIndex: 'nickName',
    width: 150,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 130,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '设备状态',
    dataIndex: 'deviceStatus',
    width: 120,
    customRender: ({ text }) => {
      const find: any = serialList.find((v) => v.value == text)
      return h(Tag, { color: find?.color || '' }, () => find?.label)
    },
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      const find: any = statusList.find((v) => v.value == text)
      return h(Tag, { color: find?.color || '' }, () => find?.label)
    },
  },
  {
    title: '设备备注',
    dataIndex: 'deviceRemark',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'deliverySerialNumber',
    label: '设备序列号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'deviceStatus',
    label: '设备状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: { options: serialList },
  },
  {
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '订单状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: { options: statusList },
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
]

export const userFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    label: '订单编号',
    field: 'orderSn',
    component: 'Input',
    show: false,
  },
  {
    field: 'deviceStatus',
    label: '设备状态',
    component: 'Select',
    required: true,
    colProps: { span: 20 },
    componentProps: { options: serialList },
  },
  {
    field: 'deviceRemark',
    label: '设备备注',
    component: 'InputTextArea',
    colProps: { span: 20 },
  },
]
