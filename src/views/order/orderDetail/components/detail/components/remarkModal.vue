<template>
  <BasicModal
    width="800px"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    destroyOnClose
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { updateRemark } from '../data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { updateRemarkApi } from '/@/api/order'
  import { cloneDeep } from 'lodash-es'
  import { updateOrderSalesPerson } from '/@/api/business/salesperson'
  import { handleImage } from '/@/utils/tool'

  export default defineComponent({
    name: 'RemarkModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const name = ref('')

      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: updateRemark,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        name.value = data.name
        const storeMerchantId = data.record?.storeMerchantId || 0

        if (unref(isUpdate)) {
          setFieldsValue({
            name,
            ...data.record,
            storeMerchantId: Number(storeMerchantId) || null,
          })
        }
      })

      const nameObj = {
        salesperson: '业务员',
        salesmanGuarantee: '业务员担保',
        ipCity: '订单归属地区',
        remark: '备注',
        storeMerchantName: '门店商家名称',
        prosecuteStatus: '起诉',
        needEsnotary: '',
      }
      const getTitle = computed(() => `编辑${nameObj[name.value] || ''}`)

      async function handleSubmit() {
        try {
          const values = await validate()
          const formValue = cloneDeep(values)
          delete formValue.name
          if (values.ipCity) {
            formValue.ipProvince = values.ipCity[0]
            formValue.ipCity = values.ipCity[1]
          }
          if (formValue.prosecuteStatus == 1) {
            formValue['prosecuteFiles'] = handleImage(values.prosecuteFiles)
          }
          setModalProps({ confirmLoading: true })
          // TODO custom api
          if (name.value == 'salesperson') {
            formValue['orderId'] = formValue.id
            await updateOrderSalesPerson(formValue)
          } else {
            await updateRemarkApi(formValue)
          }
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
