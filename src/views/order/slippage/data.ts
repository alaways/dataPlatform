import { h } from 'vue'
import { FormSchema } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'
import { Tag } from 'ant-design-vue'
import { getUserList } from '/@/api/system/account'
import { rentTypeList } from '../../goods/goodsLease/utils'
import { usePermission } from '/@/hooks/web/usePermission'
import { spuTypeList } from '../../goods/goodsBase/data'
import { cloneDeep } from 'lodash-es'
import { cityCoding } from '/@/utils/cityData2'
import { getProsecuteList } from '/@/api/collection/task'
import { getLegalChannelsList } from '/@/api/collection/legalChannels'
import { getTextArr } from '/@/utils'

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

/**
 * 逾期状态
 */
export const slippageState = [
  { label: '全部', value: '' },
  { label: '今日到期', value: 0 },
  { label: '逾期1天', value: 1 },
  { label: '逾期2天', value: 2 },
  { label: '逾期3天', value: 3 },
  { label: '逾期7天', value: 7 },
  { label: '逾期15天', value: 15 },
  { label: '逾期15天以上', value: 16 },
]

/**
 * 逾期状态
 */
export const slippageType = [
  { label: '全部', value: '' },
  { label: '首次逾期', value: 1 },
  { label: '多次逾期', value: 2 },
]
const orderStatus = {
  订单编号: hasPermission('slipdiyRow_orderSn'),
  签约时间: hasPermission('slipdiyRow_signTime'),
}
export const columns = () => {
  const oinfo = getTextArr(orderStatus)
  return [
    {
      title: oinfo,
      dataIndex: 'orderSn',
      ifShow: orderStatus['签约时间'] || orderStatus['订单编号'],
      width: 180,
      customRender: ({ text, record }) => {
        const orderSn = orderStatus['订单编号'] ? `${text || '-'}` : ''
        const signTime = orderStatus['签约时间'] ? record.signTime || '-' : ''
        return h('div', { textAlign: 'center' }, [
          h('span', {}, orderSn),
          h('br'),
          h('span', {}, signTime),
        ])
      },
    },
    {
      title: '商品类目',
      dataIndex: 'spuType',
      ifShow: hasPermission('slipdiyRow_spuType'),
      width: 100,
      customRender: ({ text }) => {
        const find: any = spuTypeList.find((v) => v.value == text)
        return find?.label || '-'
      },
    },
    {
      title: '租赁类型',
      dataIndex: 'rentType',
      ifShow: hasPermission('slipdiyRow_rentType'),
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
      title: '地区',
      dataIndex: 'ipProvince',
      ifShow: hasPermission('slipdiyRow_ipProvince'),
      width: 120,
      customRender: ({ record }) => {
        return record.province ? `${record.province || ''}${record.city || ''}` : '-'
      },
    },
    // {
    //   title: '押金(元)',
    //   dataIndex: 'depositAmount',
    //   width: 100,
    //   customRender: ({ text }) => formatNumber(text, 2) || '-',
    // },
    // {
    //   title: '增值服务金额(元)',
    //   dataIndex: 'valueAddedServiceAmount',
    //   width: 130,
    //   customRender: ({ text }) => formatNumber(text, 2) || '-',
    // },
    {
      title: '总租期',
      dataIndex: 'totalPeriodsNum',
      ifShow: hasPermission('slipdiyRow_totalPeriodsNum'),
      width: 100,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '首逾日期',
      dataIndex: 'overdueTime',
      ifShow: hasPermission('slipdiyRow_overdueTime'),
      width: 120,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '最新到期日期',
      dataIndex: 'repayDate',
      ifShow: hasPermission('slipdiyRow_repayDate'),
      width: 120,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '逾期天数',
      dataIndex: 'overdueDays',
      ifShow: hasPermission('slipdiyRow_overdueDays'),
      width: 100,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '过往逾期期数',
      dataIndex: 'passtOverduePeriodsNums',
      ifShow: hasPermission('slipdiyRow_passtOverduePeriodsNums'),
      width: 100,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '当前逾期期数',
      dataIndex: 'currentOverduePeriodsNums',
      ifShow: hasPermission('slipdiyRow_currentOverduePeriodsNums'),
      width: 100,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '逾期期数',
      dataIndex: 'overduePeriodsNums',
      ifShow: hasPermission('slipdiyRow_overduePeriodsNums'),
      width: 100,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '逾期租金(元)',
      dataIndex: 'overdueRentAmount',
      ifShow: hasPermission('slipdiyRow_overdueRentAmount'),
      width: 100,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '逾期罚金(元)',
      dataIndex: 'overduePenaltyAmount',
      ifShow: hasPermission('slipdiyRow_overduePenaltyAmount'),
      width: 100,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    // {
    //   title: '待付租金(元)/总租金(元)',
    //   dataIndex: 'totalRentAmount',
    //   width: 110,
    //   customRender: ({ record }) => {
    //     return h('div', { textAlign: 'center' }, [
    //       h('span', {}, `${formatNumber(record.rentAmount, 2) || '-'}`),
    //       h('br'),
    //       h('span', {}, `${formatNumber(record.totalRentAmount, 2) || '-'}`),
    //     ])
    //   },
    // },
    // {
    //   title: '待还总金额(元)/应付总金额(元)',
    //   dataIndex: 'repayAmount',
    //   width: 130,
    //   customRender: ({ record }) => {
    //     return h('div', { textAlign: 'center' }, [
    //       h('span', {}, `${formatNumber(record.repayAmount, 2) || '-'}`),
    //       h('br'),
    //       h('span', {}, `${formatNumber(record.totalMoney, 2) || '-'}`),
    //     ])
    //   },
    // },
    {
      title: '待还总金额(元)',
      dataIndex: 'repayAmount',
      ifShow: hasPermission('slipdiyRow_repayAmount'),
      width: 120,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    // {
    //   title: '已还总金额(元)',
    //   dataIndex: 'repaidAmount',
    //   width: 120,
    //   customRender: ({ text }) => formatNumber(text, 2) || '-',
    // },
    // {
    //   title: '应付总金额(元)',
    //   dataIndex: 'totalMoney',
    //   width: 130,
    //   customRender: ({ text }) => `${formatNumber(text, 2) || '-'}`,
    // },
    // {
    //   title: '应催收金额(元)',
    //   dataIndex: 'collectAmount',
    //   width: 120,
    //   customRender: ({ text }) => formatNumber(text, 2) || '-',
    // },
    {
      title: '逾期类型',
      dataIndex: 'overdueType',
      ifShow: hasPermission('slipdiyRow_overdueType'),
      width: 100,
      customRender: ({ text }) => {
        return slippageType[text]?.label || '-'
      },
    },
    {
      title: '起诉进度',
      dataIndex: 'prosecuteStatus',
      ifShow: hasPermission('slipdiyRow_prosecuteStatus'),
      width: 120,
      customRender: ({ record }) => {
        return h(Tag, { color: record?.color }, record?.prosecuteName)
      },
    },
    {
      title: '法诉渠道',
      dataIndex: 'lawsuitName',
      ifShow: hasPermission('slipdiyRow_lawsuitName'),
      width: 100,
      customRender: ({ text }) => text || '-',
    },
    // {
    //   title: '逾期状态',
    //   dataIndex: 'overdueDays',
    //   width: 100,
    //   customRender: ({ text }) => {
    //     return slippageState[text] || '-'
    //   },
    // },
    {
      title: '创建时间',
      width: 180,
      dataIndex: 'createTime',
      ifShow: hasPermission('slipdiyRow_createTime'),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ifShow: hasPermission('slipdiyRow_remark'),
    },
    {
      ifShow: hasPermission('OrdeSlippageFollowBy'),
      title: '跟进人',
      dataIndex: 'followByName',
      width: 100,
      customRender: ({ text }) => text || '-',
      fixed: 'right',
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
  {
    field: 'overdueDays',
    label: '逾期天数',
    // component: 'Select',
    // componentProps: { options: slippageState },
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'overdueType',
    label: '逾期类型',
    component: 'Select',
    componentProps: { options: slippageType },
    colProps: { span: 6 },
  },
  {
    label: '起诉进度',
    field: 'prosecuteStatus',
    colProps: { span: 6 },
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getProsecuteList,
      params: { cursor: 999999, status: 1 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'code',
    },
  },
  {
    label: '法诉渠道',
    field: 'lawsuitId',
    colProps: { span: 6 },
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getLegalChannelsList,
      params: { cursor: 999999, status: 1 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    field: 'spuType',
    label: '商品类目',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: spuTypeList,
    },
  },
  {
    field: 'rentTypeList',
    label: '租赁类型',
    component: 'Select',
    componentProps: { options: rentTypeList },
    colProps: { span: 6 },
  },
  {
    ifShow: hasPermission('OrdeSlippageFollowBy'),
    field: 'followBy',
    label: '跟进人',
    colProps: { span: 6 },
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      placeholder: '请选择跟进人',
      api: getUserList,
      params: { limit: 999999, status: '1' },
      resultField: 'list',
      labelField: 'userName',
      valueField: 'uid',
    },
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
    field: 'time',
    label: '创建时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]

/**
 * 分配跟进人
 */
export const followByFormSchema: FormSchema[] = [
  {
    label: '订单ID',
    field: 'orderIds',
    component: 'Input',
    show: false,
  },
  {
    label: '选择跟进人',
    field: 'uid',
    component: 'ApiSelect',
    colProps: { span: 20 },
    required: true,
    componentProps: {
      showSearch: true,
      placeholder: '请选择跟进人',
      api: getUserList,
      params: { limit: 999999, status: '1' },
      resultField: 'list',
      labelField: 'userName',
      valueField: 'uid',
    },
  },
]
