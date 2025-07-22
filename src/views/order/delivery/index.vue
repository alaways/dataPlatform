<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow: hasPermission('OrderDeliveryDetail'),
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderDeliveryModal') && record.status == 501,
              label: '发货',
              onClick: handleDelivery.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderDeliveryModal') && record.status != 501,
              label: '取消发货',
              onClick: handleCancleDelivery.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderDeliveryModal') && record.status != 501,
              label: '打印面单',
              onClick: handlePrint.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderDeliveryModal') && record.status != 501,
              label: '预览面单',
              onClick: handleOpenPrint.bind(null, record),
            },
            // {
            //   ifShow: hasPermission('OrderDeliveryCancel'),
            //   label: '取消',
            //   onClick: handleCancle.bind(null, record),
            // },
            // {
            //   label: '取消',
            //   popConfirm: {
            //     title: '是否确认取消',
            //     placement: 'left',
            //     confirm: handleCancle.bind(null, record),
            //   },
            // },
          ]"
        />
      </template>
    </BasicTable>
    <DeliveryModal @register="deliveryModal" @success="handleSuccess" />
    <CancleModal @register="cancleModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import {
    cancleDelivery,
    getFastMailList,
    getOpenPrintExpressWaybill,
    getOrderDeliveryList,
    getPrintExpressWaybill,
  } from '/@/api/order'
  import { useGo } from '/@/hooks/web/usePage'
  import { useModal } from '/@/components/Modal'
  import DeliveryModal from '../components/deliveryModal/DeliveryModal.vue'
  import CancleModal from '../components/CancleModal.vue'
  import { getChannelList } from '/@/api/channel'
  import { handleBillList } from '../utils'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { cloneDeep } from 'lodash-es'
  import { Modal } from 'ant-design-vue'
  import { handlePreviewPDF } from '/@/utils/tool'
  import { useMessage } from '/@/hooks/web/useMessage'

  export default defineComponent({
    name: 'OrderDeliveryPage',
    components: { BasicTable, TableAction, DeliveryModal, CancleModal },
    setup() {
      const go = useGo()
      const { createMessage } = useMessage()
      const [cancleModal, { openModal: openCancleModal }] = useModal()
      const [deliveryModal, { openModal: openDeliveryModal }] = useModal()
      const { hasPermission } = usePermission()
      const [registerTable, { reload, getForm }] = useTable({
        title: '待发货列表',
        beforeFetch,
        api: getOrderDeliveryList,
        afterFetch,
        columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
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

      const fastMailList = ref<any>()
      const channelList = ref<any>([])

      init()
      async function init() {
        fastMailList.value = await getFastMailList()

        const channel: any = await getChannelList()
        channelList.value = channel.list.map((v) => {
          return { label: `${v.code} - ${v.name}`, value: v.code }
        })
        // 修改搜索的角色和部门的选择
        const form = await getForm()
        form.updateSchema([
          {
            field: 'channelCode',
            componentProps: { options: channelList },
          },
          {
            field: 'status',
            componentProps: {
              onChange: () => {
                form.submit()
              },
            },
          },
        ])
      }
      function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        if (pdata.rentTypeList == 2 || pdata.rentTypeList == 3) {
          pdata.rentTypeList = '2,3'
        }
        if (pdata.time) {
          pdata['beginCreateTime'] = `${pdata.time[0]}`
          pdata['endCreateTime'] = `${pdata.time[1]}`
        }

        delete pdata.time
        return pdata
      }

      // 处理返回数据
      function afterFetch(data) {
        data.forEach((v) => {
          const res: any = handleBillList(v.orderBillItemList)
          v['firstPay'] = res.firstPay
          v['deposit'] = res.deposit
        })
        return data
      }
      function handleSuccess() {
        reload()
      }

      function handleDelivery(record: Recordable) {
        openDeliveryModal(true, {
          isUpdate: true,
          fastMailList: fastMailList.value,
          record: {
            ...record,
            id: record.id,
            orderSn: record.orderSn,
          },
        })
      }

      async function handleCancle(record: Recordable) {
        // await getOrderCancle(record.id)
        // createMessage.success(`取消成功`)
        // handleSuccess()
        openCancleModal(true, {
          isUpdate: true,
          record,
        })
      }

      // 取消发货
      function handleCancleDelivery(record: Recordable) {
        Modal.confirm({
          title: () => '是否确认取消发货',
          onCancel: () => {},
          onOk: async () => {
            await cancleDelivery(record.orderSn)
            createMessage.success('取消成功')
            handleSuccess()
          },
        })
      }
      // 打印快递面单
      function handlePrint(record: Recordable) {
        Modal.confirm({
          title: () => '是否确认打印快递面单',
          onCancel: () => {},
          onOk: async () => {
            await getPrintExpressWaybill(record.id)
            createMessage.success('打印成功')
          },
        })
      }
      // 打开快递面单
      function handleOpenPrint(record: Recordable) {
        Modal.confirm({
          title: () => '是否确认打开快递面单',
          onCancel: () => {},
          onOk: async () => {
            const res = await getOpenPrintExpressWaybill(record.id)
            handlePreviewPDF(res)
          },
        })
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.id}?uid=${record.uid}&name=${record.nickName}&back=/order/orderDelivery`,
        )
      }

      return {
        registerTable,
        handleSuccess,
        handleCancle,
        handleDelivery,
        handleDetail,
        deliveryModal,
        cancleModal,
        hasPermission,
        handleCancleDelivery,
        handlePrint,
        handleOpenPrint,
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
