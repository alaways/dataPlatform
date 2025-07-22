<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #sku="{ model }">
        <div>{{ model['sku'] }}</div>
      </template>
      <template #skuName="{ model }">
        <div style="font-size: 13px; color: red; margin: -10px 0 0 24px"
          >当前规格: {{ model['skuName'] }}</div
        >
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { skuNameFormSchema } from '../data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { getSkuInfo, updateSku } from '/@/api/order'

  export default defineComponent({
    name: 'CancleModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)

      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
        labelWidth: 100,
        schemas: skuNameFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate

        const spu = data.record.skuName && data.record.skuName.split(' ')

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
            specsValue: spu[0],
            sku: spu[1],
          })
        }

        const res = await getSkuInfo(data.record)
        updateSchema([
          {
            field: 'specsValue',
            componentProps: {
              options: res,
              fieldNames: {
                label: 'value',
                value: 'value',
                key: 'value',
              },
            },
          },
        ])
      })

      const getTitle = computed(() => '编辑规格信息')

      async function handleSubmit() {
        try {
          const values = await validate()
          setModalProps({ confirmLoading: true })
          await updateSku(values)
          closeModal()
          createMessage.success(`修改成功`)
          emit('success')
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit }
    },
  })
</script>
