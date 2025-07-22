<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" destroyOnClose>
    <BasicForm @register="registerForm">
      <template #name="{ model }">
        <div>{{ model['name'] }}</div>
      </template>
    </BasicForm>
    <template #footer>
      <Button type="primary" @click="closeModal">关闭</Button>
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, h } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { qrCodeFormSchema } from './data'
  import { Button, Image } from 'ant-design-vue'
  import { nextTick } from 'vue'
  import { creatNewCalculatorQRCode } from '/@/api/calculator/newCalculator'

  export default defineComponent({
    name: 'QRCodeModal',
    components: { BasicModal, BasicForm, Button },
    setup() {
      const isUpdate = ref(true)

      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
        labelWidth: 130,
        schemas: qrCodeFormSchema,
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
          setFieldsValue({
            ...data.record,
          })
        }
        nextTick(() => {
          handleGetCode()
        })
      })

      const getTitle = computed(() => '计算器二维码')

      // 修改二维码
      async function handleGetCode() {
        const values = await validate()
        const url = `https://admin.gsrental.cn/calculator2?id=${
          values.id
        }&time=${new Date().valueOf()}`
        const res: any = await creatNewCalculatorQRCode({ url })

        updateSchema({
          field: 'qrCode',
          colProps: { span: 16 },
          render: () => h(Image, { width: 200, height: 200, src: res }),
        })
      }

      return {
        registerModal,
        registerForm,
        getTitle,
        handleGetCode,
        closeModal,
      }
    },
  })
</script>

<style lang="less" scoped>
  .ant-tabs {
    ::v-deep(.ant-tabs-nav) {
      padding: 0 100px;

      &::before {
        border-width: 0;
      }

      .ant-tabs-nav-list {
        flex: 1;
        justify-content: space-around;
      }
    }
  }
</style>
