import { getWarehouseList } from '/@/api/purchase/warehouse'
import { FormSchema } from '/@/components/Form'
import { cityArray3 } from '/@/utils/cityData3'
import { formatDecimal } from '/@/utils/tool'

/**
 * 发货 - 填写信息
 */
export const deliveryFormSchema: FormSchema[] = [
  {
    label: '订单ID',
    field: 'id',
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
    label: '计价方式',
    field: 'goodsLeaseType',
    component: 'Input',
    show: false,
  },
  {
    label: '发货方式',
    field: 'deliverMode',
    component: 'RadioGroup',
    defaultValue: '2',
    required: true,
    colProps: { span: 22 },
    componentProps: {
      options: [
        // {
        //   label: '物流发货',
        //   value: '1',
        // },
        {
          label: '线下自提',
          value: '2',
        },
        {
          label: '顺丰发货',
          value: '3',
        },
      ],
    },
  },
  // ============================ 1. 物流发货 ============================
  {
    ifShow: ({ values }) => ['1'].includes(values.deliverMode),
    label: '物流单号',
    field: 'deliverySn',
    component: 'Input',
    required: true,
    colProps: { span: 22 },
  },
  {
    ifShow: ({ values }) => ['1'].includes(values.deliverMode),
    label: '物流公司',
    field: 'deliveryCompany',
    component: 'Select',
    required: true,
    colProps: { span: 22 },
    componentProps: {
      fieldNames: {
        label: 'comName',
        value: 'comName',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    ifShow: ({ values }) => ['1'].includes(values.deliverMode),
    label: '设备IMEI',
    field: 'deliverySerialNumber',
    component: 'Input',
    required: true,
    colProps: { span: 22 },
  },
  {
    ifShow: ({ values }) => ['1'].includes(values.deliverMode),
    label: '日期时间',
    field: 'deliveryTime',
    component: 'DatePicker',
    required: true,
    colProps: { span: 22 },
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD hh:mm:ss',
    },
  },
  // {
  // ifShow: ({ values }) =>['1'].includes(values.deliverMode),
  //   label: '图片回执',
  //   field: 'receiptImage',
  //   component: 'Input',
  //   required: true,
  // colProps: { span: 22 },
  // },
  {
    ifShow: ({ values }) => ['1'].includes(values.deliverMode),
    label: '发货备注',
    field: 'remark',
    colProps: { span: 22 },
    component: 'InputTextArea',
  },
  // ============================ 2. 线下自提 ===========================
  // {
  //   ifShow: ({ values }) => values.deliverMode == '2',
  //   label: '付款方式:',
  //   field: 'mode',
  //   colProps: { span: 22 },
  //   component: 'Input',
  //   slot: 'mode',
  // },
  // {
  //   ifShow: ({ values }) => values.deliverMode == '2',
  //   label: '姓名',
  //   field: 'realName',
  //   colProps: { span: 22 },
  //   required: true,
  //   component: 'Input',
  // },
  // {
  //   ifShow: ({ values }) => values.deliverMode == '2',
  //   label: '付款账户',
  //   field: 'bankCardNo',
  //   colProps: { span: 22 },
  //   required: true,
  //   component: 'Input',
  // },
  // {
  //   ifShow: ({ values }) => values.deliverMode == '2',
  //   label: '开户银行',
  //   field: 'bankName',
  //   colProps: { span: 22 },
  //   required: true,
  //   component: 'Input',
  // },
  {
    ifShow: ({ values }) => values.deliverMode == '2' && values.goodsLeaseType == 4,
    label: '序列号',
    field: 'deliverySerialNumber2',
    colProps: { span: 11 },
    required: true,
    component: 'Input',
  },
  // ============================ 3. 顺丰发货 ===========================
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '',
    field: 't1',
    colProps: { span: 22 },
    component: 'Input',
    slot: 't1',
  },
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '寄件人', // 仓库编号
    field: 'warehouseNo',
    colProps: { span: 11 },
    required: true,
    component: 'ApiSelect',
    componentProps: ({ formModel }) => {
      return {
        showSearch: true,
        placeholder: '请选择寄件人',
        api: getWarehouseList,
        params: { limit: 999999 },
        resultField: 'list',
        labelField: 'name',
        valueField: 'warehouseNo',
        onChange: (e, v) => {
          console.log(e)
          formModel['senderPhone'] = v.phone
          formModel['senderAddress'] = [v.provinceName, v.cityName, v.boroughName]
          formModel['senderDetailAddress'] = v.address
        },
      }
    },
  },
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '手机号',
    field: 'senderPhone',
    colProps: { span: 11 },
    component: 'Input',
    componentProps: { disabled: true },
  },
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '寄件地址',
    field: 'senderAddress',
    required: true,
    component: 'Cascader',
    colProps: { span: 22 },
    componentProps: { options: cityArray3, disabled: true },
  },
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '详细地址',
    field: 'senderDetailAddress',
    colProps: { span: 22 },
    required: true,
    component: 'InputTextArea',
    componentProps: { disabled: true },
  },
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '',
    field: 't2',
    colProps: { span: 22 },
    component: 'Input',
    slot: 't2',
  },
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '收件人',
    field: 'receiverName',
    colProps: { span: 11 },
    required: true,
    component: 'Input',
  },
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '手机号',
    field: 'receiverPhone',
    colProps: { span: 11 },
    required: true,
    component: 'Input',
  },
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '收件地址',
    field: 'receiver',
    required: true,
    colProps: { span: 22 },
    component: 'Cascader',
    componentProps: { options: cityArray3, showSearch: true },
  },
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '收件详细地址',
    field: 'receiverDetailAddress',
    required: true,
    component: 'InputTextArea',
    colProps: { span: 22 },
  },
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '',
    field: 't3',
    colProps: { span: 22 },
    component: 'Input',
    slot: 't3',
  },
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '商品名称:',
    labelWidth: 78,
    field: 'goodsName',
    colProps: { span: 11 },
    component: 'Input',
    slot: 'goodsName',
  },
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '序列号',
    field: 'deliverySerialNumber3',
    colProps: { span: 11 },
    required: true,
    component: 'Input',
  },
  {
    ifShow: ({ values }) => values.deliverMode == '3',
    label: '供应商价格',
    field: 'supplierPrice',
    colProps: { span: 11 },
    defaultValue: 0,
    component: 'InputNumber',
    required: true,
    componentProps: {
      step: 0.01,
      formatter: (value) => formatDecimal(value),
      parser: (value) => formatDecimal(value),
      addonAfter: '元',
    },
  },
]
