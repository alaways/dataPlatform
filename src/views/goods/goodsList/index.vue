<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button v-if="hasPermission('GoodsListAdd')" type="primary" @click="handleAdd">
          新增商品
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          class="TableAction"
          :actions="[
            {
              ifShow:
                hasPermission('GoodsListUpdate') &&
                !record.ifLock &&
                !goodsRentType.includes(record.rentType),
              label: '修改属性',
              onClick: handleBase.bind(null, record),
            },
            {
              ifShow: hasPermission('GoodsListUpdate'),
              label: '租赁属性',
              onClick: handleLease.bind(null, record),
            },
            {
              ifShow: hasPermission('GoodsListQRCode') && handleShow(record),
              label: '生成二维码',
              onClick: handleQRcode.bind(null, record),
            },
            {
              ifShow: hasPermission('GoodsListCopy'),
              label: '复制',
              popConfirm: {
                title: '是否确认复制',
                placement: 'left',
                confirm: handleCopy.bind(null, record),
              },
            },
            {
              ifShow:
                hasPermission('GoodsListDel') &&
                !record.ifLock &&
                !goodsRentType.includes(record.rentType),
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
    <Image
      :visible="qrCodeOpen"
      style="display: none"
      :src="qrCodeURL"
      :preview="{
        visible: qrCodeOpen,
        onVisibleChange: handleQRCodeURLChange,
      }"
    />
  </div>
  <QRcodeModal @register="qrCodeModal" @success="handleSuccess" />
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue'
  import { BasicTable, useTable, TableAction } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { useGo } from '/@/hooks/web/usePage'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { Recordable } from 'vite-plugin-mock'
  import { copyGoodsList, creatQRCode, delGoodsList, getGoodsList } from '/@/api/goods'
  import { getAppEnvConfig } from '/@/utils/env'
  import { Image } from 'ant-design-vue'
  import { useModal } from '/@/components/Modal'
  import QRcodeModal from './QRcodeModal.vue'
  import { isAdmin } from '/@/utils/is'
  import { useGoodsStore } from '/@/store/modules/goods'
  import { getUserConcern } from '/@/api/order'
  import { rentTypeList } from '../goodsLease/utils'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { getAppList } from '/@/api/saas/app'
  import { useUserStore } from '/@/store/modules/user'

  export default defineComponent({
    name: 'GoodsListPage',
    components: { BasicTable, TableAction, Image, QRcodeModal },
    setup() {
      const go = useGo()
      const { hasPermission } = usePermission()
      const goodsStore = useGoodsStore()
      const userStore = useUserStore()
      const goodsRentType = ref<any[]>([])
      const appletList = ref<any[]>([])
      const { VITE_GLOB_API_URL } = getAppEnvConfig()
      const [qrCodeModal, { openModal }] = useModal()
      const { createMessage } = useMessage()
      const [registerTable, { reload }] = useTable({
        title: '商品列表',
        beforeFetch,
        api: getGoodsList,
        columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        searchInfo: {
          ascs: '',
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
      // 处理参数
      async function beforeFetch(data) {
        data['pageIndex'] = data.cursor
        data['pageSize'] = data.limit
        delete data.time
        return data
      }
      onMounted(() => {
        init()
      })

      async function init() {
        const res = await getUserConcern({ label: 'sysConf.goods.lock' })
        const find: any = rentTypeList.find((v) => v.label == res)
        if (find) {
          goodsRentType.value = [Number(find.value), String(find.value)]
          if (find.value == 2 || find.value == 3) {
            goodsRentType.value = [2, '2', 3, '3']
          }
        }
        const userInfo = userStore.getUserInfo
        getAppList({ limit: '999999' }).then((req: any) => {
          req = req.list || []
          const appletValue = String(userInfo.appletValue).split(',')
          const filter = req.filter((v: any) => appletValue.some((o) => o == v.appletCode))
          if (filter) {
            appletList.value = filter.map((v) => {
              return {
                ...v,
                label: v.appletName,
                value: v.appletCode,
              }
            })
          }
        })
      }

      function handleSuccess() {
        reload()
      }

      async function handleCopy(record: Recordable) {
        await copyGoodsList({ spuId: record.id })
        createMessage.success(`复制成功`)
        handleSuccess()
      }

      async function handleDel(record: Recordable) {
        await delGoodsList(record.id)
        createMessage.success(`删除成功`)
        handleSuccess()
      }

      function handleAdd() {
        go(`/Goods_router/goodsBase/0?back=/goods/goodsList`)
      }

      function handleBase(record: Recordable) {
        go(`/Goods_router/goodsBase/${record.id}?title=${record.name}&back=/goods/goodsList`)
      }

      function handleLease(record: Recordable) {
        go(`/Goods_router/goodsLeaseMore/${record.id}?title=${record.name}&back=/goods/goodsList`)
      }

      const qrCodeURL = ref('')
      const qrCodeOpen = ref(false)

      async function handleQRcode(record: Recordable) {
        console.log(VITE_GLOB_API_URL)
        openModal(true, {
          isUpdate: true,
          appletList,
          record: {
            ...record,
          },
        })
        return
        console.log(openModal)
        if (record.qrCodeURL) {
          qrCodeURL.value = record.qrCodeURL
          qrCodeOpen.value = true
          return
        }
        // ${record.merchantTerminalNo} 目前只用光速租机的扫码
        // const prarms = `2023111709468001?id=${record.id}&rentType=${record.rentType}`
        let merchantTerminalNo = record.merchantTerminalNo
        if (merchantTerminalNo == 2023111718357889) {
          merchantTerminalNo = 2023111709468001
        }
        const prarms = `${merchantTerminalNo}?id=${record.id}&rentType=${record.rentType}`
        let url = `${VITE_GLOB_API_URL}/${prarms}`

        if (isAdmin()) {
          url = `https://yizu.gsrental.cn/${prarms}`
        }
        record.qrCodeURL = await creatQRCode({ url })
        qrCodeURL.value = record.qrCodeURL
        qrCodeOpen.value = true
      }

      function handleQRCodeURLChange(e) {
        qrCodeOpen.value = e
      }

      function handleShow(record) {
        return 1
        return [
          2023111718357889,
          '2023111718357889',
          2023111709468001,
          '2023111709468001',
        ].includes(record.merchantTerminalNo)
      }

      watch(
        () => goodsStore.getUpdateReload,
        (value: any) => {
          console.log(value)
          if (value) {
            handleSuccess()
            goodsStore.setUpdateReload(false)
          }
        },
      )

      return {
        registerTable,
        hasPermission,
        handleSuccess,
        handleBase,
        handleCopy,
        handleDel,
        handleLease,
        handleAdd,
        handleQRcode,
        handleQRCodeURLChange,
        qrCodeURL,
        qrCodeOpen,
        qrCodeModal,
        handleShow,
        goodsRentType,
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
