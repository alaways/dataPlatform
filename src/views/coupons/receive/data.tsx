import { Tag } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'
import { h } from 'vue'
import { discountTypeList, typesList } from '../preferential/data'
import dayjs from 'dayjs'

export const statusList = [
  { value: 0, label: '已领取', color: 'orange' },
  { value: 1, label: '已使用', color: 'green' },
  { value: 2, label: '已失效', color: 'red' },
]

export const columns: BasicColumn[] = [
  {
    title: '用户信息',
    width: 130,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, `${record.unickname || '-'}`),
        h('br'),
        h('span', {}, record.phone || '-'),
      ])
    },
  },
  {
    title: '订单编号',
    dataIndex: 'orderSn',
    width: 150,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '优惠券名称',
    dataIndex: 'couponName',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '小程序名称',
    dataIndex: 'appletName',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '优惠券类型',
    width: 120,
    dataIndex: 'couponType',
    customRender: ({ text }) => {
      const find: any = typesList.find((v) => v.value == text)
      return find?.label || '-'
    },
  },
  {
    title: '优惠信息',
    dataIndex: 'discountType',
    width: 120,
    customRender: ({ record }) => {
      const discountFind = discountTypeList.find((v) => v.value == record.discountType)
      return (
        <>
          <div>
            <Tag color={discountFind?.color}>{discountFind?.label}</Tag>
            <div style={{ display: record.minPoint == 0 ? 'none' : 'block' }}>
              满{formatNumber(record.minPoint, 2)}减{formatNumber(record.faceValue, 2)}
            </div>
            <div style={{ display: record.minPoint == 0 ? 'block' : 'none' }}>无门槛</div>
          </div>
        </>
      )
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    fixed: 'right',
    customRender: ({ text }) => {
      const find: any = statusList.find((v) => v.value == text)
      return h(Tag, { color: find?.color || '' }, find?.label || '-')
    },
  },
  {
    title: '有效时间',
    width: 180,
    dataIndex: 'validityEndTime',
    customRender: ({ text }) => {
      const date = dayjs(text)
      const formattedDate = date.format('YYYY年MM月DD日')
      return `到${formattedDate}`
    },
  },
]

export const searchFormSchema: FormSchema[] = [
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
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'name',
    label: '优惠券名称',
    labelWidth: 100,
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'type',
    label: '优惠券类型',
    labelWidth: 100,
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: typesList,
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: statusList,
    },
  },
  {
    field: 'time',
    label: '领取时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]
