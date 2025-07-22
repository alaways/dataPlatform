import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatNumber } from '/@/utils/tool'
import { DatePicker, FormItem, Input, Select } from 'ant-design-vue'
import dayjs from 'dayjs'

export const columns: BasicColumn[] = [
  {
    title: '商家(资方)',
    dataIndex: 'time',
    customRender: ({ text }) => {
      if (text == '自营') {
        return (
          <>
            <b>{text}</b>
            {/* <Tooltip title="该时间段内未分配订单的(总收款、货款支出、商家佣金、提成、锁费)数据">
              <InfoCircleOutlined
                style={{ color: '#565656', fontSize: '14px', marginLeft: '5px' }}
              />
            </Tooltip> */}
          </>
        )
      }
      if (text == '汇总') {
        return (
          <>
            <div style={{ fontWeight: 'bold', color: 'red' }}>{text}</div>
          </>
        )
      }
      return text
    },
  },
  {
    title: '合计收款(元)',
    dataIndex: 'totalCollectMoney',
    // helpMessage: '租金收款+锁费',
    customRender: ({ text, record }) => {
      const count = formatNumber(text, 2) || '-'
      if (record.time != '汇总') {
        return count
      }
      return (
        <>
          <div style={{ fontWeight: 'bold', color: 'red' }}>{count}</div>
        </>
      )
    },
  },
  {
    title: '首次支付金额(元)',
    dataIndex: 'downPayMoney',
    helpMessage: '含锁费+公证费用',
    customRender: ({ text, record }) => {
      const count = formatNumber(text, 2) || '-'
      if (record.time != '汇总') {
        return count
      }
      return (
        <>
          <div style={{ fontWeight: 'bold', color: 'red' }}>{count}</div>
        </>
      )
    },
  },
  {
    title: '租金收款(元)',
    dataIndex: 'loanMoney',
    // helpMessage: '含首次支付金额',
    customRender: ({ text, record }) => {
      const count = formatNumber(text, 2) || '-'
      if (record.time != '汇总') {
        return count
      }
      return (
        <>
          <div style={{ fontWeight: 'bold', color: 'red' }}>{count}</div>
        </>
      )
    },
  },
  // {
  //   title: '货款支出(元)',
  //   dataIndex: 'modifyLoanMoney',
  //   customRender: ({ text }) => formatNumber(text, 2) || '-',
  // },
  // {
  //   title: '商家佣金(元)',
  //   dataIndex: 'modifyRebateFee',
  //   customRender: ({ text }) => formatNumber(text, 2) || '-',
  // },
  // {
  //   title: '提成(元)',
  //   dataIndex: 'modifyRoyaltyFee',
  //   customRender: ({ text }) => formatNumber(text, 2) || '-',
  // },
  {
    title: '锁费(元)',
    dataIndex: 'lockFee',
    customRender: ({ text, record }) => {
      const count = formatNumber(text, 2) || '-'
      if (record.time != '汇总') {
        return count
      }
      return (
        <>
          <div style={{ fontWeight: 'bold', color: 'red' }}>{count}</div>
        </>
      )
    },
  },
  {
    title: '公证费用(元)',
    dataIndex: 'gzFee',
    width: 100,
    customRender: ({ text, record }) => {
      const count = formatNumber(text, 2) || '-'
      if (record.time != '汇总') {
        return count
      }
      return (
        <>
          <div style={{ fontWeight: 'bold', color: 'red' }}>{count}</div>
        </>
      )
    },
  },
  // {
  //   title: '坏账拨备',
  //   dataIndex: 'totalmodifyLoanMoney',
  //   customHeaderRender: () => {
  //     return (
  //       <div>
  //         <div>坏账拨备10%</div>
  //         <div>(总货款成本)</div>
  //       </div>
  //     )
  //   },
  //   customRender: ({ text }) => formatNumber(text, 2) || '-',
  // },
]

const today = dayjs()
const thirtyDaysAgo = today.subtract(30, 'day')
const allTime = [thirtyDaysAgo.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')]
export const searchFormSchema: FormSchema[] = [
  {
    ifShow: false,
    show: false,
    field: 'timeSelect',
    label: '时间',
    defaultValue: '支付时间',
    fields: ['time'],
    defaultValueObj: { time: allTime },
    component: 'Select',
    colProps: { span: 15 },
    renderColContent({ model, field }) {
      return (
        <Input.Group compact>
          <Select allowClear style="width: 150px;margin-left: 20px;" v-model:value={model[field]}>
            <Select.Option value="支付时间">支付时间</Select.Option>
            <Select.Option value="订单创建时间">订单创建时间</Select.Option>
          </Select>
          <FormItem name="time">
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
  {
    field: 'createTime',
    label: '订单创建时间',
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
    defaultValue: allTime,
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]

export const paymentColumns: BasicColumn[] = [
  {
    title: '商家(资方)',
    dataIndex: 'time',
    customRender: ({ text }) => {
      if (text == '自营') {
        return (
          <>
            <b>{text}</b>
            {/* <Tooltip title="该时间段内未分配订单的(总收款、货款支出、商家佣金、提成、锁费)数据">
              <InfoCircleOutlined
                style={{ color: '#565656', fontSize: '14px', marginLeft: '5px' }}
              />
            </Tooltip> */}
          </>
        )
      }
      if (text == '汇总') {
        return (
          <>
            <div style={{ fontWeight: 'bold', color: 'red' }}>{text}</div>
          </>
        )
      }
      return text
    },
  },
  {
    title: '货款支出(元)',
    dataIndex: 'loanMoney',
    customRender: ({ text, record }) => {
      const count = formatNumber(text, 2) || '-'
      if (record.time != '汇总') {
        return count
      }
      return (
        <>
          <div style={{ fontWeight: 'bold', color: 'red' }}>{count}</div>
        </>
      )
    },
  },
  {
    title: '商家佣金(元)',
    dataIndex: 'rebateFee',
    customRender: ({ text, record }) => {
      const count = formatNumber(text, 2) || '-'
      if (record.time != '汇总') {
        return count
      }
      return (
        <>
          <div style={{ fontWeight: 'bold', color: 'red' }}>{count}</div>
        </>
      )
    },
  },
  {
    title: '提成(元)',
    dataIndex: 'royaltyFee',
    customRender: ({ text, record }) => {
      const count = formatNumber(text, 2) || '-'
      if (record.time != '汇总') {
        return count
      }
      return (
        <>
          <div style={{ fontWeight: 'bold', color: 'red' }}>{count}</div>
        </>
      )
    },
  },
]

export const paymentSearchFormSchema: FormSchema[] = [
  {
    ifShow: false,
    show: false,
    field: 'timeSelect',
    label: '时间',
    defaultValue: '首付支付时间',
    fields: ['time'],
    defaultValueObj: { time: allTime },
    component: 'Select',
    colProps: { span: 15 },
    renderColContent({ model, field }) {
      return (
        <Input.Group compact>
          <Select allowClear style="width: 150px;margin-left: 20px;" v-model:value={model[field]}>
            <Select.Option value="首付支付时间">首付支付时间</Select.Option>
            <Select.Option value="订单创建时间">订单创建时间</Select.Option>
          </Select>
          <FormItem name="time">
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
  {
    field: 'createTime',
    label: '订单创建时间',
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
    defaultValue: allTime,
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]
