<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    destroyOnClose
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #text>
        <div>
          <div class="flex">
            <span class="text-right mr-3" style="width: 94px">租期: </span>
            <span class="text-[#e11d48]">{{ record?.periodNo || '-' }}</span>
          </div>
          <div class="flex mt-3">
            <span class="text-right mr-3" style="width: 94px">到期日: </span>
            <span class="text-[#e11d48]">{{ record?.repayDate || '-' }}</span>
          </div>
          <div class="flex mt-3">
            <span class="text-right mr-3" style="width: 94px">当前逾期罚金: </span>
            <span class="text-[#e11d48]">{{ handleFormat(record?.penaltyAmount || 0) }}</span>
            <span>(元)</span>
          </div>
        </div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { penaltyAmountFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { updateBillPenaltyAmount } from '/@/api/order'
  import { cloneDeep } from 'lodash-es'
  import { Modal } from 'ant-design-vue'
  import { formatNumber } from '/@/utils/tool'

  export default defineComponent({
    name: 'PenaltyAmountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()
      const record = ref<any>()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: penaltyAmountFormSchema,
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
          record.value = data.record
          delete data.record.modifyPenaltyAmount
          setFieldsValue({
            ...data.record,
          })
        }
      })

      function handleFormat(num) {
        return formatNumber(num, 2, '.', ',', '￥')
      }

      const getTitle = '逾期罚金修改'

      async function handleSubmit() {
        try {
          const values = await validate()
          const fromValues = cloneDeep(values)
          fromValues['orderId'] = Number(fromValues.orderId)

          if (fromValues.modifyPenaltyAmount) {
            fromValues['modifyPenaltyAmount'] = Number(
              (fromValues.modifyPenaltyAmount * 100).toFixed(0),
            )
          } else {
            fromValues['modifyPenaltyAmount'] = 0
          }

          Modal.confirm({
            title: () => `请再次确认修改逾期罚金！`,
            onCancel: () => {},
            onOk: async () => {
              setModalProps({ confirmLoading: true })
              // TODO custom api
              try {
                await updateBillPenaltyAmount(fromValues)
                createMessage.success(`${getTitle}成功`)
                closeModal()
                emit('success')
              } finally {
                setModalProps({ confirmLoading: false })
              }
            },
          })
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, handleFormat, record }
    },
  })
</script>
