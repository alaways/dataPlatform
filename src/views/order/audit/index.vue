<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('OrderAuditDetail'),
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderAuditModal'),
              label: '审核',
              ifShow: record.status == 201,
              onClick: handleAudit.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderAuditCancel'),
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
    <Modal @register="register" @success="handleSuccess" />
    <OnLineExamineModal @register="onLineExamineRegister" @success="handleSuccess" />
    <PasswordModal @register="passwordModal" @success="handleSuccess" />
    <CancleModal @register="cancleModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { getOrderAuditList } from '/@/api/order'
  import { useGo } from '/@/hooks/web/usePage'
  import { useModal } from '/@/components/Modal'
  import Modal from '../components/ExamineModal.vue'
  import OnLineExamineModal from '../components/onLineExamineModal/OnLineExamineModal.vue'
  import PasswordModal from '../components/PasswordModal.vue'
  import CancleModal from '../components/CancleModal.vue'
  import { getChannelList } from '/@/api/channel'
  import { handleBillList } from '../utils'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { cloneDeep } from 'lodash-es'

  export default defineComponent({
    name: 'OrderAuditPage',
    components: { BasicTable, TableAction, Modal, OnLineExamineModal, PasswordModal, CancleModal },
    setup() {
      const go = useGo()
      const [register, { openModal: openModal }] = useModal()
      const [onLineExamineRegister, { openModal: onLineExamineOpenModal }] = useModal()
      const [cancleModal, { openModal: openCancleModal }] = useModal()
      const [passwordModal, { openModal: openPasswordModal }] = useModal()
      const { hasPermission } = usePermission()
      const [registerTable, { reload, getForm }] = useTable({
        title: '待审核列表',
        beforeFetch,
        api: getOrderAuditList,
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
          width: 150,
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

      function handleSuccess(data) {
        if (data?.showPwd) {
          handlePassword(data.data)
        } else {
          reload()
        }
      }
      // 输入密码
      function handlePassword(data: any) {
        openPasswordModal(true, {
          isUpdate: true,
          data,
        })
      }

      function handleAudit(record: Recordable) {
        const params = {
          isUpdate: true,
          record: {
            id: record.id,
            orderId: record.orderId,
            ipProvince: record.ipProvince,
            ipCity: record.ipCity,
            spuType: record.spuType,
            rentType: record.rentType,
          },
        }
        if (record.goodsLeaseType == 4) {
          onLineExamineOpenModal(true, params)
        } else {
          openModal(true, params)
        }
      }

      async function handleCancle(record: Recordable) {
        // await getOrderCancle(record.orderId)
        // createMessage.success(`取消成功`)
        // reload()
        openCancleModal(true, {
          isUpdate: true,
          record: {
            ...record,
            id: record.orderId,
          },
        })
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.orderId}?uid=${record.uid}&name=${record.nickName}&auditId=${record.id}&back=/order/orderAudit`,
        )
      }

      return {
        registerTable,
        handleSuccess,
        handleCancle,
        handleAudit,
        handleDetail,
        register,
        passwordModal,
        cancleModal,
        hasPermission,
        onLineExamineRegister,
      }
    },
  })
</script>
