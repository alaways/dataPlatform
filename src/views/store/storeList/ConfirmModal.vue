<template>
  <BasicModal
    v-bind="$attrs"
    :width="1300"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
  >
    <template #footer>
      <Button type="primary" @click="onCloseModal">关闭</Button>
    </template>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: record.status == 0 && hasPermission('MerchantRechargeConfirm_cancel'),
              // disabled: record.status !== 0,
              label: '取消',
              popConfirm: {
                title: '是否取消商家充值？',
                placement: 'left',
                confirm: () => changeStatus(record, 2),
              },
            },
            {
              ifShow: record.status == 0 && hasPermission('MerchantRechargeConfirm_comfrim'),
              // disabled: record.status !== 0,
              label: '确定',
              popConfirm: {
                title: '确定商家充值？',
                placement: 'left',
                confirm: () => changeStatus(record, 1),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { confirmColumns } from './data'
  import { rechargeList, rechargeStatus } from '/@/api/store/index'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { Button } from 'ant-design-vue'

  export default defineComponent({
    name: 'ConfirmModal',
    components: { BasicModal, BasicTable, TableAction, Button },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [registerTable, { reload }] = useTable({
        // title: '商家列表',
        api: rechargeList,
        columns: confirmColumns,
        scroll: { y: 600 },
        bordered: true,
        showIndexColumn: false,
        afterFetch,
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })
      function afterFetch(data) {
        console.log(data, '我是data')
        return data?.list
      }
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
        setModalProps({ confirmLoading: false })
        reload()
      })
      const getTitle = computed(() => '商家充值确认')
      // 取消 | 确认 的操作
      const changeStatus = async (record: any, status: number) => {
        const res = await rechargeStatus({ status, id: record.id })
        if (res.data.code == 200) {
          createMessage.success(`${status == 1 ? '确定' : '取消'}成功`)
          reload()
          return
        }
        createMessage.warn(res.data.message)
      }
      const onCloseModal = () => {
        emit('success')
        closeModal()
      }
      return { hasPermission, registerModal, registerTable, getTitle, changeStatus, onCloseModal }
    },
  })
</script>
