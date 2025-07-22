import { Switch } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'
import { useMessage } from '/@/hooks/web/useMessage'
import { cityCoding } from '/@/utils/cityData2'
import { goodTypeList } from '../../goods/goodsLeaseMore/components/utils'
import { cloneDeep } from 'lodash-es'
import { updateNewCalculatorItem } from '/@/api/calculator/newCalculator'

const cityData2 = cloneDeep(cityCoding)
cityData2.forEach((v) => {
  v.children = v.children.map((c) => {
    return {
      ...c,
      // children: [],
    }
  })
})
export const totalPeriodsConfigOptions = [
  { label: '包含第一期', value: 0 },
  { label: '不含第一期', value: 1 },
]

export const columns: BasicColumn[] = [
  {
    title: '省',
    dataIndex: 'provinceRegionName',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '市',
    dataIndex: 'cityRegionName',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '区',
    dataIndex: 'boroughName',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '首付抵扣方式',
    dataIndex: 'rentType',
    width: 120,
    customRender: ({ text }) => {
      const find = goodTypeList.find((v) => v.value == text)
      return find?.label || '-'
    },
  },
  // {
  //   title: '定价系数(%)',
  //   dataIndex: 'interestRate',
  //   width: 120,
  //   customRender: ({ text }) => formatNumber(text * 100 || 0, 2),
  // },
  {
    title: '总期数设置',
    dataIndex: 'totalPeriodsConfig',
    customRender: ({ text }) => {
      const find = totalPeriodsConfigOptions.find((v) => v.value == text)
      return find?.label || '-'
    },
  },
  {
    title: '名称',
    width: 140,
    dataIndex: 'name',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '备注',
    width: 180,
    dataIndex: 'remark',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '最后更新时间',
    width: 180,
    dataIndex: 'updateTime',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'status')) {
        record.status = false
      }
      return h(Switch, {
        checked: record.status === 1,
        checkedChildren: '启用',
        unCheckedChildren: '禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true
          const newStatus = checked ? 1 : 0
          const { createMessage } = useMessage()
          updateNewCalculatorItem({ id: record.id, ...record, status: newStatus })
            .then(() => {
              record.status = newStatus
              createMessage.success(record.status === 1 ? `启用` : '禁用')
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
]

export const userFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'regionIds',
    label: '省、市、区',
    required: true,
    component: 'Cascader',
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        changeOnSelect: true,
        options: cityData2,
        onChange: (e: any, v: any) => {
          if (v && v.length) {
            // const len = e.length
            console.log(e, v, 'evShow')
            formModel.provinceRegionId = v[0].value
            formModel.provinceRegionName = v[0]?.label
            formModel.cityRegionId = v[1].value
            formModel.cityRegionName = v[1]?.label
            formModel.boroughId = v[2]?.value
            formModel.boroughName = v[2]?.label
            console.log(formModel)
          }
        },
      }
    },
  },
  {
    field: 'provinceRegionId',
    label: '省地区编号',
    component: 'Input',
    show: false,
  },
  {
    field: 'provinceRegionName',
    label: '省地区名称',
    component: 'Input',
    show: false,
  },
  {
    field: 'cityRegionId',
    label: '市地区编号',
    component: 'Input',
    show: false,
  },
  {
    field: 'cityRegionName',
    label: '市地区名称',
    component: 'Input',
    show: false,
  },
  {
    field: 'boroughName',
    label: '区名称',
    component: 'Input',
    show: false,
  },
  {
    field: 'boroughId',
    label: '区编号',
    component: 'Input',
    show: false,
  },
  {
    field: 'rentType',
    label: '首付抵扣方式',
    component: 'Select',
    colProps: { span: 20 },
    required: true,
    componentProps: {
      options: [
        { label: '计算器计价', value: 2 },
        { label: '地区政策表', value: 3 },
      ],
    },
  },
  {
    field: 'totalPeriodsConfig',
    label: '总期数设置',
    component: 'RadioGroup',
    colProps: { span: 20 },
    required: true,
    defaultValue: 0,
    componentProps: {
      options: totalPeriodsConfigOptions,
    },
  },
  {
    field: 'interestRateTxt',
    labelWidth: 0,
    label: '',
    component: 'Input',
    slot: 'interestRateTxt',
    colProps: { span: 24 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioGroup',
    colProps: { span: 20 },
    required: true,
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '正常', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
    colProps: { span: 22 },
    componentProps: {
      rows: 3,
    },
  },
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    colProps: { span: 22 },
    componentProps: {
      rows: 3,
    },
  },
  {
    field: 'interestRate',
    label: '定价系数',
    component: 'InputNumber',
    colProps: { span: 22 },
    slot: 'interestRate',
  },
]

export const qrCodeFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },

  {
    field: 'provinceRegionId',
    label: '省地区编号',
    component: 'Input',
    show: false,
  },
  {
    field: 'provinceRegionName',
    label: '省地区名称',
    component: 'Input',
    show: false,
  },
  {
    field: 'cityRegionId',
    label: '市地区编号',
    component: 'Input',
    show: false,
  },
  {
    field: 'cityRegionName',
    label: '市地区名称',
    component: 'Input',
    show: false,
  },
  {
    field: 'regionIds',
    label: '省、市',
    component: 'Input',
    colProps: { span: 20 },
    render: ({ model }) => {
      return (
        <>
          <div>
            {model['provinceRegionName']}
            {model['cityRegionName']}
          </div>
        </>
      )
    },
  },
  {
    field: 'rentType',
    label: '首付抵扣方式',
    component: 'Select',
    colProps: { span: 20 },
    render: ({ model }) => {
      const find = goodTypeList.find((v) => v.value == model['rentType'])
      return <div>{find?.label}</div>
    },
  },
  {
    field: 'interestRate',
    label: '定价系数',
    component: 'InputNumber',
    colProps: { span: 19 },
    show: false,
    render: ({ model }) => {
      const interestRate = model['interestRate'] || 0
      return <div>{interestRate}%</div>
    },
  },
  {
    field: 'totalPeriodsConfig',
    label: '总期数设置',
    component: 'RadioGroup',
    colProps: { span: 20 },
    defaultValue: 0,
    render: ({ model }) => {
      const find = totalPeriodsConfigOptions.find((v) => v.value == model['totalPeriodsConfig'])
      return <div>{find?.label}</div>
    },
  },
  {
    label: '二维码',
    field: 'qrCode',
    component: 'Input',
    render: () => h('div', {}, ''),
    colProps: { span: 6 },
  },
]

export const tableColumn: BasicColumn[] = [
  {
    title: '期数',
    dataIndex: 'period',
    editRow: true,
    editRule: true,
    editComponent: 'InputNumber',
  },
  {
    title: '系数',
    dataIndex: 'interestRate',
    editRow: true,
    editRule: true,
    editComponent: 'InputNumber',
    editComponentProps: () => {
      return {
        addonAfter: '%',
      }
    },
  },
]

export const tableEditRow = {
  period: '',
  interestRate: '',
}
