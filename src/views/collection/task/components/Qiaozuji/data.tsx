import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'
import { Tag } from 'ant-design-vue'
import { platform } from '/@/views/order/utils'
import { stateList } from '/@/views/order/orderDetail/components/bill/data'
import { spuTypeList } from '/@/views/goods/goodsBase/data'
import { rentTypeList } from '/@/views/goods/goodsLease/utils'


export const columns: BasicColumn[] = [
  {
    title: '客户名称',
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
    title: '手机号',
    dataIndex: 'ipProvince',
    width: 100,
    customRender: ({ record }) => `${record.ipProvince} ${record.ipCity}`,
  },
  {
    title: '业务金额',
    dataIndex: 'spuType',
    width: 100,
    customRender: ({ text }) => {
      const find: any = spuTypeList.find((v) => v.value == text)
      return find?.label || '-'
    },
  },
  {
    title: '商品名称',
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
    title: '商品规格',
    dataIndex: 'sourceFrom',
    width: 150,
    customRender: ({ text }) => {
      const find: any = platform.find((v) => v.value == text)
      return find?.label
    },
  },
  {
    title: '期次',
    dataIndex: 'overduePeriodsNum',
    width: 100,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '金额(元)',
    dataIndex: 'overdueRentAmount',
    width: 150,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '时间',
    dataIndex: 'overdueDays',
    width: 100,
    sorter: true,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '来源',
    dataIndex: 'overduePenaltyAmount',
    width: 150,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '催收人',
    dataIndex: 'collectAmount',
    width: 150,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
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
