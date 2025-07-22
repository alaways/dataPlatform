<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #loanMoney="{ model }">
        <div>{{ model['loanMoney'] }} 元</div>
      </template>
      <template #rebateFee="{ model }">
        <div>{{ model['rebateFee'] }} 元</div>
      </template>
      <template #royaltyFee="{ model }">
        <div>{{ model['royaltyFee'] }} 元</div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { payModalSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import { updateBalance } from '/@/api/finance/balance'
  import { handlenAmount } from '/@/utils/tool'

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
        labelWidth: 100,
        schemas: payModalSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate

        let options = [{ label: '已付款', value: 2 }]
        if (data.record.payStatus == 0) {
          options.unshift({ label: '待付款(提成未付)', value: 1 })
        }
        updateSchema([
          {
            field: 'payStatus',
            componentProps: {
              options,
            },
          },
        ])

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
            showAction: data.showAction,
            payStatus: 2,
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

      const getTitle = computed(() => '确认付款')

      async function handleSubmit() {
        try {
          const values = await validate()
          let formParams = cloneDeep(values)
          formParams = {
            ...formParams,
            ...handlenAmount(
              {
                loanMoney: formParams.loanMoney,
                royaltyFee: formParams.royaltyFee,
                rebateFee: formParams.rebateFee,
              },
              true,
            ),
          }

          setModalProps({ confirmLoading: true })

          // TODO custom api
          await updateBalance({
            ids: formParams.id,
            orderId: formParams.orderId,
            orderSn: formParams.orderSn,
            payStatus: formParams.payStatus,
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
