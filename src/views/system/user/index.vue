<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable :canResize="true" @register="registerTable">
      <template #toolbar>
        <a-button
          :loading="exportExcelLoading"
          @click="aoaToExcel"
          v-if="hasPermission('UserExport')"
        >
          <template #icon><DownloadOutlined /></template>
          申请下载Excel
        </a-button>
        <a-button @click="handleDownload" v-if="hasPermission('UserExport')">
          <template #icon><UnorderedListOutlined /></template>
          下载暂存列表
        </a-button>
        <a-button type="primary" @click="handleCreate" v-if="hasPermission('UserAdd')">
          新增用户
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow: hasPermission('UserQueryCard') && record.countCard != 0,
              label: '查看银行卡',
              onClick: handleQueryCard.bind(null, record),
            },
            {
              ifShow: hasPermission('UserUpdate'),
              label: '更新手机号状态',
              onClick: handleUpdatePhoneStatus.bind(null, record),
            },
            {
              ifShow: hasPermission('UserUpdate'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('UserDel'),
              label: '删除',
              popConfirm: {
                title: '是否确认删除',
                placement: 'left',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <UserDrawer @register="registerDrawer" @success="handleSuccess" destroyOnClose />
    <CardModel @register="cardRegister" @success="handleSuccess" />
    <DownloadModal @register="downloadModal" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { PageWrapper } from '/@/components/Page'
  import { useDrawer } from '/@/components/Drawer'
  import UserDrawer from './userDrawer.vue'

  import { columns, searchFormSchema } from './data'
  import { delUserItem, getUserList, exportExcel } from '/@/api/system/user'
  import { Recordable } from 'vite-plugin-mock'
  import { getChannelList } from '/@/api/channel'
  import { getQueryPhoneStatus, getUserConcern } from '/@/api/order'
  import { canParseJSON } from '/@/utils/tool'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useMessage } from '/@/hooks/web/useMessage'
  import CardModel from './CardModal.vue'
  import DownloadModal from '/@/components/DownloadModal/index.vue'
  import { useModal } from '/@/components/Modal'
  import { cloneDeep } from 'lodash-es'
  import { isIEBrowse } from '/@/utils/is'
  import { DownloadOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'

  export default defineComponent({
    name: 'UserPage',
    components: {
      BasicTable,
      PageWrapper,
      UserDrawer,
      TableAction,
      CardModel,
      DownloadModal,
      DownloadOutlined,
      UnorderedListOutlined,
    },
    setup() {
      const exportExcelLoading = ref(false)
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [cardRegister, { openModal: openBindCardModel }] = useModal()
      const [downloadModal, { openModal: openDownloadModal }] = useModal()
      const [registerDrawer, { openDrawer }] = useDrawer()
      const [registerTable, { reload, getForm, getPaginationRef }] = useTable({
        title: '用户列表',
        beforeFetch,
        api: getUserList,
        rowKey: 'id',
        columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        showIndexColumn: false,
        useSearchForm: true,
        bordered: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      })
      init()
      const options = ref<any>([])
      const channelList = ref<any>([])
      // 初始化数据
      async function init() {
        // 渠道列表
        const channel: any = await getChannelList()
        channelList.value = channel.list.map((v) => {
          return { label: `${v.code} - ${v.name}`, value: v.code }
        })

        // 获取用户关系列表
        const res = await getUserConcern({ label: 'sysConf.user.emergencyContactRelationship2' })
        if (canParseJSON(res)) {
          const opt = JSON.parse(res)
          options.value = opt.map((v) => {
            return { label: v, value: v }
          })
        }

        // 修改搜索的角色和部门的选择
        const form = await getForm()
        form.updateSchema([
          {
            field: 'channelCode',
            componentProps: { options: channelList },
          },
        ])
      }
      // 处理参数
      function beforeFetch(data: any) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        if (pdata.time) {
          pdata['createTimeMin'] = `${pdata.time[0]} 00:00:00`
          pdata['createTimeMax'] = `${pdata.time[1]} 23:59:59`
        }
        delete pdata.time
        if (pdata.workType == '其他') {
          pdata.workType = pdata.workTypeInput
        }
        delete pdata.workTypeInput
        return pdata
      }

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
          channelList,
        })
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          channelList,
          options,
          isUpdate: true,
        })
      }

      function handleQueryCard(record: Recordable) {
        openBindCardModel(true, {
          record,
          isUpdate: true,
        })
      }

      async function handleDelete(record: Recordable) {
        await delUserItem(record.id)
        createMessage.success(`删除成功`)
        handleSuccess()
      }

      function handleSuccess() {
        reload()
      }

      function handleDownload() {
        openDownloadModal(true)
      }

      // 导出
      async function aoaToExcel() {
        if (isIEBrowse()) {
          createMessage.error('请使用除IE之外的浏览器导出Excel')
          return
        }
        const form = await getForm()
        const value = form.getFieldsValue()
        const formValue = await beforeFetch(cloneDeep(value))

        exportExcelLoading.value = true
        const pageData: any = getPaginationRef()
        const params = {
          ...formValue,
          limit: pageData.total,
        }
        const res = await exportExcel(params)
        if (res.code == 200) {
          createMessage.success('已添加进下载暂存列表')
        } else {
          createMessage.success('申请失败')
        }
        exportExcelLoading.value = false
      }

      async function handleUpdatePhoneStatus(record: Recordable) {
        try {
          await getQueryPhoneStatus({ phone: record.phone, expSeconds: 0 })
          createMessage.success(`更新成功`)
          handleSuccess()
        } finally {
        }
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleSuccess,
        hasPermission,
        handleDelete,
        handleQueryCard,
        cardRegister,
        downloadModal,
        exportExcelLoading,
        aoaToExcel,
        handleDownload,
        handleUpdatePhoneStatus,
      }
    },
  })
</script>

<style lang="less" scoped>
  .TableAction {
    flex-direction: column;

    ::v-deep.vben-basic-table-action {
      button {
        margin-bottom: 2px;
      }

      .action-divider {
        display: none !important;
      }
    }
  }
</style>
