import { h } from 'vue'
import { DescItem } from '/@/components/Description/index'
import { Button, FormItem, Input, Select, Tag } from 'ant-design-vue'
import dayjs from 'dayjs'
import { BasicColumn, FormSchema } from '/@/components/Table'
import { cityArray } from '/@/utils/cityData'
import { cloneDeep } from 'lodash-es'
import { getSalespersonStoreList } from '/@/api/business/salesperson'
import { statusList } from '../../../utils'
import { EditOutlined } from '@ant-design/icons-vue'
import { usePermission } from '/@/hooks/web/usePermission'
import { cityArray3 } from '/@/utils/cityData3'
import { uploadApi } from '/@/api/sys/upload'
import { getStoreList } from '/@/api/business/store'
import { getOperatorStoreList } from '/@/api/business/operator'
import { phoneStatasList } from './components/contacts/contactsTable'
import { getLegalChannelsList } from '/@/api/collection/legalChannels'
import { getProsecuteList } from '/@/api/collection/task'
const { hasPermission } = usePermission()

// 工作类型
export const workTypeList = [
  { label: '无业', value: '无业' },
  { label: '学生', value: '学生' },
  { label: '个体经营', value: '个体经营' },
  { label: '普通员工', value: '普通员工' },
  { label: '日结工种', value: '日结工种' },
  { label: '夜场', value: '夜场' },
  { label: '外卖/快递', value: '外卖/快递' },
  { label: '其他', value: '其他' },
]
// 收入方式
export const incomeModeList = [
  { label: '现金', value: '现金' },
  { label: '银行卡', value: '银行卡' },
  { label: '微信/支付宝', value: '微信/支付宝' },
]
const cityDatas = cloneDeep(cityArray)
cityDatas.forEach((v) => {
  v.children = v.children.map((c) => {
    return {
      ...c,
      children: [],
    }
  })
})

export const personSchema = (other: any): DescItem[] => {
  return [
    {
      field: 'nickName',
      label: '用户姓名',
      ifHide: !hasPermission('orderDetail_nickName'),
      render: (value, data) => {
        const gender = data.gender == 1 ? '女' : '男'
        let ageSpan
        if (data.birthday) {
          const age = Number(dayjs().format('YYYY')) - Number(dayjs(data.birthday).format('YYYY'))
          ageSpan = h(Tag, { color: 'green' }, age)
        }
        return h('div', {}, [
          h('span', {}, value),
          h(Tag, { color: 'green', style: { margin: '0 6px' } }, gender),
          ageSpan,
        ])
      },
    },
    {
      field: 'phone',
      label: '手机号',
      ifHide: !hasPermission('orderDetail_phone'),
      render: (value) => {
        return (
          <div class="flex items-center">
            <span>{value || '-'}</span>
            <Button
              size="small"
              type="primary"
              style={{ marginLeft: '10px' }}
              onClick={() => other.handleUpdatePhoneStatus(value)}
            >
              更新号码状态
            </Button>
          </div>
        )
      },
    },
    {
      field: 'applyState',
      label: '实名认证',
      render: (value) => h(Tag, { color: value ? 'green' : 'red' }, value ? '已认证' : '未认证'),
    },
    {
      field: 'channelCode',
      label: '注册渠道',
      render: (value) => value || '-',
    },
    {
      field: 'riskNewCalInfo.onlineDescription',
      label: '入网时长',
      render: (value) => value || '-',
    },
    {
      field: 'riskNewCalInfo.fnmDescription',
      label: '运营商三要素',
      render: (value) => value || '-',
    },
    {
      field: 'lipReadingDetectionList',
      label: '活体认证',
      render: (value) => {
        const len = (value && value.length) || 0
        return h(Tag, { color: len ? 'green' : 'red' }, len ? '已认证' : '未认证')
      },
      span: 1,
    },
    {
      field: 'phoneStatus',
      label: '号码状态',
      render: (value) => {
        const find = phoneStatasList.find((v) => v.value == value)
        return h(Tag, { color: find?.color }, find?.label)
      },
      span: 2,
    },
    {
      field: 'idCard',
      label: '身份证号',
      ifHide: !hasPermission('orderDetail_idCard'),
    },
    {
      field: 'birthday',
      label: '身份证出生日期',
      ifHide: !hasPermission('orderDetail_idCard'),
      render: (value) => (value && dayjs(value).format('YYYY-MM-DD')) || '-',
    },
    {
      field: 'timeLimit',
      label: '身份证有效期',
      ifHide: !hasPermission('orderDetail_idCard'),
      render: (value) => {
        if (!value) return '-'
        const dateList = value.split('-')
        // yyyymmdd 转 yyyy-mm-dd
        const handleDate = (date) => date.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1年$2月$3日')
        return `${handleDate(dateList[0])} - ${handleDate(dateList[1])}`
      },
    },
    {
      field: 'province',
      label: '身份证地址',
      ifHide: !hasPermission('orderDetail_idCard'),
      render: (value, data) => {
        return `${value || ''}${data.city || ''}${data.district || ''}` || '-'
      },
    },
    {
      field: 'workType',
      label: '工作类型',
      ifHide: !hasPermission('orderDetail_workType'),
      render: (value) => {
        return (
          <>
            <div class="flex items-center">
              <span>{value || '-'}</span>
              <EditOutlined
                style={{
                  marginLeft: '10px',
                  color: '#3ca2fc',
                  display: hasPermission('OrderDetailEditModal') ? 'block' : 'none',
                }}
                class="cursor-point"
                onClick={() => other.handleUserWordModal('workType')}
              />
            </div>
          </>
        )
      },
    },
    {
      field: 'incomeMode',
      label: '收入方式',
      ifHide: !hasPermission('orderDetail_incomeMode'),
      render: (value) => {
        return (
          <>
            <div class="flex items-center">
              <span>{value || '-'}</span>
              <EditOutlined
                style={{
                  marginLeft: '10px',
                  color: '#3ca2fc',
                  display: hasPermission('OrderDetailEditModal') ? 'block' : 'none',
                }}
                class="cursor-point"
                onClick={() => other.handleUserWordModal('incomeMode')}
              />
            </div>
          </>
        )
      },
    },
  ].filter((item: any) => !item?.ifHide)
}

/**
 * 修改紧急联系人
 */
export const updateContact: FormSchema[] = [
  {
    label: 'ID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: 'orderId',
    field: '订单id',
    component: 'Input',
    show: false,
  },
  {
    label: '订单Id',
    field: 'orderId',
    component: 'Input',
    show: false,
  },
]

/**
 * 修改渠道
 */
export const updateChannel: FormSchema[] = [
  {
    label: '订单Id',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '渠道',
    field: 'channelCode',
    required: true,
    component: 'Input',
  },
]

/**
 * 修改审核人员
 */
export const updateAuditSchema: FormSchema[] = [
  {
    label: '审核ID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '订单Id',
    field: 'orderId',
    component: 'Input',
    show: false,
  },
  {
    label: '风控审核',
    field: 'operatorId',
    component: 'ApiSelect',
    colProps: { span: 22 },
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getOperatorStoreList,
      params: { pageSize: 999999, cursor: 999999 },
      resultField: 'list',
      labelField: 'userName',
      valueField: 'uid',
    },
  },
]

/**
 * 修改收货
 */
export const updateDelivery: FormSchema[] = [
  {
    label: '订单Id',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '是否显示串号',
    field: 'isOneSerial',
    component: 'Input',
    show: false,
  },
  {
    ifShow: ({ values }) => {
      return values.isOneSerial
    },
    label: '串号',
    field: 'deliverySerialNumber',
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    ifShow: ({ values }) => {
      return !values.isOneSerial
    },
    label: '收件人',
    field: 'receiverName',
    required: true,
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    ifShow: ({ values }) => {
      return !values.isOneSerial
    },
    label: '手机号',
    field: 'receiverPhone',
    required: true,
    component: 'Input',
    colProps: { span: 22 },
  },
  {
    ifShow: ({ values }) => {
      return !values.isOneSerial
    },
    label: '收货地区',
    field: 'address',
    required: true,
    component: 'Cascader',
    componentProps: { options: cityArray3 },
    colProps: { span: 22 },
  },
  {
    ifShow: ({ values }) => {
      return !values.isOneSerial
    },
    label: '详细地址',
    field: 'receiverDetailAddress',
    required: true,
    component: 'InputTextArea',
    colProps: { span: 22 },
  },
]

/**
 * 修改备注
 */
export const updateRemark: FormSchema[] = [
  {
    label: '订单Id',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    show: false,
    label: '类型名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 22 },
  },
  // {
  //   ifShow: ({ values }) => {
  //     return values.name == 'salesperson'
  //   },
  //   label: '业务员',
  //   field: 'salesperson',
  //   component: 'Input',
  //   colProps: { span: 22 },
  // },
  {
    ifShow: ({ values }) => {
      return values.name == 'salesperson'
    },
    label: '业务员',
    field: 'salespersonId',
    component: 'ApiSelect',
    colProps: { span: 22 },
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getSalespersonStoreList,
      params: { pageSize: 999999, cursor: 999999 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    ifShow: ({ values }) => {
      return values.name == 'storeMerchantName'
    },
    label: '门店商家名称',
    field: 'storeMerchantId',
    colProps: { span: 22 },
    component: 'ApiSelect',
    componentProps: {
      showSearch: true,
      placeholder: '请选择门店',
      api: getStoreList,
      params: { limit: 999999, pageSize: 999999 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    ifShow: ({ values }) => {
      return values.name == 'salesmanGuarantee'
    },
    labelWidth: 120,
    field: 'salesmanGuarantee',
    label: '业务员担保',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    required: true,
    colProps: { span: 10 },
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
  {
    ifShow: ({ values }) => {
      return values.name == 'remark'
    },
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 22 },
  },
  {
    ifShow: ({ values }) => {
      return values.name == 'ipCity'
    },
    label: '订单归属地区',
    field: 'ipCity',
    required: true,
    labelWidth: '200px',
    colProps: { span: 22 },
    component: 'Cascader',
    componentProps: { options: cityDatas, showSearch: true },
  },
  {
    ifShow: ({ values }) => {
      return values.name == 'prosecuteStatus'
    },
    label: '起诉进度',
    field: 'prosecuteStatus',
    colProps: { span: 22 },
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getProsecuteList,
      params: { cursor: 999999, status: 1 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'code',
    },
  },
  {
    ifShow: ({ values }) => {
      return values.name == 'prosecuteStatus'
    },
    label: '法诉渠道',
    field: 'lawsuitId',
    colProps: { span: 22 },
    component: 'ApiSelect',
    required: true,
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getLegalChannelsList,
      params: { cursor: 999999, status: 1 },
      resultField: 'list',
      labelField: 'name',
      valueField: 'id',
    },
  },
  {
    ifShow: ({ values }) => {
      return values.name == 'prosecuteStatus' && values.prosecuteStatus == 1
    },
    label: '上传材料',
    field: 'prosecuteFiles',
    component: 'Upload',
    colProps: { span: 22 },
    componentProps: {
      api: uploadApi,
      showPreviewProps: true,
    },
  },
  {
    ifShow: ({ values }) => {
      return values.name == 'needEsnotary'
    },
    label: '办理公证',
    field: 'needEsnotary',
    required: true,
    colProps: { span: 22 },
    component: 'RadioButtonGroup',
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
]

/**
 * 取消
 */
export const skuNameFormSchema: FormSchema[] = [
  {
    label: '订单ID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '规格(颜色): ',
    field: 'specsValue',
    component: 'Select',
    colProps: { span: 18 },
  },
  {
    label: '规格(内存): ',
    field: 'sku',
    component: 'Input',
    colProps: { span: 18 },
    slot: 'sku',
  },
  {
    label: '',
    field: 'skuName',
    component: 'Input',
    colProps: { span: 18 },
    slot: 'skuName',
  },
]
// orderHistoryColumns

export const orderHistoryColumns: BasicColumn[] = [
  {
    title: '订单编号',
    dataIndex: 'orderSn',
    width: 150,
    customRender: ({ text, record }) => {
      const find: any = statusList.find((v) => v.value == record.status)
      return (
        <>
          <div>{text}</div>
          <div>
            <Tag color={find?.color || ''}>{find?.label}</Tag>
          </div>
        </>
      )
    },
  },
  {
    title: '姓名/性别/手机号',
    width: 130,
    customRender: ({ record }) => {
      const gender = record.gender == 1 ? '女' : '男'
      return h('div', { textAlign: 'center' }, [
        h('span', {}, `${record.nickName || '-'} ${gender}`),
        h('br'),
        h('span', {}, record.phone || '-'),
      ])
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
]
/**
 * 银行卡信息表格
 */
export const bindCardTableColumn: BasicColumn[] = [
  {
    title: '银行卡信息',
    dataIndex: 'bankName',
  },
  {
    title: '银行卡号',
    dataIndex: 'bankCardNo',
  },
]

/**
 * 没有银行卡
 * 填写备注
 * 修改状态
 */
export const bindCardForm: FormSchema[] = [
  {
    label: '订单Id',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '订单状态',
    field: 'status',
    component: 'Input',
    show: false,
  },
  {
    label: '备注',
    labelWidth: 50,
    field: 'remark',
    required: true,
    component: 'InputTextArea',
    colProps: { span: 22 },
  },
]

/**
 * 修改 工作类型/收入方式
 */
export const updateUserWorl: FormSchema[] = [
  {
    label: 'id',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: 'uid',
    field: 'uid',
    component: 'Input',
    show: false,
  },
  {
    label: '类型',
    field: 'type',
    component: 'Input',
    show: false,
  },
  {
    ifShow: ({ values }) => values.type == 'workType',
    label: '工作类型',
    field: 'workType',
    fields: ['workTypeInput'],
    required: true,
    component: 'Input',
    colProps: { span: 20 },
    render({ model, field }) {
      return (
        <Input.Group compact>
          <Select
            style="width: 120px"
            allowClear
            placeholder="请选择"
            v-model:value={model[field]}
            onChange={() => (model['workTypeInput'] = '')}
          >
            {workTypeList.map((v) => {
              return <Select.Option value={v.value}>{v.value}</Select.Option>
            })}
          </Select>
          <FormItem
            style={{ display: model[field] == '其他' ? 'inline-block' : 'none' }}
            name="workTypeInput"
            rules={[{ required: model[field] == '其他', message: '请输入工作类型' }]}
          >
            <Input placeholder="请输入" v-model:value={model['workTypeInput']} />
          </FormItem>
        </Input.Group>
      )
    },
  },
  {
    ifShow: ({ values }) => values.type == 'incomeMode',
    label: '收入方式',
    field: 'incomeMode',
    required: true,
    component: 'Select',
    colProps: { span: 20 },
    componentProps: {
      options: incomeModeList,
    },
  },
]

/**
 * 上传合同
 */
export const uploadContractFormSchema: FormSchema[] = [
  {
    label: '订单ID',
    field: 'orderId',
    component: 'Input',
    show: false,
  },
  {
    label: 'uid',
    field: 'uid',
    component: 'Input',
    show: false,
  },
  {
    label: '上传附件',
    field: 'uploadFiles',
    component: 'Upload',
    colProps: { span: 20 },
    componentProps: {
      api: uploadApi,
      showPreviewProps: true,
    },
  },
]
