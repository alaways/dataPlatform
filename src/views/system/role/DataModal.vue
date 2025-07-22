<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    destroyOnClose
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #dataScopeDept="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          checkable
          toolbar
          title="指定部门数据"
          :replaceFields="{ title: 'deptName', key: 'deptId' }"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { dataFormSchema } from './role.data'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicTree, TreeItem } from '/@/components/Tree'

  import { updateRoleItem } from '/@/api/system/role'
  import { recursionPidMenus } from './menuUtil'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { getDeptList, getDeptLists } from '/@/api/system/dept'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'RoleModal',
    components: { BasicModal, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const treeData = ref<TreeItem[]>([])
      const deptList = ref<any>([])

      const { createMessage } = useMessage()

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: dataFormSchema,
        showActionButtonGroup: false,
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        if (unref(treeData).length === 0) {
          deptList.value = (await getDeptLists({ status: '1' })) as any
          treeData.value = (await getDeptList({ status: '1' })) as any
        }
        isUpdate.value = !!data?.isUpdate
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          })
        }
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '数据权限' : '数据权限'))

      async function handleSubmit() {
        try {
          const values = await validate()
          const formVlaues = cloneDeep(values)
          if (formVlaues.dataScope == 2) {
            formVlaues['dataScopeDeptIds'] = recursionPidMenus(
              deptList.value,
              formVlaues.dataScopeDeptIds,
            ).join(',')
          }

          setModalProps({ confirmLoading: true })
          await updateRoleItem({
            ...formVlaues,
          })
          // TODO custom api
          createMessage.success(`修改成功`)
          closeModal()
          emit('success')
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return {
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
        treeData,
      }
    },
  })
</script>
