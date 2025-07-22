<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    destroyOnClose
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { passwordFormSchema } from './account.data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { updatePassword } from '/@/api/system/account'

  export default defineComponent({
    name: 'PasswordModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const userName = ref('')
      const { createMessage } = useMessage()

      const [registerForm, { resetFields, validate, setFieldsValue }] = useForm({
        labelWidth: 100,
        schemas: passwordFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        if (unref(isUpdate)) {
          userName.value = data.record.userName
          setFieldsValue({
            ...data.record,
          })
        }
      })

      const getTitle = computed(() => `重置 ${userName.value} 登录密码`)

      async function handleSubmit() {
        try {
          const values = await validate()
          setModalProps({ confirmLoading: true })
          // TODO custom api
          await updatePassword(values)

          createMessage.success(`重置密码成功`)
          closeModal()
          emit('success')
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit }
    },
  })
</script>
