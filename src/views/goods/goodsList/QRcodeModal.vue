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
  import { paidFormSchema } from './data'
  import { Button, Image, Spin } from 'ant-design-vue'
  import { isAdmin } from '/@/utils/is'
  import { getAppEnvConfig } from '/@/utils/env'
  import { creatQRCode } from '/@/api/goods'
  import { nextTick } from 'vue'
  import { useUserStore } from '/@/store/modules/user'
  // import { useMessage } from '/@/hooks/web/useMessage'

  export default defineComponent({
    name: 'QRCodeModal',
    components: { BasicModal, BasicForm, Button },
    setup() {
      const { VITE_GLOB_API_URL } = getAppEnvConfig()
      const userStore = useUserStore()
      const userInfo = userStore.getUserInfo

      // const { createMessage } = useMessage()
      const isUpdate = ref(true)

      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
        labelWidth: 130,
        schemas: paidFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        const detailInfo = data?.record?.spuRentAttributeList || []

        const find = detailInfo.find((v) => v.type == data?.record?.type)

        updateSchema({
          field: 'qrCode',
          render: () => h('div', {}, ''),
        })

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
            rentType: find?.rentType,
          })
        }

        updateSchema({
          field: 'qrSelect',
          componentProps: ({ formModel }) => {
            return {
              options: data?.appletList,
              onChange: async (e: any) => {
                console.log(e)
                // 切换时如果没有填金额
                updateSchema({
                  field: 'qrCode',
                  colProps: { span: 16 },
                  render: () => h(Spin, { tip: '加载中...', spinning: true }),
                })
                let prarms = `id=${formModel.id}&rentType=${formModel.rentType}`
                if (formModel.type) {
                  prarms = `${prarms}&type=${formModel.type}`
                }
                if (userInfo.tenantCode) {
                  prarms = `${prarms}&tenantCode=${userInfo.tenantCode}`
                }
                let url
                if (isAdmin()) {
                  url = `https://yizu.gsrental.cn/${e}?${prarms}`
                } else {
                  let str = e
                  if (e == 'Wechat-gsyz') {
                    str = 2023111709466887
                  } else if (e == 'Wechat-klzj') {
                    str = 2023111718357889
                  } else if (e == 'Wechat-gszj') {
                    str = 2023111709468001
                  }
                  url = `${VITE_GLOB_API_URL}/${str}?${prarms}`
                }
                const res: any = await creatQRCode({ url })
                updateSchema({
                  field: 'qrCode',
                  colProps: { span: 16 },
                  render: () => h(Image, { width: 200, height: 200, src: res }),
                })
              },
            }
          },
        })
        nextTick(() => {
          handleGetCode()
        })
      })

      const getTitle = computed(() => '商品二维码')

      // 修改二维码
      async function handleGetCode() {
        const values = await validate()
        const prarms = `${values.merchantTerminalNo}?id=${values.id}&rentType=${values.rentType}`
        let url = `https://yizu.gsrental.cn/${prarms}`
        if (!isAdmin) {
          url = `${VITE_GLOB_API_URL}/${prarms}`
        }
        const res: any = await creatQRCode({ url })

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
