<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #withdrawAmount="{ model }">
        <div style="color: red">￥{{ model['withdrawAmount'] }}</div>
      </template>
      <template #merchantName="{ model }">
        <div>{{ model['merchantName'] }}</div>
      </template>
      <template #realName="{ model }">
        <div>{{ model['realName'] }}</div>
      </template>
      <template #bankName="{ model }">
        <div>{{ model['bankName'] }}</div>
      </template>
      <template #bankCardNo="{ model }">
        <div>{{ model['bankCardNo'] }}</div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { modalSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { handlenAmount } from '/@/utils/tool'
  import { updateSettled } from '/@/api/finance/withdrawal'

  export default defineComponent({
    name: 'WithdrawalModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: modalSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        console.log(data.record)

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
            payLogIdList: data.record.ids,
            ...handlenAmount(
              {
                withdrawAmount: data.record.withdrawAmount || 0,
              },
              false,
            ),
          })
        }
      })

      const getTitle = computed(() => '确认结算')

      async function handleSubmit() {
        try {
          const values = await validate()

          setModalProps({ confirmLoading: true })

          // TODO custom api
          await updateSettled({
            withdrawId: values.withdrawId,
            applyStatus: 1,
            settleStatus: 1,
          })
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
