<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { userFormSchema } from './data'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { setCategoryItem, updateCategoryItem } from '/@/api/goods/category'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()

      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
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
          setFieldsValue({
            ...data.record,
          })
        }

        updateSchema({
          field: 'parentId',
          componentProps: ({ formModel }) => {
            return {
              treeData: data.parent,
              fieldNames: {
                label: 'name',
                value: 'id',
                key: 'id',
              },
              onChange: (e, v) => {
                console.log(e)
                if (v && v.length) {
                  const len = v.length
                  formModel.parentName = v[len - 1].name
                  formModel.level = v[len - 1].level
                }
              },
            }
          },
        })
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'))

      async function handleSubmit() {
        try {
          const values = await validate()
          const formParams = cloneDeep(values)
          setModalProps({ confirmLoading: true })
          // 处理主图
          if (Array.isArray(values.logo)) {
            formParams['logo'] = values.logo
              .map((v) => {
                if (typeof v == 'string') {
                  return v
                } else {
                  return v.url
                }
              })
              .join(',')
          }
          // TODO custom api
          if (!unref(isUpdate)) {
            await setCategoryItem(formParams)
          } else {
            await updateCategoryItem(formParams)
          }
          createMessage.success(`${getTitle.value}成功`)
          closeModal()
          emit('success')
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit }
    },
  })
</script>
