<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    destroyOnClose
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed, ref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { formSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { getCollectsStatusList, setTaskRecordItem } from '/@/api/collection/task'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'RecordAddModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage } = useMessage()
      const type = ref(1)
      const [registerForm, { setFieldsValue, resetFields, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        type.value = Number(data.type)

        setFieldsValue({
          orderId: data.orderId,
          followBy: data.uid,
          type: data.type,
        })

        if (data.type == 1) {
          getCollectsStatusList({ cursor: 999999, status: 1, isNew: 1 }).then((res) => {
            const options = res.map((v) => {
              return { label: v.name, value: v.code }
            })
            updateSchema({
              field: 'status',
              componentProps: { options },
            })
          })
        }
      })

      const getTitle = computed(() => (type.value == 1 ? '新增催收记录' : '新增备注记录'))

      async function handleSubmit() {
        try {
          const values = await validate()
          const formValues = cloneDeep(values)
          formValues['type'] = Number(formValues.type)
          setModalProps({ confirmLoading: true })
          await setTaskRecordItem(formValues)
          closeModal()
          createMessage.success(`新增成功`)
          emit('success')
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit }
    },
  })
</script>
