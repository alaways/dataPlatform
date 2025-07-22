import { DatePicker, FormItem, Input, Select } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { usePermission } from '/@/hooks/web/usePermission'
import { handleCurrentMonthToDays, handleToFixed2 } from '/@/utils/tool'
const { hasPermission } = usePermission()
const allTime = handleCurrentMonthToDays(3)

export const columns: BasicColumn[] = [
  {
    title: '风控人员',
    dataIndex: 'userName',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '审核订单数',
    sorter: true,
    dataIndex: 'sumCount',
  },
  {
    title: '到期订单数',
    sorter: true,
    dataIndex: 'expCount',
  },
  {
    title: '逾期订单数',
    sorter: true,
    dataIndex: 'overdueOrderCount',
  },
  {
    title: '逾期率',
    dataIndex: 'overdueScale',
    width: 120,
    sorter: true,
    customRender: ({ text }) => handleToFixed2(text * 100) + '%',
  },
  // {
  //   title: '取消重新下单订单数',
  //   dataIndex: 'name',
  //   customRender: ({ text }) => text || '-',
  // },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'userName',
    label: '风控人员',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'rentType',
    label: '租赁类型',
    component: 'Select',
    defaultValue: 2,
    colProps: { span: 5 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '全部', value: '' },
        { label: '日付', value: 0 },
        { label: '周付', value: 1 },
        { label: '月付', value: 2 },
        { label: '十天', value: 4 },
      ],
    },
  },
  {
    field: 'spuType',
    label: '品类',
    component: 'Select',
    defaultValue: '',
    colProps: { span: 5 },
    componentProps: {
      allowClear: false,
      options: [
        { label: '全部', value: '' },
        { label: '手机', value: 1 },
        { label: '电动车', value: 2 },
      ],
    },
  },
  {
    field: 'timeSelect',
    label: '时间',
    defaultValue: '创建时间',
    fields: ['time', 'observationTimePoint'],
    component: 'Select',
    colProps: { span: 7 },
    defaultValueObj: { time: allTime },
    renderColContent({ model, field }) {
      return (
        <Input.Group compact style={{ display: 'flex' }}>
          <Select style="width: 120px;margin-left: 20px;" v-model:value={model[field]}>
            <Select.Option value="创建时间">创建时间</Select.Option>
            <Select.Option
              value="按月维度"
              style={{ display: hasPermission('BusinessOperatorMonth') ? 'block' : 'none' }}
            >
              按月维度
            </Select.Option>
          </Select>
          <FormItem
            name="time"
            label=""
            style={{ display: model[field] == '创建时间' ? 'flex' : 'none' }}
          >
            <DatePicker.RangePicker
              allowClear
              v-model:value={model['time']}
              valueFormat="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
            />
          </FormItem>
          <FormItem
            name="observationTimePoint"
            label=""
            style={{ display: model[field] == '按月维度' ? 'flex' : 'none' }}
          >
            <DatePicker.MonthPicker
              allowClear
              v-model:value={model['observationTimePoint']}
              valueFormat="YYYY-MM"
              placeholder="请选择月份"
            />
          </FormItem>
        </Input.Group>
      )
    },
  },
  // {
  //   field: 'time',
  //   label: '创建时间',
  //   component: 'RangePicker',
  //   componentProps: {
  //     valueFormat: 'YYYY-MM-DD',
  //     placeholder: ['开始日期', '结束日期'],
  //   },
  //   colProps: { span: 6 },
  // },
]
