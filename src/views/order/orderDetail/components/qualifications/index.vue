<template>
  <PageWrapper class="p-0 pb-10">
    <BasicForm @register="register" />
    <template #rightFooter>
      <a-button type="primary" @click="submitAll"> 提交 </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form'
  import { defineComponent, inject, onMounted } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { schemas } from './data'
  import { updateOrderUser } from '/@/api/order'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { Modal } from 'ant-design-vue'

  const props = {
    detailInfo: { type: Object },
  }
  export default defineComponent({
    name: 'Information',
    components: { BasicForm, PageWrapper },
    props,
    setup(props) {
      const { createMessage } = useMessage()
      const parent: any = inject('init')

      const [register, { validate, setFieldsValue }] = useForm({
        labelWidth: 150,
        baseColProps: {
          span: 8,
        },
        schemas,
        showActionButtonGroup: false,
      })
      onMounted(() => {
        init()
      })
      async function init() {
        setFieldsValue({
          ...props.detailInfo,
          ...props.detailInfo?.userIdentifyVO,
          contacts: props.detailInfo?.userIdentifyVO,
          orderId: props.detailInfo?.id,
        })
      }

      function handleImage(img: any) {
        if (!img) return ''
        if (typeof img != 'string') {
          const data = img.map((v) => v.url || v)
          return data.join(',')
        }
      }

      async function submitAll() {
        try {
          const values = await validate()
          const modal = Modal.confirm({
            title: () => '是否确认修改用户资质',
            onCancel: () => {},
            onOk: async function () {
              values['uploadImages'] = handleImage(values.uploadImages)
              values['uploadFiles'] = handleImage(values.uploadFiles)
              values['uploadPhoto'] = handleImage(values.uploadPhoto)
              values['uploadVideo'] = handleImage(values.uploadVideo)

              try {
                await updateOrderUser(values)
                createMessage.success(`修改成功`)
                parent()
              } catch (error) {
                modal.destroy()
              }
            },
          })
        } catch (error) {}
      }

      return { register, submitAll }
    },
  })
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
