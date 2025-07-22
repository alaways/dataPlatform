<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('BusinessStoreAdd')">
          新增门店
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('BusinessStoreUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('BusinessStoreDel'),
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
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { PageWrapper } from '/@/components/Page'
  import { useModal } from '/@/components/Modal'
  import Modal from './Modal.vue'
  import { columns, searchFormSchema } from './data'
  import { Recordable } from 'vite-plugin-mock'
  import { delStoreItem, getStoreList } from '/@/api/business/store'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { cloneDeep } from 'lodash-es'
  import { cityCoding } from '/@/utils/cityData2'

  export default defineComponent({
    name: 'BusinessStorePage',
    components: { BasicTable, PageWrapper, Modal, TableAction },
    setup() {
      const { hasPermission } = usePermission()
      const { createMessage } = useMessage()
      const [registerModal, { openModal }] = useModal()
      const [registerTable, { reload }] = useTable({
        title: '门店管理',
        beforeFetch,
        scroll: { y: 600 },
        api: getStoreList,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        bordered: true,
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
        pdata['pageSize'] = pdata.limit
        if (pdata.ipCitys) {
          const cityArr = cloneDeep(cityCoding)
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

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        })
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        })
      }

      function handleSuccess() {
        reload()
      }

      async function handleDel(record: Recordable) {
        await delStoreItem({ id: record.id })
        createMessage.success(`删除成功`)
        handleSuccess()
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDel,
        handleSuccess,
        hasPermission,
      }
    },
  })
</script>
