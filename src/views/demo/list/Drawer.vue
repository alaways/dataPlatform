<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="40%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { formSchema } from './data'
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer'
  import { getUserList } from '/@/api/system/account'
  import { addStoreItem, updateStoreItem } from '/@/api/store/index'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import { handleImgUploadFormat, handlenAmount } from '/@/utils/tool'

  export default defineComponent({
    name: 'Drawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const sendTime = ref(null)
      const { createMessage } = useMessage()

      const [
        registerForm,
        { resetFields, setFieldsValue, validate, updateSchema, getFieldsValue },
      ] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
      })

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields()
        setDrawerProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate

        // 传入表单默认值
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
            bindUid: String(data.record.bindUid),
            settleRate: Number((data.record.settleRate * 100).toFixed(0)),
            loanSettleRate: Number((data.record.loanSettleRate * 100).toFixed(0)),
            weekLoanSettleRate: Number((data.record.weekLoanSettleRate * 100).toFixed(0)),
            monthLoanSettleRate: Number((data.record.monthLoanSettleRate * 100).toFixed(0)),
            ...handlenAmount(
              {
                withdrawLimit: data.record.withdrawLimit || 0,
                availableBalanceNotify: data.record.availableBalanceNotify || 0,
              },
              false,
            ),
          })
        }
        init()
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增商家' : '编辑商家'))
      async function init() {
        const res = await getUserList({ limit: 999999, status: '1', userType: '1' })
        const values = await getFieldsValue()
        updateSchema([
          {
            field: 'bindUid',
            componentProps: {
              options: [...res?.list],
              fieldNames: {
                label: 'userName',
                value: 'uid',
              },
              onChange: (e, v) => {
                setFieldsValue({ ...values, merchantName: v.userName, bindUid: v.uid })
              },
            },
          },
        ])
      }
      async function handleSubmit() {
        try {
          if (sendTime.value && new Date().valueOf() - sendTime.value <= 2000) return
          sendTime.value = new Date().valueOf()

          const values = await validate()
          setDrawerProps({ confirmLoading: true })
          let parmas = cloneDeep(values)
          parmas = {
            ...parmas,
            ...handlenAmount(
              {
                withdrawLimit: parmas.withdrawLimit,
                availableBalanceNotify: parmas.availableBalanceNotify,
              },
              true,
            ),
          }

          parmas.merchantLogo = handleImgUploadFormat(parmas.merchantLogo).join(',')
          parmas['settleRate'] = parmas.settleRate / 100
          parmas['loanSettleRate'] = parmas.loanSettleRate / 100
          parmas['monthLoanSettleRate'] = parmas.monthLoanSettleRate / 100
          parmas['weekLoanSettleRate'] = parmas.weekLoanSettleRate / 100
          // TODO custom api
          if (!unref(isUpdate)) {
            await addStoreItem(parmas)
          } else {
            await updateStoreItem(parmas)
          }

          createMessage.success(`${getTitle.value}成功`)
          closeDrawer()
          emit('success')
        } finally {
          setDrawerProps({ confirmLoading: false })
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit }
    },
  })
</script>
