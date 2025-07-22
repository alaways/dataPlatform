<template>
  <BasicModal
    :width="1000"
    v-bind="$attrs"
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
  import { userFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { setMangerItem, updateMangerItem } from '/@/api/sue/index'

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
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
        } else {
          setFieldsValue({
            content: ``,
          })
        }
        updateSchema({
          field: 'helpArticleCategoryId',
          componentProps: ({ formModel }) => {
            return {
              options: data.helpArticleCategoryId,
              fieldNames: {
                label: 'name',
                value: 'id',
                key: 'id',
              },
              onChange: (e, v) => {
                console.log(e)
                formModel.helpArticleCategoryName = v.name
              },
            }
          },
        })
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'))

      async function handleSubmit() {
        try {
          const values = await validate()

          setModalProps({ confirmLoading: true })
          // TODO custom api
          if (!unref(isUpdate)) {
            await setMangerItem(values)
          } else {
            await updateMangerItem(values)
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
