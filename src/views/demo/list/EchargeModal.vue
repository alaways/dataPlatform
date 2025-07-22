<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #merchantCode1="{ model }">
        <div>{{ model['merchantCode1'] }}</div>
      </template>
      <template #availableBalance="{ model }">
        <div>￥{{ model['availableBalance'] }}</div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { echargeFormSchema } from './data'
  import { updateStoreBalanceRecharge } from '/@/api/store'
  import { formatNumber } from '/@/utils/tool'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'Modal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: echargeFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })

        const treeData = data?.merchantCodeList
        updateSchema({
          field: 'merchantCode',
          componentProps: {
            options: treeData,
            fieldNames: {
              label: 'merchantName',
              value: 'merchantCode',
              key: 'merchantCode',
            },
            onChange: (e, v) => {
              setFieldsValue({
                merchantCode1: e,
                availableBalance: formatNumber(v.availableBalance || 0, 2),
              })
            },
          },
        })
      })

      const getTitle = computed(() => '商家余额充值')

      async function handleSubmit() {
        try {
          const values = await validate()
          if (values.rechargeAmount <= 0) {
            createMessage.error(`充值金额不得小于等于0元`)
            return
          }
          const formParams = cloneDeep(values)
          formParams.rechargeAmount = Number((formParams.rechargeAmount * 100).toFixed(0))
          setModalProps({ confirmLoading: true })

          await updateStoreBalanceRecharge(formParams)
          createMessage.success(`充值成功`)
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
