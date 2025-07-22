<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #headInterestList="{ model }">
        <div>租期利率</div>
        <PlanTable ref="planTableRef" :pdata="model['headInterestList']" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { userFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { setAreaItem, updateAreaItem } from '/@/api/calculator/area'
  import { cloneDeep } from 'lodash-es'
  import { canParseJSON, formatNumber } from '/@/utils/tool'
  import PlanTable from './planTable.vue'

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm, PlanTable },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()

      // 分期计划
      const planTableRef = ref<{ getDataSource: () => any } | null>(null)

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: userFormSchema,
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
          let regionId = data.record.regionTree
          let interestRate = data.record.interestRate || 0
          if (regionId) {
            regionId = String(regionId).split('/')
          }
          if (interestRate) {
            interestRate = Number(formatNumber(interestRate, 2))
          }
          setFieldsValue({
            ...data.record,
            interestRate,
            regionId,
          })
        }

        // 处理自定义字段 JSON
        let additionalData = data.record.additionalData
        if (additionalData && canParseJSON(additionalData)) {
          additionalData = JSON.parse(additionalData)
        }
        // 处理租赁方式
        let headInterestList: any = (additionalData && additionalData?.headInterestList) || []
        if (!headInterestList.length) {
          for (let i = 0; i < 12; i++) {
            headInterestList.push({ periodNo: i + 1, interestRate: 0 })
          }
        } else {
          headInterestList = headInterestList.map((v: any) => {
            return { ...v, interestRate: Number(formatNumber(v.interestRate, 2)) }
          })
        }
        setFieldsValue({
          headInterestList,
        })
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'))

      async function handleSubmit() {
        try {
          const values = await validate()
          const newForm = cloneDeep(values)
          newForm['regionParentId'] = newForm.regionParentId || 0
          newForm['regionId'] = newForm.regionId[newForm.regionId.length - 1]
          newForm['interestRate'] = parseInt(newForm.interestRate * 100)

          // 处理租期利率
          let headInterestList: any = []
          if (planTableRef.value) {
            headInterestList = cloneDeep(planTableRef.value.getDataSource())
            headInterestList = headInterestList.map((v: any) => {
              return {
                ...v,
                interestRate: parseInt(v.interestRate * 100),
              }
            })
            let additionalData = newForm.additionalData
            if (additionalData && canParseJSON(additionalData)) {
              additionalData = JSON.parse(additionalData)
            } else {
              additionalData = {}
            }
            additionalData['headInterestList'] = headInterestList
            newForm.additionalData = JSON.stringify(additionalData)
          }

          setModalProps({ confirmLoading: true })
          // TODO custom api
          if (!unref(isUpdate)) {
            await setAreaItem(newForm)
          } else {
            await updateAreaItem(newForm)
          }
          createMessage.success(`${getTitle.value}成功`)
          closeModal()
          emit('success')
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, planTableRef }
    },
  })
</script>
