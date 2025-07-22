<template>
  <PageWrapper class="p-0 pb-10">
    <BasicForm @register="register">
      <template #contacts="{ model, field }">
        <ContactsTable
          v-if="model[field]"
          :pdata="model[field]"
          isEmit
          key="info"
          @contacts="handleContactsChange"
        />
      </template>
    </BasicForm>
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
  import { getUserConcern, updateOrderUser } from '/@/api/order'
  import { canParseJSON } from '/@/utils/tool'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { Modal } from 'ant-design-vue'
  import ContactsTable from '../detail/components/contacts/contactsTable.vue'

  const props = {
    detailInfo: { type: Object },
  }
  export default defineComponent({
    name: 'Information',
    components: { BasicForm, PageWrapper, ContactsTable },
    props,
    setup(props) {
      const { createMessage } = useMessage()
      const parent: any = inject('init')

      const [register, { validate, setFieldsValue, updateSchema }] = useForm({
        labelWidth: 120,
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

        // 获取用户关系列表
        const res = await getUserConcern({ label: 'sysConf.user.emergencyContactRelationship2' })
        let options = []
        if (canParseJSON(res)) {
          const opt = JSON.parse(res)
          options = opt.map((v) => {
            return { label: v, value: v }
          })
        }
        updateSchema([
          {
            field: 'emergentRelation1',
            componentProps: { options },
          },
          {
            field: 'emergentRelation2',
            componentProps: { options },
          },
        ])
      }

      function handleImage(img: any) {
        if (!img) return ''
        if (typeof img != 'string') {
          return img.join(',')
        }
      }

      function handleContactsChange(data: any) {
        setFieldsValue({
          emergentName1: data.emergentName1,
          emergentPhone1: data.emergentPhone1,
          emergentRelation1: data.emergentRelation1,
          emergentStatus1: data.emergentStatus1,
          emergentName2: data.emergentName2,
          emergentPhone2: data.emergentPhone2,
          emergentRelation2: data.emergentRelation2,
          emergentStatus2: data.emergentStatus2,
          emergents: data.emergents || '',
        })
      }

      async function submitAll() {
        try {
          const values = await validate()
          const modal = Modal.confirm({
            title: () => '是否确认修改用户信息',
            onCancel: () => {},
            onOk: async function () {
              values['cardFrontImage'] = handleImage(values.cardFrontImage)
              values['cardBackImage'] = handleImage(values.cardBackImage)
              values['cardHandImage'] = handleImage(values.cardHandImage)
              values['uploadImages'] = handleImage(values.uploadImages)
              values['uploadFiles'] = handleImage(values.uploadFiles)

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

      return { register, submitAll, handleContactsChange }
    },
  })
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
