import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'

export const columns: BasicColumn[] = [
  {
    title: '订单编号',
    dataIndex: 'orderSn',
    width: 150,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '寄件人',
    dataIndex: 'contactName',
    customRender: ({ text, record }) => {
      return (
        <>
          <div>{text}</div>
          <div>{record.contactPhone}</div>
          <div>{record.contactCompany}</div>
        </>
      )
    },
  },
  {
    title: '收件人',
    dataIndex: 'receiverName',
    customRender: ({ text, record }) => {
      return (
        <>
          <div>{text}</div>
          <div>{record.receiverPhone}</div>
        </>
      )
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 6 },
  },
]
