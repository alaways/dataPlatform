<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button class="mr-3" @click="handleBatch" v-if="hasPermission('SalespersonBatch')">
          批量更改上级
        </a-button>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('SalespersonAdd')">
          新增业务员
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('SalespersonUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('SalespersonDel'),
              label: '删除',
              popConfirm: {
                title: '是否确认删除',
                placement: 'left',
                confirm: handleDel.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <Modal @register="registerModal" @success="handleSuccess" />
    <BatchModal @register="batchRegisterModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { PageWrapper } from '/@/components/Page'
  import { useModal } from '/@/components/Modal'
  import Modal from './Modal.vue'
  import BatchModal from './BatchModal.vue'
  import { columns, searchFormSchema } from './data'
  import { Recordable } from 'vite-plugin-mock'
  import { getStoreList } from '/@/api/store'
  import { delSalespersonItem, getSalespersonStoreList } from '/@/api/business/salesperson'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { cloneDeep } from 'lodash-es'
  import { cityCoding } from '/@/utils/cityData2'

  export default defineComponent({
    name: 'SalespersonPage',
    components: { BasicTable, PageWrapper, Modal, BatchModal, TableAction },
    setup() {
      const salespersonTree = ref<any>([]) // 业务员树状

      const { hasPermission } = usePermission()
      const isAdmin = hasPermission('Finance.loanMoney.platform')
      const { createMessage } = useMessage()
      const [registerModal, { openModal }] = useModal()
      const [batchRegisterModal, { openModal: openBatchModal }] = useModal()
      const [registerTable, { reload }] = useTable({
        title: '业务员列表',
        isTreeTable: true,
        beforeFetch,
        scroll: { y: 600 },
        api: getSalespersonStoreList,
        afterFetch,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        bordered: true,
        pagination: false,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      })
      // 处理参数
      async function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata.limit = 9999999
        pdata['pageSize'] = pdata.limit
        if (pdata.ipCitys) {
          const cityArr = cloneDeep(cityCoding)
          // 将value转成中文并且添加省级
          let provinces: string[] = []
          let city: string[] = []
          cityArr.forEach((v) => {
            const flist = v.children
              .filter((f) => pdata.ipCitys.some((c) => c == f.value))
              .map((m) => m.label)
            if (flist && flist.length) {
              city.push(...flist)
              provinces.push(v.label)
            }
          })

          pdata.provinceList = provinces.join(',')
          pdata.cityList = city.filter((v) => v != '市辖区').join(',')
        } else {
          delete pdata.ipCitys
          delete pdata.provinceList
        }
        delete pdata.ipCitys
        return pdata
      }

      function afterFetch(res) {
        let data = cloneDeep(res)
        if (data && data.length) {
          const mlist = data.filter((v) => !v.parentId || v.parentId == v.id)
          function filterTree(children: any) {
            return children.map((v) => {
              const dlist = data.filter((ch) => ch.parentId == v.id && ch.parentId != ch.id)
              return {
                ...v,
                children: dlist,
              }
            })
          }
          if (mlist && mlist.length) {
            data = filterTree(mlist)
          }
          salespersonTree.value = data
        }
        return data
      }

      init()
      const merchantList = ref<any>([])
      async function init() {
        const res = await getStoreList({ pageSize: 99999 })
        merchantList.value = res.list
      }

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
          merchantList,
          isAdmin,
        })
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
          merchantList,
          isAdmin,
        })
      }

      function handleSuccess() {
        reload()
      }

      async function handleDel(record: Recordable) {
        await delSalespersonItem({ id: record.id })
        createMessage.success(`删除成功`)
        handleSuccess()
      }

      function handleBatch() {
        openBatchModal(true, {
          isUpdate: true,
          isAdmin,
        })
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDel,
        handleSuccess,
        hasPermission,
        handleBatch,
        batchRegisterModal,
      }
    },
  })
</script>
