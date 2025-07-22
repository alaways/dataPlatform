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
      <template #menu="{ model, field }">
        <BasicTree
          ref="menuTree"
          v-model:value="model[field]"
          :treeData="treeData"
          checkable
          toolbar
          title="菜单分配"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { menuFormSchema } from './role.data'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicTree, TreeItem } from '/@/components/Tree'

  import { getMenuList } from '/@/api/system/menu'
  import { getRoleMenuList, updateRoleItem } from '/@/api/system/role'
  import { recursionMenus, recursionPidMenus } from './menuUtil'
  import { useMessage } from '/@/hooks/web/useMessage'

  export default defineComponent({
    name: 'RoleModal',
    components: { BasicModal, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const treeData = ref<TreeItem[]>([])
      const menuList = ref<any>([])

      const { createMessage } = useMessage()

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: menuFormSchema,
        showActionButtonGroup: false,
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        if (unref(treeData).length === 0) {
          menuList.value = (await getMenuList({ status: '1' })) as any
          const mlist = menuList.value.filter((v) => !v.parentId || v.parentId == 0)

          function filterTree(children: any) {
            return children.map((v) => {
              return {
                key: v.menuId,
                value: v.menuId,
                title: v.menuName,
                parentId: v.parentId,
                children: filterTree(menuList.value.filter((ch) => ch.parentId == v.menuId)),
              }
            })
          }
          treeData.value = filterTree(mlist)
        }
        isUpdate.value = !!data?.isUpdate
        if (unref(isUpdate)) {
          let menuIds = await getRoleMenuList({ roleId: data?.record?.roleId })
          let newMenuIds = []
          if (menuIds && menuIds.length) {
            menuIds = menuIds.map((v) => `${v.id}`)
            newMenuIds = recursionMenus(treeData.value, menuIds)
          }
          setFieldsValue({
            roleId: data?.record?.roleId,
            menuIds: newMenuIds,
          })
        }
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '菜单权限' : '菜单权限'))

      async function handleSubmit() {
        try {
          const values = await validate()
          setModalProps({ confirmLoading: true })
          await updateRoleItem({
            ...values,
            menuIds: recursionPidMenus(menuList.value, values.menuIds),
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
