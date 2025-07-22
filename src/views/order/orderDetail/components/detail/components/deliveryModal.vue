<template>
  <BasicModal
    width="800px"
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
  import { updateDelivery } from '../data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { checkIfSerialNumber, updateAddress } from '/@/api/order'

  export default defineComponent({
    name: 'DeliveryModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const inName = ref('')

      const { notification, createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: updateDelivery,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        inName.value = data?.name
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
            isOneSerial: data.name == 'deliverySerialNumber',
            address: [
              data.record.receiverProvince || '',
              data.record.receiverCity || '',
              data.record.receiverRegion || '',
            ],
          })
        }
      })

      const getTitle = computed(() => {
        if (inName.value == 'deliverySerialNumber') {
          return '修改串号'
        }
        return '修改地址'
      })

      async function handleSubmit() {
        try {
          const values = await validate()
          if (!values.isOneSerial) {
            values['receiverProvince'] = values.address[0] || ''
            values['receiverCity'] = values.address[1] || ''
            values['receiverRegion'] = values.address[2] || ''
          }
          const res = await checkIfSerialNumber({
            deliverySerialNumber: values.deliverySerialNumber,
          })
          if (res.code == 500) {
            notification.error({
              message: '提示',
              description: `${res.message}`,
              duration: 3,
            })
            return
          }

          setModalProps({ confirmLoading: true })
          // TODO custom api
          await updateAddress(values)
          createMessage.success(`修改成功`)
          emit('success')
          closeModal()
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit }
    },
  })
</script>
