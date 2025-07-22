<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    destroyOnClose
    :footer="null"
  >
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('UserUnBindCard'),
              label: '解绑',
              popConfirm: {
                title: '是否确认解绑银行卡',
                placement: 'left',
                confirm: handleUnBind.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { bindCardTableColumn } from './data'
  import { BasicTable, TableAction, useTable } from '/@/components/Table'
  import { getBindCardList, getUnBindCard } from '/@/api/sys/user'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useMessage } from '/@/hooks/web/useMessage'

  export default defineComponent({
    name: 'CardTableModel',
    components: { BasicModal, BasicTable, TableAction },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const isUpdate = ref(true)
      const loading = ref(true)
      const uid = ref('')

      const [registerTable, { setTableData }] = useTable({
        columns: bindCardTableColumn,
        scroll: { y: 600 },
        bordered: true,
        showIndexColumn: false,
        pagination: false,
        loading,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      })

      const [registerModal, { setModalProps }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        uid.value = data.record.uid
        init()
      })

      async function init() {
        loading.value = true
        let res = await getBindCardList({ uid: uid.value })
        loading.value = false
        res = res.alreadyCardList
        setTableData(res)
      }

      async function handleUnBind(record: Recordable) {
        if (!record.bindId) {
          createMessage.error(`绑卡id为空,请联系技术人员`)
          return
        }
        await getUnBindCard({ P3_userId: uid.value, P4_bindId: record.bindId })
        createMessage.success(`解绑成功`)
        init()
        emit('success')
      }

      const getTitle = computed(() => '用户绑卡信息')

      return {
        registerTable,
        registerModal,
        hasPermission,
        handleUnBind,
        getTitle,
        loading,
      }
    },
  })
</script>
