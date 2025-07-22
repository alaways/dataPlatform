<template>
  <BasicModal
    width="900px"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    destroyOnClose
    :bodyStyle="{ height: '460px' }"
  >
    <Spin tip="正在加载业务员所属地区..." size="large" :spinning="loading">
      <BasicForm @register="registerForm">
        <template #esnotaryTxt>
          <h2 class="m-0 mr-12 text-base">公证办理</h2>
        </template>
      </BasicForm>
    </Spin>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { examineFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import { getSealLists } from '/@/api/contract/seal'
  import { Modal, Spin } from 'ant-design-vue'
  import { getUserConcern, updateOrderAudit } from '/@/api/order'
  import { contractType } from '/@/views/contract/seal/data'
  import { isArray } from '/@/utils/is'

  export default defineComponent({
    name: 'Modal',
    components: { BasicModal, BasicForm, Spin },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const loading = ref(false)

      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, updateSchema, resetFields, validate }] = useForm({
        schemas: examineFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        init(data.record)
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
            ipCity: [data.record.ipProvince, data.record.ipCity],
          })
        }
      })

      async function init(record) {
        const contract = await getUserConcern({ label: 'sysConf.contractSign' })
        const find: any = contractType.find((v) => v.label == contract)
        const sealList = await getSealLists({
          spuType: record.spuType,
          status: 1,
          type: find?.value,
          rentType: record.rentType,
        })
        // 处理默认值
        let isdefult = sealList.find((v) => v.isDefault == 1)
        // 如果没有设置默认值则默认第一个
        if (!isdefult) {
          isdefult = sealList[0]
        }
        updateSchema([
          {
            field: 'sealId',
            componentProps: {
              placeholder: '请选择',
              options: sealList || [],
              fieldNames: {
                label: 'company2TenantName',
                value: 'sealId',
                key: 'sealId',
              },
            },
          },
        ])
        if (sealList) {
          setFieldsValue({
            sealId: isdefult?.sealId,
          })
        }
      }

      const getTitle = computed(() => '订单审核')

      async function handleSubmit() {
        try {
          const values = await validate()
          let formValues = cloneDeep(values)
          if (values.city && isArray(values.city)) {
            formValues.province = values.city[0]
            formValues.city = values.city[1]
          } else {
            formValues.province = values.city
          }
          if (values.ipCity && isArray(values.ipCity)) {
            formValues.ipProvince = values.ipCity[0]
            formValues.ipCity = values.ipCity[1]
          } else {
            formValues.ipProvince = values.ipCity
          }
          if (values.salespersonCity && isArray(values.salespersonCity)) {
            formValues.salespersonProvince = values.salespersonCity[0]
            formValues.salespersonCity = values.salespersonCity[1]
          } else {
            formValues.province = values.salespersonCity
          }

          formValues.realReason = formValues?.showReason || formValues?.showReason1 // 审核原因
          formValues.userLevel = formValues?.userLevel || formValues?.userLevel1 // 用户评级

          if (formValues.creditStatus == 103) {
            formValues.status = 103
          } else {
            formValues.status = formValues.state
          }
          setModalProps({ confirmLoading: true })
          // TODO custom api
          if (formValues.creditStatus == 103) {
            createMessage.success(`修改成功`)
            emit('success')
          } else {
            Modal.confirm({
              title: () => '审核操作',
              content: () => '请确认订单无误？',
              onCancel: () => {},
              onOk: async () => {
                await updateOrderAudit(formValues)
                createMessage.success(`审核成功`)
                emit('success')
              },
            })
          }
          closeModal()
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, loading }
    },
  })
</script>
