<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    destroyOnClose
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, onMounted } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { accountFormSchema } from './account.data'
  import { addUserItem, updateUserItem } from '/@/api/system/account'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import { getAppList } from '/@/api/saas/app'
  import { getProductList } from '/@/api/saas/product'
  import { useUserStore } from '/@/store/modules/user'

  export default defineComponent({
    name: 'AccountModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const { createMessage } = useMessage()
      const userStore = useUserStore()
      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
        labelWidth: 100,
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        getCurrentDatas(data)
        const salespersonValue = data.record?.salespersonValue
        if (!salespersonValue || salespersonValue == '0') {
          delete data.record?.salespersonValue
        } else {
          data.record['salespersonValue'] = String(data.record.salespersonValue)
            .split(',')
            .map((v) => Number(v))
        }

        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
            // deptId: (data.record.deptId && String(data.record.deptId).split(',')) || [],
            appletValue:
              (data.record.appletValue && String(data.record.appletValue).split(',')) || [],
            postId: (data.record.postId && String(data.record.postId).split(',')) || [],
            roleId: '4' || (data.record.roleId && String(data.record.roleId).split(',')) || [],
            merchantTerminalNo:
              (data.record.merchantTerminalNo &&
                String(data.record.merchantTerminalNo).split(',')) ||
              [],
          })
        }
      })
      const baseFilterList = (nowList, list, key) => {
        let merchantList = []
        if (list?.length) {
          list?.map((item: any) => {
            const nitem = nowList?.find((nitem: any) => nitem[key] === item)
            if (nitem) {
              merchantList.push(nitem)
            }
          })
        }
        return merchantList || []
      }
      const getCurrentDatas = async () => {
        const res = await getAppList({ limit: '999999' })
        const pres = await getProductList({})
        let merchantList = []
        let appletList = []
        const userInfo = userStore.getUserInfo || {}
        const applyNlist = res?.list || []
        const appleList = userInfo?.appletValue?.split(',')
        const nlist = pres?.list || []
        const merchanList = userInfo?.merchantTerminalNo?.split(',')
        merchantList = baseFilterList(nlist, merchanList, 'merchantTerminalNo')
        appletList = baseFilterList(applyNlist, appleList, 'appletCode')
        updateSchema([
          {
            field: 'appletValue',
            componentProps: {
              placeholder: '请选择',
              options: appletList,
              mode: 'multiple',
              fieldNames: {
                label: 'appletName',
                value: 'appletCode',
                key: 'appletCode',
              },
            },
          },
          {
            field: 'merchantTerminalNo',
            componentProps: {
              placeholder: '请选择',
              mode: 'multiple',
              options: merchantList,
              fieldNames: {
                label: 'merchantTerminalName',
                value: 'merchantTerminalNo',
                key: 'merchantTerminalNo',
              },
            },
          },
        ])
      }
      const getTitle = computed(() => (!unref(isUpdate) ? '新增员工' : '编辑员工'))

      async function handleSubmit() {
        try {
          const values = await validate()
          const formValues = cloneDeep(values)
          const offlineUid = formValues['offlineUid']
          const onlineUid = formValues['onlineUid']
          // formValues.loginUid = JSON.stringify({
          //   mayi: onlineUid,
          //   newAdmin: offlineUid,
          // })
          // formValues['deptId'] = (values.deptId && values.deptId.join(',')) || ''
          formValues['postId'] = (values.postId && values.postId.join(',')) || ''
          if (values.roleId && typeof values.roleId == 'string') {
            formValues['roleId'] = values.roleId || ''
          } else {
            formValues['roleId'] = (values.roleId && values.roleId?.join(',')) || ''
          }
          formValues['appletValue'] = (values.appletValue && values.appletValue.join(',')) || ''
          formValues['salespersonValue'] =
            (values.salespersonValue && values.salespersonValue.join(',')) || ''
          formValues['merchantTerminalNo'] =
            (values.merchantTerminalNo && values.merchantTerminalNo.join(',')) || ''
          setModalProps({ confirmLoading: true })
          // TODO custom api
          if (!unref(isUpdate)) {
            await addUserItem(formValues)
          } else {
            await updateUserItem(formValues)
          }

          createMessage.success(`${getTitle.value}成功`)
          closeModal()
          emit('success')
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }
      onMounted(() => {})
      return { registerModal, registerForm, getTitle, handleSubmit }
    },
  })
</script>
