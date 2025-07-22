<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    destroyOnClose
    @ok="handleSubmit"
    @cancel="handleReload"
  >
    <Spin tip="正在校验交易单号..." size="large" :spinning="spinLoading">
      <BasicForm @register="registerForm">
        <template #totalAmount="{ model }">
          <div>{{ formatNumber(model['totalAmount'], 2) }}元</div>
        </template>
        <template #repayAmount="{ model }">
          <div class="text-[red]">{{ formatNumber(model['repayAmount'] || 0, 2) }}元</div>
        </template>
        <template #penaltyAmount="{ model }">
          <div class="text-[red]">{{ formatNumber(model['penaltyAmount'] || 0, 2) }}元</div>
        </template>
        <template #getCode>
          <Button type="primary" @click="handleGetCode()">获取二维码</Button>
        </template>
      </BasicForm>
    </Spin>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, h, nextTick } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { paidFormSchema } from './data'
  import { Button, Image, Spin } from 'ant-design-vue'
  import { getBatchCollectionPaymentOrder } from '/@/api/order'
  import { formatNumber } from '/@/utils/tool'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'Modal',
    components: { BasicModal, BasicForm, Button, Spin },
    emits: ['success', 'register', 'cancle'],
    setup(_, { emit }) {
      const { createMessage } = useMessage()
      const isUpdate = ref(true)
      const base64QRCode = ref() // 缓存base64QRCode
      const spinLoading = ref(false)
      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
        labelWidth: 130,
        schemas: cloneDeep(paidFormSchema),
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

          if (data.record?.totalAmount) {
            nextTick(() => handleGetCode())
          }
        }
      })

      const getTitle = computed(() => '批量收款')

      // 修改二维码
      async function handleGetCode() {
        const values = await validate()
        updateSchema({
          field: 'payCode',
          colProps: { span: 16 },
          render: () => h(Spin, { tip: '加载中...', spinning: true }),
        })

        const params = { ...values }
        const res = await getBatchCollectionPaymentOrder(params)
        if (res.base64QRCode) {
          base64QRCode.value = res.base64QRCode
        } else {
          createMessage.error(res.message || '您点击的太频繁，请一分钟后再尝试')
        }
        updateSchema({
          field: 'payCode',
          colProps: { span: 16 },
          render: () => h(Image, { width: 200, height: 200, src: base64QRCode.value }),
        })
      }

      function handleReload() {
        emit('cancle')
      }

      async function handleSubmit() {
        try {
          closeModal()
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return {
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
        handleGetCode,
        handleReload,
        spinLoading,
        formatNumber,
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
