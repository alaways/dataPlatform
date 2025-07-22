<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button
          class="mr-3"
          v-if="hasPermission('MerchantRechargeConfirm')"
          :loading="openLoading"
          @click="handleRechargeConfrim"
        >
          商家充值确认
        </Button>
        <Button
          class="mr-3"
          :loading="openLoading"
          @click="handleRecharge"
          v-if="hasPermission('MerchantRecharge')"
        >
          商家余额充值
        </Button>
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
    <ConfirmModal @register="registerConfrimModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { useDrawer } from '/@/components/Drawer'
  import Drawer from './Drawer.vue'
  import { columns, searchFormSchema } from './data'
  import { getStoreList, getStoreNoPageList } from '/@/api/store/index'
  import { Recordable } from 'vite-plugin-mock'
  import Modals from './Modal.vue'
  import EchargeModal from './EchargeModal.vue'
  import ConfirmModal from './ConfirmModal.vue'
  import { useModal } from '/@/components/Modal'
  import { useGo } from '/@/hooks/web/usePage'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { Button } from 'ant-design-vue'

  export default defineComponent({
    name: 'StorePage',
    components: { BasicTable, Drawer, TableAction, Modals, EchargeModal, Button, ConfirmModal },
    setup() {
      const { hasPermission } = usePermission()
      const go = useGo()
      const [registerDrawer, { openDrawer }] = useDrawer()
      const [registerModal, { openModal }] = useModal()
      const [registerConfrimModal, { openModal: openConfrimModal }] = useModal()
      const [registerEchargeModal, { openModal: openEchargeModal }] = useModal()
      const openLoading = ref(false)
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

      async function handleRecharge() {
        openLoading.value = true
        const res = await getStoreNoPageList()
        const merchantCodeList = res
        openLoading.value = false
        openEchargeModal(true, {
          merchantCodeList,
          isUpdate: true,
        })
      }

      function handleDetail(type: any) {
        go(`/finance/accountLimit?type=${type}`)
      }
      // 商家充值确认弹窗
      const handleRechargeConfrim = () => {
        openConfrimModal(true, {
          isUpdate: true,
          record: {
            id: 99,
          },
        })
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
        openLoading,
        handleRechargeConfrim,
        registerConfrimModal,
      }
    },
  })
</script>
