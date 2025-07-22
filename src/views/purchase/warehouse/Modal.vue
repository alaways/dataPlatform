<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { userFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { setWarehouseItem, updateWarehouseItem } from '/@/api/purchase/warehouse'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'PurchaseWarehouseModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
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
        const supplierNo = data?.supplierNo

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
            supplierNo,
            city: [data.record.provinceName, data.record.cityName, data.record.boroughName],
          })
        } else {
          setFieldsValue({
            supplierNo,
          })
        }
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'))

      async function handleSubmit() {
        try {
          const values = await validate()
          const formParams = cloneDeep(values)

          if (values.city) {
            formParams.provinceName = values.city[0]
            formParams.cityName = values.city[1]
            formParams.boroughName = values.city[2]
          }
          delete formParams.city
          setModalProps({ confirmLoading: true })
          // TODO custom api
          if (!unref(isUpdate)) {
            await setWarehouseItem(formParams)
          } else {
            await updateWarehouseItem(formParams)
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
