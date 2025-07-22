<template>
  <BasicModal
    :width="700"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #mode>
        <div>银行卡</div>
      </template>
      <template #t1>
        <div class="text-sm font-bold ml-3">寄件人信息</div>
      </template>
      <template #t2>
        <div class="text-sm font-bold ml-3">收件人信息</div>
      </template>
      <template #t3>
        <div class="text-sm font-bold ml-3">商品信息</div>
      </template>
      <template #goodsName>
        <div>{{ detailInfo?.spuName || '-' }}</div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { deliveryFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { updateDelivery } from '/@/api/order'
  import { Modal } from 'ant-design-vue'
  import { cloneDeep } from 'lodash-es'
  import { handlenAmount } from '/@/utils/tool'

  export default defineComponent({
    name: 'Modal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const fastMailList = ref([])
      const detailInfo = ref()

      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: deliveryFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate

        fastMailList.value = data?.fastMailList
        detailInfo.value = data?.record

        // 收件地址
        const receiver: string[] = [data.record.receiverProvince]
        if (data.record.receiverCity) {
          receiver.push(data.record.receiverCity)
          if (data.record.receiverRegion) {
            receiver.push(data.record.receiverRegion)
          }
        }

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
            receiver,
            deliverySerialNumber2: data.record?.deliverySerialNumber || '',
            deliverySerialNumber3: data.record?.deliverySerialNumber || '',
          })
        }
        const treeData = data?.fastMailList
        updateSchema({
          field: 'deliveryCompany',
          componentProps: { options: treeData },
        })
      })

      const getTitle = computed(() => '发货')

      async function handleSubmit() {
        try {
          const values = await validate()
          let formValues = cloneDeep(values)
          if (formValues.deliverMode == 2) {
            formValues = {
              ...formValues,
              deliverySerialNumber: formValues.deliverySerialNumber2,
              ...handlenAmount(
                {
                  supplierPrice: formValues.supplierPrice,
                },
                true,
              ),
            }
            delete formValues.deliverySerialNumber2
          }
          if (formValues.deliverMode == 3) {
            formValues = {
              ...formValues,
              deliverySerialNumber: formValues.deliverySerialNumber3,
              ...handlenAmount(
                {
                  supplierPrice: formValues.supplierPrice,
                },
                true,
              ),
            }
            // 处理收件人地址
            const receiver = values.receiver
            if (receiver) {
              if (receiver[0]) {
                formValues['receiverProvince'] = receiver[0]
                if (receiver[1]) {
                  formValues['receiverCity'] = receiver[1]
                  if (receiver[2]) {
                    formValues['receiverRegion'] = receiver[2]
                  }
                }
              }
            }
            delete formValues.receiver
            delete formValues.senderAddress
            delete formValues.deliverySerialNumber3
          }
          Modal.confirm({
            title: () => '请确认信息是否有误',
            onCancel: () => {},
            onOk: async function () {
              try {
                if (['1', '3'].includes(formValues.deliverMode)) {
                  const find: any = fastMailList.value.find(
                    (v: any) => v.comName == formValues.deliveryCompany,
                  )
                  formValues['com'] = find?.com
                  formValues['sysSfExpressConfigCode'] = 'gs'
                }
                setModalProps({ confirmLoading: true })
                const res = await updateDelivery(formValues)
                if (res.data.code == 200) {
                  closeModal()
                  createMessage.success(`发货成功`)
                  emit('success')
                } else {
                  createMessage.warn(res?.data?.message)
                  setModalProps({ confirmLoading: false })
                }
              } catch (error) {
                setModalProps({ confirmLoading: false })
              }
            },
          })
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, detailInfo }
    },
  })
</script>
