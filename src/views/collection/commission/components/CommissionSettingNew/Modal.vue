<template>
  <BasicModal
    :width="700"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    destroyOnClose
  >
    <BasicForm @register="registerForm">
      <template #days="{ model }">
        <div class="flex items-center">
          <InputNumber
            id="inputNumber"
            placeholder="请输入最小天数"
            v-model:value="model['minDays']"
            :min="1"
          />
          <div class="mx-3">至</div>
          <InputNumber
            id="inputNumber"
            placeholder="请输入最大天数"
            v-model:value="model['maxDays']"
            :min="1"
          />
        </div>
      </template>
      <template #ge="{ model }">
        <div class=""></div>
        <Row type="flex" class="mt-3">
          <Col :span="10">{{ model['ge'] }}</Col>
          <Col :span="10">提成点</Col>
          <Col :span="4" />
        </Row>
      </template>
      <template #geForm="{ model }">
        <GeForm ref="geForm" :pdata="model['geForm']" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { rulesTitle, userFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { setExpireSetting } from '/@/api/collection/commission'
  import { cloneDeep } from 'lodash-es'
  import { Col, InputNumber, Row } from 'ant-design-vue'
  import GeForm from './gsForm.vue'
  import { canParseJSON } from '/@/utils/tool'
  import { useRoute } from 'vue-router'

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm, InputNumber, Row, Col, GeForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()
      const geForm = ref<any>(null)
      const currentDataSource = ref()
      const { query } = useRoute()
      console.log(query,'queryShow')
      if (query && query.dataSources) {
        currentDataSource.value = String(query.dataSources)
      }
      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        layout: 'vertical',
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
        const record = data?.record
        // 逾期天数
        const envs = record.envs

        if (envs && envs != 'NaN') {
          const arr = String(envs).split(',')
          record['minDays'] = arr[0]
          record['maxDays'] = arr[1]
        } else {
          delete record.minDays
          delete record.maxDays
        }

        const returnVal = record.returnVal
        if ((returnVal && !isNaN(returnVal)) || canParseJSON(returnVal)) {
          const val = JSON.parse(returnVal)
          // ge 默认显示
          record['ge'] = rulesTitle[val.inIndex || 0]

          // geForm
          record['geForm'] = val.rules
        }

        if (unref(isUpdate)) {
          setFieldsValue({
            ...record,
          })
        }
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'))

      async function handleSubmit() {
        try {
          const values = await validate()
          if (!values.minDays && values.minDays != 0) {
            createMessage.error('逾期天数-最小值不能为空')
            return
          }
          if (!values.minDays && values.minDays != 0) {
            createMessage.error('逾期天数-最大值不能为空')
            return
          }
          const formParams: any = {
            ...cloneDeep(values),
            code: 'collection-rule', // 固定传值
            expression: '$P0 >= $E0 && $P0 <= $E1', // 固定传值
            envs: `${values.minDays},${values.maxDays}`,
          }

          // 提成点处理
          const geFormValues: any = await geForm.value?.getValues()
          const rules: any = []
          Object.keys(geFormValues).forEach((k: any) => {
            if (k.startsWith('ge') || k.startsWith('val')) {
              const indexMatch = k.match(/\d+/)
              const index = indexMatch ? parseInt(indexMatch[0], 10) : null
              if (index !== null) {
                if (!rules[index]) {
                  rules[index] = {}
                }
                if (k.startsWith('ge')) {
                  rules[index].ge = geFormValues[k]
                } else if (k.startsWith('val')) {
                  rules[index].val = Number((geFormValues[k] / 100).toFixed(4))
                }
              }
            }
          })

          const returnVal = {
            inIndex: formParams.inIndex,
            rules,
          }
          formParams.dataSources = currentDataSource.value,
          formParams.returnVal = JSON.stringify(returnVal)
          delete formParams.inIndex
          delete formParams.ge
          delete formParams.geForm
          setModalProps({ confirmLoading: true })
          // TODO custom api
          await setExpireSetting(formParams)
          createMessage.success(`${getTitle.value}成功`)
          closeModal()
          emit('success')
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, geForm }
    },
  })
</script>

<style lang="less" scoped>
  ::v-deep.vben-basic-form .ant-form-item {
    .ant-form-item-control {
      width: 100% !important;
    }
  }
</style>
