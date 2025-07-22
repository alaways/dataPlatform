import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { Tag } from 'ant-design-vue'
import { statusList } from '/@/views/order/utils'
import { DescItem } from '/@/components/Description'

export const phoneStatasList = [
  { label: '正常', value: 'NORMAL', color: 'green' },
  { label: '停机', value: 'SHUTDOWN', color: 'red' },
  { label: '关机', value: 'POWER_OFF', color: 'red' },
  { label: '空号', value: 'NOT_EXIST', color: 'red' },
  { label: '疑似关机', value: 'SUSPECTED_POWER_OFF', color: 'orange' },
  { label: '忙', value: 'BUSY', color: 'pink' },
  { label: '未知', value: 'UNKNOWNv', color: '' },
]

/**
 *
 * @param options 关系列表
 * @param realName 本人名称
 * @returns
 */
export function tableColumn(options, realName): BasicColumn[] {
  return [
    {
      title: '紧急联系人姓名',
      dataIndex: 'userName',
      editRow: true,
      editRule: true,
      editComponent: 'Input',
    },
    {
      title: '紧急联系人关系',
      dataIndex: 'relation',
      editRow: true,
      editRule: true,
      editComponent: 'Select',
      editComponentProps: ({ record }) => {
        return {
          options,
          placeholder: '请选择',
          onChange: (e: any) => {
            if (e == '本人') {
              record.userName = realName
              console.log(record)
            } else {
              if (record.userName == realName) {
                record.userName = ''
              }
            }
          },
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      editRow: true,
      editRule: true,
      editComponent: 'Input',
    },
    {
      title: '紧急联系人手机号',
      dataIndex: 'mobile',
      editRow: true,
      editRule: true,
      editComponent: 'Input',
    },
    {
      title: '号码状态',
      dataIndex: 'checkStatus',
      width: 100,
      customRender: ({ text }) => {
        const find = phoneStatasList.find((v) => v.value == text)
        return h(Tag, { color: find?.color }, find?.label)
      },
    },
    {
      title: '验证状态',
      dataIndex: 'status',
      width: 100,
      customRender: ({ text }) => {
        let color = 'orange'
        let txt = '待验证'
        if (text === 0) {
          color = 'red'
          txt = '验证不通过'
        } else if (text == 1) {
          color = 'green'
          txt = '验证通过'
        } else if (text == 2) {
          color = 'red'
          txt = '验证不通过'
        }
        return h(Tag, { color }, txt)
      },
    },
    {
      // id 标识: 1:紧急联系人1，2:紧急联系人2，3就是列表里的接上并且按序号排
      ifShow: false,
      title: '联系人标识',
      dataIndex: 'id',
    },
    // {
    //   title: '是否在通讯录中',
    //   dataIndex: 'address',
    //   customRender: ({ text }) => text || '-',
    // },
  ]
}

export const tableEditRow = {
  userName: '',
  relation: '',
  mobile: '',
  status: '',
}

export const modalColumns: BasicColumn[] = [
  {
    title: '订单编号',
    dataIndex: 'order_sn',
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ text }) => {
      const find: any = statusList.find((v) => v.value == text)
      return h(Tag, { color: find?.color || '' }, () => find?.label)
    },
  },
]

export const descriptionSchema: DescItem[] = [
  {
    field: 'userName',
    label: '紧急联系人名称',
  },
  {
    field: 'mobile',
    label: '紧急联系人手机号',
  },
  {
    field: 'relation',
    label: '紧急联系人关系',
  },
  {
    field: 'remark',
    label: '备注',
  },
  {
    field: 'status',
    label: '人审结果',
    render: (value) => {
      let color = 'red'
      let txt = '验证不通过'
      if (!value && value !== 0) {
        color = 'orange'
        txt = '待验证'
      } else if (value == 1) {
        color = 'green'
        txt = '验证通过'
      }
      return h(Tag, { color }, txt)
    },
  },
]
