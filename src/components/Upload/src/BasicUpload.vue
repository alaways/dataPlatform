<template>
  <div>
    <a-button-group :style="{ display: buttonType == 'primary' ? 'inline-flex' : 'inline' }">
      <a-button
        :class="{ 'wh-full': buttonType != 'primary' }"
        :type="buttonType"
        @click="openUploadModal"
      >
        <slot>{{ t('component.upload.upload') }}</slot>
      </a-button>
      <Tooltip placement="bottom" v-if="showPreviewProps && showPreview">
        <template #title>
          {{ t('component.upload.uploaded') }}
          <template v-if="fileList.length">
            {{ fileList.length }}
          </template>
        </template>
        <a-button @click="openPreviewModal">
          <Icon icon="bi:eye" />
          <template v-if="fileList.length && showPreviewNumber">
            {{ fileList.length }}
          </template>
        </a-button>
      </Tooltip>
    </a-button-group>

    <!-- :previewFileList="fileList" -->
    <UploadModal
      v-bind="bindValue"
      :previewFileList="fileList"
      @register="registerUploadModal"
      @change="handleChange"
      @delete="handleDelete"
    />

    <UploadPreviewModal
      :value="fileList"
      @register="registerPreviewModal"
      @list-change="handlePreviewChange"
      @delete="handlePreviewDelete"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, watch, unref, computed } from 'vue'
  import UploadModal from './UploadModal.vue'
  import UploadPreviewModal from './UploadPreviewModal.vue'
  import { Icon } from '/@/components/Icon'
  import { Tooltip } from 'ant-design-vue'
  import { useModal } from '/@/components/Modal'
  import { uploadContainerProps } from './props'
  import { isString, omit } from 'lodash-es'
  import { useI18n } from '/@/hooks/web/useI18n'
  import { isArray } from '/@/utils/is'

  export default defineComponent({
    name: 'BasicUpload',
    components: { UploadModal, UploadPreviewModal, Icon, Tooltip },
    props: uploadContainerProps,
    emits: ['change', 'delete', 'preview-delete', 'update:value'],

    setup(props, { emit, attrs }) {
      const buttonType = computed(() => props.buttonType)
      const { t } = useI18n()
      // 上传modal
      const [registerUploadModal, { openModal: openUploadModal }] = useModal()

      //   预览modal
      const [registerPreviewModal, { openModal: openPreviewModal }] = useModal()

      const fileList = ref<string[]>([])

      const showPreview = computed(() => {
        const { emptyHidePreview } = props
        if (!emptyHidePreview) return true
        return emptyHidePreview ? fileList.value.length > 0 : true
      })

      const bindValue = computed(() => {
        const value = { ...attrs, ...props }
        return omit(value, 'onChange')
      })

      watch(
        () => props.value,
        (value = []) => {
          if (value && isString(value)) {
            value = value.split(',')
          }

          fileList.value = isArray(value) ? value : []
        },
        { immediate: true },
      )

      // 上传modal保存操作
      function handleChange(urls: string[]) {
        fileList.value = [...unref(fileList), ...(urls || [])]
        emit('update:value', fileList.value)
        emit('change', fileList.value)
        fileList.value = []
      }

      // 预览modal保存操作
      function handlePreviewChange(urls: string[]) {
        fileList.value = [...(urls || [])]
        emit('update:value', fileList.value)
        emit('change', fileList.value)
        fileList.value = []
      }

      function handleDelete(record: Recordable) {
        emit('delete', record)
      }

      function handlePreviewDelete(url: string) {
        emit('preview-delete', url)
      }

      return {
        registerUploadModal,
        openUploadModal,
        handleChange,
        handlePreviewChange,
        registerPreviewModal,
        openPreviewModal,
        fileList,
        showPreview,
        bindValue,
        handleDelete,
        handlePreviewDelete,
        buttonType,
        t,
      }
    },
  })
</script>

<style lang="less" scoped>
  .wh-full {
    width: 100%;
    height: 100%;
  }
</style>
