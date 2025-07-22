<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #settleAmount="{ model }">
        <div style="color: red">￥{{ model['settleAmount'] }}</div>
      </template>
      <template #merchantName="{ model }">
        <div>{{ model['merchantName'] }}</div>
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
  import { cloneDeep } from 'lodash-es'
  import { handlenAmount } from '/@/utils/tool'
  import { updateWithdraw } from '/@/api/finance/stream'

  export default defineComponent({
    name: 'FinanceWithdrawalModal',
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

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
            payLogIdList: data.record.ids,
            ...handlenAmount(
              {
                settleAmount: data.record.settleAmount || 0,
                withdrawLimit: data.record.withdrawLimit || 0,
              },
              false,
            ),
          })
        }
      })

      const getTitle = computed(() => '发起提现')

      async function handleSubmit() {
        try {
          const values = await validate()
          if (Number(values.withdrawLimit) > Number(values.settleAmount)) {
            createMessage.error(`当前提现金额必须大于${values.withdrawLimit}元`)
            return
          }
          let formParams = cloneDeep(values)
          formParams = {
            ...formParams,
          }
          delete formParams.settleAmount
          delete formParams.withdrawLimit
          delete formParams.merchantName

          setModalProps({ confirmLoading: true })

          // TODO custom api
          await updateWithdraw(formParams)
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
