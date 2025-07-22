import { h } from 'vue'
import { BasicColumn } from '/@/components/Table/src/types/table'
import { formatDecimal, formatNumber } from '/@/utils/tool'
import { Tag } from 'ant-design-vue'
import { FormSchema } from '/@/components/Table'
import { EditOutlined } from '@ant-design/icons-vue'
import { usePermission } from '/@/hooks/web/usePermission'
const { hasPermission } = usePermission()

export const stateList: any = {
  0: { title: '未生效', color: 'volcano' },
  1: { title: '待支付', color: 'orange' },
  2: { title: '逾期未支付', color: 'red' },
  3: { title: '逾期已支付', color: 'green' },
  4: { title: '已支付', color: 'green' },
  5: { title: '已取消', color: '' },
}
const typeState = {
  0: { title: '押金', color: 'volcano' },
  1: { title: '增值服务', color: 'red' },
  2: { title: '租金', color: 'red' },
  3: { title: '保证金', color: 'green' },
  4: { title: '罚金', color: 'green' },
  5: { title: '续期', color: '' },
  6: { title: '买断', color: '' },
  7: { title: '归还赔付', color: '' },
  8: { title: '归还退款', color: '' },
  21: { title: '锁费', color: '' },
  22: { title: '公证费用', color: '' },
  100: { title: '监管锁及公证费', color: '' },
}
/**
 * data
 * @param updateMoreDate 修改到期日方法
 * @param isAllocation 是否 从分配订单列表进来
 * @returns table
 */
export function tableSchema(data: any): BasicColumn[] {
  return [
    // {
    //   title: '账单ID',
    //   dataIndex: 'billId',
    //   width: 100,
    //   customRender: ({ text }) => text || '-',
    // },
    {
      title: '账单编号',
      dataIndex: 'billItemSn',
      width: 160,
      customRender: ({ text }) => text || '-',
    },
    {
      ifShow: data.isAllocation,
      title: '是否分账',
      dataIndex: 'payOutMerchantAccount',
      width: 80,
      customRender: ({ text }) =>
        h(Tag, { color: text == 1 ? 'green' : 'red' }, text == 1 ? '是' : '否'),
    },
    {
      title: '是否首付',
      dataIndex: 'sourceType',
      width: 80,
      customRender: ({ text }) => (text == 0 ? '是' : '否'),
      // h(Tag, { color: text == 0 ? 'green' : 'red' }, text == 0 ? '是' : '否'),
    },
    {
      title: '租期',
      dataIndex: 'periodNo',
      width: 80,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      customRender: ({ text }) => typeState[text]?.title || '-',
    },
    {
      title: '账单金额（元）',
      dataIndex: 'totalAmount',
      width: 120,
      customRender: ({ text }) => formatNumber(text, 2) || '-',
    },
    {
      title: '到期日',
      dataIndex: 'repayDate',
      width: 120,
      customRender: ({ text }) => text || '-',
      customHeaderRender() {
        return (
          <div>
            <span>到期日</span>
            {hasPermission('OrderDetailUpdateBillTime') ? (
              <EditOutlined class="icon" onClick={data.updateMoreDate} />
            ) : (
              ''
            )}
          </div>
        )
      },
    },
    {
      title: '还款状态',
      dataIndex: 'status',
      width: 100,
      customRender: ({ text }) => {
        // if (record.repayAmount - record.repaidAmount == 0) {
        //   text = 4
        // }
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
      title: '逾期罚金（元）',
      dataIndex: 'penaltyAmount',
      width: 120,
      customRender: ({ text, record }) => {
        return (
          <div>
            <span>{formatNumber(text, 2)}</span>
            {hasPermission('OrderDetailUpdatePenaltyAmount') &&
            text &&
            ![3, 4, 5].includes(record.status) ? (
              <EditOutlined class="icon" onClick={() => data.updatePenaltyAmount(record)} />
            ) : (
              ''
            )}
          </div>
        )
      },
    },
    {
      title: '减免罚金（元）',
      dataIndex: 'modifyPenaltyAmount',
      width: 120,
      customRender: ({ text }) => formatNumber(text, 2),
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
        // const pay = record.actualAmout ? record.actualAmout : text
        const txt = [h('span', {}, formatNumber(text, 2) || '-')]
        // if (record.actualAmout && record.actualAmout != record.repaidAmount) {

        // }
        // 有优惠券ID
        if (record.couponId) {
          txt.push(h(Tag, { color: 'red', style: { marginLeft: '3px' } }, '券后'))
        }
        // 如果有标识就展示 减免实收
        if (record?.ifActual == 1)
          txt.push(h(Tag, { color: 'green', style: { marginLeft: '3px' } }, '减免实收'))
        return h('div', { textAlign: 'center' }, txt)
      },
    },
    // {
    //   title: '备注',
    //   dataIndex: 'billRemarks',
    //   customRender: ({ text }) => text || '-',
    // },
    {
      title: '还款时间',
      dataIndex: 'payDate',
      width: 180,
      customRender: ({ text }) => text || '-',
    },
  ]
}

export const dateFormSchema: FormSchema[] = [
  {
    field: 'sourceBizId',
    label: '订单ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'billItemSn',
    label: '账单编号',
    component: 'Input',
    show: false,
  },
  {
    field: 'repayDate',
    label: '当前账单到期日: ',
    component: 'Input',
    colProps: { span: 24 },
    slot: 'repayDate',
  },
  {
    field: 'days',
    label: '调整后到期日: ',
    component: 'Select',
    suffix: '号',
    componentProps: {
      options: [
        { label: '1', value: 1 },
        { label: '5', value: 5 },
        { label: '10', value: 10 },
        { label: '15', value: 15 },
        { label: '20', value: 20 },
        { label: '25', value: 25 },
        { label: '30', value: 30 },
      ],
    },
  },
  {
    field: 'text',
    label: '',
    component: 'Input',
    slot: 'text',
    colProps: { span: 24 },
  },
]

export const penaltyAmountFormSchema: FormSchema[] = [
  {
    field: 'orderId',
    label: '订单ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'billItemSn',
    label: '账单编号',
    component: 'Input',
    show: false,
  },
  {
    show: false,
    field: 'penaltyAmount',
    label: '当前逾期罚金',
    component: 'InputNumber',
    colProps: { span: 24 },
  },
  {
    field: 'text',
    label: '',
    component: 'Input',
    slot: 'text',
    colProps: { span: 24 },
  },
  {
    label: '修改逾期罚金:',
    field: 'modifyPenaltyAmount',
    component: 'InputNumber',
    colProps: { span: 24 },
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonBefore: '￥',
      addonAfter: '元',
    },
  },
]
