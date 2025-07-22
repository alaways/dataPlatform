<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <BasicUpload
          v-if="hasPermission('OrderListImport')"
          :maxSize="20"
          :maxNumber="1"
          :api="impExcelApi"
          class="my-5"
          :accept="['xls', 'xlsx']"
        >
          导入Excel
        </BasicUpload>

        <Button
          :loading="exportExcelLoading"
          @click="aoaToExcel"
          v-if="hasPermission('OrderListExport')"
        >
          <template #icon><DownloadOutlined /></template>
          申请下载Excel
        </Button>
        <Button @click="handleDownload" v-if="hasPermission('OrderListExport')">
          <template #icon><UnorderedListOutlined /></template>
          下载暂存列表
        </Button>
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow: hasPermission('OrderListDetail'),
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              ifShow:
                hasPermission('OrderDetailSerialNumber') &&
                record.status == 301 &&
                record.goodsLeaseType != 4,
              label: '填写串号',
              onClick: handleDelivery.bind(null, record),
            },
            // {
            //   label: '其他',
            //   onClick: handleDetail.bind(null, record),
            // },
            {
              ifShow:
                record.status != 901 &&
                record?.status != 1101 &&
                record?.status != 1201 &&
                hasPermission('OrderListCancel'),
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
    <PasswordModal @register="passwordModal" @success="handleSuccess" />
    <CancleModal @register="cancleModal" @success="handleSuccess" />
    <deliveryModal @register="deliveryRegister" @success="handleSuccess" />
    <DownloadModal @register="downloadModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, h, ref } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { export3Excel, getOrderList, impExcelApi } from '/@/api/order'
  import { useGo } from '/@/hooks/web/usePage'
  import { Button, Tag } from 'ant-design-vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { getChannelList } from '/@/api/channel'
  import { handleBillList } from '../utils'
  import { useUserStore } from '/@/store/modules/user'
  import { BasicUpload } from '/@/components/Upload'
  import PasswordModal from '../components/PasswordModal.vue'
  import CancleModal from '../components/CancleModal.vue'
  import DownloadModal from '/@/components/DownloadModal/index.vue'
  import { useModal } from '/@/components/Modal'
  import { cloneDeep } from 'lodash-es'
  import { isGMTFormat, isIEBrowse } from '/@/utils/is'
  import { cityCoding } from '/@/utils/cityData2'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { getProductList } from '/@/api/saas/product'
  import { handleMonth } from '/@/utils/order'
  import { DownloadOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
  import deliveryModal from '../orderDetail/components/detail/components/deliveryModal.vue'

  export default defineComponent({
    name: 'OrderListPage',
    components: {
      BasicTable,
      TableAction,
      Button,
      BasicUpload,
      PasswordModal,
      CancleModal,
      DownloadModal,
      DownloadOutlined,
      UnorderedListOutlined,
      deliveryModal,
    },
    setup() {
      const go = useGo()
      const exportExcelLoading = ref(false)
      const importExcelLoading = ref(false)
      const fileList = ref([])

      const userStore = useUserStore()
      const { hasPermission } = usePermission()

      const { createMessage } = useMessage()
      const [passwordModal, { openModal: openPasswordModal }] = useModal()
      const [cancleModal, { openModal: openCancleModal }] = useModal()
      const [downloadModal, { openModal: openDownloadModal }] = useModal()
      const [deliveryRegister, { openModal: openDeliveryModal }] = useModal()
      const [registerTable, { reload, getForm, setColumns, getColumns, getPaginationRef }] =
        useTable({
          title: '订单列表',
          beforeFetch,
          api: getOrderList,
          afterFetch,
          columns: columns(),
          scroll: { y: 600 },
          formConfig: {
            labelWidth: 80,
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
        channelList.value.unshift({ label: '非渠道', value: '*' })
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
        // 显示平台端
        const role = userStore.getUserInfo.role || []
        role.forEach((v: any) => {
          if (v.code == 'super_admin') {
            getProductList().then((res: any) => {
              res = res.list
              form.updateSchema([
                {
                  ifShow: true,
                  field: 'merchantTerminalNo',
                  componentProps: {
                    options: res,
                    fieldNames: {
                      label: 'merchantName',
                      value: 'merchantTerminalNo',
                    },
                  },
                },
              ])
              const columns = getColumns().map((item: any) => {
                if (item.dataIndex == 'merchantTerminalNo') {
                  item = {
                    title: '平台端',
                    dataIndex: 'merchantTerminalNo',
                    width: 120,
                    ifShow: true,
                    customRender: ({ text, record }) => {
                      const find = res.find((v: any) => {
                        if (record.curAuthorizationNumber) {
                          return v.merchantTerminalNo == record.curAuthorizationNumber
                        }
                        return v.merchantTerminalNo == text
                      })
                      const color = {
                        '2023111709466887': '#87d068', // 光速易租
                        '2023111718357889': '#2db7f5', // 考拉租机
                        '2023111709468001': 'green', //光速租机 - 微信
                        '2023111709468002': 'blue', //光速租机 - 支付宝
                      }
                      return h(
                        Tag,
                        { color: color[record.curAuthorizationNumber] || color[text] },
                        find.merchantName || '-',
                      )
                    },
                  }
                }
                return item
              })
              setColumns(columns)
            })
          }
        })
      }

      function handleDelivery(record: Recordable) {
        openDeliveryModal(true, {
          isUpdate: true,
          record,
          name: 'deliverySerialNumber',
        })
      }

      // 处理参数
      async function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        if (pdata.status == 3011) {
          pdata['needEsnotary'] = 1
          pdata['esnotaryPersonSign'] = 0
          delete pdata.status
        }
        if (pdata.rentTypeList == 2 || pdata.rentTypeList == 3) {
          pdata.rentTypeList = '2,3'
        }
        if (pdata.time) {
          pdata['timeBool'] = true
          console.log(isGMTFormat(`${pdata.time[0]}`))

          if (isGMTFormat(`${pdata.time[0]}`)) {
            pdata.time = handleMonth()
          }
          pdata['beginCreateTime'] = `${pdata.time[0]}`
          pdata['endCreateTime'] = `${pdata.time[1]}`
        }
        if (pdata.payTime) {
          pdata['timeBool'] = true
          pdata['beginPayTime'] = `${pdata.payTime[0]}`
          pdata['endPayTime'] = `${pdata.payTime[1]}`
        }
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
        delete pdata.payTime
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
        reload()
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

      async function handleCancle(record: Recordable) {
        // if ([801, 902].includes(record.status)) {
        //   handlePassword({
        //     come: 'orderCancle',
        //     data: record,
        //   })
        //   return
        // }
        // await getOrderCancle(record.id)
        // createMessage.success(`取消成功`)
        // handleSuccess({})
        openCancleModal(true, {
          isUpdate: true,
          record,
        })
      }

      function handleDetail(record: Recordable) {
        go(
          `/Order_router/orderDetail/${record.id}?uid=${record.uid}&name=${record.nickName}&auditId=${record.auditId}&back=/order/orderList`,
        )
      }

      function handleDownload() {
        openDownloadModal(true)
      }
      //  获取有的权限
      function getHasPermission() {
        // hasPermission("diyRow_orderSn"),
        const objStatus = {
          diyRow_orderSn: false,
          diyRow_nickName: hasPermission('diyRow_nickName'),
          diyRow_gender: hasPermission('diyRow_gender'),
          diyRow_phone: hasPermission('diyRow_phone'),
          diyRow_province: hasPermission('diyRow_province'),
          diyRow_channelCode: hasPermission('diyRow_channelCode'),
          diyRow_appletName: hasPermission('diyRow_appletName'),
          diyRow_storeMerchantName: hasPermission('diyRow_storeMerchantName'),
          diyRow_operator: hasPermission('diyRow_operator'),
          diyRow_tenantCode: hasPermission('diyRow_tenantCode'),
          diyRow_spuName: hasPermission('diyRow_spuName'),
          diyRow_goodsLeaseType: hasPermission('diyRow_goodsLeaseType'),
          diyRow_rentType: hasPermission('diyRow_rentType'),
          diyRow_downPaymentAmount: hasPermission('diyRow_downPaymentAmount'),
          diyRow_lockFee2: hasPermission('diyRow_lockFee2'),
          diyRow_atoStatus: hasPermission('diyRow_atoStatus'),
          diyRow_status: hasPermission('diyRow_status'),
          diyRow_createTime: hasPermission('diyRow_createTime'),
          diyRow_payTime: hasPermission('diyRow_payTime'),
          diyRow_realReason: hasPermission('diyRow_realReason'),
          diyRow_remark: hasPermission('diyRow_remark'),
          diyRow_ifOrder: hasPermission('diyRow_ifOrder'),
        }
        let listText = []
        Object.keys(objStatus)?.map((item) => {
          console.log(item, objStatus[item], '我是item')
          if (objStatus[item]) {
            listText.push(item)
          }
        })
        return listText.join(',')
      }
      // 导出
      async function aoaToExcel() {
        if (isIEBrowse()) {
          createMessage.error('请使用除IE之外的浏览器导出Excel')
          return
        }
        const form = await getForm()
        const value = form.getFieldsValue()
        const selectedExcelFields = getHasPermission()
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
          selectedExcelFields,
        }
        const res = await export3Excel(params)
        if (res.code == 200) {
          createMessage.success('已添加进下载暂存列表')
        } else {
          createMessage.success('申请失败')
        }
        exportExcelLoading.value = false
      }

      return {
        registerTable,
        handleSuccess,
        handleCancle,
        handleDetail,
        aoaToExcel,
        importExcelLoading,
        exportExcelLoading,
        fileList,
        impExcelApi,
        passwordModal,
        cancleModal,
        hasPermission,
        downloadModal,
        handleDownload,
        handleDelivery,
        deliveryRegister,
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
