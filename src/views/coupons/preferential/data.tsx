import { FormItem, Image, Input, InputNumber, Switch, Tag } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { formatDecimal, formatNumber } from '/@/utils/tool'
import { h } from 'vue'
import { spuTypeList } from '../../goods/goodsBase/data'
import { getCategoryTree } from '/@/api/goods/category'
import { useMessage } from '/@/hooks/web/useMessage'
import { updatePreferentialStatusItem } from '/@/api/coupons/preferential'

export const typesList = [
  { value: 1, label: '平台券' },
  { value: 2, label: '商品券' },
  { value: 3, label: '品类券' },
]
export const deductionTypeList = [
  { value: 1, label: '首付租金' },
  { value: 2, label: '账单租金' },
]
// 状态 0-禁用 1-正常
export const statusList = [
  { value: 1, label: '正常', color: 'green' },
  { value: 0, label: '禁用', color: 'red' },
]

export const discountTypeList = [{ value: 1, label: '抵扣', color: 'green' }]
export const getList = [
  { value: 1, label: '是' },
  { value: 0, label: '否' },
]

export const grantTypeList = [
  { value: 1, label: '平台领取' },
  { value: 2, label: '新用户注册(自动发放)' },
  { value: 3, label: '指定用户发放' },
]

// const platformList = [
//   { label: '全平台', value: 0 },
//   { label: 'APP', value: 1 },
//   { label: 'PC', value: 2 },
// ]

export const validityPeriodTypeList = [
  { value: 2, label: '固定日期' },
  { value: 1, label: '领取后' },
]

export const columns: BasicColumn[] = [
  {
    title: '优惠券名称',
    dataIndex: 'name',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '优惠券类型',
    width: 120,
    dataIndex: 'type',
    customRender: ({ text }) => {
      const find: any = typesList.find((v) => v.value == text)
      return find?.label || '-'
    },
  },
  {
    title: '优惠信息',
    dataIndex: 'discountType',
    width: 120,
    customRender: ({ record }) => {
      const discountFind = discountTypeList.find((v) => v.value == record.discountType)
      return (
        <>
          <div>
            <Tag color={discountFind?.color}>{discountFind?.label}</Tag>
            <div style={{ display: record.minPoint == 0 ? 'none' : 'block' }}>
              满{formatNumber(record.minPoint, 2)}减{formatNumber(record.faceValue, 2)}
            </div>
            <div style={{ display: record.minPoint == 0 ? 'block' : 'none' }}>无门槛</div>
          </div>
        </>
      )
    },
  },
  {
    title: '发放方式',
    dataIndex: 'grantType',
    width: 120,
    customRender: ({ text }) => {
      const find: any = grantTypeList.find((v) => v.value == text)
      return find?.label || '-'
    },
  },
  {
    title: '领取上限',
    dataIndex: 'perLimit',
    width: 100,
    customRender: ({ text }) => {
      const bool = text == -1 ? '无限制' : text
      return bool
    },
  },
  {
    title: '数量',
    dataIndex: 'circulation',
    width: 180,
    align: 'left',
    customRender: ({ record }) => {
      return (
        <>
          <div>发放数量: {record.circulation}</div>
          <div>领取数量: {record.distributedCount}</div>
          <div>剩余数量: {record.circulation - record.distributedCount}</div>
        </>
      )
    },
  },

  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    fiexd: 'rignt',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'status')) {
        record.status = false
      }
      return h(Switch, {
        checked: record.status === 1,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true
          const newStatus = checked ? 1 : 0
          const { createMessage } = useMessage()
          updatePreferentialStatusItem({ id: record.id, status: newStatus })
            .then(() => {
              record.status = newStatus
              createMessage.success(record.status === 1 ? `已启用` : '已禁用')
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
    title: '创建时间',
    width: 180,
    dataIndex: 'createTime',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '优惠券名称',
    labelWidth: 100,
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'type',
    label: '优惠券类型',
    labelWidth: 100,
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: typesList,
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: statusList,
    },
  },
  {
    field: 'time',
    label: '创建时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',

      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
]

export const userFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    show: false,
    field: 'disabled',
    label: '是否查看',
    component: 'Input',
  },
  {
    field: 'name',
    label: '优惠券名称',
    component: 'Input',
    required: true,
    colProps: { span: 16 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
      }
    },
  },
  {
    field: 'remark',
    label: '优惠券说明',
    component: 'Input',
    required: true,
    colProps: { span: 16 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
      }
    },
  },
  {
    field: 'type',
    label: '优惠券类型',
    component: 'RadioGroup',
    defaultValue: 1,
    required: true,
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
        options: typesList,
      }
    },
  },
  {
    ifShow: ({ values }) => values.type == 2,
    field: 'spuIds',
    label: '商品',
    component: 'Input',
    required: true,
    slot: 'spuIds',
  },
  {
    ifShow: ({ values }) => values.type == 3,
    field: 'applicationScope',
    label: '分类',
    component: 'Select',
    required: true,
    colProps: { span: 16 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
        options: spuTypeList,
      }
    },
  },
  {
    field: 'discountType',
    label: '抵扣',
    component: 'RadioGroup',
    defaultValue: 1,
    required: true,
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
        options: discountTypeList,
      }
    },
  },
  {
    field: 'deductionType',
    label: '抵扣账单',
    component: 'RadioGroup',
    defaultValue: 1,
    required: true,
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
        options: deductionTypeList,
      }
    },
  },
  {
    field: 'faceValue',
    label: '抵扣面额',
    component: 'InputNumber',
    required: true,
    colProps: { span: 16 },
    helpMessage: '请输入优惠金额，单位“元”',
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
        placeholder: '请输入',
        step: 0.01,
        min: 0,
        formatter: (value) => formatDecimal(value),
        parser: (value) => formatDecimal(value),
        addonBefore: '￥',
        addonAfter: '元',
      }
    },
  },
  {
    field: 'minPoint',
    label: '满多少可用',
    component: 'InputNumber',
    required: true,
    colProps: { span: 16 },
    helpMessage: '不可填“0”且不可小于「抵扣面额」',
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
        placeholder: '请输入',
        step: 0.01,
        min: 0.01,
        formatter: (value) => formatDecimal(value),
        parser: (value) => formatDecimal(value),
        addonBefore: '￥',
        addonAfter: '元',
      }
    },
  },
  {
    field: 'grantType',
    label: '发放设置',
    component: 'RadioGroup',
    defaultValue: 1,
    required: true,
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
        options: grantTypeList,
      }
    },
  },
  {
    ifShow: ({ values }) => values.grantType == 3,
    field: 'uid',
    label: '用户名字',
    component: 'Input',
    slot: 'uid',
  },
  {
    field: 'ifUserReceive',
    label: '存在逾期单是否可领',
    component: 'RadioGroup',
    defaultValue: 1,
    required: true,
    colProps: { span: 24 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
        options: getList,
      }
    },
  },

  {
    field: 'circulation',
    label: '发行数量',
    component: 'InputNumber',
    required: true,
    helpMessage: '发放数量，没有之后不能领取或发放，-1为不限制',
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
        placeholder: '请输入',
        addonAfter: '张',
      }
    },
  },
  {
    field: 'perLimit',
    label: '每人限领数量',
    component: 'InputNumber',
    required: true,
    helpMessage: '设置为-1时,可无限领取',
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
        placeholder: '请输入',
        addonAfter: '张',
      }
    },
  },
  {
    field: 'status',
    label: '状态',
    defaultValue: 1,
    required: true,
    component: 'RadioGroup',
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
        options: statusList,
      }
    },
  },
  {
    field: 'validityPeriodType',
    label: '有效期类型',
    defaultValue: 2,
    required: true,
    component: 'RadioGroup',
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
        options: validityPeriodTypeList,
      }
    },
  },
  {
    ifShow: ({ values }) => values.validityPeriodType == 2,
    field: 'validityTime',
    label: '固定日期',
    required: true,
    component: 'RangePicker',
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
        showTime: true,
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        placeholder: ['开始日期', '结束日期'],
      }
    },
  },
  {
    // 用于储存 validityDaysMax 数据
    ifShow: ({ values }) => values.validityPeriodType == 1,
    show: false,
    field: 'validityDaysMax',
    label: '最大值',
    component: 'InputNumber',
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        disabled: formModel.disabled,
      }
    },
  },
  {
    ifShow: ({ values }) => values.validityPeriodType == 1,
    label: '时效',
    field: 'validityDaysMin',
    fields: ['validityDaysMax'],
    required: true,
    component: 'Input',
    helpMessage: '最小值为0,则今天生效',
    colProps: { span: 24 },
    render({ model, field }) {
      return (
        <Input.Group
          compact
          style={{ display: 'flex !important', alignItems: 'center !important' }}
        >
          <div style={{ 'margin-right': '10px', border: 'none' }}>第</div>
          <InputNumber
            disabled={model['disabled']}
            style={{ width: '120px !important' }}
            allowClear
            placeholder="请输入最小值"
            v-model:value={model[field]}
          />
          <div style={{ margin: '0 10px', border: 'none' }}>至</div>
          <FormItem
            style={{ margin: '0 !important' }}
            name="validityDaysMax"
            rules={[{ required: true, message: '请输入最大值' }]}
          >
            <InputNumber
              disabled={model['disabled']}
              style={{ width: '120px !important' }}
              placeholder="请输入最大值"
              defaultValue={model['validityDaysMax']}
              v-model:value={model['validityDaysMax']}
            />
          </FormItem>
          <div style={{ 'margin-left': '10px' }}>天有效值</div>
        </Input.Group>
      )
    },
  },
]

export const checkColumns: BasicColumn[] = [
  {
    title: '优惠券码',
    dataIndex: 'couponCode',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '优惠券名称',
    dataIndex: 'couponName',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '优惠券类型',
    width: 120,
    dataIndex: 'couponType',
    customRender: ({ text }) => {
      const find: any = typesList.find((v) => v.value == text)
      return find?.label || '-'
    },
  },
  {
    title: '面值(元)',
    dataIndex: 'faceValue',
    width: 120,
    customRender: ({ text }) => formatNumber(text, 2) || '-',
  },
  {
    title: '订单编号',
    dataIndex: 'orderSn',
    width: 150,
  },
  {
    title: '昵称',
    dataIndex: 'unickname',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    fixed: 'right',
    customRender: ({ text }) => {
      const find: any = statusList.find((v) => v.value == text)
      return h(Tag, { color: find?.color || '' }, find?.label || '-')
    },
  },
]

export const goodsColumns: BasicColumn[] = [
  {
    title: '商品编号',
    dataIndex: 'id',
    width: 100,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '图片',
    width: 50,
    dataIndex: 'pic',
    customRender: ({ text }) => h(Image, { src: text }),
  },
  {
    title: '分类',
    dataIndex: 'categoryName',
    width: 120,
  },
]

export const searchGoodsFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '商品名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'categoryId',
    label: '分类',
    component: 'ApiTreeSelect',
    colProps: { span: 8 },
    componentProps: {
      showSearch: true,
      placeholder: '请选择',
      api: getCategoryTree,
      fieldNames: {
        label: 'name',
        value: 'id',
        key: 'id',
      },
    },
  },
]
