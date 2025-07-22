<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #repayDate="{ model }">
        <div>{{ model['repayDate'] }}</div>
      </template>
      <template #text>
        <p style="color: red; margin-left: 30px">
          注: <br />
          <span class="text-base">
            1.调整成功后不可再次修改 <br />
            2.到期日改修改较当前账单到期前，将导致该期账单还款日修改至下月。 <br />例:
            当前:10月30日;修改:15日; 则该期账单还款日将变更为11月15日。
          </span>
        </p>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { dateFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { updateBillDate } from '/@/api/order'

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 150,
        schemas: dateFormSchema,
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
          })
        }
      })

      const getTitle = '调整用户账单到期日'

      async function handleSubmit() {
        try {
          const values = await validate()
          setModalProps({ confirmLoading: true })
          // TODO custom api
          await updateBillDate(values)
          createMessage.success(`${getTitle}成功`)
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
