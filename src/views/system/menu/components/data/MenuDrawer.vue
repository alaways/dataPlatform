<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { formSchema } from './menu.data'
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer'

  import { addMenuItem, updateMenuItem } from '/@/api/system/menu'
  import { useMessage } from '/@/hooks/web/useMessage'

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const editValue = ref() // 传入数据的处理

      const { createMessage } = useMessage()

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
      })

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields()
        setDrawerProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        editValue.value = data.record // 获取编辑传入的值

        // 传入表单默认值
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          })
        }
        console.log(data.parentList)

        // 选择父级菜单使用
        const treeData = data.parentList
        updateSchema({
          field: 'parentId',
          componentProps: { treeData },
        })
      })

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'))

      async function handleSubmit() {
        try {
          const values = await validate()
          setDrawerProps({ confirmLoading: true })
          let res: any
          // TODO custom api
          if (!unref(isUpdate)) {
            res = await addMenuItem(values)
          } else {
            res = await updateMenuItem(values)
          }
          if (values.addChild == 1) {
            const type = [
              { code: 'Query', name: '查询', sort: 10 },
              { code: 'Add', name: '新增', sort: 20 },
              { code: 'Update', name: '修改', sort: 30 },
              { code: 'Del', name: '删除', sort: 40 },
            ]
            type.forEach((v) => {
              const fromValue = {
                menuCode: `${res.menuCode}${v.code}`,
                menuName: `${res.menuName}-${v.name}`,
                parentId: `${res.menuId}`,
                icon: '',
                menuType: 'F',
                url: 'LAYOUT',
                visible: '0',
                status: '1',
                orderNum: v.sort,
              }
              addMenuItem(fromValue)
            })
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
