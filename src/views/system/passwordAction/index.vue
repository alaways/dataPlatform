<template>
  <PageWrapper title="修改当前操作密码">
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> 重置 </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { BasicForm, useForm } from '/@/components/Form'

  import { formSchema } from './pwd.data'
  import { updatePasswordAction } from '/@/api/system/account'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { Modal } from 'ant-design-vue'

  export default defineComponent({
    name: 'ChangePassword',
    components: { BasicForm, PageWrapper },
    setup() {
      const [register, { validate, resetFields }] = useForm({
        size: 'large',
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema,
      })
      const { createMessage } = useMessage()

      async function handleSubmit() {
        try {
          const values = await validate()
          Modal.confirm({
            title: () => '是否确认修改操作密码',
            onCancel: () => {},
            onOk: async function () {
              // TODO custom api
              await updatePasswordAction(values)
              createMessage.success(`修改操作密码成功`)
            },
          })
        } catch (error) {}
      }

      return { register, resetFields, handleSubmit }
    },
  })
</script>
