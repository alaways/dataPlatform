<template>
  <div class="sippageOrder">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Dropdown
          key="prosecution"
          overlayClassName="sippageOrder"
          v-if="hasPermission('OrderSlippageProsecution')"
        >
          <Button>批量起诉<DownOutlined /></Button>
          <template #overlay>
            <Menu>
              <MenuItem key="0">
                <div class="text-center" @click="downProsecutionTemplate">下载模板</div>
              </MenuItem>
              <MenuDivider />
              <MenuItem key="1">
                <BasicUpload
                  :maxSize="20"
                  :maxNumber="1"
                  :api="impExcelProsecutionApi"
                  :accept="['xls', 'xlsx']"
                  buttonType="text"
                  @change="uploadChange"
                >
                  导入起诉
                </BasicUpload>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
        <Dropdown
          key="allocation"
          overlayClassName="sippageOrder"
          v-if="hasPermission('OrderSlippageAllocation')"
        >
          <Button>批量分配<DownOutlined /></Button>
          <template #overlay>
            <Menu>
              <MenuItem key="0">
                <div class="text-center" @click="downAllocationTemplate">下载模板</div>
              </MenuItem>
              <MenuDivider />
              <MenuItem key="1">
                <BasicUpload
                  :maxSize="20"
                  :maxNumber="1"
                  :api="impExcelAllocationApi"
                  :accept="['xls', 'xlsx']"
                  buttonType="text"
                  @change="uploadChange"
                >
                  导入分配
                </BasicUpload>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
        <Button
          type="primary"
          @click="handleFollowBy"
          v-if="hasPermission('OrderSlippageFollowBy')"
        >
          分配跟进人
        </Button>

        <Button
          :loading="exportExcelLoading"
          @click="aoaToExcel"
          v-if="hasPermission('OrderSlippageExport')"
        >
          <template #icon><DownloadOutlined /></template>
          申请下载Excel
        </Button>
        <Button @click="handleDownload" v-if="hasPermission('OrderSlippageExport')">
          <template #icon><UnorderedListOutlined /></template>
          下载暂存列表
        </Button>
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow: hasPermission('OrderSlippageDetail'),
              label: '详情',
              disabled: record.dataSources != 'xx' && record.dataSources != 'xs' ? true : false,
              onClick: handleDetail.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderSlippageTaskRecord'),
              label: '催收记录',
              onClick: handleCollectionRecord.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderSlippageProsecuteStatus'),
              label: '编辑起诉',
              onClick: handleProsecuteStatus.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderSlippageReceive') && !record.followBy,
              label: '领取催收单',
              popConfirm: {
                title: '请确认领取该催收单!',
                confirm: handleReceive.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <remarkModal @register="register" @success="handleSuccess" />
    <RecordModal @register="taskRecordRegister" @success="handleSuccess" />
    <FollowByModal @register="followByRegister" @success="handleSuccess" />
    <DownloadModal @register="downloadModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import {
    export3OverdueExcel,
    getOrderSlippageList,
    impExcelAllocationApi,
    impExcelProsecutionApi,
  } from '/@/api/order'
  import { useGo } from '/@/hooks/web/usePage'
  import { Recordable } from 'vite-plugin-mock'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useModal } from '/@/components/Modal'
  import RecordModal from '../../collection/components/recordModal.vue'

  import remarkModal from '/@/views/order/orderDetail/components/detail/components/remarkModal.vue'
  import { Button, Dropdown, Menu, MenuDivider, MenuItem } from 'ant-design-vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import FollowByModal from './FollowByModal.vue'
  import { setTaskItem } from '/@/api/collection/task'
  import { useUserStore } from '/@/store/modules/user'
  import { cloneDeep } from 'lodash-es'
  import { cityCoding } from '/@/utils/cityData2'
  import { isIEBrowse } from '/@/utils/is'
  import DownloadModal from '/@/components/DownloadModal/index.vue'
  import { DownloadOutlined, DownOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
  import { downloadByUrl } from '/@/utils/file/download'
  import { BasicUpload } from '/@/components/Upload'
  import { HOSTNEW, HOSTMAYI } from '/@/utils/http/axios'

  export default defineComponent({
    name: 'OrderSlippagePage',
    components: {
      BasicTable,
      TableAction,
      remarkModal,
      Button,
      FollowByModal,
      RecordModal,
      DownloadModal,
      DownloadOutlined,
      UnorderedListOutlined,
      Dropdown,
      Menu,
      MenuItem,
      MenuDivider,
      DownOutlined,
      BasicUpload,
    },
    setup() {
      const go = useGo()
      const userStore = useUserStore()
      const userInfo = userStore.getUserInfo
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [register, { openModal }] = useModal()
      const [taskRecordRegister, { openModal: openTaskRecordModal }] = useModal()
      const [followByRegister, { openModal: openfollowByModal }] = useModal()
      const [downloadModal, { openModal: openDownloadModal }] = useModal()
      const exportExcelLoading = ref(false)

      const [
        registerTable,
        { reload, getForm, getSelectRowKeys, getPaginationRef, setSelectedRowKeys },
      ] = useTable({
        title: '逾期订单',
        beforeFetch,
        api: getOrderSlippageList,
        columns: columns(),
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
          getCheckboxProps(record: Recordable) {
            // 分配过了禁止分屏
            return { disabled: record.followBy }
          },
        },
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })

      // 处理参数
      function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        if (pdata.rentTypeList == 2 || pdata.rentTypeList == 3) {
          pdata.rentTypeList = '2,3'
        }
        if (pdata.time) {
          pdata['timeBool'] = true
          pdata['beginCreateTime'] = `${pdata.time[0]}`
          pdata['endCreateTime'] = `${pdata.time[1]}`
        }
        pdata.dataSources = 'llsz'
        if (pdata.city) {
          const cityArr = cloneDeep(cityCoding)
          // 将value转成中文并且添加省级
          let ipProvinces: string[] = []
          let ipCitys: string[] = []
          cityArr.forEach((v) => {
            const flist = v.children
              .filter((f) => pdata.city.some((c) => c == f.value))
              .map((m) => m.label)
            if (flist && flist.length) {
              ipCitys.push(...flist)
              ipProvinces.push(v.label)
            }
          })

          pdata.ipProvinces = ipProvinces.join(',')
          pdata.ipCitys = ipCitys.filter((v) => v != '市辖区').join(',')
        } else {
          delete pdata.ipCitys
          delete pdata.ipProvinces
        }
        delete pdata.city
        delete pdata.time
        return pdata
      }

      function handleProsecuteStatus(record: Recordable) {
        openModal(true, {
          isUpdate: true,
          record: record,
          name: 'prosecuteStatus',
        })
      }

      async function handleCollectionRecord(record: Recordable) {
        openTaskRecordModal(true, {
          isTask: true,
          record: {
            ...record,
            orderId: record.id,
          },
        })
      }

      function handleSuccess(data) {
        if (data == 'FollowBy') {
          setSelectedRowKeys([])
        }
        reload()
      }

      // 分配跟进人
      function handleFollowBy() {
        const select = getSelectRowKeys()
        if (!select.length) {
          createMessage.error(`请先选择要分配的订单`)
          return
        }
        openfollowByModal(true, {
          isUpdate: true,
          record: {
            orderIds: select.join(','),
          },
        })
      }

      // 领取催收单
      async function handleReceive(record: Recordable) {
        console.log(userInfo)

        await setTaskItem({
          orderIds: record.id,
          uid: userInfo.uid,
        })
        createMessage.success(`领取成功`)
        handleSuccess('FollowBy')
      }

      // 批量起诉 - 下载模板
      function downProsecutionTemplate() {
        const url =
          'https://guangsu-v2.oss-cn-shanghai.aliyuncs.com/2025-02-21/a0b32424-dfb0-49ea-a042-aa9a117c710c.xlsx'
        downloadByUrl({ url, fileName: '批量起诉模板.xlsx' })
      }

      // 批量分配 - 下载模板
      function downAllocationTemplate() {
        const url =
          'https://guangsu-v2.oss-cn-shanghai.aliyuncs.com/2025-02-21/74b6e066-3326-4bcc-b891-fececff83b1e.xlsx'
        downloadByUrl({ url, fileName: '批量分配模板.xlsx' })
      }

      function uploadChange() {
        handleSuccess('')
      }

      function handleDetail(record: Recordable) {
        let host = record.dataSources === 'xx' ? HOSTNEW : HOSTMAYI
        window.open(
          `${host}#${record.dataSources === 'xx' ?  '/Order_router/orderDetail' : '/order/orderDetail'}/${record.orderId}?uid=${record.uid}&name=${record.nickName}&auditId=${record.auditId}&back=/order/orderList`,
        )
      }
      function handleDownload() {
        openDownloadModal(true)
      }

      async function aoaToExcel() {
        if (isIEBrowse()) {
          createMessage.error('请使用除IE之外的浏览器导出Excel')
          return
        }
        const form = await getForm()
        const value = form.getFieldsValue()
        const formValue = await beforeFetch(cloneDeep(value))
        if (!formValue?.timeBool) {
          createMessage.error('请筛选时间进行导出')
          return
        }
        exportExcelLoading.value = true
        const pageData: any = getPaginationRef()
        const params = {
          ...formValue,
          limit: pageData.total,
        }
        const res = await export3OverdueExcel(params)
        if (res.code == 200) {
          createMessage.success('已添加进下载暂存列表')
        } else {
          createMessage.success('申请失败')
        }
        exportExcelLoading.value = false
      }

      return {
        registerTable,
        handleDetail,
        hasPermission,
        handleProsecuteStatus,
        register,
        handleSuccess,
        handleFollowBy,
        handleReceive,
        followByRegister,
        aoaToExcel,
        exportExcelLoading,
        taskRecordRegister,
        handleCollectionRecord,
        downloadModal,
        handleDownload,
        downProsecutionTemplate,
        downAllocationTemplate,
        impExcelProsecutionApi,
        impExcelAllocationApi,
        uploadChange,
      }
    },
  })
</script>

<style lang="less" scoped>
  .sippageOrder {
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

    .ant-dropdown-content {
      .ant-dropdown-menu {
        ::v-deep(.ant-dropdown-menu-item) {
          padding: 5px 0 !important;
        }
      }
    }
  }
</style>
