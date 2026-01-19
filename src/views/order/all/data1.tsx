import { h } from 'vue'
import { FormSchema } from '/@/components/Table'
import { platform, statusList, statusSearch, cancelObj } from '../utils'
import { formatNumber } from '/@/utils/tool'
import { Tag } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { cityCoding } from '/@/utils/cityData2'
import { isTradeNoOffline } from '/@/utils/is'
import { spuTypeList } from '../../goods/goodsBase/data'
import { getStoreList } from '/@/api/store'
import { usePermission } from '/@/hooks/web/usePermission'
import { handleMonth } from '/@/utils/order'
import { getAppList } from '/@/api/saas/app'
import { RentModeOptions } from '/@/utils/status/goods'
import { phoneExit } from '/@/utils/phone'
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

// 小程序的场景来源枚举
export const alipaySceneList = [
  { label: '首页十二宫格及更多', value: '1000' },
  { label: '应用中心-更多', value: '1001' },
  { label: '我的小程序入口', value: '1002' },
  { label: '支付宝客户端首页', value: '1003' },
  { label: '支付宝首页、消息 tab 顶部搜索框的搜索结果页', value: '1005' },
  { label: '单人聊天会话中的小程序消息卡片（分享）', value: '1007' },
  { label: '智能助理', value: '1008' },
  { label: '扫描二维码', value: '1011' },
  { label: '小程序商家消息（服务消息）', value: '1014' },
  { label: '出行频道-订机票酒店', value: '1015' },
  { label: '生活号 profile 页相关小程序列表', value: '1020' },
  { label: '直播', value: '1022' },
  { label: '系统桌面图标', value: '1023' },
  { label: '小程序打开小程序', value: '1037' },
  { label: '从另一个小程序返回', value: '1038' },
  { label: '消费圈', value: '1039' },
  { label: '市民中心（原城市服务频道）', value: '1200' },
  { label: '芝麻信用频道', value: '1201' },
  { label: '出行(原车主服务频道)', value: '1202' },
  { label: '支付宝就业小程序', value: '1205' },
  { label: '支付宝学生特惠小程序', value: '1208' },
  { label: '支付宝会员频道', value: '1209' },
  { label: '医疗健康频道', value: '1215' },
  {
    label:
      '第三方 APP（如钉钉）打开，在跳转链接中传入访问来源参数：chInfo=ch_orderCenter，跳转链接拼接方法，可查看 小程序跳转 FAQ。',
    value: '1300',
  },
  { label: '碰一下打开小程序。', value: '1301' },
  { label: '支付宝 push 消息（同 1014）。', value: '1305' },
  { label: '付费流量(通过商家数字推广平台，灯火等投放的广告)', value: '1400' },
  { label: '卡包', value: '1401' },
  { label: '支付成功页', value: '1403' },
  { label: '其他渠道场景渠道。', value: '0000' },
]
export const merchantTerminalOptions = [
  { label: 'GS租机', value: '2021004105683179' },
  { label: '光速易租', value: '2023111709466887' },
]
// 获取当前的场景来源
export const getAlipayScene = (value: string) => {
  const item = alipaySceneList.find((item: any) => item.value === value)
  if (item) return item.label
  return '-'
}
/**
 * 客群年龄
 */
export const underAgeOptions = [
  { label: '已成年', value: 0, color: 'green' },
  { label: '未成年', value: 1, color: 'red' },
]

export const columns = () => {
  return [
    {
      title: '订单编号',
      dataIndex: 'orderSn',
      width: 150,
      customRender: ({ record }) => {
        const hrender = record.attrMap?.['approval.lockUid']
          ? h(Tag, { color: '#f2cf98' }, `${record.attrMap?.['approval.lockUsername']}锁定` || '-')
          : null
        return h('div', { textAlign: 'center' }, [
          h('span', {}, `${record.orderSn}`),
          h('br'),
          hrender,
        ])
      },
    },
    {
      title: '姓名/性别/手机号',
      width: 130,
      dataIndex: 'phone',
      customRender: ({ record }) => {
        const gender = record.gender == 1 ? '女' : '男'
        return h('div', { textAlign: 'center' }, [
          h('span', {}, `${record.nickName || '-'} ${gender}`),
          h('br'),
          phoneExit(record.phone, record),
        ])
      },
    },
    {
      title: '下单平台',
      dataIndex: 'merchantTerminalName',
      width: 100,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '商家号',
      dataIndex: 'merchantTerminalNo',
      width: 100,
      ifShow: false,
    },
    {
      title: '支付宝升级用户',
      dataIndex: 'isLevel',
      width: 100,
      customRender: ({ record }) => (record.attrMap['orderInfo.mayi.version'] ? '是' : '否' || '-'),
    },

    {
      title: '地区',
      dataIndex: 'ipProvince',
      width: 120,
      customRender: ({ record }) => {
        // return record.ipProvince ? `${record.ipProvince || ''}${record.ipCity || ''}` : '-'
        return record.province ? `${record.province || ''}${record.city || ''}` : '-'
      },
    },
    // {
    //   title: '渠道/平台',
    //   dataIndex: 'channelCode',
    //   width: 120,
    //   customRender: ({ record }) => {
    //     return h('div', { textAlign: 'center' }, [
    //       h('span', {}, record.channelCode || '-'),
    //       h('br'),
    //       h('span', {}, record.appletName || '-'),
    //     ])
    //   },
    // },
    // {
    //   title: '业务员',
    //   dataIndex: 'salesperson',
    //   width: 120,
    //   customRender: ({ text, record }) => {
    //     return (
    //       <>
    //         <div>{text}</div>
    //         <Tag color="#f2cf98" style={{ display: record.salesmanGuarantee ? 'block' : 'none' }}>
    //           业务员担保
    //         </Tag>
    //       </>
    //     )
    //   },
    // },
    // {
    //   title: '风控审单',
    //   dataIndex: 'operator',
    //   width: 120,
    //   customRender: ({ text }) => text || '-',
    // },
    {
      ifShow: hasPermission('OrderListTenantCode'),
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
        const spuInfo = record?.spuInfo ? JSON.parse(record.spuInfo) : {}
        return (
          <>
            <div>商品类目: {find?.label || ''}</div>
            <div>商品名称: {record.spuName}</div>
            <div>商品规格: {record.attrValueNames}</div>
            <div>
              成色:
              <Tag color={spuInfo?.spuQuality === '全新' ? 'green' : 'red'}>
                {' '}
                {spuInfo?.spuQuality}{' '}
              </Tag>
            </div>
          </>
        )
      },
    },
    {
      title: '租赁方式',
      dataIndex: 'rentModeName',
      width: 100,
      customRender: ({ text }) => text || '',
    },
    // {
    //   title: '计价方式',
    //   dataIndex: 'goodsLeaseType',
    //   width: 100,
    //   customRender: ({ text }) => {
    //     const find: any = goodTypeList.find((v) => v.value == text)
    //     return (find && find?.label) || ''
    //   },
    // },
    // {
    //   title: '租赁类型',
    //   dataIndex: 'rentMode',
    //   width: 100,
    //   customRender: ({ text }) => {
    //     const find = RentModeOptions.find((v) => v.value == text)
    //     return find?.label || '-'
    //   },
    // },
    // {
    //   title: '订单总金额',
    //   dataIndex: 'totalMoney',
    //   width: 100,
    //   customRender: ({ record }) => {
    //     const props = { decimals: 2 }
    //     return formatNumber(record.totalMoney, props)
    //   },
    // },
    {
      title: '首次支付金额(元)',
      // dataIndex: 'firstPay',
      dataIndex: 'downPaymentAmountWithCoupon',
      width: 130,
      customRender: ({ text, record }) =>
        formatNumber(text || record.downPaymentTotalAmount, 2) || '-',
    },
    {
      title: '优惠金额(元)',
      // dataIndex: 'firstPay',
      dataIndex: 'couponMoney',
      width: 130,
      customRender: ({ text, record }) => formatNumber(text || record.couponMoney, 2) || '-',
    },
    {
      title: '押金(元)',
      dataIndex: 'depositAmount',
      width: 100,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '芝麻免押(元)',
      dataIndex: 'zhimaAmount',
      width: 100,
      customRender: ({ record }) => {
        const sum = record.depositAmount - record.alipayDepositAmount
        return formatNumber(sum, 2)
      },
    },
    {
      title: '冻结押金(元)',
      dataIndex: 'alipayDepositAmount',
      width: 100,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '提前归还罚金(元)',
      dataIndex: 'giveBackAmount',
      width: 100,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    // {
    //   title: '锁费(元)',
    //   dataIndex: 'lockFee2',
    //   width: 100,
    //   customRender: ({ text }) => formatNumber(text, 2) || '-',
    // },
    // {
    //   title: '是否公证',
    //   dataIndex: 'needEsnotary',
    //   width: 100,
    //   customRender: ({ text }) => h(Tag, { color: text ? 'green' : 'red' }, text ? '是' : '否'),
    // },
    {
      title: '创建时间/支付时间',
      dataIndex: 'createTime',
      width: 180,
      customRender: ({ record }) => {
        return h('div', { textAlign: 'center' }, [
          h('span', {}, record.createTime || '-'),
          h('br'),
          h('span', {}, record.payTime || '-'),
        ])
      },
    },
    {
      title: '交易信息',
      dataIndex: 'bizType',
      width: 180,
      customHeaderRender: () => {
        return (
          <div>
            <div>支付来源</div>
            <div>交易单号</div>
            <div>商户订单号</div>
          </div>
        )
      },
      customRender: ({ record }) => {
        const bool = isTradeNoOffline(record)
        return (
          <>
            <div>{`${record.bizType || '-'}`}</div>
            <div>{(bool && record.tradeNo) || '-'}</div>
            <div>{(!bool && record.outTradeNo) || '-'}</div>
          </>
        )
      },
    },
    {
      title: '周期代扣状态',
      dataIndex: 'agreementStatus',
      width: 80,
      customRender: ({ text }) => {
        if (!text && text != 0) {
          return h(Tag, { color: 'gray' }, '空')
        }
        return h(Tag, { color: text == 1 ? 'green' : 'red' }, text == 1 ? '正常' : '关闭')
      },
    },
    // {
    //   title: '备注',
    //   dataIndex: 'remark',
    // },
    {
      title: '审核原因',
      dataIndex: 'showReason',
    },
    {
      title: '取消原因',
      dataIndex: 'closeRemark',
      customRender: ({ record }) => {
        const cancelType = record.attrMap['cancelInfo.cancelType']
        if (cancelType == 1) return record.attrMap['orderInfo.userCancelReason']
        return record.closeRemark || '-'
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
      title: '芝麻免押模式',
      dataIndex: 'freezeMode',
      width: 110,
      fixed: 'right',
      customRender: ({ record }) => {
        return record?.attrMap?.['sys.freezeMode'] === 'DEPOSIT_ONLY' ? '仅押金' : '租金'
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 160,
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
        let riskData = record.attrMap?.['orderInfo.riskRequest.resp']
        if (riskData) riskData = JSON.parse(riskData)
        if (riskData?.data?.isPass == 0) record.status = 2025
        const find: any = statusList.find((v) => v.value == record.status)
        const cancelStatus = record?.attrMap?.['cancelInfo.historyStatus']
        const cancelType = record?.attrMap?.['cancelInfo.cancelType']
        const candItem = statusList.find((v) => v.value == cancelStatus)
        if (cancelStatus && cancelType)
          return h(Tag, { color: 'default' }, `${candItem?.label}${cancelObj[cancelType]}`)

        return h(Tag, { color: find?.color || '' }, () => find?.label)
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
    field: 'rentModeList',
    label: '租赁类型',
    component: 'Select',
    componentProps: { options: RentModeOptions },
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
  {
    ifShow: false,
    field: 'needEsnotary',
    label: '是否选择公证',
    component: 'Select',
    labelWidth: 110,
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
  // {
  //   field: 'goodsLeaseType',
  //   label: '计价方式',
  //   component: 'Select',
  //   componentProps: { options: goodTypeList },
  //   colProps: { span: 6 },
  // },
  // {
  //   ifShow: false,
  //   label: '风控审单',
  //   field: 'operatorId',
  //   component: 'ApiSelect',
  //   colProps: { span: 6 },
  //   componentProps: {
  //     showSearch: true,
  //     placeholder: '请选择',
  //     api: getOperatorStoreList,
  //     params: { pageSize: 999999, cursor: 999999 },
  //     resultField: 'list',
  //     labelField: 'userName',
  //     valueField: 'uid',
  //   },
  // },
  {
    field: 'agreementStatus',
    label: '周期代扣状态',
    component: 'Select',
    colProps: { span: 6 },
    labelWidth: 120,
    componentProps: {
      options: [
        { label: '关闭', value: 0 },
        { label: '正常', value: 1 },
      ],
    },
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
]
