import { uploadApi } from '/@/api/sys/upload'
import { FormSchema } from '/@/components/Form'
import { handleImgAfter, handleImgUploadFormat, imgUploadFormat } from '/@/utils/tool'
import { usePermission } from '/@/hooks/web/usePermission'

const { hasPermission } = usePermission()

export const schemas: FormSchema[] = [
  {
    show: false,
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
    label: '上传手持回执',
    field: 'uploadImages',
    component: 'ImageUpload',
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        disabled: !hasPermission('OrderDetailEditModal'),
        api: uploadApi,
        afterFetch: (data) => handleImgAfter(data),
        onChange: (e: imgUploadFormat[]) => {
          formModel.uploadImages = handleImgUploadFormat(e)
        },
        accept: ['png', 'jpeg', 'jpg'],
      }
    },
  },
  {
    label: '上传附件',
    field: 'uploadFiles',
    component: 'Upload',
    colProps: { span: 20 },
    componentProps: {
      disabled: !hasPermission('OrderDetailEditModal'),
      api: uploadApi,
      accept: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar'],
      showPreviewProps: true,
    },
  },
  {
    label: '上传照片',
    field: 'uploadPhoto',
    component: 'ImageUpload',
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        disabled: !hasPermission('OrderDetailEditModal'),
        api: uploadApi,
        afterFetch: (data) => handleImgAfter(data),
        onChange: (e: imgUploadFormat[]) => {
          formModel.uploadPhoto = handleImgUploadFormat(e)
        },
        accept: ['png', 'jpeg', 'jpg'],
      }
    },
  },
  {
    label: '上传视频',
    field: 'uploadVideo',
    component: 'ImageUpload',
    colProps: { span: 20 },
    componentProps: ({ formModel }) => {
      return {
        disabled: !hasPermission('OrderDetailEditModal'),
        isVideo: true,
        api: uploadApi,
        afterFetch: (data) => handleImgAfter(data),
        onChange: (e: imgUploadFormat[]) => {
          formModel.uploadVideo = handleImgUploadFormat(e)
        },
        accept: ['mp4', 'avi', 'wmv', 'mov', 'flv', 'mkv', 'webm', '3gp'],
      }
    },
  },
]
