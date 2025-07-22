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
      </BasicForm>
    </Spin>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { paidFormSchema } from './data'
  import { Spin } from 'ant-design-vue'
  import { batchBillAmount } from '/@/api/order'
  import { formatNumber } from '/@/utils/tool'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'Modal',
    components: { BasicModal, BasicForm, Spin },
    emits: ['success', 'register', 'cancle'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const spinLoading = ref(false)
      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
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
        }
      })

      const getTitle = computed(() => '批量入账')

      function handleReload() {
        emit('cancle')
      }

      async function handleSubmit() {
        setModalProps({ confirmLoading: true })
        const params = await validate()
        await batchBillAmount(params)
        setModalProps({ confirmLoading: false })

        emit('success')
        closeModal()
      }

      return {
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
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
