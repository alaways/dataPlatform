<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { uploadContractFormSchema } from '../data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { updateContract } from '/@/api/order'
  import { handleImage } from '/@/utils/tool'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'CancleModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: uploadContractFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        const record = data?.record
        if (unref(isUpdate)) {
          setFieldsValue({
            ...record,
          })
        }
      })

      const getTitle = computed(() => '上传合同图片')

      async function handleSubmit() {
        try {
          const values = await validate()
          const formValue = cloneDeep(values)
          formValue['uploadFiles'] = handleImage(formValue.uploadFiles)
          if (!formValue.uploadFiles) {
            createMessage.error(`请上传附件`)
            return
          }
          setModalProps({ confirmLoading: true })
          await updateContract(formValue)
          closeModal()
          createMessage.success(`上传成功`)
          emit('success')
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit }
    },
  })
</script>
