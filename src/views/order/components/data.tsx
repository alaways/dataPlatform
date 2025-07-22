import { h } from 'vue'
import { FormSchema } from '/@/components/Table'
import { formatDecimal } from '/@/utils/tool'
import { cityArray } from '/@/utils/cityData'
import { cloneDeep } from 'lodash-es'
import { getSalespersonStoreList } from '/@/api/business/salesperson'
import { FormItem, Input, Select } from 'ant-design-vue'
import { incomeModeList, workTypeList } from '../orderDetail/components/detail/data'
import { bizTypeAll } from '../../finance/stream/components/data'
import { getStoreList } from '/@/api/business/store'
import { userLevelOptions } from '../all/data'

const cityDatas = cloneDeep(cityArray)
cityDatas.forEach((v) => {
  v.children = v.children.map((c) => {
    return {
      ...c,
      children: [],
    }
  })
})
export const bizTypeList = bizTypeAll.filter((v) => v.label.indexOf('线下入账') != -1)
/**
 * 审核信息 - 填写信息
 */
export const examineFormSchema: FormSchema[] = [
  {
    label: 'ID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: 'orderId',
    field: 'orderId',
    component: 'Input',
    show: false,
  },
  {
    field: 'status',
    label: '订单状态',
    component: 'Input',
    show: false,
  },
  {
    field: 'creditStatus',
    label: '机审审核',
    component: 'RadioButtonGroup',
    required: true,
    ifShow: ({ values }) => {
      return values.status == 103 // 机审拒绝展示
    },
    suffix: '注：机审不通过订单，仅修改机审结果为通过,后方再人审通过，请谨慎操作',
    componentProps: {
      options: [
        { label: '通过', value: 401 },
        { label: '不通过', value: 103 },
      ],
    },
  },
  {
    field: 'state',
    label: '人审审核',
    component: 'RadioButtonGroup',
    required: true,
    colProps: { span: 11 },
    ifShow: ({ values }) => {
      return values.creditStatus != 103 // 机审拒绝展示
    },
    componentProps: {
      options: [
        { label: '通过', value: 401 },
        { label: '不通过', value: 202 },
      ],
    },
  },
  {
    ifShow: ({ values }) => values.state != 202,
    label: '用户下单IP',
    field: 'ipCity',
    required: true,
    colProps: { span: 9 },
    component: 'Cascader',
    componentProps: { options: cityDatas, showSearch: true },
  },
  {
    ifShow: ({ values }) => values.state != 202,
    label: '合同甲方公司名称',
    field: 'sealId',
    labelWidth: 130,
    required: true,
    colProps: { span: 10 },
    component: 'Select',
  },
  {
    ifShow: ({ values }) => values.state != 202,
    label: '门店商家名称',
    labelWidth: 150,
    field: 'storeMerchantId',
    required: true,
    colProps: { span: 10 },
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
  // {
  //   label: '业务员',
  //   field: 'salesperson',
  //   required: true,
  //   colProps: { span: 22 },
  //   component: 'Input',
  // },
  {
    ifShow: ({ values }) => values.state != 202,
    label: '业务员',
    field: 'salespersonId',
    component: 'ApiSelect',
    required: true,
    colProps: { span: 8 },
    componentProps: ({ formModel, formActionType }) => {
      return {
        showSearch: true,
        placeholder: '请选择',
        api: getSalespersonStoreList,
        params: { pageSize: 999999, cursor: 999999, status: 1, ignoreChild: 2 },
        resultField: 'list',
        labelField: 'name',
        valueField: 'id',
        onChange: (e, v) => {
          console.log(e)
          if (v.province) {
            formModel.salespersonCity = [v.province, v.city]
            formActionType.updateSchema({
              field: 'salespersonCity',
              componentProps: { disabled: true, options: cityDatas, showSearch: true },
            })
          } else {
            formModel.salespersonCity = []
            formActionType.updateSchema({
              field: 'salespersonCity',
              componentProps: { disabled: false, options: cityDatas, showSearch: true },
            })
          }
        },
        // onBlue: (e) => {
        //   const len = formModel.salespersonCity && formModel.salespersonCity.length
        //   if (e && !len) {
        //     formModel.salespersonCity = [e.province, e.city]
        //     formActionType.updateSchema({
        //       field: 'salespersonCity',
        //       componentProps: { disabled: true, options: cityDatas, showSearch: true },
        //     })
        //   }
        // },
      }
    },
  },
  {
    ifShow: ({ values }) => values.state != 202,
    label: '业务员所属地区',
    labelWidth: 150,
    field: 'salespersonCity',
    component: 'Cascader',
    required: true,
    colProps: { span: 10 },
    componentProps: {
      options: cityDatas,
      showSearch: true,
    },
  },
  {
    ifShow: ({ values }) => values.state != 202,
    labelWidth: 120,
    field: 'salesmanGuarantee',
    label: '业务员担保',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    required: true,
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
  {
    ifShow: ({ values }) => values.state != 202,
    label: '货款',
    labelWidth: 50,
    field: 'loanMoney',
    required: true,
    colProps: { span: 7 },
    component: 'InputNumber',
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  {
    ifShow: ({ values }) => values.state != 202,
    label: '业务员提成',
    labelWidth: 120,
    field: 'royaltyFee',
    required: true,
    colProps: { span: 9 },
    component: 'InputNumber',
    defaultValue: 300,
    componentProps: {
      // disabled: true,
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  {
    ifShow: ({ values }) => values.state != 202,
    label: '商家返点',
    labelWidth: 120,
    field: 'rebateFee',
    required: true,
    colProps: { span: 8 },
    component: 'InputNumber',
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
  // {
  //   label: '所属政策地区',
  //   field: 'city',
  //   labelWidth: 152,
  //   required: true,
  //   colProps: { span: 12 },
  //   component: 'Cascader',
  //   componentProps: { options: cityDatas },
  // },
  // {
  //   label: '是否含锁费',
  //   field: 'lockFeeSwitch',
  //   required: true,
  //   colProps: { span: 6 },
  //   defaultValue: false,
  //   component: 'Switch',
  // },
  // {
  //   ifShow: ({ values }) => !values.lockFeeSwitch,
  //   label: '',
  //   field: 'lockFee',
  //   required: true,
  //   colProps: { span: 6 },
  //   component: 'InputNumber',
  // },
  {
    ifShow: ({ values }) => values.state != 202,
    label: '用户评级',
    field: 'userLevel',
    required: true,
    colProps: { span: 8 },
    component: 'Select',
    helpMessage: 'R1最优,R7最差,以此类推',
    componentProps: {
      options: userLevelOptions,
    },
  },
  {
    ifShow: ({ values }) => values.state == 202,
    label: '用户评级',
    field: 'userLevel1',
    colProps: { span: 8 },
    helpMessage: 'R1最优,R7最差,以此类推',
    component: 'Select',
    componentProps: {
      options: userLevelOptions,
    },
  },
  {
    ifShow: ({ values }) => values.state != 202,
    label: '审核原因',
    required: true,
    field: 'showReason', // 原-内部原因
    component: 'InputTextArea',
    colProps: { span: 22 },
  },
  {
    ifShow: ({ values }) => values.state == 202,
    label: '审核原因',
    field: 'showReason1', // 原-内部原因
    component: 'InputTextArea',
    colProps: { span: 22 },
  },
  {
    ifShow: ({ values }) => false && values.state != 202,
    label: '',
    field: 'esnotaryTxt',
    colProps: { span: 24 },
    component: 'Input',
    slot: 'esnotaryTxt',
  },
  {
    ifShow: ({ values }) => false && values.state != 202,
    labelWidth: 150,
    field: 'needEsnotary',
    label: '是否办理公证签署',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    required: true,
    colProps: { span: 7 },
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
  {
    ifShow: ({ values }) => values.state != 202,
    label: '',
    field: 'workTxt',
    colProps: { span: 24 },
    component: 'Input',
    slot: 'workTxt',
  },
  {
    ifShow: ({ values }) => values.state != 202,
    label: '工作类型',
    field: 'workType',
    fields: ['workTypeInput'],
    required: true,
    component: 'Input',
    colProps: { span: 12 },
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
    ifShow: ({ values }) => values.state != 202,
    label: '收入方式',
    field: 'incomeMode',
    required: true,
    component: 'Select',
    colProps: { span: 8 },
    componentProps: {
      options: incomeModeList,
    },
  },
]
/**
 * 操作密码 - 填写信息
 */
export const passwordFormSchema: FormSchema[] = [
  {
    label: '操作密码',
    field: 'password',
    component: 'InputPassword',
    required: true,
  },
]
/**
 * 线下付款 - 填写信息
 * 具体条件，可以看 README
 */
export const paidFormSchema: FormSchema[] = [
  {
    label: '订单ID',
    field: 'orderId',
    component: 'Input',
    show: false,
  },
  {
    label: '订单编号',
    field: 'orderSn',
    component: 'Input',
    show: false,
  },
  {
    label: '用户uid',
    field: 'uid',
    component: 'Input',
    show: false,
  },
  {
    label: '首次支付金额 - 自定义',
    field: 'downPayAmounts',
    component: 'InputNumber',
    show: false,
  },
  {
    label: '账单编号',
    field: 'billItemSn',
    component: 'Input',
    show: false,
  },
  {
    label: '账单编号',
    field: 'billItemSn',
    component: 'Input',
    show: false,
  },
  {
    label: '支付类型',
    field: 'payType',
    component: 'Select',
    defaultValue: 0,
    show: false,
    componentProps: {
      options: [
        { label: '正常支付', value: 0 },
        { label: '买断支付', value: 1 },
        { label: '部分减免', value: 2 },
      ],
    },
  },
  {
    // 0.显示收款方式可以切换 1.只有线下收款 2.只有二维码收款
    label: '收款方式显示方式',
    field: 'payShow',
    component: 'Input',
    show: false,
  },
  {
    show: false,
    label: '是否有含首付',
    field: 'isSourceType',
    component: 'Input',
  },
  {
    ifShow: ({ values }) => values.payType != 1 && !values.isSourceType,
    label: '',
    field: 'isDiscount',
    component: 'Input',
    defaultValue: 'pay',
    slot: 'isDiscount',
    colProps: { span: 24 },
  },
  {
    show: ({ values }) => values.payShow == 0 || !values.payShow,
    label: '收款方式',
    field: 'payment',
    component: 'RadioGroup',
    defaultValue: '0',
    required: true,
    colProps: { span: 22 },
  },
  {
    label: '线下收款金额',
    field: 'totalAmount',
    component: 'InputNumber',
    colProps: { span: 15 },
    suffix: '元',
    componentProps: ({ formModel, formActionType }) => {
      return {
        step: 0.01,
        min: 0,
        onChange: async () => {
          console.log(formModel)
          const { updateSchema } = formActionType
          updateSchema({
            field: 'payCode',
            render: () => h('div', {}, ''),
            colProps: { span: 6 },
          })
        },
      }
    },
  },
  {
    ifShow: ({ values }) => values.payType == 1 && values.isSourceType,
    label: '实际收款备注',
    field: 'billRemarks',
    // required: true,
    component: 'InputTextArea',
    colProps: { span: 22 },
  },
  {
    label: '押金显示',
    field: 'isDepositShow',
    component: 'Input',
    show: false,
  },
  // {
  //   ifShow: ({ values }) => values.isDepositShow == 1,
  //   label: '押金',
  //   field: 'deposit',
  //   component: 'Input',
  //   colProps: { span: 22 },
  //   slot: 'deposit',
  // },
  // {
  //   ifShow: ({ values }) => values.isDepositShow == 1,
  //   label: '押金抵扣最后账单',
  //   field: 'ifDeduct',
  //   component: 'RadioGroup',
  //   defaultValue: 1,
  //   required: true,
  //   colProps: { span: 22 },
  //   componentProps: {
  //     options: [
  //       { label: '是', value: 1 },
  //       { label: '否', value: 0 },
  //     ],
  //   },
  // },
  {
    show: false,
    label: '是否确认收款',
    field: 'status',
    component: 'RadioGroup',
    defaultValue: '1',
    required: true,
    colProps: { span: 22 },
    componentProps: {
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
      ],
    },
  },
  {
    label: '收款渠道',
    field: 'paymentChannels',
    ifShow: ({ values }) => values.payment == '1',
    component: 'RadioGroup',
    required: true,
    defaultValue: '0',
    colProps: { span: 22 },
  },
  {
    show: ({ values }) => values.payment == 0,
    label: '交易单号',
    field: 'tradeNo',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    ifShow: ({ values }) => values.payment == 0,
    label: '支付来源',
    field: 'bizType',
    component: 'Select',
    required: true,
    colProps: { span: 20 },
    componentProps: {
      options: bizTypeList,
    },
  },
  {
    label: '支付时间',
    field: 'payTime',
    component: 'DatePicker',
    ifShow: ({ values }) => values.payment == 0,
    required: true,
    colProps: { span: 22 },
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '收款二维码',
    field: 'payCode',
    ifShow: ({ values }) => values.payment == '1',
    component: 'Input',
    render: () => h('div', {}, ''),
    colProps: { span: 6 },
  },
  {
    label: '',
    field: 'getCode',
    ifShow: ({ values }) => values.payment == '1',
    component: 'Input',
    slot: 'getCode',
  },
  {
    label: '',
    field: 'text',
    component: 'Input',
    render: ({ values }) => {
      let context = '输入收款金额可以生成收款二维码让客户微信或支付宝付款，账单会自动更新'
      if (values.payType == 1) {
        context = '实际买断金额应与用户确认协商，确认买断后则订单完结请谨慎操作'
      }
      return h('div', { style: { color: 'red', padding: '0 30px' } }, [
        h('div', {}, '温馨提示：'),
        h('div', {}, context),
      ])
    },
  },
]

/**
 * 分配 - 填写信息
 */
export const allocationFormSchema: FormSchema[] = [
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
    label: '分配商家',
    field: 'merchantCode',
    component: 'Select',
    required: true,
    colProps: { span: 20 },
  },
]

/**
 * 取消
 */
export const cancleFormSchema: FormSchema[] = [
  {
    label: '订单ID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '',
    field: 'record',
    component: 'Input',
    colProps: { span: 20 },
    slot: 'record',
  },
  {
    label: '取消原因: ',
    field: 'closeRemark',
    component: 'InputTextArea',
    required: true,
    colProps: { span: 20 },
  },
]
