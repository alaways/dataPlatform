<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { examineFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import { handlenAmount } from '/@/utils/tool'
  import { updateBalanceModal } from '/@/api/finance/balance'

  export default defineComponent({
    name: 'Modal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)

      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: examineFormSchema,
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
            city: [data.record.province, data.record.city],
            ...handlenAmount(
              {
                loanMoney: data.record.loanMoney || 0,
                royaltyFee: data.record.royaltyFee || 30000,
                rebateFee: data.record.rebateFee || 0,
              },
              false,
            ),
          })
        }
      })

      const getTitle = computed(() => '修改货款信息')

      async function handleSubmit() {
        try {
          const values = await validate()
          let formValues = cloneDeep(values)
          formValues = {
            ...formValues,
            ...handlenAmount(
              {
                loanMoney: formValues.loanMoney,
                royaltyFee: formValues.royaltyFee,
                rebateFee: formValues.rebateFee,
                lockFee: formValues.lockFee,
              },
              true,
            ),
          }
          if (values.city) {
            formValues.province = values.city[0]
            formValues.city = values.city[1]
          }
          if (values.ipCity) {
            formValues.ipProvince = values.ipCity[0]
            formValues.ipCity = values.ipCity[1]
          }

          setModalProps({ confirmLoading: true })
          // TODO custom api
          await updateBalanceModal(formValues)
          createMessage.success(`修改成功`)
          emit('success')
          closeModal()
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit }
    },
  })
</script>
