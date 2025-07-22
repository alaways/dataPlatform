<template>
  <div>
    <Card>
      <Row>
        <Col :span="9">
          {{ personData.startTime }} 到期订单总数 {{ personData.nickName }}
        </Col>
        <Col :span="9">
          {{ personData.endTime }} 到期订单总数 {{ personData.nickName }}
        </Col>
        <Col :span="6">
          更新日期 {{ personData.updateTime }} 
        </Col>
      </Row>
    </Card>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button
          :loading="exportExcelLoading"
          @click="aoaToExcel"
          v-if="hasPermission('CollectionRemitExport')"
        >
          导出Excel
        </Button>
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow: hasPermission('CollectionRemitOrderDetail'),
              label: '订单详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              ifShow: hasPermission('CollectionRemitRecord'),
              label: '催收记录',
              onClick: handleCollectionRecord.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <RecordModal @register="registerModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { useGo } from '/@/hooks/web/usePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { downloadByData } from '/@/utils/file/download'
  import RecordModal from '../components/recordModal.vue'
  import { useModal } from '/@/components/Modal'
  import { cloneDeep } from 'lodash-es'
  import { isIEBrowse } from '/@/utils/is'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { Recordable } from 'vite-plugin-mock'
  import { Button, Card, Row, Col } from 'ant-design-vue'
  import { exportExcel, getRemitList } from '/@/api/collection/remit'
  export default defineComponent({
    name: 'CollectionRemitPage',
    components: { BasicTable, TableAction, Button, RecordModal, Row, Col, Card },
    setup() {
      const go = useGo()
      const exportExcelLoading = ref(false)
      const { hasPermission } = usePermission()
      const personData = ref({
        startTime: '2025-07-16',
        endTime: '2025-07-22',
        updateTime: '2025-07-17',
        nickName: 23787823,
        phone: 19022,
      })
      const { createMessage } = useMessage()
      const [registerModal, { openModal: openModal }] = useModal()
      const [registerTable, { getForm, getPaginationRef }] = useTable({
        title: '催收回款',
        scroll: { y: 600 },
        beforeFetch,
        api: getRemitList,
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })

      function beforeFetch(data) {
        if (data.payTime) {
          data['beginPayTime'] = `${data.payTime[0]}`
          data['endPayTime'] = `${data.payTime[1]}`
        }
        if (data.receiveTime) {
          data['beginReceiveTime'] = `${data.receiveTime[0]}`
          data['endReceiveTime'] = `${data.receiveTime[1]}`
        }

        delete data.payTime
        delete data.receiveTime
        return data
      }

      async function handleCollectionRecord(record: Recordable) {
        openModal(true, {
          isUpdate: true,
          record,
        })
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.orderId}?uid=${record.uid}&name=${record.nickName}&back=/Collection/CollectionRemit`,
        )
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
        downloadByData(res.data, '催收回款.xlsx')
        exportExcelLoading.value = false
      }
      return {
        registerTable,
        handleCollectionRecord,
        handleDetail,
        aoaToExcel,
        exportExcelLoading,
        registerModal,
        hasPermission,
        personData,
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
