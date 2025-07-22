<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #merchantTips="{ model }">
        <div class="text-sm" style="margin: -20px 0 0 35px">
          <span>提示: &nbsp;该商家承担订单货款占比: &nbsp;&nbsp;</span>
          <span style="color: red">{{ model['merchantTips'] }}%</span>
        </div>
      </template>
      <template #ordermodifyLoanMoney>
        <div style="margin: 0 0 0 36px">订单货款</div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { allocationFormSchema } from '../allocation/data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { allocationOrderStore, getAllocationStoreBool } from '/@/api/order'
  import { Modal } from 'ant-design-vue'
  import { handlenAmount } from '/@/utils/tool'
  import { cloneDeep } from 'lodash-es'
  import { getStoreList } from '/@/api/store'
  export default defineComponent({
    name: 'Modal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)

      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: allocationFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        console.log(data)

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
            ...handlenAmount(
              {
                // 此时传入数据为旧货款
                modifyLoanMoney: data.record.loanMoney || 0,
                modifyRoyaltyFee: data.record.royaltyFee || 30000,
                modifyRebateFee: data.record.rebateFee || 0,
              },
              false,
            ),
          })
        }
        updateSchema({
          field: 'merchantCode',
          componentProps: ({ formModel }) => {
            return {
              showSearch: true,
              placeholder: '请选择',
              api: getStoreList,
              params: { pageSize: 999999, limit: 999999 },
              resultField: 'list',
              labelField: 'merchantName',
              valueField: 'merchantCode',
              onChange: (e, v) => {
                console.log(e)
                formModel['merchantTips'] = Number(((v.loanSettleRate || 0) * 100).toFixed(0))
                updateSchema({
                  field: 'merchantTips',
                })
              },
            }
          },
        })
      })

      const getTitle = computed(() => '分配商家')

      async function handleSubmit() {
        try {
          const values = await validate()
          let formParams = cloneDeep(values)
          formParams = {
            ...formParams,
            ...handlenAmount(
              {
                modifyLoanMoney: formParams.modifyLoanMoney,
                modifyRoyaltyFee: formParams.modifyRoyaltyFee,
                modifyRebateFee: formParams.modifyRebateFee,
              },
              true,
            ),
          }
          formParams['orderId'] = formParams.id
          console.log(formParams)

          setModalProps({ confirmLoading: true })

          const isRefuse = await getAllocationStoreBool(formParams)
          if (isRefuse) {
            Modal.confirm({
              title: () => '已拒绝接收该订单',
              onCancel: () => {},
              onOk: () => {
                handleAllocation()
              },
            })
          } else {
            handleAllocation()
          }

          async function handleAllocation() {
            await allocationOrderStore(formParams)
            createMessage.success(`分配成功`)
            closeModal()
            emit('success')
          }
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit }
    },
  })
</script>
