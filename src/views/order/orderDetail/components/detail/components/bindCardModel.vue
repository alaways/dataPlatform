<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <template #footer>
      <a-button key="back" @click="handleCancel">{{ isCardList ? '关闭' : '取消' }}</a-button>
      <a-button
        v-if="!isCardList"
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleSubmit"
      >
        确认
      </a-button>
    </template>

    <BasicTable v-show="isCardList" @register="registerTable" />

    <BasicForm v-show="!isCardList" @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { bindCardForm, bindCardTableColumn } from '../data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { updateRemarkApi } from '/@/api/order'
  import { BasicTable, useTable } from '/@/components/Table'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'BindCardModel',
    components: { BasicModal, BasicForm, BasicTable },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const list = ref<any>([])
      const isCardList = ref(false)
      const loading = ref(false)

      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: bindCardForm,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerTable, { setTableData }] = useTable({
        title: '',
        columns: bindCardTableColumn,
        bordered: true,
        showIndexColumn: false,
        pagination: false,
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        loading.value = false
        isUpdate.value = !!data?.isUpdate
        list.value = data?.bindCardList

        // 如果不是代绑卡状态，只显示绑卡信息
        isCardList.value = data.record.status != 400
        // if (!isCardList.value) {
        //   isCardList.value = !!data?.bindCardList.length
        // }

        setTableData(list.value)
        setFieldsValue({
          ...data.record,
        })
      })

      const getTitle = computed(() =>
        isCardList.value ? '用户绑卡信息' : '提示: 无可绑定银行卡，跳过绑卡阶段',
      )

      function handleCancel() {
        closeModal()
      }

      async function handleSubmit() {
        try {
          const values = await validate()
          const formValue = cloneDeep(values)
          formValue['status'] = 401
          setModalProps({ confirmLoading: true })
          loading.value = true
          // TODO custom api
          await updateRemarkApi(formValue)
          createMessage.success(`修改成功`)
          emit('success')
          closeModal()
        } finally {
          setModalProps({ confirmLoading: false })
          loading.value = false
        }
      }

      return {
        registerTable,
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
        handleCancel,
        loading,
        list,
        isCardList,
      }
    },
  })
</script>
