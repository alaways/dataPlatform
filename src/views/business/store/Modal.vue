<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { modalFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { updateOrderStore } from '/@/api/business/store'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'StoreModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: modalFormSchema,
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
          let city
          if (data.record.province) {
            city = [data.record.province, data.record.city]
          }

          setFieldsValue({
            ...data.record,
            city,
          })
        }
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'))

      async function handleSubmit() {
        try {
          const values = await validate()
          const formValues = cloneDeep(values)
          if (formValues.city && formValues.city.length) {
            formValues['province'] = values['city'][0]
            formValues['city'] = values['city'][1]
          }
          if (!formValues.parentId) {
            formValues['parentId'] = -1
          }
          setModalProps({ confirmLoading: true })
          // TODO custom api
          await updateOrderStore(formValues)
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
