import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'
import { usePermission } from '/@/hooks/web/usePermission'
import { Tag } from 'ant-design-vue'
import { getProsecuteList } from '/@/api/collection/task'
import { getLegalChannelsList } from '/@/api/collection/legalChannels'
import { getUserList } from '/@/api/system/account'

const { hasPermission } = usePermission()

export const columns: BasicColumn[] = [
  {
    title: '用户信息',
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
    title: '订单编号',
    dataIndex: 'orderSn',
    width: 150,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '账单编号',
    dataIndex: 'billItemSn',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '逾期期数',
    dataIndex: 'periodNo',
    width: 100,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '逾期天数',
    dataIndex: 'overdueDays',
    width: 100,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '催收已还金额',
    dataIndex: 'repaidAmount',
    width: 150,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  // {
  //   title: '催收提成',
  //   dataIndex: 'royaltyFee',
  //   width: 150,
  //   helpMessage: '催收已还金额*催收提成点',
  //   customRender: ({ text }) => formatNumber(text, 2) || '-',
  // },
  {
    title: '提成费倍率',
    dataIndex: 'multiplier',
    width: 100,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '最终提成费',
    dataIndex: 'multiplierRoyaltyFee',
    width: 150,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '还款时间',
    dataIndex: 'payDate',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
  // {
  //   title: '最后催收记录',
  //   dataIndex: 'remark',
  // },
  // {
  //   title: '最后跟进时间',
  //   dataIndex: 'lastFollowTime',
  //   width: 180,
  //   customRender: ({ text }) => text || '-',
  // },
  {
    ifShow: hasPermission('CollectionRemitFollowBy'),
    title: '跟进人',
    dataIndex: 'followByName',
    width: 150,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '领取时间',
    dataIndex: 'receiveTime',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '起诉进度',
    dataIndex: 'prosecuteStatus',
    width: 120,
    customRender: ({ record }) => {
      return h(Tag, { color: record?.color }, record?.prosecuteName)
    },
  },
  {
    title: '法诉渠道',
    dataIndex: 'lawsuitName',
    width: 100,
    customRender: ({ text }) => text || '-',
  },
]
export const dataList = [
  { label: '线下', value: 'xx' },
  { label: '线上', value: 'xs' },
  { label: '零零享租', value: 'llsz' },
  { label: '俏租机', value: 'qzj' },
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
    field: 'followBy',
    label: '跟进人',
    colProps: { span: 8 },
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
    field: 'payTime',
    label: '还款时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 8 },
  },
  {
    field: 'receiveTime',
    label: '领取时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 8 },
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
