<template>
  <PageWrapper title="租赁属性" contentBackground contentClass="p-4">
    <template #footer>
      <ATabs v-model:activeKey="currentKey" @change="handleTabChange">
        <ATabPane v-for="item in menuData" :tab="item.tab" :key="item.key" />
      </ATabs>
    </template>
    <template #rightFooter>
      <Button
        v-if="hasPermission('GoodsLeaseMoreQRCode') && rentType.value != -1"
        @click="handleQRcode"
      >
        生成二维码
      </Button>
      <Button class="!ml-4" @click="resetAll"> 重置 </Button>
      <Button class="!ml-4" type="primary" @click="submitAll"> 提交 </Button>
    </template>
    <Skeleton v-show="loading" :active="true" :loading="loading" :paragraph="{ rows: 16 }" />
    <Lease
      v-show="!loading"
      ref="leaseRef"
      :currentKey="currentKey"
      :goodsId="goodsId"
      :rentTypeList="rentTypeList"
      :info="detailInfo"
    />
    <Image
      :visible="qrCodeOpen"
      style="display: none"
      :src="qrCodeURL"
      :preview="{
        visible: qrCodeOpen,
        onVisibleChange: handleQRCodeURLChange,
      }"
    />
    <QRcodeModal @register="qrCodeModal" />
  </PageWrapper>
</template>
<script lang="ts">
  import { computed, defineComponent, provide, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { Tabs, Button } from 'ant-design-vue'
  import { useRoute } from 'vue-router'
  import { useTabs } from '/@/hooks/web/useTabs'
  import { useGoodsStore } from '/@/store/modules/goods'
  import { useGo } from '/@/hooks/web/usePage'
  import { creatQRCode, getGoodsDetail } from '/@/api/goods'
  import Lease from './components/lease.vue'
  import QRcodeModal from '../goodsList/QRcodeModal.vue'
  import { goodTypeList } from './components/utils'
  import { Image } from 'ant-design-vue'
  import { getAppEnvConfig } from '/@/utils/env'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { isAdmin } from '/@/utils/is'
  import { getAppList } from '/@/api/saas/app'
  import { useModal } from '/@/components/Modal/src/hooks/useModal'
  import { useUserStore } from '/@/store/modules/user'
  import { getUserConcern } from '/@/api/order'
  import { getPenaltyList } from '/@/api/goods/goodsPenaltySetting'
  import { canParseJSON } from '/@/utils/tool'

  export default defineComponent({
    name: '商品租赁属性',
    components: {
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      PageWrapper,
      Lease,
      Button,
      Image,
      QRcodeModal,
    },
    setup() {
      provide('init', init)
      provide('loading', loadingClose)

      const go = useGo()
      const route = useRoute()
      const { setTitle } = useTabs()
      const goodsStore = useGoodsStore()
      const { VITE_GLOB_API_URL } = getAppEnvConfig()
      const { hasPermission } = usePermission()
      const [qrCodeModal, { openModal }] = useModal()
      const userStore = useUserStore()
      const appletList = ref<any[]>([])

      const loading = ref(false)
      const qrCodeURL = ref('')
      const qrCodeOpen = ref(false)

      setTitle('租赁: ' + route.query?.title)
      const goodsId = ref(route.params?.id)
      const back = String(route.query?.back)

      const info = ref<any>()
      const detailInfo = ref<any>()
      const leaseRef = ref<any>()

      const currentKey = ref(2)
      const menuData = ref<any>([])

      const rentTypeList = ref<any>([])

      init()
      async function init() {
        try {
          getPenaltyList({ label: 'penaltyRate.confg' }).then((res: any) => {
            if (canParseJSON(res)) {
              const data = JSON.parse(String(res))
              if (data.penaltyRateInfoList && data.penaltyRateInfoList.length) {
                rentTypeList.value = data.penaltyRateInfoList
              }
            }
          })
          getUserConcern({ label: 'sysConf.goodsLeaseType' }).then((res: string) => {
            const data = res.split(',')
            menuData.value = goodTypeList
              .filter((v) => data.some((o: any) => o == v.value))
              .map((v) => {
                return { tab: v.label, key: v.value }
              })
          })
          loading.value = true
          info.value = await getGoodsDetail(goodsId.value)
          detailInfo.value = info.value.spuRentAttributeList
          loadingClose()
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
        } catch (error) {
          loadingClose()
        }
      }

      function resetAll() {
        leaseRef.value?.resetAll()
      }

      async function submitAll() {
        return await leaseRef.value?.submitAll()
      }

      function handleTabChange() {
        resetAll()
      }

      async function handleQRcode() {
        console.log(VITE_GLOB_API_URL)
        try {
          // if (rentType.value == -1) {
          // const error = await submitAll()
          // if (error) return
          // }
          const error = await submitAll()
          if (error) return
          console.log(info.value)

          openModal(true, {
            isUpdate: true,
            appletList,
            record: {
              ...info.value,
              type: currentKey.value,
            },
          })
        } catch (error) {
          console.log(error)
        }
        return
        console.log(openModal)
        const prarms = `${info.value.merchantTerminalNo}?id=${info.value.id}&rentType=${rentType.value}&type=${currentKey.value}`
        let url = `${VITE_GLOB_API_URL}/${prarms}`
        console.log(VITE_GLOB_API_URL)

        if (isAdmin()) {
          url = `https://yizu.gsrental.cn/${prarms}`
        }
        qrCodeURL.value = await creatQRCode({ url })
        qrCodeOpen.value = true
      }

      function handleQRCodeURLChange(e) {
        qrCodeOpen.value = e
      }

      function loadingClose() {
        loading.value = false
      }

      // 返回上一页
      function goBack() {
        goodsStore.setUpdateReload(true)
        go(back)
      }

      const rentType = computed(() => {
        if (!detailInfo.value) return -1
        const find = detailInfo.value.find((v) => v.type == currentKey.value)
        if (!find) {
          return -1
        } else if (find.rentType === 0) {
          return find.rentType
        } else if (!find.rentType) {
          return -1
        } else {
          return find.rentType
        }
      })

      return {
        hasPermission,
        menuData,
        currentKey,
        handleTabChange,
        resetAll,
        submitAll,
        goBack,
        leaseRef,
        loading,
        goodsId,
        rentType,
        detailInfo,
        handleQRcode,
        qrCodeURL,
        qrCodeOpen,
        handleQRCodeURLChange,
        qrCodeModal,
        rentTypeList,
      }
    },
  })
</script>
