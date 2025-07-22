import { validateIdCard } from '/@/api/order'
import { uploadApi, uploadOCRApi } from '/@/api/sys/upload'
import { FormSchema } from '/@/components/Form'
import { useMessage } from '/@/hooks/web/useMessage'
import { usePermission } from '/@/hooks/web/usePermission'

const { hasPermission } = usePermission()

export const schemas: FormSchema[] = [
  {
    label: '用户信息',
    field: 'divider-linked0',
    component: 'Divider',
    colProps: {
      span: 24,
    },
  },
  {
    label: 'id',
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
    label: 'uid',
    field: 'uid',
    component: 'Input',
    show: false,
  },
  {
    label: '年龄',
    field: 'age',
    component: 'Input',
    show: false,
  },
  {
    label: '民族',
    field: 'nation',
    component: 'Input',
    show: false,
  },
  {
    label: '手机号',
    field: 'phone',
    component: 'Input',
    // show: false,
    ifShow: false,
  },
  {
    label: '真实姓名',
    field: 'realName',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
    componentProps: {
      disabled: !hasPermission('OrderDetailEditModal'),
    },
  },
  {
    label: '身份证号码',
    field: 'idCard',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
    componentProps: {
      disabled: !hasPermission('OrderDetailEditModal'),
    },
  },
  {
    label: '身份证正面',
    field: 'cardFrontImage',
    component: 'ImageUpload',
    required: true,
    colProps: { span: 16 },
    suffix: '注：上传身份证正面会覆盖真实姓名、身份证号码',
    componentProps: ({ formModel }) => {
      return {
        disabled: !hasPermission('OrderDetailEditModal'),
        accept: ['png', 'jpeg', 'jpg'],
        maxNumber: 1,
        api: uploadOCRApi,
        beforeFetch: (data) => {
          data.code = 'idcard'
          data.side = 'front'
          data.uid = formModel['uid']
          return data
        },
        afterFetch: (data: any) => {
          const res = data[0].response
          const info = res.data.info
          if (info) {
            formModel.realName = info.name
            formModel.age = info.age
            formModel.nation = info.nation
            if (validateIdCard(info.number)) {
              formModel.idCard = info.number
            } else {
              const { createMessage } = useMessage()
              createMessage.error('身份证号不正确，请核对后重新输入')
              formModel.idCard = ''
            }
          }
          return res.data.pic.split(',')
        },
      }
    },
  },
  {
    label: '身份证背面',
    field: 'cardBackImage',
    component: 'ImageUpload',
    required: true,
    colProps: { span: 12 },
    componentProps: ({ formModel }) => {
      return {
        disabled: !hasPermission('OrderDetailEditModal'),
        accept: ['png', 'jpeg', 'jpg'],
        maxNumber: 1,
        api: uploadOCRApi,
        beforeFetch: (data) => {
          data.code = 'idcard'
          data.side = 'back'
          data.uid = formModel['uid']
        },
        afterFetch: (data) => {
          const res = data[0].response
          return res.data.pic.split(',')
        },
      }
    },
  },
  {
    label: '手持身份证',
    field: 'cardHandImage',
    component: 'ImageUpload',
    componentProps: {
      disabled: !hasPermission('OrderDetailEditModal'),
      api: uploadApi,
      accept: ['png', 'jpeg', 'jpg'],
      maxNumber: 1,
      afterFetch: (data) => {
        const res = data[0].response
        return res.data.split(',')
      },
    },
  },
  {
    show: false,
    label: '上传手持回执',
    field: 'uploadImages',
    component: 'ImageUpload',
    colProps: { span: 20 },
    componentProps: {
      disabled: !hasPermission('OrderDetailEditModal'),
      api: uploadApi,
      accept: ['png', 'jpeg', 'jpg'],
      maxNumber: 99999,
      afterFetch: (data) => {
        const res = data[0].response
        return res.data.split(',')
      },
    },
  },
  {
    show: false,
    label: '上传附件',
    field: 'uploadFiles',
    component: 'Upload',
    colProps: { span: 20 },
    componentProps: {
      disabled: !hasPermission('OrderDetailEditModal'),
      api: uploadApi,
      accept: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
      maxNumber: 99999,
      showPreviewProps: true,
    },
  },
  {
    show: false,
    label: '紧急联系人1',
    field: 'divider-linked1',
    component: 'Divider',
    colProps: {
      span: 24,
    },
  },
  {
    show: false,
    label: '关系',
    field: 'emergentRelation1',
    component: 'Select',
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    show: false,
    label: '姓名',
    field: 'emergentName1',
    component: 'Input',
  },
  {
    show: false,
    label: '手机号',
    field: 'emergentPhone1',
    component: 'Input',
  },
  {
    show: false,
    label: '状态',
    field: 'emergentStatus1',
    component: 'Input',
  },
  {
    show: false,
    label: '紧急联系人2',
    field: 'divider-linked2',
    component: 'Divider',
    colProps: {
      span: 24,
    },
  },
  {
    show: false,
    label: '关系',
    field: 'emergentRelation2',
    component: 'Select',
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    show: false,
    label: '姓名',
    field: 'emergentName2',
    component: 'Input',
  },
  {
    show: false,
    label: '手机号',
    field: 'emergentPhone2',
    component: 'Input',
  },
  {
    show: false,
    label: '状态',
    field: 'emergentStatus2',
    component: 'Input',
  },
  {
    show: false,
    label: '紧急联系人列表',
    field: 'emergents',
    component: 'Input',
  },
  {
    // 紧急联系人
    label: '',
    field: 'contacts',
    component: 'Input',
    slot: 'contacts',
    colProps: {
      span: 24,
    },
  },
]
