<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button class="mr-3" @click="handleRecharge" v-if="hasPermission('MerchantRecharge')">
          商家余额充值
        </a-button>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('StoreAdd')">
          新增商家
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('StoreUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <Drawer @register="registerDrawer" @success="handleSuccess" />
    <Modals @register="registerModal" />
    <EchargeModal @register="registerEchargeModal" @success="handleSuccess" />
    <!-- Modal -->
    <!-- <Modal title="我是标题" @ok="" @cancel="" visible="status" /> -->
    <!-- Tootlip -->
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { useDrawer } from '/@/components/Drawer'
  import Drawer from './Drawer.vue'
  import { columns, searchFormSchema } from './data'
  import { getStoreList } from '/@/api/store/index'
  import { Recordable } from 'vite-plugin-mock'
  import Modals from './Modal.vue'
  import EchargeModal from './EchargeModal.vue'
  import { useModal } from '/@/components/Modal'
  import { useGo } from '/@/hooks/web/usePage'
  import { usePermission } from '/@/hooks/web/usePermission'
  // import { Modal } from 'ant-design-vue'

  export default defineComponent({
    name: 'StorePage',
    components: {
      BasicTable,
      Drawer,
      TableAction,
      Modals,
      EchargeModal,
      // Modal
    },
    setup() {
      const { hasPermission } = usePermission()
      const go = useGo()
      const [registerDrawer, { openDrawer }] = useDrawer()
      const [registerModal, { openModal }] = useModal()
      const [registerEchargeModal, { openModal: openEchargeModal }] = useModal()
      const [registerTable, { reload }] = useTable({
        // title: '商家列表',
        api: getStoreList,
        columns: columns({ payModal: handlePayModal, storeBalance: handleDetail }),
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })
      getList()
      let uidList = []
      const merchantCodeList = ref<any>([])
      async function getList() {
        getStoreList({ pageSize: 99999 }).then((res) => {
          merchantCodeList.value = res.list
        })

        // 筛选出已经绑定的
        // let screenList = await getStoreNoPageList()
        // if (screenList) {
        //   const idScreenList = screenList.map((v) => v.bindUid) //['1','2'...]
        //   uidList = uidList.filter((u: any) => {
        //     return idScreenList.includes(u.uid)
        //   })
        // }
      }

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
          uidList,
        })
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
          uidList,
        })
      }

      function handleSuccess() {
        reload()
      }

      function handlePayModal(record: Recordable) {
        if (!record.rejectCount) return
        openModal(true, {
          record,
          isUpdate: true,
          uidList,
        })
      }

      function handleRecharge() {
        openEchargeModal(true, {
          merchantCodeList,
          isUpdate: true,
        })
      }

      function handleDetail(type: any) {
        go(`/finance/accountLimit?type=${type}`)
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleSuccess,
        registerModal,
        handleRecharge,
        registerEchargeModal,
        hasPermission,
      }
    },
  })
</script>
