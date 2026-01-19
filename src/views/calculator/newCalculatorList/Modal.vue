<template>
  <BasicModal
    :width="700"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #interestRateTxt>
        <div class="flex flex-row">
          <div style="width: 100px"></div>
          <div class="flex flex-col text-[#e11d48]">
            <div>注: 包含第一期指：第一期（首付），在总期数内（即前台界面选择的期数含第一期）</div>
            <div>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;不含第一期指：第一期（首付），不含在总期数内（即前台界面选择的期数再+1期）
            </div>
          </div>
        </div>
      </template>
      <template #interestRate="{ model }">
        <InterestRateTable ref="interestRateTableRef" :data="model['interestRate']" />
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
  import { cloneDeep } from 'lodash-es'
  import { setNewCalculatorItem, updateNewCalculatorItem } from '/@/api/calculator/newCalculator'
  import InterestRateTable from './interestRateTable.vue'

  export default defineComponent({
    name: 'NewCalculatorModal',
    components: { BasicModal, BasicForm, InterestRateTable },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()
      const interestRateTableRef = ref<any>(null)

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
          let regionIds: any = []
          if (data.record?.provinceRegionId) {
            regionIds = [data.record?.provinceRegionId]
          }
          if (data.record?.cityRegionId) {
            regionIds.push(data.record?.cityRegionId)
          }
          if (data.record?.boroughId) {
            regionIds.push(data.record?.boroughId)
          }
          setFieldsValue({
            ...data.record,
            regionIds,
          })
        }
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'))

      async function handleSubmit() {
        try {
          const values = await validate()
          const newForm = cloneDeep(values)
          delete newForm.regionIds
          setModalProps({ confirmLoading: true })
          if (interestRateTableRef.value) {
            const table = interestRateTableRef.value.getDataSource()
            if (!table || !table.length) {
              createMessage.error(`请新增定价系数`)
              throw ''
            }
            const interestRate = table.map((v) => {
              return {
                period: v.period,
                interestRate: v.interestRate,
                editable: v.editable,
              }
            })
            newForm['interestRate'] = JSON.stringify(interestRate)
          }
          // TODO custom api
          if (!unref(isUpdate)) {
            await setNewCalculatorItem(newForm)
          } else {
            await updateNewCalculatorItem(newForm)
          }
          createMessage.success(`${getTitle.value}成功`)
          closeModal()
          emit('success')
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, interestRateTableRef }
    },
  })
</script>
