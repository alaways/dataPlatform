<template>
  <BasicModal
    :width="1000"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <div class="mb-5 p-3" style="border: 1px solid #f0f0f0">
      <Description
        size="middle"
        title=""
        :bordered="false"
        :column="3"
        :data="refundData"
        :schema="refundSchema"
      />
    </div>
    <BasicForm @register="registerForm">
      <template #mode>
        <div>银行卡</div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { modalSchema, refundSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import { updateBalanceAfterModal } from '/@/api/finance/balance'
  import { Description } from '/@/components/Description/index'
  import { handlenAmount } from '/@/utils/tool'

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm, Description },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()
      const refundData = ref()

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
        refundData.value = data.record

        if (unref(isUpdate)) {
          let params: any = {
            loanMoney: data.record.loanMoney || 0,
            royaltyFee: data.record.royaltyFee || 30000,
            rebateFee: data.record.rebateFee || 0,
          }
          if (data.isAfter) {
            params = {
              modifyLoanMoney: data.record.modifyLoanMoney || 0,
              modifyRoyaltyFee: data.record.modifyRoyaltyFee || 0,
              modifyRebateFee: data.record.modifyRebateFee || 0,
            }
          }
          setFieldsValue({
            ...data.record,
            isAfter: data.isAfter,
            ...handlenAmount(params, false),
          })
        }
      })

      const getTitle = computed(() => '修改')

      async function handleSubmit() {
        try {
          const values = await validate()
          let formParams = cloneDeep(values)
          let params: any = {
            loanMoney: formParams.loanMoney,
            royaltyFee: formParams.royaltyFee,
            rebateFee: formParams.rebateFee,
          }
          if (formParams.isAfter) {
            params = {
              modifyLoanMoney: formParams.modifyLoanMoney,
              modifyRoyaltyFee: formParams.modifyRoyaltyFee,
              modifyRebateFee: formParams.modifyRebateFee,
            }
          }
          formParams = {
            ...formParams,
            ...handlenAmount(params, true),
          }

          setModalProps({ confirmLoading: true })

          // TODO custom api
          await updateBalanceAfterModal(formParams)
          createMessage.success(`${getTitle.value}成功`)
          closeModal()
          emit('success')
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, refundSchema, refundData }
    },
  })
</script>
