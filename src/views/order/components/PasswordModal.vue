<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" v-if="false" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { passwordFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import {
    getOfflineNew,
    getOrderCancle,
    updateOrderAudit,
    uploadAllocationOrderStore,
  } from '/@/api/order'

  export default defineComponent({
    name: 'PasswordModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const comeData = ref<any>() // 来源数据
      const { createMessage } = useMessage()

      const [registerForm, { resetFields }] = useForm({
        labelWidth: 100,
        schemas: passwordFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        comeData.value = data?.data
        console.log(comeData.value)
      })

      // const getTitle = computed(() => '本次操作需要输入操作密码')
      const getTitle = computed(() => '是否确认操作')

      async function handleSubmit() {
        try {
          // const values = await validate()
          setModalProps({ confirmLoading: true })
          let res
          // TODO custom api
          // if (comeData.value?.come == 'storeOrder') {
          //   res = await storePassword(values)
          // } else {
          //   res = await operationPassword(values)
          // }
          // res = await samePassword(values)

          // if (res.code == 200 || res.data) {
          // createMessage.success(`密码验证成功`)
          switch (comeData.value?.come) {
            case 'orderCancle':
              // 全部订单的取消
              res = await getOrderCancle({ id: comeData.value.data.id })
              createMessage.success(`取消成功`)
              break
            case 'examine':
              // 审核
              res = await updateOrderAudit(comeData.value.data)
              createMessage.success(`操作成功`)
              break
            case 'paid':
              // 收款
              // 如果是二维码支付，假动作
              if (comeData.value.data?.payment == '1') return
              res = await getOfflineNew(comeData.value.data)
              if (res.code == 500) {
                createMessage.error(res.message)
                throw res.message
              } else {
                createMessage.success(`确认收款成功`)
              }
              break
            case 'storeOrder':
              // 商家分配确认
              res = await uploadAllocationOrderStore(comeData.value.data)
              if (res && res.code == 500) {
                createMessage.error(res.message)
                return
              }
              if (comeData.value.isCancel) {
                createMessage.success(`拒单成功`)
              } else {
                createMessage.success(`接单成功`)
              }
              break
          }

          // if (res && res.code == 500) {
          //   createMessage.error(res.message)
          //   return
          // }

          //   emit('success', {})
          // } else {
          //   createMessage.error(`密码验证错误`)
          // }
          closeModal()
          emit('success', {})
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit }
    },
  })
</script>
