import { h } from 'vue'
import { FormSchema } from '/@/components/Table'
import { platform, statusList, statusSearch } from '../utils'
import { formatNumber } from '/@/utils/tool'
import { Tag } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { cityCoding } from '/@/utils/cityData2'
import { usePermission } from '/@/hooks/web/usePermission'
import { rentTypeList } from '../../goods/goodsLease/utils'
import { handleMonth } from '/@/utils/order'
import { getTextArr } from '/@/utils/index'
import { dataList } from '/@/views/collection/remit/data'

const { hasPermission } = usePermission()
export const spuTypeList = [
  { label: '手机', value: 1 },
  { label: '电动车', value: 2 },
]
const cityDatas = cloneDeep(cityCoding)
cityDatas.forEach((v) => {
  v.children = v.children.map((c) => {
    return {
      ...c,
      children: [],
    }
  })
})
const goodTypeList = [
  { label: '默认', value: 1 },
  { label: '计算器计价', value: 2 },
  { label: '地区政策表', value: 3 },
  { label: '0首付', value: 4 },
]
// 是否接单
export const receivingList = [
  { label: '待确认', value: 0, color: 'orange' },
  { label: '已确认', value: 1, color: 'green' },
  { label: '已拒绝', value: 2, color: 'red' },
]
export const atoStatusList = [
  { label: '待授权', value: 0, color: 'orange' },
  { label: '已授权', value: 1, color: 'green' },
  { label: '用户申请解约中', value: 2, color: 'orange' },
  { label: '已解约', value: 3, color: 'gray' },
  { label: '拒绝解约', value: 4, color: 'red' },
  { label: '自动解约', value: 5, color: 'gray' },
]
/** 用户评分 */
export const userLevelOptions = [
  { label: 'R1', value: 'R1' },
  { label: 'R2', value: 'R2' },
  { label: 'R3', value: 'R3' },
  { label: 'R4', value: 'R4' },
  { label: 'R5', value: 'R5' },
  { label: 'R6', value: 'R6' },
  { label: 'R7', value: 'R7' },
]
/**
 * 客群年龄
 */
export const underAgeOptions = [
  { label: '已成年', value: 0, color: 'green' },
  { label: '未成年', value: 1, color: 'red' },
]
// 获取用户数据的列权限
const userStatus = {
  姓名: true || hasPermission('diyRow_nickName'),
  性别: true || hasPermission('diyRow_gender'),
  手机号: true || hasPermission('diyRow_phone'),
}
//  获取渠道/平台的列权限
const channelSystem = {
  渠道: true || hasPermission('diyRow_channelCode'),
  平台: true || hasPermission('diyRow_appletName'),
}
// 创建时间 / 支付时间 列权限
const timeStatus = {
  创建时间: true || hasPermission('diyRow_createTime'),
  支付时间: true || hasPermission('diyRow_payTime'),
}
export const columns = () => {
  const userinfo = getTextArr(userStatus)
  const channelInfo = getTextArr(channelSystem)
  const timeinfo = getTextArr(timeStatus)
  return [
    {
      title: '订单编号',
      dataIndex: 'orderSn',
      width: 150,
    },
    {
      title: '业务端',
      dataIndex: 'dataSources',
      width: 150,
      customRender: ({ record }) => {
        const find = dataList.find((item: any) => item.value == record.dataSources)
        if (find) return find?.label
      },
    },
    {
      title: userinfo,
      width: 130,
      customRender: ({ record }) => {
        const gender = record.gender == 1 ? '女' : '男'
        const realName = userStatus['姓名'] ? record.nickName : ''
        const sexGender = userStatus['性别'] ? gender : ''
        const userPhone = userStatus['手机号'] ? record.phone : ''
        return h('div', { textAlign: 'center' }, [
          h('span', {}, `${realName} ${sexGender}`),
          h('br'),
          h('span', {}, userPhone),
        ])
      },
    },
    {
      title: '地区',
      dataIndex: 'ipProvince',
      width: 120,
      customRender: ({ record }) => {
        return record.province ? `${record.province || ''}${record.city || ''}` : '-'
      },
    },
    {
      title: '门店商家名称',
      dataIndex: 'storeMerchantName',
      width: 130,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '业务员',
      dataIndex: 'salesperson',
      width: 120,
      customRender: ({ text, record }) => {
        return (
          <>
            <div>{text}</div>
            <Tag color="#f2cf98" style={{ display: record.salesmanGuarantee ? 'block' : 'none' }}>
              业务员担保
            </Tag>
          </>
        )
      },
    },
    {
      title: '风控审单',
      dataIndex: 'operator',
      width: 120,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '租户标识',
      dataIndex: 'tenantCode',
      width: 120,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '商品信息',
      dataIndex: 'spuName',
      customRender: ({ record }) => {
        const find: any = spuTypeList.find((v) => v.value == record.spuType)
        return (
          <>
            <div>商品类目: {find?.label || ''}</div>
            <div>商品名称: {record?.spuName}</div>
            <div>商品规格: {record?.skuName}</div>
          </>
        )
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
      title: '首次支付金额(元)',
      dataIndex: 'downPaymentAmount',
      width: 130,
      customRender: ({ text, record }) =>
        formatNumber(text || record.downPaymentTotalAmount, 2) || '-',
    },
    {
      title: '锁费(元)',
      dataIndex: 'lockFee2',
      width: 100,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '蚂蚁代扣授权',
      dataIndex: 'atoStatus',
      width: 110,
      fixed: 'right',
      customRender: ({ text }) => {
        const find = atoStatusList.find((v) => v.value == text)
        return h(Tag, { color: find?.color || 'gray' }, () => find?.label || '未知')
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      fixed: 'right',
      customRender: ({ record }) => {
        if (record.status == 501 && !record?.atoStatus && record.goodsLeaseType == 4) {
          record.status = 3012
        }
        const find: any = statusList.find((v) => v.value == record.status)
        return h(Tag, { color: find?.color || '' }, () => find?.label)
      },
    },
    {
      title: timeinfo,
      dataIndex: 'createTime',
      width: 180,
      customRender: ({ record }) => {
        const ctime = timeStatus['创建时间'] ? record.createTime || '-' : ''
        const ptime = timeStatus['支付时间'] ? record.payTime || '-' : ''
        return h('div', { textAlign: 'center' }, [
          h('span', {}, ctime),
          h('br'),
          h('span', {}, ptime),
        ])
      },
    },
    {
      title: '审核原因',
      dataIndex: 'realReason',
      align: 'left',
      customRender: ({ text, record }) => {
        return (
          <div>
            <div style={{ display: record?.userLevel ? 'block' : 'none' }}>
              用户评级: {record?.userLevel}
            </div>
            <div>{text}</div>
          </div>
        )
      },
    },
    {
      title: '取消原因',
      dataIndex: 'remark',
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
  ]
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'status',
    label: '订单状态',
    defaultValue: '',
    component: 'RadioButtonGroup',
    componentProps: { options: statusSearch },
    colProps: { span: 24 },
  },
  {
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'city',
    label: '地区',
    component: 'TreeSelect',
    colProps: { span: 6 },
    componentProps: () => {
      return {
        treeNodeFilterProp: 'label',
        treeData: cityDatas,
        treeCheckable: true,
        allowClear: true,
        showSearch: true,
      }
    },
  },
  {
    field: 'nickName',
    label: '姓名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'salesperson',
    label: '业务员',
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
    ifShow: false,
    field: 'sourceFrom',
    label: '可见范围',
    component: 'Select',
    componentProps: { options: platform },
    colProps: { span: 6 },
  },
  {
    field: 'salesmanGuarantee',
    label: '业务员担保',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
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
    field: 'atoStatusList',
    label: '蚂蚁代扣授权',
    component: 'Select',
    labelWidth: 120,
    colProps: { span: 6 },
    componentProps: {
      options: atoStatusList,
    },
  },
  {
    field: 'underAge',
    label: '客群年龄',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: underAgeOptions,
    },
  },
  {
    field: 'userLevel',
    label: '用户评分',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: userLevelOptions,
    },
  },
  {
    field: 'storeMerchantName',
    label: '门店商家名称',
    labelWidth: 120,
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'time',
    label: '创建时间',
    defaultValue: handleMonth(),
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
  {
    field: 'payTime',
    label: '支付时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
  {
    label: 'Y/-',
    field: 'customTag',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: 'Y', value: 'Y' },
        { label: '-', value: '-' },
      ],
    },
  },
  // {
  //   field: 'dataSources',
  //   label: '业务数据',
  //   component: 'Select',
  //   defaultValue: 'xx',
  //   componentProps: {
  //     options: dataList,
  //   },
  //   colProps: { span: 8 },
  // },
]
