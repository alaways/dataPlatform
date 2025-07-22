import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'
import { Tag } from 'ant-design-vue'
import { platform } from '/@/views/order/utils'
import { stateList } from '/@/views/order/orderDetail/components/bill/data'
import { usePermission } from '/@/hooks/web/usePermission'
import { spuTypeList } from '/@/views/goods/goodsBase/data'
import { rentTypeList } from '/@/views/goods/goodsLease/utils'
import { receivingList } from '/@/views/order/all/data'

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
    title: '地区',
    dataIndex: 'ipProvince',
    width: 100,
    customRender: ({ record }) => `${record.ipProvince} ${record.ipCity}`,
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
    title: '下单来源',
    dataIndex: 'sourceFrom',
    width: 150,
    customRender: ({ text }) => {
      const find: any = platform.find((v) => v.value == text)
      return find?.label
    },
  },
  {
    title: '逾期期数',
    dataIndex: 'overduePeriodsNum',
    width: 100,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '账单金额(元)',
    dataIndex: 'overdueRentAmount',
    width: 150,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '逾期天数',
    dataIndex: 'overdueDays',
    width: 100,
    sorter: true,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '逾期罚金(元)',
    dataIndex: 'overduePenaltyAmount',
    width: 150,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '应催收金额(元)',
    dataIndex: 'collectAmount',
    width: 150,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '起诉进度',
    dataIndex: 'prosecuteStatus',
    width: 120,
    customRender: ({ record }) => {
      return h(Tag, { color: record?.color }, record?.prosecuteName)
    },
    fixed: 'right',
  },
  {
    title: '催收状态',
    dataIndex: 'collectsStatusName',
    width: 100,
    customRender: ({ record }) => {
      return h(Tag, { color: record?.collectsStatusColor }, record?.collectsStatusName)
    },
    fixed: 'right',
  },
  {
    title: '业务员',
    dataIndex: 'salesperson',
    fixed: 'right',
  },
  {
    title: '最后催收记录',
    dataIndex: 'remark',
    fixed: 'right',
  },
  {
    title: '最后跟进时间',
    dataIndex: 'lastFollowTime',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
  {
    ifShow: hasPermission('CollectionTaskFollowBy'),
    title: '跟进人',
    dataIndex: 'followByName',
    width: 150,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '领取时间',
    dataIndex: 'receiveTime',
    // helpMessage: '催收已还金额*催收提成点',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '订单分配信息',
    dataIndex: 'ifOrder',
    width: 230,
    align: 'left',
    // fixed: 'right',
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
      if (record.repayAmount - record.repaidAmount == 0) {
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
      const pay = record.actualAmout ? record.actualAmout : text
      const txt = [h('span', {}, formatNumber(pay, 2) || '-')]
      if (record.actualAmout && record.actualAmout != record.repaidAmount) {
        if (record.couponId) {
          txt.push(h(Tag, { color: 'red', style: { marginLeft: '3px' } }, '券后'))
        } else {
          txt.push(h(Tag, { color: 'green', style: { marginLeft: '3px' } }, '减免实收'))
        }
      }
      return h('div', { textAlign: 'center' }, txt)
    },
  },
]
