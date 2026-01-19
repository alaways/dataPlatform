import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'
import { Tag } from 'ant-design-vue'
import { stateList } from '/@/views/order/orderDetail/components/bill/data'
import { getUserList } from '/@/api/system/account'
import { usePermission } from '/@/hooks/web/usePermission'
import { spuTypeList } from '/@/views/goods/goodsBase/data'
import { rentTypeList } from '/@/views/goods/goodsLease/utils'
import { getStoreList } from '/@/api/store'
import { receivingList } from '/@/views/order/all/data'
import { getLegalChannelsList } from '/@/api/collection/legalChannels'
import { getCollectsStatusList, getProsecuteList } from '/@/api/collection/task'
const { hasPermission } = usePermission()

/**
 * 菜单
 */
export const tabsList = [
  { tab: '诉讼中', key: '1' },
  { tab: '新派单', key: '2' },
]

export const columns: BasicColumn[] = [
  {
    title: '用户信息',
    width: 112,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, `${record?.nickName || '-'}`),
        h('br'),
        h('span', {}, record?.phone || '-'),
      ])
    },
  },
  {
    title: '订单编号',
    dataIndex: 'orderSn',
    width: 144,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '最大逾期天数',
    dataIndex: 'overdueDays',
    width: 102,
    // sorter: true,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '逾期租金(元)',
    dataIndex: 'overdueRentAmount',
    width: 102,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '上次跟进时间',
    dataIndex: 'lastFollowTime',
    width: 102,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '跟进人',
    dataIndex: 'followByName',
    width: 80,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '领取时间',
    dataIndex: 'receiveTime',
    width: 100,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '逾期罚金(元)',
    dataIndex: 'overduePenaltyAmount',
    width: 102,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '应催收金额(元)',
    dataIndex: 'collectAmount',
    width: 120,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '起诉进度',
    dataIndex: 'prosecuteStatus',
    width: 80,
    customRender: ({ record }) => {
      return h(Tag, { color: record?.color }, record?.prosecuteName)
    },
  },
  {
    title: '法诉渠道',
    dataIndex: 'lawsuitName',
    width: 80,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '地区',
    dataIndex: 'ipProvince',
    width: 100,
    customRender: ({ record }) => `${record?.ipProvince} ${record?.ipCity}`,
  },
  {
    title: '商品类目',
    dataIndex: 'spuType',
    width: 80,
    customRender: ({ text }) => {
      const find: any = spuTypeList.find((v) => v.value == text)
      return find?.label || '-'
    },
  },
  {
    title: '租赁类型',
    dataIndex: 'rentType',
    width: 80,
    customRender: ({ text }) => {
      if (text == 2) {
        return '月付'
      }
      const find = rentTypeList.find((v) => v.value == text)
      return find?.label || '-'
    },
  },
  {
    title: '订单分配信息',
    dataIndex: 'ifOrder',
    width: 230,
    align: 'left',
    customRender: ({ record }) => {
      const ifOrder = receivingList[record?.ifOrder]
      const merchantName = record?.merchantCode && record?.merchantName ? record?.merchantName : '-'
      return h('div', {}, [
        h('span', {}, `商家名称:${merchantName}`),
        h('br'),
        h('span', {}, `分配时间:${record?.allocatTime || '-'}`),
        h('br'),
        h('span', {}, [
          h('span', {}, `接单状态:`),
          ifOrder ? h(Tag, { color: ifOrder?.color || '' }, () => ifOrder?.label) : '-',
        ]),
        h('br'),
        h('span', {}, `接单时间:${record?.receivtTime || '-'}`),
      ])
    },
  },
  {
    title: '业务员',
    dataIndex: 'salesperson',
    fixed: 'right',
  },
  {
    title: '协商还款时间',
    width: 102,
    dataIndex: 'repayDate',
    fixed: 'right',
    customRender: ({ text }) => text || '-',
  },
]

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
    ifShow: hasPermission('CollectionTaskNewFollowBy'),
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
    label: '催收状态',
    field: 'status',
    colProps: { span: 6 },
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getCollectsStatusList,
      params: { cursor: 999999, status: 1 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'code',
    },
  },
  {
    field: 'overdueDays',
    label: '逾期天数',
    component: 'Input',
    colProps: { span: 6 },
  },
  // {
  //   field: 'merchantCode',
  //   label: '分配商家',
  //   component: 'ApiSelect',
  //   colProps: { span: 6 },
  //   componentProps: {
  //     showSearch: true,
  //     placeholder: '请选择',
  //     api: getStoreList,
  //     params: { pageSize: 999999, limit: 999999 },
  //     resultField: 'list',
  //     labelField: 'merchantName',
  //     valueField: 'merchantCode',
  //   },
  // },
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
    field: 'time',
    label: '领取时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
  {
    field: 'repayDate',
    label: '协商还款时间',
    component: 'RangePicker',
    labelWidth: 110,
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
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
    colProps: { span: 6 },
  },
  {
    field: 'salesperson',
    label: '业务员',
    component: 'Input',
    colProps: { span: 6 },
  },
]

export const billColumns: BasicColumn[] = [
  {
    title: '账单ID',
    dataIndex: 'billId',
    width: 100,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '逾期租期',
    dataIndex: 'periodNo',
    width: 80,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '账单金额(元)',
    dataIndex: 'totalAmount',
    width: 120,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '到期日',
    dataIndex: 'repayDate',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '还款状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text, record }) => {
      if (record?.repayAmount - record?.repaidAmount == 0) {
        text = 4
      }
      if (text || text == 0) {
        return h(Tag, { color: stateList[text].color }, stateList[text].title)
      }
      return '-'
    },
  },
  {
    title: '逾期天数',
    dataIndex: 'overdueDays',
    width: 100,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '逾期罚金(元)',
    dataIndex: 'penaltyAmount',
    width: 120,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '应还金额（元）',
    dataIndex: 'repayAmount',
    width: 120,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '已还金额（元）',
    dataIndex: 'repaidAmount',
    width: 150,
    customRender: ({ text, record }) => {
      const pay = record?.actualAmout ? record?.actualAmout : text
      const txt = [h('span', {}, formatNumber(pay, 2) || '-')]
      if (record?.actualAmout && record?.actualAmout != record?.repaidAmount) {
        if (record?.couponId) {
          txt.push(h(Tag, { color: 'red', style: { marginLeft: '3px' } }, '券后'))
        } else {
          txt.push(h(Tag, { color: 'green', style: { marginLeft: '3px' } }, '减免实收'))
        }
      }
      return h('div', { textAlign: 'center' }, txt)
    },
  },
]
