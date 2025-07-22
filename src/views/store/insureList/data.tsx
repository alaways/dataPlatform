import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { statusList } from '../utils'
import { formatNumber } from '/@/utils/tool'
import { Tag } from 'ant-design-vue'

export const columns: BasicColumn[] = [
  {
    title: '订单信息',
    dataIndex: 'orderSn',
    width: 230,
    customRender: ({ record }) => {
      const find: any = statusList.find((v) => v.value == record.status)
      return (
        <>
          <div>订单编号: {record.orderSn || '-'} </div>
          <div>
            订单状态: <Tag color={find?.color}>{find.label}</Tag>
          </div>
          <div>创建时间: {record.createTime || '-'}</div>
        </>
      )
    },
  },
  {
    title: '保单编号',
    dataIndex: 'proposalNo',
    width: 120,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '保险期限',
    dataIndex: 'effectiveTime',
    width: 180,
    customRender: ({ text, record }) => `${text}至${record.expireTime}`,
  },
  {
    title: '保险条款名称',
    dataIndex: 'proposalName',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '保险金额(元)',
    dataIndex: 'sumAmount',
    width: 120,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '保险费(元)',
    dataIndex: 'sumPremium',
    width: 100,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'proposalNo',
    label: '保单编号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'time',
    label: '创建时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 8 },
  },
]
