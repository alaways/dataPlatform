<template>
  <BasicModal
    :width="900"
    v-bind="$attrs"
    @register="registerModal"
    title="申请下载"
    destroyOnClose
  >
    <template #footer>
      <Button type="primary" @click="closeModal">关闭</Button>
    </template>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              disabled: record.status != 1,
              icon: 'material-symbols:download-2',
              label: '下载',
              onClick: handleDownload.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { columns } from './data'
  import { TableAction, useTable, BasicTable } from '/@/components/Table'
  import { getDownloadFile, getDownloadList } from '/@/api/utils'
  import { downloadByData } from '/@/utils/file/download'
  import { Button } from 'ant-design-vue'

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, TableAction, BasicTable, Button },
    emits: ['success', 'register'],
    setup() {
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
        setModalProps({ confirmLoading: false })
      })

      const [registerTable] = useTable({
        api: getDownloadList,
        showIndexColumn: false,
        useSearchForm: false,
        showTableSetting: true,
        bordered: true,
        columns,
        actionColumn: {
          width: 100,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })

      async function handleDownload(record: Recordable) {
        if (record.status == 1) {
          const res = await getDownloadFile({ key: record.key })
          downloadByData(res.data, record.fileName)
        }
      }

      return {
        registerModal,
        registerTable,
        handleDownload,
        closeModal,
      }
    },
  })
</script>
