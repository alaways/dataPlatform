<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #record="{ model }">
        <div class="flex text-right leading-loose">
          <div style="width: 100px; padding-right: 8px">订单编号:</div>
          <div>{{ model['record']?.orderSn || '' }}</div>
        </div>
        <div class="flex text-right leading-loose">
          <div style="width: 100px; padding-right: 8px">姓名:</div>
          <div>{{ model['record']?.nickName || '' }}</div>
        </div>
        <div class="flex text-right leading-loose">
          <div style="width: 100px; padding-right: 8px">手机号:</div>
          <div>{{ model['record']?.phone || '' }}</div>
        </div>
        <div class="flex text-right leading-loose">
          <div style="width: 100px; padding-right: 8px">商品类目:</div>
          <div>{{ model['record']?.spuType || '' }}</div>
        </div>
        <div class="flex text-right leading-loose">
          <div style="width: 100px; padding-right: 8px">商品名称:</div>
          <div>{{ model['record']?.spuName || '' }}</div>
        </div>
        <div class="flex text-right leading-loose">
          <div style="width: 100px; padding-right: 8px">商品规格:</div>
          <div>{{ model['record']?.skuName || '' }}</div>
        </div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { cancleFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { getOrderCancle } from '/@/api/order'
  import { spuTypeList } from '../../goods/goodsBase/data'

  export default defineComponent({
    name: 'CancleModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const fastMailList = ref([])
      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: cancleFormSchema,
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
        const record = data?.record
        const find: any = spuTypeList.find((v) => v.value == record.spuType)
        if (unref(isUpdate)) {
          setFieldsValue({
            ...record,
            record: {
              ...record,
              spuType: find.label || '',
            },
          })
        }
      })

      const getTitle = computed(() => '取消提示')

      async function handleSubmit() {
        try {
          const values = await validate()
          setModalProps({ confirmLoading: true })
          await getOrderCancle(values)
          closeModal()
          createMessage.success(`取消成功`)
          emit('success')
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit }
    },
  })
</script>
