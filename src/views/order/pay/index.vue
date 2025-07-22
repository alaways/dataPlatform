<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow: hasPermission('OrderPayDetail'),
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderPayModal'),
              label: '确认支付',
              onClick: handlePay.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderPayCancel'),
              label: '取消',
              onClick: handleCancle.bind(null, record),
            },
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
    <PaidModal @register="registerModal" @success="handleSuccess" />
    <PasswordModal @register="passwordModal" @success="handleSuccess" />
    <CancleModal @register="cancleModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { getOrderPayList } from '/@/api/order'
  import { useGo } from '/@/hooks/web/usePage'
  import { useModal } from '/@/components/Modal'
  import PaidModal from '../components/PaidModal.vue'
  import PasswordModal from '../components/PasswordModal.vue'
  import CancleModal from '../components/CancleModal.vue'
  import { Recordable } from 'vite-plugin-mock'
  import { getChannelList } from '/@/api/channel'
  import { handleBillList } from '../utils'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'OrderPayPage',
    components: { BasicTable, TableAction, PaidModal, PasswordModal, CancleModal },
    setup() {
      const go = useGo()
      const [registerModal, { openModal }] = useModal()
      const [cancleModal, { openModal: openCancleModal }] = useModal()
      const [passwordModal, { openModal: openPasswordModal }] = useModal()
      const { hasPermission } = usePermission()
      const [registerTable, { reload, getForm }] = useTable({
        title: '待支付列表',
        beforeFetch,
        api: getOrderPayList,
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
          width: 100,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      })

      const channelList = ref<any>([])
      init()
      // 初始化数据
      async function init() {
        // 渠道列表
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
        ])
      }

      // 处理参数
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
      // 输入密码
      function handlePassword(data: any) {
        openPasswordModal(true, {
          isUpdate: true,
          data,
        })
      }

      function handleSuccess(data) {
        if (data?.showPwd) {
          handlePassword(data.data)
        } else {
          reload()
        }
      }

      function handlePay(record: Recordable) {
        const blist = record.orderBillItemList
          .filter((v) => v.sourceType == 0)
          .map((v) => v.billItemSn)
        const billstr = blist.join(',')
        openModal(true, {
          isUpdate: true,
          record: {
            isSourceType: true,
            orderId: record.id,
            totalAmount: record.downPaymentAmount / 100,
            downPaymentAmount: record.downPaymentAmount / 100,
            billItemSn: billstr,
            billsList: record.orderBillItemList,
            uid: record.uid,
            status: record.status,
          },
        })
      }

      async function handleCancle(record: Recordable) {
        // await getOrderCancle(record.id)
        // createMessage.success(`取消成功`)
        // reload()
        openCancleModal(true, {
          isUpdate: true,
          record,
        })
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.id}?uid=${record.uid}&name=${record.nickName}&back=/order/orderPay`,
        )
      }

      return {
        registerTable,
        handleSuccess,
        handleCancle,
        handlePay,
        handleDetail,
        registerModal,
        passwordModal,
        cancleModal,
        hasPermission,
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
