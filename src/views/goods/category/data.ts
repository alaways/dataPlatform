import { Image, Tag } from 'ant-design-vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { h } from 'vue'
import { uploadApi } from '/@/api/sys/upload'
import { handleImgAfter, handleImgUploadFormat, imgUploadFormat } from '/@/utils/tool'

export const columns: BasicColumn[] = [
  {
    title: '分类名称',
    dataIndex: 'name',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '分类图标',
    dataIndex: 'logo',
    width: 120,
    customRender: ({ text }) => h(Image, { src: text, width: 50 }),
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      const color = text ? 'green' : 'red'
      const txt = text ? '显示' : '隐藏'
      return h(Tag, { color }, txt)
    },
  },
  {
    title: '排序',
    width: 120,
    dataIndex: 'sort',
  },
  {
    title: '创建时间',
    width: 180,
    dataIndex: 'createTime',
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
    field: 'createUid',
    label: 'createUid',
    component: 'Input',
    show: false,
  },
  {
    field: 'level',
    label: 'level',
    component: 'Input',
    show: false,
  },
  {
    field: 'logo',
    label: '分类图标',
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
    field: 'parentId',
    label: '上级分类',
    component: 'TreeSelect',
    colProps: { span: 20 },
  },
  {
    field: 'parentName',
    label: '上级名称名称',
    component: 'Input',
    colProps: { span: 19 },
    show: false,
  },
  {
    field: 'name',
    label: '分类名称',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber',
    suffix: '注: 从大到小排序',
    colProps: { span: 20 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioGroup',
    colProps: { span: 20 },
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '显示', value: 1 },
        { label: '隐藏', value: 0 },
      ],
    },
  },
]
