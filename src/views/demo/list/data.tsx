import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatDecimal, formatNumber, handleImgAfter } from '/@/utils/tool'
import { uploadApi } from '/@/api/sys/upload'
import { FormItem, Input, DatePicker, Select, Tag, Tooltip } from 'ant-design-vue'
// import { getUserList } from '/@/api/system/account'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'

export function columns(other: any): BasicColumn[] {
  return [
    {
      title: '商家编号',
      dataIndex: 'merchantCode',
      width: 120,
    },
    {
      title: '商家名称',
      dataIndex: 'merchantName',
      width: 120,
      customRender: ({ text }) => text || '-',
    },
    // {
    //   title: '绑定账号',
    //   dataIndex: 'bindUid',
    //   width: 120,
    //   customRender: ({ text }) => text || '-',
    // },
    // {
    //   title: '负责人名称',
    //   dataIndex: 'bindName',
    //   width: 120,
    //   customRender: ({ text }) => text || '-',
    // },
    {
      title: '账户余额(元)',
      dataIndex: 'availableBalance',
      width: 220,
      customRender: ({ record }) => {
        return (
          <div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => other.storeBalance('AvailableBalanceTable')}
            >
              账户可用余额:{' '}
              <span style={{ color: '#48a6ea' }}>
                {formatNumber(record.availableBalance, 2) || 0}
              </span>
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => other.storeBalance('UsageAmountTable')}
            >
              已使用余额:{' '}
              <span style={{ color: '#48a6ea' }}>{formatNumber(record.usageAmount, 2) || 0}</span>
            </div>
            <div>
              累计充值金额:{' '}
              <span style={{ color: 'red' }}>
                {formatNumber(record.totalRechargeAmount, 2) || 0}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      title: '商家接单数据',
      dataIndex: 'allocatCount',
      width: 120,
      customRender: ({ record }) => {
        return (
          <div>
            <div
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
              onClick={() => other.payModal(record)}
            >
              分配订单
              <Tooltip
                placement="topLeft"
                title="取商家账号名下的订单（确认接单状态），订单状态【租赁生效中、已逾期、买断、已完结】的累计订单数"
              >
                <QuestionCircleOutlined />
              </Tooltip>
              : <span style={{ color: '#48a6ea' }}>{record.allocatCount || 0}</span>
            </div>

            <div
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
              onClick={() => other.payModal(record)}
            >
              拒绝接单
              <Tooltip placement="topLeft" title="取商家账号名下，操作拒绝接单的数据（累计）">
                <QuestionCircleOutlined />
              </Tooltip>
              :<span style={{ color: '#48a6ea' }}>{record.rejectCount || 0}</span>
            </div>
          </div>
        )
      },
    },
    {
      title: '在租订单/完结订单',
      dataIndex: 'rentalSum',
      width: 80,
      customHeaderRender: () => {
        return (
          <div>
            <div>
              在租订单
              <Tooltip
                placement="topLeft"
                title="取商家账号名下的订单（确认接单状态），订单状态【租赁生效中、已逾期】的订单数"
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <div>
              完结订单
              <Tooltip
                placement="topLeft"
                title="取商家账号名下的订单（确认接单状态），订单状态【买断、已完结】 的订单数"
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
          </div>
        )
      },
      customRender: ({ record }) => {
        return h('div', { textAlign: 'center' }, [
          h('span', {}, record.rentalSum || '-'),
          h('br'),
          h('span', {}, record.finishSum || '-'),
        ])
      },
    },
    {
      title: '待还总金额 / 订单总金额',
      dataIndex: 'repayTotalAmount',
      width: 120,
      customHeaderRender: () => {
        return (
          <div>
            <div>
              待还总金额(元)
              <Tooltip
                placement="topLeft"
                title="取商家账号名下的订单（确认接单状态），订单状态【租赁生效中、已逾期】的订单待收总金额（不含罚金，仅租金）"
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <div>
              订单总金额(元)
              <Tooltip
                placement="topLeft"
                title="取商家账号名下的订单（确认接单状态），订单状态【租赁生效中、已逾期、买断、已完结】的订单总金额（参考订单详情）"
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
          </div>
        )
      },
      customRender: ({ record }) => {
        return h('div', { textAlign: 'center' }, [
          h('span', {}, formatNumber(record.repayTotalAmount, 2) || '-'),
          h('br'),
          h('span', {}, formatNumber(record.totalAmount, 2) || '-'),
        ])
      },
    },
    // {
    //   isShow : false ,
    //   title: '待提现总金额(元)',
    //   dataIndex: 'waitWithdrawnTotalAmount',
    //   width: 100,
    //   customRender: ({ text }) => formatNumber(text, 2) || '-',
    // },
    // {
    //   isShow : false ,
    //   title: '提现中总金额(元)',
    //   dataIndex: 'withdrawnTotalAmount',
    //   width: 100,
    //   customRender: ({ text }) => formatNumber(text, 2) || '-',
    // },
    // {
    //   isShow : false ,
    //   title: '已提现总金额(元)',
    //   dataIndex: 'alreadyWithdrawnTotalAmount',
    //   width: 100,
    //   customRender: ({ text }) => formatNumber(text, 2) || '-',
    // },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   width: 100,
    //   fixed: 'right',
    //   customRender: ({ record }) => {
    //     if (!Reflect.has(record, 'status')) {
    //       record.status = false
    //     }
    //     return h(Switch, {
    //       checked: record.status === 0,
    //       checkedChildren: '启用',
    //       unCheckedChildren: '禁用',
    //       loading: record.pendingStatus,
    //       onChange(checked: boolean) {
    //         record.pendingStatus = true
    //         const newStatus = checked ? 0 : 1
    //         const { createMessage } = useMessage()
    //         updateStoreItem({ id: record.id, ...record, status: newStatus })
    //           .then(() => {
    //             record.status = newStatus
    //             createMessage.success(record.status === 0 ? `启用` : '禁用')
    //           })
    //           .catch(() => {
    //             createMessage.error('修改状态失败')
    //           })
    //           .finally(() => {
    //             record.pendingStatus = false
    //           })
    //       },
    //     })
    //   },
    // },
  ]
}

// 是否接单
const receivingList = [
  { label: '待确认', value: 0, color: 'orange' },
  { label: '已确认', value: 1, color: 'green' },
  { label: '已拒绝', value: 2, color: 'red' },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'merchantName',
    label: '商家名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    colProps: { span: 8 },
  },
  // {
  //   field: 'status',
  //   label: '状态',
  //   component: 'Select',
  //   colProps: { span: 8 },
  //   componentProps: {
  //     options: [
  //       { label: '启用', value: 0 },
  //       { label: '禁用', value: 1 },
  //     ],
  //   },
  // },
]
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: '商家ID',
    component: 'InputNumber',
    show: false,
  },
  {
    label: '商家Logo',
    field: 'merchantLogo',
    component: 'ImageUpload',
    colProps: { span: 24 },
    componentProps: () => {
      return {
        api: uploadApi,
        afterFetch: (data) => handleImgAfter(data),
        accept: ['png', 'jpeg', 'jpg'],
        maxNumber: 1,
      }
    },
  },
  {
    show: false,
    field: 'merchantName',
    label: '商家名称',
    component: 'Input',
    required: true,
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请输入商家名称',
    },
  },
  {
    field: 'bindUid',
    label: '商家名称',
    required: true,
    component: 'Select',
    colProps: { span: 20 },
    // componentProps: ({ formModel }) => {
    //   return {
    //     showSearch: true,
    //     placeholder: '请选择账号',
    //     api: getUserList,
    //     params: { limit: 999999, status: '1', userType: '1' },
    //     resultField: 'list',
    //     labelField: 'userName',
    //     valueField: 'uid',
    //     onChange: (e, v) => {
    //       console.log(e)
    //       formModel.merchantName = v.label
    //     },
    //   }
    // },
  },
  {
    field: 'merchantCode',
    label: '商家编号',
    component: 'Input',
    required: true,
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请输入商家唯一编号',
    },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    colProps: { span: 18 },
  },
  {
    label: '可用余额',
    field: 'availableBalanceNotify',
    helpMessage: '短信通知',
    required: true,
    colProps: { span: 22 },
    component: 'InputNumber',
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  {
    field: 'bindName',
    label: '负责人名称',
    component: 'Input',
    show: false,
  },
  {
    field: 'settleRate',
    label: '结算比例',
    defaultValue: 94,
    component: 'InputNumber',
    required: true,
    colProps: { span: 18 },
    componentProps: {
      addonAfter: '%',
    },
  },
  {
    field: 'loanSettleRate',
    label: '货款结算比例',
    component: 'InputNumber',
    // required: true,
    colProps: { span: 18 },
    componentProps: {
      addonAfter: '%',
    },
  },
  {
    labelWidth: 160,
    field: 'weekLoanSettleRate',
    label: '周付订单货款结算比例',
    component: 'InputNumber',
    required: true,
    colProps: { span: 22 },
    componentProps: {
      addonAfter: '%',
      // max: 100,
    },
  },
  {
    labelWidth: 160,
    field: 'monthLoanSettleRate',
    label: '月付订单货款结算比例',
    component: 'InputNumber',
    required: true,
    colProps: { span: 22 },
    componentProps: {
      addonAfter: '%',
      // max: 100,
    },
  },
  {
    labelWidth: 160,
    label: '结算提现金额门槛',
    field: 'withdrawLimit',
    required: true,
    colProps: { span: 22 },
    component: 'InputNumber',
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  // {
  //   field: 'password',
  //   label: '操作密码',
  //   component: 'InputPassword',
  //   colProps: { span: 18 },
  //   componentProps: {
  //     placeholder: '默认: Aa123456',
  //   },
  // },
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请输入姓名',
    },
  },
  {
    field: 'idCard',
    label: '身份证号',
    component: 'Input',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请输入身份证号',
    },
  },
  {
    field: 'realName',
    label: '开户名称',
    component: 'Input',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请输入开户名称',
    },
  },
  {
    field: 'bankName',
    label: '开户银行',
    component: 'Input',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请输入开户银行名称',
    },
  },
  {
    field: 'bankCardNo',
    label: '银行账号',
    component: 'Input',
    colProps: { span: 18 },
    componentProps: {
      placeholder: '请输入银行账号',
    },
  },
  // {
  //   field: 'status',
  //   label: '状态',
  //   component: 'RadioGroup',
  //   defaultValue: 0,
  //   colProps: { span: 24 },
  //   componentProps: {
  //     options: [
  //       { label: '启用', value: 0 },
  //       { label: '禁用', value: 1 },
  //     ],
  //   },
  // },
]

export const statusAllocationList = [
  {
    value: 801,
    label: '租赁生效中',
    color: 'green',
  },
  {
    value: 901,
    label: '已逾期',
    color: 'red',
  },
  {
    value: 1101,
    label: '已买断',
    color: 'green',
  },
  {
    value: 1201,
    label: '已完结',
    color: 'green',
  },
  {
    value: 1301,
    label: '取消订单',
    color: 'default',
  },
]

export const paidColumns: BasicColumn[] = [
  {
    title: '订单信息',
    dataIndex: 'orderSn',
    customRender: ({ record }) => {
      return h('div', {}, [
        h('span', {}, `订单编号: ${record.orderSn || '-'}`),
        h('br'),
        h('span', {}, `订单渠道: ${record.channelCode || '-'}`),
        h('br'),
        h('span', {}, `创建时间: ${record.createTime || '-'}`),
      ])
    },
  },
  {
    title: '用户信息',
    dataIndex: 'nickName',
    customRender: ({ record }) => {
      const gender = record.gender == 1 ? '女' : '男'
      return h('div', {}, [
        h('span', {}, `姓名: ${record.nickName || '-'}`),
        h('br'),
        h('span', {}, `性别: ${gender}`),
        h('br'),
        h('span', {}, `手机号: ${record.phone || '-'}`),
        h('br'),
        h('span', {}, `身份证号: ${record.idCard || '-'}`),
      ])
    },
  },
  {
    title: '商品信息',
    dataIndex: 'spuName',
    customRender: ({ record }) => {
      return h('div', {}, [
        h('span', {}, `商品名称: ${record.spuName || '-'}`),
        h('br'),
        h('span', {}, `商品规格: ${record.skuName || '-'}`),
      ])
    },
  },
  {
    title: '订单分配信息',
    dataIndex: 'ifOrder',
    fixed: 'right',
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
        h('span', {}, `操作时间:${record.receivtTime || '-'}`),
      ])
    },
  },
]

export const searchPaidFormSchema: FormSchema[] = [
  {
    field: 'orderSn',
    label: '订单编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'nickName',
    label: '姓名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'idCard',
    label: '身份证',
    component: 'Input',
    colProps: { span: 6 },
  },
  // {
  //   field: 'time',
  //   label: '分配时间',
  //   component: 'RangePicker',
  //   componentProps: {
  //     valueFormat: 'YYYY-MM-DD',
  //     placeholder: ['开始日期', '结束日期'],
  //   },
  //   colProps: { span: 10 },
  // },
  {
    field: 'timeSelect',
    label: '时间',
    defaultValue: '创建时间',
    fields: ['time'],
    component: 'Select',
    renderColContent({ model, field }) {
      return (
        <Input.Group compact>
          <Select allowClear style="width: 120px" v-model:value={model[field]}>
            <Select.Option value="创建时间">创建时间</Select.Option>
            <Select.Option value="分配时间">分配时间</Select.Option>
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

/**
 * 商家余额充值
 */
export const echargeFormSchema: FormSchema[] = [
  {
    label: '订单ID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '订单ID',
    field: 'orderId',
    component: 'Input',
    show: false,
  },
  {
    label: '商家名称',
    field: 'merchantCode',
    component: 'Select',
    required: true,
    colProps: { span: 18 },
  },
  {
    show: ({ values }) => values.merchantCode,
    label: '商家编号',
    field: 'merchantCode1',
    component: 'Select',
    colProps: { span: 18 },
    slot: 'merchantCode1',
  },
  {
    show: ({ values }) => values.merchantCode,
    label: '账户可用余额',
    field: 'availableBalance',
    component: 'Input',
    colProps: { span: 18 },
    slot: 'availableBalance',
  },
  {
    label: '本次充值金额',
    field: 'rechargeAmount',
    required: true,
    colProps: { span: 18 },
    component: 'InputNumber',
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
]
