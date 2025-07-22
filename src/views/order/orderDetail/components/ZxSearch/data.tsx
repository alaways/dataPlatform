import { DescItem } from '/@/components/Description/index'
import { Image } from 'ant-design-vue'
//
export const infoSchema: DescItem[] = [
  {
    field: 'realName',
    label: '姓名',
    contentMinWidth: 100,
  },
  {
    field: 'idCard',
    label: '身份证号',
  },
  {
    field: 'receiverPhone',
    label: '手机号',
  },
  {
    field: 'gender',
    label: '性别',
  },
  {
    field: 'idCardFrontUrl',
    render: (record) => {
      return (
        <div>
          <span style={{ marginRight: '2px' }}>身份证正面</span>
          <Image width={100} src={record} />
        </div>
      )
    },
  },
  {
    field: 'idCardBackUrl',
    render: (record) => {
      return (
        <div>
          <span style={{ marginRight: '2px' }}>身份证反面</span>
          <Image width={100} src={record} />
        </div>
      )
    },
  },
]

export const searchSchema: DescItem[] = [
  {
    field: 'orderSn',
    label: '查询订单号',
    span: 1,
  },
  {
    field: 'productCodeDiy',
    label: '查询产品编号',
  },
  {
    field: 'createTime',
    label: '查询时间',
  },
]
