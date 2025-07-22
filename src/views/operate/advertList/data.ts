import { Image, Tag } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'
import { uploadApi } from '/@/api/sys/upload'
import { handleImgAfter, handleImgUploadFormat, imgUploadFormat } from '/@/utils/tool'

const typeList = [
  { value: 0, label: '首页广告' },
  { value: 1, label: '分类广告' },
]

const statusList = [
  { value: 0, label: '禁用', color: 'red' },
  { value: 1, label: '正常', color: 'green' },
  { value: 2, label: '过期', color: 'red' },
]

export const columns: BasicColumn[] = [
  {
    title: '标题',
    dataIndex: 'name',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '图片',
    dataIndex: 'pic',
    width: 120,
    customRender: ({ text }) => h(Image, { src: text, width: 50 }),
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 100,
    customRender: ({ text }) => {
      const find = typeList.find((v) => v.value == text)
      return find?.label || '-'
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      const find = statusList.find((v) => v.value == text)
      return h(Tag, { color: find?.color }, find?.label || '-')
    },
  },
  {
    title: '开始时间',
    dataIndex: 'beginTime',
    width: 180,
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: 180,
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '标题',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'type',
    label: '类型',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: typeList,
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
]

export const userFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'pic',
    label: '图片',
    required: true,
    component: 'ImageUpload',
    colProps: { span: 24 },
    componentProps: ({ formModel }) => {
      return {
        api: uploadApi,
        afterFetch: (data) => handleImgAfter(data),
        onChange: (e: imgUploadFormat[]) => {
          formModel.logo = handleImgUploadFormat(e).join(',')
        },
        accept: ['png', 'jpeg', 'jpg'],
        maxNumber: 1,
      }
    },
  },
  {
    field: 'name',
    label: '标题',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'beginTime',
    label: '开始时间',
    component: 'DatePicker',
    colProps: { span: 20 },
    required: true,
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'endTime',
    label: '结束时间',
    component: 'DatePicker',
    colProps: { span: 20 },
    required: true,
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'type',
    label: '类型',
    component: 'RadioGroup',
    colProps: { span: 20 },
    required: true,
    defaultValue: 0,
    componentProps: {
      options: typeList,
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioGroup',
    colProps: { span: 20 },
    required: true,
    defaultValue: 1,
    componentProps: {
      options: statusList,
    },
  },
]
