<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #days="{ model }">
        <div class="flex items-center">
          <InputNumber id="inputNumber" v-model:value="model['minDays']" :min="1" />
          <div class="mx-3">至</div>
          <InputNumber id="inputNumber" v-model:value="model['maxDays']" :min="1" />
        </div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { userFormSchema } from '../data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { setCommissionItem, updateCommissionItem } from '/@/api/collection/commission'
  import { cloneDeep } from 'lodash-es'
  import { InputNumber } from 'ant-design-vue'

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm, InputNumber },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        layout: 'vertical',
        labelWidth: 100,
        schemas: userFormSchema,
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

      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'))

      async function handleSubmit() {
        try {
          const values = await validate()
          const formParams = cloneDeep(values)
          setModalProps({ confirmLoading: true })
          // TODO custom api
          if (!unref(isUpdate)) {
            await setCommissionItem(formParams)
          } else {
            await updateCommissionItem(formParams)
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
