<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <div class="flex flex-1 items-center pl-6">
          <div style="color: #e11d48">
            可锁定客户数剩余: {{ lockCount.curLockCount }} / {{ lockCount.clientLockMax }}
          </div>
          <div class="ml-10"> 跟进客户数: {{ clientCount || 0 }} </div>
          <div class="flex-1"></div>
          <Button
            v-if="hasPermission('CollectionBatchHanld')"
            @click="() => batchSuoHanld(0)"
            :disabled="!selectList.length"
            class="batchBtn"
            >批量解锁</Button
          >
          <Button
            v-if="hasPermission('CollectionBatchHanld')"
            @click="() => batchSuoHanld(1)"
            :disabled="!selectList.length"
            class="batchBtn"
            >批量锁定</Button
          >
          <Button
            :loading="exportExcelLoading"
            @click="aoaToExcel"
            v-if="hasPermission('CollectionTaskExport')"
          >
            导出Excel
          </Button>
        </div>
      </template>
      <template #expandedRowRender="{ record }">
        <BasicTable
          v-if="record.orderBillItemList && record.orderBillItemList.length"
          class="BasicTableItem"
          :showIndexColumn="false"
          :columns="billColumns"
          :dataSource="record.orderBillItemList"
          :pagination="false"
          :canResize="false"
          bordered
        />
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow: hasPermission('CollectionTaskRelease'),
              label: '释放客户',
              popConfirm: {
                title: '请确认是否放弃该条催收任务',
                placement: 'left',
                confirm: handleRelease.bind(null, record),
              },
            },
            {
              ifShow: hasPermission('CollectionTaskOrderDetail'),
              label: '订单详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderSlippageProsecuteStatus'),
              label: '编辑起诉',
              onClick: handleProsecuteStatus.bind(null, record),
            },
            {
              ifShow: hasPermission('CollectionTaskRecord'),
              label: '催收记录',
              onClick: handleCollectionRecord.bind(null, record),
            },
            {
              ifShow: hasPermission('CollectionTaskLock') && !record.lockStatus,
              label: '待锁定客户',
              color: 'warning',
              popConfirm: {
                title: '是否确认锁定客户',
                placement: 'left',
                confirm: handleLock.bind(null, record, 1),
              },
            },

            {
              ifShow: hasPermission('CollectionTaskUnLock') && record.lockStatus == 1,
              label: '已锁定客户',
              color: 'error',
              popConfirm: {
                title: '是否确认解锁客户',
                placement: 'left',
                confirm: handleLock.bind(null, record, 0),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <!-- <RecordModal @register="registerModal" @success="handleSuccess" /> -->
    <RemarkModal @register="remarkRegister" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, nextTick } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { billColumns, columns } from './data'
  import { useGo } from '/@/hooks/web/usePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { downloadByData } from '/@/utils/file/download'
  import { useModal } from '/@/components/Modal'
  import { cloneDeep } from 'lodash-es'
  import { isIEBrowse } from '/@/utils/is'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { Recordable } from 'vite-plugin-mock'
  import { Button, message } from 'ant-design-vue'
  import {
    delTaskItem,
    exportExcel,
    getTaskList,
    getTaskLockCount,
    lockTaskItem,
    batchLock,
  } from '/@/api/collection/task'
  import RemarkModal from '/@/views/order/orderDetail/components/detail/components/remarkModal.vue'

  export default defineComponent({
    name: 'Qiaozuji',
    components: { BasicTable, TableAction, Button, RemarkModal },
    setup() {
      const go = useGo()
      const exportExcelLoading = ref(false)
      const { hasPermission } = usePermission()

      const lockCount = ref({
        curLockCount: 0,
        clientLockMax: 0,
      })

      const clientCount = ref(0)

      const { createMessage } = useMessage()
      const [registerModal, { openModal }] = useModal()
      const [remarkRegister, { openModal: openRemarkModal }] = useModal()
      const [registerTable, { reload, getForm, getPaginationRef, clearSelectedRowKeys }] = useTable(
        {
          title: '催收任务',
          scroll: { y: 600 },
          beforeFetch,
          api: getTaskList,
          afterFetch,
          columns,
          
          sortFn,
          useSearchForm: false,
          bordered: true,
          canResize: false,
          showIndexColumn: false,
          fetchSetting: {
            listField: 'data',
            totalField: 'data.data.total',
          },
          actionColumn: {
            width: 120,
            title: '操作',
            dataIndex: 'action',
            slots: { customRender: 'action' },
            fixed: 'right',
          },
          rowKey: 'taskId',
          rowSelection: {
            type: 'checkbox',
            notRowClick: true,
            onChange: onChangeSelect,
          },
        },
      )

      function beforeFetch(data) {
        const pdata = cloneDeep(data)
        if (pdata.time) {
          pdata['beginReceiveTime'] = `${pdata.time[0]}`
          pdata['endReceiveTime'] = `${pdata.time[1]}`
        }
        if (pdata.repayDate) {
          pdata['beginRepayDate'] = `${pdata.repayDate[0]}`
          pdata['endRepayDate'] = `${pdata.repayDate[1]}`
        }
        if (pdata.lastFollowDate) {
          pdata['lastFollowBeginDate'] = `${pdata.lastFollowDate[0]}`
          pdata['lastFollowEndDate'] = `${pdata.lastFollowDate[1]}`
        }

        if (pdata.rentTypeList == 2 || pdata.rentTypeList == 3) {
          pdata.rentTypeList = '2,3'
        }
        pdata.dataSources = 'qzj'
        delete pdata.lastFollowDate
        delete pdata.repayDate
        delete pdata.time
        return pdata
      }

      function afterFetch(data: any) {
        clientCount.value = data.num
        return data.data.list
      }

      function sortFn(e) {
        if (!e.order) return {}
        if (e.field === 'overdueDays') {
          return {
            sortValue: e.order === 'descend' ? 'DESC' : 'ASC',
            sortField: 'overdue_days',
          }
        }
      }

      async function init() {
        getLockCountData()
      }

      function getLockCountData() {
        getTaskLockCount().then((res: any) => {
          lockCount.value = res
        })
      }

      async function handleCollectionRecord(record: Recordable) {
        openModal(true, {
          isTask: true,
          record,
        })
      }

      function handleProsecuteStatus(record: Recordable) {
        openRemarkModal(true, {
          isUpdate: true,
          record: {
            ...record,
            id: record.orderId,
          },
          name: 'prosecuteStatus',
        })
      }

      async function handleRelease(record: Recordable) {
        await delTaskItem(record.taskId)
        createMessage.success(`删除成功`)
        handleSuccess()
      }

      function handleSuccess() {
        reload()
        getLockCountData()
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.orderId}?uid=${record.uid}&name=${record.nickName}&back=/Collection/CollectionTask`,
        )
      }

      // lockStatus（1上锁，0未上锁）
      async function handleLock(record: Recordable, lockStatus: number) {
        console.log(record)
        console.log(lockStatus)

        await lockTaskItem({ id: record.taskId, lockStatus })
        createMessage.success(`${lockStatus ? '锁定' : '解锁'}成功`)
        handleSuccess()
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
        downloadByData(res.data, '催收任务.xlsx')
        exportExcelLoading.value = false
      }
      const selectList = ref([])
      async function onChangeSelect(rowList) {
        selectList.value = rowList
      }
      async function batchSuoHanld(lock) {
        const params = {
          taskIds: selectList.value,
          lock,
        }
        const res = await batchLock(params)
        if (res.data.code === 200) {
          message.success('批量操作成功')
          selectList.value = []
          reload()
          clearSelectedRowKeys()
        } else {
          message.warn(res.data.message)
        }
      }
      onMounted(() => {
        nextTick(() => {
          init()
        })
      })

      return {
        registerTable,
        handleCollectionRecord,
        handleDetail,
        handleRelease,
        aoaToExcel,
        exportExcelLoading,
        registerModal,
        hasPermission,
        billColumns,
        handleLock,
        handleSuccess,
        handleProsecuteStatus,
        remarkRegister,
        lockCount,
        clientCount,
        batchSuoHanld,
        selectList,
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

  ::v-deep(.ant-table-expanded-row-fixed) {
    padding: 10px 0 !important;
    background: #fff;
  }

  .BasicTableItem {
    ::v-deep(.ant-table-wrapper) {
      padding: 0 !important;
    }

    ::v-deep(.ant-table) {
      margin: 0 !important;
    }
  }

  .batchBtn {
    margin-right: 10px;
  }
</style>
