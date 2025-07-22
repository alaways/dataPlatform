import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { Switch } from 'ant-design-vue'
import { useMessage } from '/@/hooks/web/useMessage'
import { updateLock } from '/@/api/business/lock'
import dayjs from 'dayjs'

export function columns(handleDetail): BasicColumn[] {
  return [
    {
      title: '省份',
      dataIndex: 'ipProvince',
      width: 130,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '城市',
      dataIndex: 'ipCity',
      width: 130,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '用户名/手机号',
      dataIndex: 'nickName',
      width: 150,
      customRender: ({ record }) => {
        return h('div', { textAlign: 'center' }, [
          h('span', {}, record.nickName || '-'),
          h('br'),
          h('span', {}, record.phone || '-'),
        ])
      },
    },
    {
      title: '订单编号/签约时间',
      dataIndex: 'orderSn',
      customRender: ({ record }) => {
        return h('div', { textAlign: 'center' }, [
          h(
            'span',
            { style: { color: '#49a6ea', cursor: 'pointer' }, onClick: () => handleDetail(record) },
            record.orderSn || '-',
          ),
          h('br'),
          h('span', {}, record.signTime || '-'),
        ])
      },
    },
    {
      title: '业务员',
      dataIndex: 'salesperson',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      customRender: ({ text }) => text || '-',
    },
    {
      title: '锁机状态',
      dataIndex: 'lockStatus',
      width: 100,
      customRender: ({ record }) => {
        if (!Reflect.has(record, 'lockStatus')) {
          record.lockStatus = false
        }
        return h(Switch, {
          checked: record.lockStatus === 1,
          checkedChildren: '锁机',
          unCheckedChildren: '未锁机',
          loading: record.pendingStatus,
          onChange(checked: boolean) {
            record.pendingStatus = true
            const newStatus = checked ? 1 : 0
            const { createMessage } = useMessage()
            updateLock({ id: record.id, ...record, lockStatus: newStatus })
              .then(() => {
                record.lockStatus = newStatus
                createMessage.success(record.lockStatus === 1 ? `已锁机` : '已解锁')
              })
              .catch(() => {
                createMessage.error('修改状态失败')
              })
              .finally(() => {
                record.pendingStatus = false
              })
          },
        })
      },
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      width: 180,
      customRender: ({ text }) => {
        return text ? dayjs(text).format('YYYY-MM-DD hh:mm:ss') : '-'
      },
    },
    {
      title: '最新到期时间',
      dataIndex: 'latestRepayDate',
      width: 180,
    },
  ]
}

export const searchFormSchema: FormSchema[] = [
  {
    field: 'nickName',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'phone',
    label: '手机号',
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
    field: 'lockStatus',
    label: '锁机状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '锁机', value: 1 },
        { label: '未锁机', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'salesperson',
    label: '业务员',
    component: 'Input',
    colProps: { span: 8 },
  },
]
