<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <!-- <template #merchantTips="{ model }">
        <div class="text-sm" style="margin: -20px 0 0 35px">
          <span>提示: &nbsp;该商家承担订单货款占比: &nbsp;&nbsp;</span>
          <span style="color: red">{{ model['merchantTips'] }}%</span>
        </div>
      </template> -->
      <template #ordermodifyLoanMoney>
        <div style="margin: 0 0 0 36px">批量修改提成</div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { batchFormSchema } from '../allocation/data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { allocationBatchOrderStore } from '/@/api/order'
  import { handlenAmount } from '/@/utils/tool'
  import { cloneDeep } from 'lodash-es'
  import { getStoreNoPageList } from '/@/api/store'
  export default defineComponent({
    name: 'Modal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)

      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: batchFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })
      const record = ref([])
      const getList = async () => {
        const allMerchantCodes = record.value?.map((item: any) => item.merchantCode)
        const res = await getStoreNoPageList({ pageSize: 999999, limit: 999999 })
        res.list = res.list?.map((item: any) => {
          const fitem = allMerchantCodes?.find((aitem: any) => aitem == item.merchantCode)
          if (fitem) {
            item.disabled = true
          }
          return item
        })
        return res
      }
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        record.value = data.rowList
        if (unref(isUpdate)) {
          setFieldsValue({
            orderIds: data?.orderIds,
          })
        }
        updateSchema({
          field: 'merchantCode',
          componentProps: ({ formModel }) => {
            return {
              showSearch: true,
              placeholder: '请选择',
              api: getList,
              params: { pageSize: 999999, limit: 999999 },
              resultField: 'list',
              labelField: 'merchantName',
              valueField: 'merchantCode',
              onChange: (e, v) => {
                formModel['merchantTips'] = Number(((v.loanSettleRate || 0) * 100).toFixed(0))
                updateSchema({
                  field: 'merchantTips',
                })
              },
            }
          },
        })
      })

      const getTitle = computed(() => '批量修改提成后分配订单')

      async function handleSubmit() {
        try {
          const values = await validate()
          let formParams = cloneDeep(values)
          formParams = {
            ...formParams,
            ...handlenAmount(
              {
                modifyRoyaltyFee: Number(formParams.modifyRoyaltyFee),
              },
              true,
            ),
          }

          setModalProps({ confirmLoading: true })
          const res = await allocationBatchOrderStore(formParams)
          if (res.data.code == 200) {
            createMessage.success(`分配成功`)
            closeModal()
            emit('success')
          } else {
            createMessage.warn(res.data.message)
          }
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit }
    },
  })
</script>
