import { userLevelOptions } from '../../all/data'
import { getSalespersonStoreList } from '/@/api/business/salesperson'
import { FormSchema } from '/@/components/Table'
import { cityArray } from '/@/utils/cityData'
import { cloneDeep } from 'lodash-es'

const cityDatas = cloneDeep(cityArray)
cityDatas.forEach((v) => {
  v.children = v.children.map((c) => {
    return {
      ...c,
      children: [],
    }
  })
})
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
    label: '业务员',
    field: 'salespersonId',
    component: 'ApiSelect',
    required: true,
    labelWidth: 97,
    colProps: { span: 9 },
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
      }
    },
  },
  {
    ifShow: ({ values }) => values.state != 202,
    show: false,
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
    defaultValue: 1,
    required: true,
    colProps: { span: 7 },
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
]
