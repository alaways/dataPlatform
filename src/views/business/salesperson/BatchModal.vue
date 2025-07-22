<template>
  <BasicModal
    :height="400"
    wrapClassName="bathcModal"
    v-bind="$attrs"
    destroyOnClose
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm class="from" @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { batchModalFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { updateBatchSalespersonItem } from '/@/api/business/salesperson'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'SalespersonBatchModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: batchModalFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate

        setFieldsValue({
          isAdmin: data.isAdmin,
        })
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'))

      async function handleSubmit() {
        try {
          const values = await validate()
          const formValues = cloneDeep(values)
          formValues['id'] = formValues.id.join(',')
          setModalProps({ confirmLoading: true })
          // TODO custom api
          await updateBatchSalespersonItem(formValues)
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
<style scoped lang="less">
  .bathcModal {
    .from {
      height: 360px;
    }
  }
</style>
