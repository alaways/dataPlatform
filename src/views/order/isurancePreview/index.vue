<template>
  <PageWrapper dense contentFullHeight contentClass="flex flex-col">
    <div class="header">
      <div class="flex-1"></div>
      <div class="title">订单投保合作协议/电子保单</div>
      <div class="flex flex-1 justify-end">
        <Button type="primary" @click="handleConfirm"> 确认投保 </Button>
        <Button class="mx-3" @click="handleCancle"> 关闭 </Button>
      </div>
    </div>
    <template v-for="(item, index) in keyList">
      <div class="content" v-if="index == pageCurrent" :key="item">
        <div v-html="pdata.contentValues[item]"></div>
      </div>
    </template>

    <div class="pageCur">
      <Button :disabled="pageCurrent == 0" @click="handlePage(-1)"> 上一份 </Button>
      <Button :disabled="pageCurrent == keyList.length - 1" class="mt-3" @click="handlePage(1)">
        下一份
      </Button>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, h, ref } from 'vue'
  import { PageWrapper } from '/@/components/Page'
  import { useTabs } from '/@/hooks/web/useTabs'
  import { useRoute } from 'vue-router'
  import { Button, Modal } from 'ant-design-vue'
  import { getIsurancePreview, getIsurancePreviewConfirm } from '/@/api/order/isurancePreview'
  import { formatNumber } from '/@/utils/tool'
  import { useMessage } from '/@/hooks/web/useMessage'

  export default defineComponent({
    name: 'IsurancePreviewOrder',
    components: { PageWrapper, Button },
    setup() {
      const route = useRoute()
      const { closeCurrent } = useTabs()
      const { createMessage } = useMessage()
      const pageCurrent = ref(0)
      const params = {
        orderId: route.params?.id,
        merchantCode: route.query?.merchantCode,
        orderSn: route.query?.orderSn,
      }
      const pdata = ref<any>()
      const keyList = ref<any>([])
      init()
      async function init() {
        pdata.value = await getIsurancePreview(params)
        keyList.value = Object.keys(pdata.value.contentValues)
      }
      function handleConfirm() {
        Modal.confirm({
          title: () => `请确认是否为了订单: ${params.orderSn}, 进行投保!`,
          content: () =>
            h('div', {}, [
              h('div', {}, `保险条款名称: ${pdata.value.proposalName}`),
              h('div', {}, `保险期限: ${pdata.value.effectiveTime}至${pdata.value.expireTime}`),
              h('div', {}, `保险金额(元): ${formatNumber(pdata.value.sumAmount, 2)}`),
              h('div', {}, `保险费(元): ${pdata.value.sumPremium}`),
            ]),
          onCancel: () => {},
          onOk: async () => {
            const data = await getIsurancePreviewConfirm(params)
            if (data.elecPolicyUrl) {
              createMessage.success(`投保成功`)
            } else {
              createMessage.success(`投保失败`)
            }
          },
        })
      }
      function handleCancle() {
        closeCurrent()
      }

      function handlePage(size: number) {
        window.scrollTo({
          top: 0,
        })
        pageCurrent.value = pageCurrent.value + size
      }

      return {
        handleConfirm,
        handleCancle,
        pdata,
        keyList,
        pageCurrent,
        handlePage,
      }
    },
  })
</script>

<style lang="less" scoped>
  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    min-height: 40px;
    padding: 8px 0;
    background: #fff;

    .title {
      padding-left: 7px;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  .content {
    padding: 30px;
    margin-top: 10px;
    width: 100%;
    background: #fff;
  }

  .pageCur {
    position: fixed;
    right: 80px;
    top: 70%;
    display: flex;
    flex-direction: column;
  }
</style>
