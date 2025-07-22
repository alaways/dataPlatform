<template>
  <div class="relative">
    <Button v-if="isDownload" type="primary" class="down" @click="handleDownload">
      下载微签回执
    </Button>
    <Description
      size="middle"
      title=""
      :bordered="false"
      :column="3"
      :data="deliveryData"
      :schema="carrySchema"
    />
    <Description
      size="middle"
      title="发货信息"
      :bordered="false"
      :column="3"
      :data="deliveryData"
      :schema="deliverySchema"
    />
    <Description
      size="middle"
      title="商品信息"
      :bordered="false"
      :column="3"
      :data="detailInfo"
      :schema="goodsSchema"
    />
    <Description
      size="middle"
      title="物流信息"
      :bordered="false"
      :column="3"
      :data="ticketsData"
      :schema="ticketsSchema"
    />
    <div class="ml-3 steps" v-if="routeList && routeList.length">
      <a-steps :current="stepCurrent" direction="vertical" progress-dot size="size">
        <a-step
          v-for="(item, index) in routeList"
          :key="index"
          :subTitle="`${item.acceptAddress} ${item.acceptTime} ${item.remark}`"
        />
      </a-steps>
    </div>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, ref } from 'vue'
  import { Description } from '/@/components/Description/index'
  import { Button, Divider } from 'ant-design-vue'

  import { carrySchema, deliverySchema, goodsSchema, ticketsSchema } from './data'
  import { getSFLogistics, getSFLogisticsRoute } from '/@/api/order'
  import { canParseJSON } from '/@/utils/tool'
  import { Steps } from 'ant-design-vue'
  import { downloadByUrlChangeName } from '/@/utils/file/download'

  const props = {
    detailInfo: { type: Object },
  }
  export default defineComponent({
    components: {
      Description,
      [Divider.name]: Divider,
      [Steps.name]: Steps,
      [Steps.Step.name]: Steps.Step,
      Button,
    },
    props,
    setup(props) {
      const detailInfo: any = ref(props.detailInfo)
      // 订单详情里的 - 物流信息
      const orderDeliveryRecordVO: any = ref(detailInfo.value.orderDeliveryRecordVO)
      const deliveryData = ref<any>({})
      const ticketsData = ref<any>({})
      const routeList = ref<any>([])

      const stepCurrent = 0

      /**
       * 显示下载按钮
       * -2下单中,-1下单失败,0下单成功,1任务处理中,2任务待审核,3任务异常,
       * 4任务已完成,5任务已取消,6任务异常退出,7任务失败,8任务失败完成,9任务终止,-99其他错误"
       */
      const isDownload = computed(() => {
        // receiptImage 图片回执
        return deliveryData.value?.wpStatus == 4 || orderDeliveryRecordVO.value?.receiptImage
      })

      init()
      async function init() {
        // 发货信息
        getSFLogistics({ orderSn: detailInfo.value.orderSn }).then((res) => {
          const data = res?.reqData
          if (data && canParseJSON(data)) {
            deliveryData.value = JSON.parse(data)
            deliveryData.value['createTime'] = res.createTime
            deliveryData.value['deliveryMethod'] = '物流发货'
            deliveryData.value['logisticsCompany'] = '顺丰快递'
          }
        })

        // 物流详情
        getSFLogisticsRoute({ orderSn: detailInfo.value.orderSn }).then((res) => {
          ticketsData.value = res && res[0]
          const data = ticketsData.value?.routes || []
          routeList.value = data.reverse()
        })
      }

      function handleDownload() {
        const userV0 = detailInfo.value.userV0
        downloadByUrlChangeName({
          url: orderDeliveryRecordVO.value?.receiptImage || '',
          fileName: `${userV0?.nickName || ''}物流回执`,
        })
      }

      return {
        detailInfo,
        carrySchema,
        deliverySchema,
        deliveryData,
        goodsSchema,
        ticketsSchema,
        ticketsData,
        routeList,
        stepCurrent,
        handleDownload,
        isDownload,
      }
    },
  })
</script>
<style lang="less" scoped>
  .steps {
    ::v-deep(.ant-steps-item) {
      .ant-steps-item-tail {
        &::after {
          background-color: #0960bd;
        }
      }

      .ant-steps-item-icon {
        .ant-steps-icon-dot {
          background: #0960bd;
        }
      }
    }
  }

  .down {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
