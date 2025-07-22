import { BasicColumn, FormSchema } from '/@/components/Table'
import { FormItem, Input, DatePicker, Select } from 'ant-design-vue'
import { formatNumber } from '/@/utils/tool'
import { usePermission } from '/@/hooks/web/usePermission'
import { getStoreList } from '/@/api/store'

const { hasPermission } = usePermission()

export const availableBalanceColumns: BasicColumn[] = [
  {
    ifShow: hasPermission('FinanceAccountMerchant'),
    title: '商家',
    dataIndex: 'merchantName',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.merchantCode}</div>
          <div>{record.merchantName}</div>
        </div>
      )
    },
  },
  {
    title: '充值编号',
    dataIndex: 'tradeNo',
    customRender: ({ text }) => text,
  },
  {
    title: '金额',
    dataIndex: 'amount',
    customRender: ({ text }) => formatNumber(text || 0, 2),
  },
  {
    title: '充值时间',
    dataIndex: 'createTime',
  },
]

export const availableBalanceSearchSchema: FormSchema[] = [
  {
    ifShow: hasPermission('FinanceAccountMerchant'),
    field: 'merchantCode',
    label: '商家名称',
    component: 'ApiSelect',
    colProps: { span: 8 },
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
]

export const usageAmountColumns: BasicColumn[] = [
  {
    title: '订单编号/创建时间',
    dataIndex: 'orderSn',
    width: 230,
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.orderSn}</div>
          <div>{record.createTime}</div>
        </div>
      )
    },
  },
  {
    ifShow: hasPermission('FinanceAccountMerchant'),
    title: '商家',
    dataIndex: 'merchantName',
    customRender: ({ record }) => {
      return (
        <div>
          <div>{record.merchantCode}</div>
          <div>{record.merchantName}</div>
        </div>
      )
    },
  },
  // {
  //   title: '货款(元)',
  //   dataIndex: 'modifyLoanMoney',
  //   customRender: ({ text }) => formatNumber(text, 2) || '-',
  // },
  // {
  //   title: '业务员提成(元)',
  //   dataIndex: 'modifyRoyaltyFee',
  //   customRender: ({ text }) => formatNumber(text, 2) || '-',
  // },
  // {
  //   title: '商家分佣(元)',
  //   dataIndex: 'modifyRebateFee',
  //   customRender: ({ text }) => formatNumber(text, 2) || '-',
  // },
  {
    // 非商家，查看原始
    ifShow:
      !hasPermission('Finance.loanMoney.merchant') || hasPermission('Finance.loanMoney.platform'),
    title: '货款',
    dataIndex: 'loanMoney',
    align: 'left',
    customRender: ({ record }) => {
      return (
        <div>
          <div>货款: {formatNumber(record.loanMoney || 0, 2) || '-'}</div>
          <div>业务员提成: {formatNumber(record.royaltyFee || 0, 2) || '-'}</div>
          <div>商家返点: {formatNumber(record.rebateFee || 0, 2) || '-'}</div>
          <div>
            接单商家合计承担:{' '}
            <span style={{ color: 'red' }}>
              {formatNumber(record.merchantTotalLoanMoney, 2) || '-'}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    // 商家，查看最新
    // 平台，有资格看
    // 非商家，非平台，没得看
    ifShow:
      hasPermission('Finance.loanMoney.platform') || hasPermission('Finance.loanMoney.merchant'),
    title: hasPermission('Finance.loanMoney.platform') ? '修改后货款' : '货款',
    dataIndex: 'modifyLoanMoney',
    align: 'left',
    customRender: ({ record }) => {
      return (
        <div>
          <div>货款: {formatNumber(record.modifyLoanMoney || 0, 2) || '-'}</div>
          <div>业务员提成: {formatNumber(record.modifyRoyaltyFee || 0, 2) || '-'}</div>
          <div>商家返点: {formatNumber(record.modifyRebateFee || 0, 2) || '-'}</div>
          <div>
            接单商家合计承担:{' '}
            <span style={{ color: 'red' }}>
              {formatNumber(record.modifyMerchantTotalLoanMoney, 2) || '-'}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    title: '接单时间',
    width: 180,
    dataIndex: 'receivtTime',
  },
]

export const usageAmountSearchSchema: FormSchema[] = [
  {
    ifShow: hasPermission('FinanceAccountMerchant'),
    field: 'merchantCode',
    label: '商家名称',
    component: 'ApiSelect',
    colProps: { span: 8 },
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
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'timeSelect',
    label: '时间',
    defaultValue: '创建时间',
    fields: ['time'],
    component: 'Select',
    colProps: { span: 8 },
    renderColContent({ model, field }) {
      return (
        <Input.Group compact>
          <Select allowClear style="width: 120px;margin-left: 20px;" v-model:value={model[field]}>
            <Select.Option value="创建时间">创建时间</Select.Option>
            <Select.Option value="接单时间">接单时间</Select.Option>
          </Select>
          <FormItem name="time" label="">
            <DatePicker.RangePicker
              allowClear
              v-model:value={model['time']}
              valueFormat="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
            />
          </FormItem>
        </Input.Group>
      )
    },
  },
]
