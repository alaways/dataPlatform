<template>
  <div>
    <Upload
      v-bind="$attrs"
      v-model:file-list="fileList"
      :list-type="listType"
      :showUploadList="showUploadList"
      :accept="getStringAccept"
      :multiple="multiple"
      :maxCount="maxNumber"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      @preview="handlePreview"
      @remove="handleRemove"
    >
      <template #removeIcon>
        <div class="removeIcon">
          <CloseCircleOutlined />
        </div>
      </template>
      <div v-if="fileList && fileList.length < maxNumber">
        <template v-if="listType != 'text'">
          <plus-outlined />
          <div style="margin-top: 8px">{{ t('component.upload.upload') }}</div>
        </template>
        <a-button v-else>
          <UploadOutlined />
          上传
        </a-button>
      </div>
    </Upload>
    <Modal
      v-if="isVideo"
      :visible="previewOpen"
      :title="previewTitle"
      :footer="null"
      @cancel="handleCancel"
    >
      <video
        controls
        :loop="false"
        style="width: 100%; max-height: 500px"
        :src="previewImage"
      ></video>

      <!-- <img v-else alt="" style="width: 100%; max-height: 500px" :src="previewImage" /> -->
    </Modal>
    <Image
      v-else
      :visible="previewOpen"
      style="display: none"
      :src="previewImage"
      :preview="{
        visible: previewOpen,
        onVisibleChange: handleVisibleChange,
      }"
    />
  </div>
</template>

<script lang="ts" setup name="ImageUpload">
  import { ref, toRefs, watch } from 'vue'
  import { CloseCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons-vue'
  import { Upload, Modal, Image } from 'ant-design-vue'
  import type { UploadProps } from 'ant-design-vue'
  import { UploadRequestOption } from 'ant-design-vue/lib/vc-upload/interface'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { isArray, isFunction, isObject, isString } from '/@/utils/is'
  import { warn } from '/@/utils/log'
  import { useI18n } from '/@/hooks/web/useI18n'
  import { useUploadType } from './useUpload'
  import { uploadContainerProps } from './props'
  import { isImgTypeByName } from './helper'
  import { nextTick } from 'vue'

  const emit = defineEmits(['change', 'update:value', 'delete'])
  const props = defineProps({
    ...uploadContainerProps,
  })
  const { t } = useI18n()
  const { createMessage } = useMessage()
  const { accept, helpText, maxNumber, maxSize, isVideo } = toRefs(props)
  const { getStringAccept } = useUploadType({
    acceptRef: accept,
    helpTextRef: helpText,
    maxNumberRef: maxNumber,
    maxSizeRef: maxSize,
  })
  const previewOpen = ref<boolean>(false)
  const previewImage = ref<string>('')
  const previewTitle = ref<string>('')

  const fileList = ref<UploadProps['fileList']>([])
  const isLtMsg = ref<boolean>(true)
  const isActMsg = ref<boolean>(true)

  watch(
    () => props.value,
    (v) => {
      if (v && isString(v)) {
        v = v.split(',')
      }
      if (v && isArray(v)) {
        fileList.value = v.map((item, i) => {
          if (item && isString(item)) {
            return {
              uid: -i + '',
              name: item.substring(item.lastIndexOf('/') + 1),
              status: 'done',
              url: item,
            }
          } else if (item && isObject(item)) {
            return item
          } else {
            return
          }
        }) as UploadProps['fileList'][number]
      }
    },
  )

  function getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handlePreview = async (file: UploadProps['fileList'][number]) => {
    if (!file.url && !file.preview && !isVideo) {
      file.preview = (await getBase64(file.originFileObj)) as string
    }

    previewImage.value = file.url || file.preview
    previewOpen.value = true
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
  }

  const handleRemove = async (file: UploadProps['fileList'][number]) => {
    if (fileList.value) {
      const index = fileList.value.findIndex((item: any) => item.url === file.url)
      index !== -1 && fileList.value.splice(index, 1)
      emit('change', fileList.value)
      emit('delete', file)
    }
  }

  const handleCancel = () => {
    previewOpen.value = false
    previewTitle.value = ''
  }

  function handleVisibleChange(e) {
    previewOpen.value = e
  }

  const beforeUpload = (file: File) => {
    const { maxSize, accept } = props
    const { name } = file
    const isAct = isImgTypeByName(name) || true
    if (!isAct) {
      createMessage.error(t('component.upload.acceptUpload', [accept]))
      isActMsg.value = false
      // 防止弹出多个错误提示
      setTimeout(() => (isActMsg.value = true), 1000)
    }
    const isLt = file.size / 1024 / 1024 > maxSize
    if (isLt) {
      createMessage.error(t('component.upload.maxSizeMultiple', [maxSize]))
      isLtMsg.value = false
      // 防止弹出多个错误提示
      setTimeout(() => (isLtMsg.value = true), 1000)
    }
    return (isAct && !isLt) || Upload.LIST_IGNORE
  }

  async function customRequest(info: UploadRequestOption<any>) {
    const { api, beforeFetch, afterFetch } = props
    if (!api || !isFunction(api)) {
      return warn('upload api must exist and be a function')
    }
    let params = {}
    if (beforeFetch && isFunction(beforeFetch)) {
      params = (await beforeFetch(params)) || params
    }

    try {
      const res = await props.api?.({
        data: {
          ...(props.uploadParams || {}),
          ...params,
        },
        file: info.file,
        name: props.name,
        filename: props.filename,
      })
      info.onSuccess!(res.data)
      nextTick(async () => {
        let resultItems = fileList.value
        if (afterFetch && isFunction(afterFetch)) {
          resultItems = (await afterFetch(resultItems)) || resultItems
        }
        emit('change', resultItems)
      })
    } catch (e: any) {
      console.log(e)
      info.onError!(e)
    }
  }
</script>

<style lang="less" scoped>
  // .ant-upload-select-picture-card i {
  //   color: #999;
  //   font-size: 32px;
  // }

  // .ant-upload-select-picture-card .ant-upload-text {
  //   margin-top: 8px;
  //   color: #666;
  // }

  .removeIcon {
    border-radius: 50%;
    background: #fff;
    position: absolute;
    top: -45px;
    right: -27px;
    color: #0960bd;
    font-size: 17px !important;
    z-index: 1;
  }
</style>
