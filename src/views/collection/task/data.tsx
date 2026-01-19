import { getUserList } from '/@/api/system/account'
import { usePermission } from '/@/hooks/web/usePermission'
import { spuTypeList } from '/@/views/goods/goodsBase/data'
import { rentTypeList } from '/@/views/goods/goodsLease/utils'
import { getStoreNoPageList } from '/@/api/store'
import { getCollectsStatusList, getProsecuteList } from '/@/api/collection/task'

const { hasPermission } = usePermission()

// export const statusList = [
//   { color: 'orange', label: '未催收', value: 0 },
//   { color: 'blue', label: '达成还款意向', value: 1 },
//   { color: 'red', label: '无还款意向', value: 2 },
//   { color: 'green', label: '已还清租金', value: 3 },
//   { color: 'cyan', label: '已还部分租金', value: 4 },
//   { color: 'red', label: '关机', value: 5 },
//   { color: 'red', label: '停机/空号', value: 6 },
// ]
const tabsList = [
  { name: '诉讼中', code: '1' },
  { name: '新派单', code: '2' },
]
export const searchFormSchema = [
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
    ifShow: hasPermission('CollectionTaskFollowBy'),
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
    field: 'lockStatus',
    label: '锁定状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '已锁定客户', value: 1 },
        { label: '待锁定客户', value: 0 },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'overdueDays',
    label: '逾期天数',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'merchantCode',
    label: '分配商家',
    component: 'ApiSelect',
    colProps: { span: 6 },
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getStoreNoPageList,
      params: { pageSize: 999999, limit: 999999 },
      resultField: 'list',
      labelField: 'merchantName',
      valueField: 'merchantCode',
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
    colProps: { span: 8 },
  },
  {
    field: 'repayDate',
    label: '协商还款时间',
    component: 'RangePicker',
    labelWidth: 120,
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 8 },
  },
  {
    field: 'lastFollowDate',
    label: '最后跟进时间',
    component: 'RangePicker',
    labelWidth: 120,
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 8 },
  },
  {
    field: 'salesperson',
    label: '业务员',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'tabCode',
    label: '催收状态',
    component: 'ApiSelect',
    defaultValue: '2',
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      initProps: tabsList,
      allowClear: false,
      api: getCollectsStatusList,
      params: { cursor: 999999, status: 1, isNew: 1 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'code',
    },
  },
]
export const menuList = [
  {
    tab: '线下业务',
    key: 'OfflineCom', // 对应组件名
    ifShow: hasPermission('offlineCollection'),
  },
  {
    tab: '线上业务',
    key: 'OnlineCom', // 对应组件名
    ifShow: hasPermission('onlineCollection'),
  },
  {
    tab: '零零享租',
    key: 'Linglingxiang',
    ifShow: hasPermission('linglxCollection'),
  },
  {
    tab: '俏租机',
    key: 'Qiaozuji',
    ifStore: 1,
    ifShow: hasPermission('qiaozujiCollection'),
  },
]?.filter((item: any) => item.ifShow)
