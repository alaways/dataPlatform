<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { accountFormSchema } from './account.data'
  import { addUserItem, updateUserItem } from '/@/api/system/account'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: accountFormSchema,
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
          setFieldsValue({
            ...data.record,
            // deptId: (data.record.deptId && String(data.record.deptId).split(',')) || [],
            postId: (data.record.postId && String(data.record.postId).split(',')) || [],
            roleId: (data.record.roleId && String(data.record.roleId).split(',')) || [],
            appletValue:
              (data.record.appletValue && String(data.record.appletValue).split(',')) || [],
            merchantTerminalNo:
              (data.record.merchantTerminalNo &&
                String(data.record.merchantTerminalNo).split(',')) ||
              [],
          })
        }
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增租户' : '编辑租户'))

      async function handleSubmit() {
        try {
          const values = await validate()
          const formValues = cloneDeep(values)
          formValues['userType'] = 1
          // formValues['deptId'] = (values.deptId && values.deptId.join(',')) || ''
          formValues['postId'] = (values.postId && values.postId.join(',')) || ''
          formValues['roleId'] = (values.roleId && values.roleId.join(',')) || ''
          formValues['merchantTerminalNo'] =
            (values.merchantTerminalNo && values.merchantTerminalNo.join(',')) || ''
          formValues['appletValue'] = (values.appletValue && values.appletValue.join(',')) || ''
          setModalProps({ confirmLoading: true })
          // TODO custom api
          if (!unref(isUpdate)) {
            await addUserItem(formValues)
          } else {
            await updateUserItem(formValues)
          }

          createMessage.success(`${getTitle.value}成功`)
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
