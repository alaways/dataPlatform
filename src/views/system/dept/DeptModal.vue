<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    destroyOnClose
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form'
  import { formSchema } from './dept.data'

  import { addDeptItem, getDeptList, updateDeptItem } from '/@/api/system/dept'

  const emit = defineEmits(['success', 'register'])

  const isUpdate = ref(true)

  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: false,
  })

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields()
    setModalProps({ confirmLoading: false })
    isUpdate.value = !!data?.isUpdate

    if (unref(isUpdate)) {
      if (data.record?.parentId == 0 || !data.record?.parentId) {
        delete data.record?.parentId
      }
      setFieldsValue({
        ...data.record,
      })
    }
    const treeData = await getDeptList({})
    updateSchema({
      field: 'parentDept',
      componentProps: { treeData },
    })
  })

  const getTitle = computed(() => (!unref(isUpdate) ? '新增部门' : '编辑部门'))

  async function handleSubmit() {
    try {
      const values = await validate()
      setModalProps({ confirmLoading: true })
      // TODO custom api
      if (!unref(isUpdate)) {
        await addDeptItem(values)
      } else {
        await updateDeptItem(values)
      }
      closeModal()
      emit('success')
    } finally {
      setModalProps({ confirmLoading: false })
    }
  }
</script>
