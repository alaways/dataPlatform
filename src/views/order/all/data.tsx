import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { platform, statusList, statusSearch } from '../utils'
import { formatNumber } from '/@/utils/tool'
import { Tag } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { cityCoding } from '/@/utils/cityData2'
import { spuTypeList } from '../../goods/goodsBase/data'
import { getStoreList } from '/@/api/store'
import { usePermission } from '/@/hooks/web/usePermission'
import { rentTypeList } from '../../goods/goodsLease/utils'
import { handleMonth } from '/@/utils/order'
// import { goodTypeList } from '../../goods/goodsLeaseMore/components/utils'
import { getAppList } from '/@/api/saas/app'
import { getOperatorStoreList } from '/@/api/business/operator'
import { getTextArr } from '/@/utils/index'
const { hasPermission } = usePermission()

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
  姓名: hasPermission('diyRow_nickName'),
  性别: hasPermission('diyRow_gender'),
  手机号: hasPermission('diyRow_phone'),
}
//  获取渠道/平台的列权限
const channelSystem = {
  渠道: hasPermission('diyRow_channelCode'),
  平台: hasPermission('diyRow_appletName'),
}
// 创建时间 / 支付时间 列权限
const timeStatus = {
  创建时间: hasPermission('diyRow_createTime'),
  支付时间: hasPermission('diyRow_payTime'),
}
export const columns: BasicColumn[] = () => {
  const userinfo = getTextArr(userStatus)
  const channelInfo = getTextArr(channelSystem)
  const timeinfo = getTextArr(timeStatus)
  return [
    {
      title: '订单编号',
      dataIndex: 'orderSn',
      width: 150,
      ifShow: hasPermission('diyRow_orderSn'),
    },
    {
      title: userinfo,
      width: 130,
      ifShow: userStatus['姓名'] || userStatus['性别'] || userStatus['手机号'],
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
    // {
    //   title: '商家号',
    //   dataIndex: 'merchantTerminalNo',
    //   width: 100,
    //   ifShow: false,
    // },
    {
      title: '地区',
      dataIndex: 'ipProvince',
      width: 120,
      ifShow: hasPermission('diyRow_province'),
      customRender: ({ record }) => {
        // return record.ipProvince ? `${record.ipProvince || ''}${record.ipCity || ''}` : '-'
        return record.province ? `${record.province || ''}${record.city || ''}` : '-'
      },
    },
    {
      title: channelInfo,
      dataIndex: 'channelCode',
      width: 120,
      ifShow: channelSystem['渠道'] || channelSystem['平台'],
      customRender: ({ record }) => {
        const channelCode = record.channelCode || '-'
        const appletName = record.appletName || '-'
        const channel = channelSystem['渠道'] ? channelCode : ''
        const applet = channelSystem['平台'] ? appletName : ''
        return h('div', { textAlign: 'center' }, [
          h('span', {}, channel),
          h('br'),
          h('span', {}, applet),
        ])
      },
    },
    {
      title: '门店商家名称',
      dataIndex: 'storeMerchantName',
      width: 130,
      customRender: ({ text }) => text || '-',
      ifShow: hasPermission('diyRow_storeMerchantName'),
    },
    {
      title: '业务员',
      dataIndex: 'salesperson',
      width: 120,
      ifShow: hasPermission('diyRow_salesperson'),
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
      ifShow: hasPermission('diyRow_operator'),
      width: 120,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '租户标识',
      dataIndex: 'tenantCode',
      width: 120,
      ifShow: hasPermission('diyRow_tenantCode'),
      customRender: ({ text }) => text || '-',
    },
    {
      title: '商品信息',
      dataIndex: 'spuName',
      ifShow: hasPermission('diyRow_spuName'),
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
      title: '计价方式',
      dataIndex: 'goodsLeaseType',
      width: 100,
      ifShow: hasPermission('diyRow_goodsLeaseType'),
      customRender: ({ text }) => {
        const find: any = goodTypeList.find((v) => v.value == text)
        return (find && find.label) || ''
      },
    },
    {
      title: '租赁类型',
      dataIndex: 'rentType',
      width: 100,
      ifShow: hasPermission('diyRow_rentType'),
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
      // dataIndex: 'firstPay',
      dataIndex: 'downPaymentAmount',
      width: 130,
      ifShow: hasPermission('diyRow_downPaymentAmount'),
      customRender: ({ text, record }) =>
        formatNumber(text || record.downPaymentTotalAmount, 2) || '-',
    },
    {
      title: '锁费(元)',
      dataIndex: 'lockFee2',
      width: 100,
      ifShow: hasPermission('diyRow_lockFee2'),
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '蚂蚁代扣授权',
      dataIndex: 'atoStatus',
      width: 110,
      fixed: 'right',
      ifShow: hasPermission('diyRow_atoStatus'),
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
      ifShow: hasPermission('diyRow_status'),
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
      ifShow: timeStatus['创建时间'] || timeStatus['支付时间'],
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
      ifShow: hasPermission('diyRow_realReason'),
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
      ifShow: hasPermission('diyRow_remark'),
    },
    {
      title: '订单分配信息',
      dataIndex: 'ifOrder',
      ifShow: hasPermission('diyRow_ifOrder'),
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
  {
    field: 'appletCode',
    label: '平台',
    component: 'ApiSelect',
    colProps: { span: 6 },
    componentProps: {
      params: { limit: '999999' },
      showSearch: true,
      placeholder: '请选择小程序',
      api: getAppList,
      resultField: 'list',
      labelField: 'appletName',
      valueField: 'appletCode',
    },
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
    ifShow: false,
    label: '平台端',
    field: 'merchantTerminalNo',
    component: 'Select',
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
  //   colProps: { span: 6 },
  // },
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
    ifShow: hasPermission('OrderListMerchant'),
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
  // {
  //   field: 'needEsnotary',
  //   label: '是否选择公证',
  //   component: 'Select',
  //   labelWidth: 110,
  //   colProps: { span: 6 },
  //   componentProps: {
  //     options: [
  //       { label: '是', value: 1 },
  //       { label: '否', value: 0 },
  //     ],
  //   },
  // },
  {
    field: 'goodsLeaseType',
    label: '计价方式',
    component: 'Select',
    componentProps: { options: goodTypeList },
    colProps: { span: 6 },
  },
  {
    label: '风控审单',
    field: 'operatorId',
    component: 'ApiSelect',
    colProps: { span: 6 },
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getOperatorStoreList,
      params: { pageSize: 999999, cursor: 999999 },
      resultField: 'list',
      labelField: 'userName',
      valueField: 'uid',
    },
  },
  // {
  //   field: 'agreementStatus',
  //   label: '周期代扣状态',
  //   component: 'Select',
  //   colProps: { span: 6 },
  //   labelWidth: 120,
  //   componentProps: {
  //     options: [
  //       { label: '关闭', value: 0 },
  //       { label: '正常', value: 1 },
  //     ],
  //   },
  // },
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
]
