<template>
  <div class="orderInfo">
    <div class="contract">
      <div class="flex mb-3 justify-end" v-if="detailInfo.signStatus === 1">
        <Button
          v-if="hasPermission('OrderDetailContractDownload')"
          type="primary"
          :loading="exportContractLoading"
          @click="downloadContract"
        >
          下载合同
        </Button>
        <Popconfirm
          v-if="hasPermission('OrderDetailContractRevoke') && detailInfo.signType != 'ato'"
          title="是否确认撤销"
          placement="bottom"
          @confirm="handleRevoke"
        >
          <Button class="ml-3"> 合同撤销 </Button>
        </Popconfirm>
      </div>
      <div class="flex justify-end">
        <Button
          v-if="
            detailInfo.ifOrder == 1 &&
            !detailInfo.elecPolicyUrl &&
            hasPermission('OrderDetailInsure')
          "
          class="isurance"
          @click="handleIsurance"
        >
          订单投保
        </Button>
        <Button
          v-if="
            detailInfo.ifOrder == 1 &&
            detailInfo.elecPolicyUrl &&
            hasPermission('OrderDetailInsureDownload')
          "
          class="ml-3"
          @click="downloadIsurance"
        >
          下载保单
        </Button>
        <Button
          v-if="detailInfo.esnotaryPersonSign == 1 && hasPermission('OrderDetailEsnotaryDownload')"
          class="ml-3"
          type="primary"
          :loading="downLoadEsnotaryLoading"
          @click="downLoadEsnotary"
        >
          下载公证
        </Button>
        <Button
          v-if="detailInfo.contractStatus === 'COMPLETE' && hasPermission('downloadContract')"
          class="ml-3"
          type="primary"
          @click="downLoadEsgineContact"
        >
          下载补充协议合同
        </Button>
        <Button
          v-if="hasPermission('OrderSueCreateInfo') && detailInfo.status == 901"
          type="primary"
          @click="handleCreateOrdeSue"
        >
          生成起诉材料
        </Button>
      </div>
    </div>
    <Descriptions class="flex-1" size="middle" title="订单信息">
      <DescriptionsItem label="" :span="3">
        <h1 style="cursor: pointer" @click="handleCopy(detailInfo.spuName)">
          {{ detailInfo.spuName || '-' }}
        </h1>
        <Tag color="green" v-if="detailInfo.appletName" style="margin-left: 6px">
          {{ detailInfo.appletName }}
        </Tag>

        <Tag :color="detailInfo?.spuType ? 'blue' : 'purple'" style="margin-left: 6px">
          {{ detailInfo?.spuType == 1 ? '手机' : '电动车' }}
        </Tag>

        <Tag color="blue" v-if="detailInfo.goodsLeaseType" style="margin-left: 6px">
          {{ handleTypeName(detailInfo.goodsLeaseType) }}
        </Tag>

        <Tag v-if="atoStatus" :color="atoStatus?.color" style="margin-left: 6px">
          {{ atoStatus?.label }}
        </Tag>

        <Tag :color="status?.color" style="margin-left: 6px">
          {{ status?.label }}
        </Tag>

        <!-- <Tag v-if="detailInfo.merchantTerminalNames" color="green" style="margin-left: 6px">{{
          detailInfo.merchantTerminalNames
        }}</Tag> -->
      </DescriptionsItem>
      <DescriptionsItem label="订单编号">
        <div>{{ detailInfo.orderSn || '-' }}</div>
        <CopyOutlined class="icon" @click="handleCopy(detailInfo.orderSn)" />
      </DescriptionsItem>
      <DescriptionsItem label="渠道">
        <div>{{ detailInfo.channelCode || '-' }}</div>
        <EditOutlined
          v-if="hasPermission('OrderDetailEditModal')"
          class="icon"
          @click="handleChannelCode"
        />
      </DescriptionsItem>
      <DescriptionsItem label="办理公证">
        <div v-if="detailInfo.needEsnotary == 1">是</div>
        <div v-else-if="detailInfo.needEsnotary == 0">否</div>
        <div v-else>-</div>
        <EditOutlined
          v-if="
            hasPermission('OrderDetailNeedEsnotary') &&
            detailInfo.status >= 301 &&
            !detailInfo.esnotaryPersonSign
          "
          class="icon"
          @click="handleRemark('needEsnotary')"
        />
      </DescriptionsItem>
      <DescriptionsItem label="规格">
        <div>{{ detailInfo.skuName || '-' }}</div>
        <EditOutlined
          class="icon"
          @click="handleSkuName"
          v-if="detailInfo.status < 501 && hasPermission('OrderDetailEditModal')"
        />
      </DescriptionsItem>
      <DescriptionsItem label="官网价格">
        <div>{{ formatNumber(detailInfo.officialPrice, 2, '.', ',', '￥', '元') || '-' }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="订单总金额">
        <div>{{ formatNumber(detailInfo.totalMoney, 2, '.', ',', '￥', '元') }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="订单总租金">
        <div>{{ formatNumber(detailInfo.totalRentAmount, 2, '.', ',', '￥', '元') }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="订单总罚金">
        <div>{{
          formatNumber(detailInfo.totalRepenaltyAmount, 2, '.', ',', '￥', '元') || '-'
        }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="首次支付金额">
        <div>{{
          formatNumber(
            detailInfo.downPaymentAmount || detailInfo.downPaymentTotalAmount,
            2,
            '.',
            ',',
            '￥',
            '元',
          )
        }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="剩余待支付金额">
        <div>{{ formatNumber(detailInfo.outstandingAmountToBePaid, 2, '.', ',', '￥', '元') }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="优惠金额">
        <Tooltip placement="bottom" v-if="detailInfo.couponMoney">
          <template #title>
            <div class="p-2">
              <span>查看优惠信息</span><br />
              <span>优惠信息: 满</span>
              <span>{{ formatNumber(detailInfo.userCouponRecordVO?.minPoint || 0, 2) }}</span>
              <span>减</span>
              <span>{{ formatNumber(detailInfo.userCouponRecordVO?.faceValue || 0, 2) }}</span>
              <span v-if="detailInfo.userCouponRecordVO?.minPoint == 0">(无门槛)</span>
            </div>
          </template>
          <div>
            {{ formatNumber(detailInfo.couponMoney, 2, '.', ',', '￥', '元') }}
          </div>
        </Tooltip>
        <div v-else>
          {{ formatNumber(detailInfo.couponMoney, 2, '.', ',', '￥', '元') }}
        </div>
      </DescriptionsItem>
      <DescriptionsItem label="租期">
        <div>{{ detailInfo.totalPeriodsNum }}期</div>
      </DescriptionsItem>
      <DescriptionsItem label="下单时间">
        <div>{{ detailInfo.createTime || '-' }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="支付时间">
        <div>{{ detailInfo.payTime || '-' }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="串号/序列号">
        <div>
          <div>
            <span>{{ detailInfo.deliverySerialNumber || '-' }}</span>
            <EditOutlined
              class="icon"
              @click="handleDelivery('deliverySerialNumber')"
              v-if="detailInfo.status < 501 && hasPermission('OrderDetailEditModal')"
            />
          </div>
          <div style="color: red; font-weight: bold; font-size: 16px">
            签约前请填写串号/序列号
          </div>
        </div>
      </DescriptionsItem>
      <DescriptionsItem label="风控审单">
        <div>{{ orderAudit?.operator || '-' }}</div>
        <EditOutlined
          v-if="hasPermission('OrderDetailEditOperatorModal')"
          class="icon"
          @click="handleUpdateAudit"
        />
      </DescriptionsItem>
      <DescriptionsItem label="业务员">
        <div>{{ detailInfo.salesperson || '-' }}</div>
        <EditOutlined
          v-if="hasPermission('OrderDetailEditModal')"
          class="icon"
          @click="handleRemark('salesperson')"
        />
      </DescriptionsItem>
      <DescriptionsItem label="业务员所属地区" :span="3">
        <div>{{ `${detailInfo.salespersonCity || '-'}` }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="是否业务员担保" :span="1">
        <div v-if="!detailInfo.salesmanGuarantee && detailInfo.salesmanGuarantee != 0">-</div>
        <div v-else>
          <span>{{ `${detailInfo.salesmanGuarantee ? '是' : '否'}` }}</span>
          <EditOutlined
            v-if="hasPermission('OrderDetailEditModal')"
            class="icon"
            @click="handleRemark('salesmanGuarantee')"
          />
        </div>
      </DescriptionsItem>
      <DescriptionsItem label="合同甲方公司名称" :span="2">
        <div>{{ detailInfo.contractElectronicSeal?.company2TenantName || '-' }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="门店商家名称">
        <div>{{ detailInfo.storeMerchantName || '-' }}</div>
        <EditOutlined
          v-if="hasPermission('OrderDetailEditModal')"
          class="icon"
          @click="handleRemark('storeMerchantName')"
        />
      </DescriptionsItem>
      <DescriptionsItem label="押金/抵后剩余" :span="2">
        <div>{{
          detailInfo.deposit
            ? `${formatNumber(detailInfo.deposit || 0, 2)}/${formatNumber(
                (detailInfo.deposit || 0) - (detailInfo.deductDeposit || 0),
                2,
              )}`
            : '-'
        }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="锁费">
        <div style="margin-right: 6px">￥{{ formatNumber(detailInfo.lockFee2, 2) || '-' }}元</div>
      </DescriptionsItem>
      <DescriptionsItem label="增值服务">
        <div style="margin-right: 6px">{{ detailInfo.service || '无' }}</div>
        <!-- <Tag v-if="detailInfo.service" color="green">开启</Tag>
        <Tag v-else color="red">关闭</Tag> -->
      </DescriptionsItem>
      <DescriptionsItem label="公证费用">
        <div style="margin-right: 6px">￥{{ formatNumber(detailInfo.gzFee, 2) || '-' }}元</div>
      </DescriptionsItem>
      <DescriptionsItem label="物流公司">
        <div>{{ `${detailInfo.orderDeliveryRecordVO?.deliveryCompany || '-'}` }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="物流单号" :span="2">
        <div>{{ `${detailInfo.orderDeliveryRecordVO?.deliverySn || '-'}` }}</div>
        <CopyOutlined
          v-if="detailInfo.orderDeliveryRecordVO?.deliverySn"
          class="icon"
          @click="handleCopy(detailInfo.orderDeliveryRecordVO?.deliverySn)"
        />
      </DescriptionsItem>

      <DescriptionsItem label="收件人" v-if="hasPermission('orderDetail_receiverName')">
        <div>{{ `${detailInfo.receiverName || '-'}` }}</div>
      </DescriptionsItem>
      <DescriptionsItem label="收件号" :span="2" v-if="hasPermission('orderDetail_receiverPhone')">
        <div>{{ `${detailInfo.receiverPhone || '-'}` }}</div>
      </DescriptionsItem>
      <DescriptionsItem
        label="收货地址"
        :span="3"
        v-if="hasPermission('orderDetail_receiverProvince')"
      >
        <div>{{
          `${detailInfo.receiverProvince}${detailInfo.receiverCity || ''}${
            detailInfo.receiverRegion || ''
          }${detailInfo.receiverDetailAddress}`
        }}</div>
        <EditOutlined
          v-if="hasPermission('OrderDetailEditModal')"
          class="icon"
          @click="handleDelivery('address')"
        />
      </DescriptionsItem>
      <DescriptionsItem label="用户下的IP" :span="3">
        <div>{{ `${detailInfo.ipProvince}${detailInfo.ipCity}` }}</div>
        <EditOutlined
          v-if="hasPermission('OrderDetailEditModal')"
          class="icon"
          @click="handleRemark('ipCity')"
        />
      </DescriptionsItem>
      <DescriptionsItem label="备注" :span="3" v-if="hasPermission('orderDetail_remark')">
        <div>{{ `${detailInfo.remark || '-'}` }}</div>
        <EditOutlined
          v-if="hasPermission('OrderDetailEditModal')"
          class="icon"
          @click="handleRemarkList()"
        />
      </DescriptionsItem>

      <DescriptionsItem label="订单取消原因" v-if="hasPermission('orderDetail_closeRemark')">
        <div>{{ detailInfo?.closeRemark || '-' }}</div>
      </DescriptionsItem>

      <DescriptionsItem label="操作人" v-if="hasPermission('orderDetail_closeCreateBy')">
        <div>{{ detailInfo?.closeCreateBy || '-' }}</div>
      </DescriptionsItem>

      <DescriptionsItem label="时间" v-if="hasPermission('orderDetail_closeCreateTime')">
        <div>{{ detailInfo?.closeCreateTime || '-' }}</div>
      </DescriptionsItem>

      <DescriptionsItem label="用户评级" v-if="hasPermission('orderDetail_userLevel')">
        <div>{{ detailInfo?.userLevel || '-' }}</div>
      </DescriptionsItem>

      <DescriptionsItem label="审核原因" :span="2" v-if="hasPermission('orderDetail_realReason')">
        <div>{{ detailInfo?.realReason || '-' }}</div>
      </DescriptionsItem>
    </Descriptions>
    <channelModel @register="channelRegister" @success="handleSuccess" />
    <deliveryModal @register="deliveryRegister" @success="handleSuccess" />
    <remarkModal @register="remarkRegister" @success="handleSuccess" />
    <skuNameModal @register="skuNameRegister" @success="handleSuccess" />
    <remarkTaskModal @register="remarkTaskRegister" @success="handleSuccess" />
    <updateAuditModal @register="updateAuditRegister" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, inject, ref } from 'vue'
  import { Descriptions, DescriptionsItem, Tag, Button, Popconfirm, Tooltip } from 'ant-design-vue'
  import { formatNumber } from '/@/utils/tool'
  import { platform, statusList } from '../../../../utils'
  import { EditOutlined, CopyOutlined } from '@ant-design/icons-vue'
  import { copyText } from '/@/utils/copyTextToClipboard'
  import { useModal } from '/@/components/Modal'
  import channelModel from './channelModel.vue'
  import deliveryModal from './deliveryModal.vue'
  import remarkModal from './remarkModal.vue'
  import { downloadByData, downloadByUrl } from '/@/utils/file/download'
  import { useUserStore } from '/@/store/modules/user'
  import skuNameModal from './skuNameModal.vue'
  import remarkTaskModal from '/@/views/collection/components/recordModal.vue'
  import { downloadEsnotary, exportContract, revokeContract } from '/@/api/order'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useGo } from '/@/hooks/web/usePage'
  import { getProductList } from '/@/api/saas/product'
  import { getSalespersonList } from '/@/api/business/salesperson'
  import { goodTypeList } from '/@/views/goods/goodsLeaseMore/components/utils'
  import { atoStatusList } from '/@/views/order/all/data'
  import UpdateAuditModal from './updateAuditModal.vue'
  import { downloadContractList } from '/@/api/esgineInfo/list'
  import { prosecuteCreate } from '/@/api/sue/index'

  const props = {
    detailInfo: { type: Object },
  }

  export default defineComponent({
    components: {
      Descriptions,
      DescriptionsItem,
      Tag,
      EditOutlined,
      CopyOutlined,
      channelModel,
      deliveryModal,
      remarkModal,
      skuNameModal,
      remarkTaskModal,
      UpdateAuditModal,
      Button,
      Popconfirm,
      Tooltip,
    },
    props,
    setup(props) {
      const go = useGo()
      const parent: any = inject('init')
      const exportContractLoading = ref(false)
      const downLoadEsnotaryLoading = ref(false)
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()

      const detailInfo: any = ref(props.detailInfo)
      const [channelRegister, { openModal: openChannelModel }] = useModal()
      const [deliveryRegister, { openModal: openDeliveryModal }] = useModal()
      const [remarkRegister, { openModal: openRemarkModal }] = useModal()
      const [skuNameRegister, { openModal: openSkuNameModal }] = useModal()
      const [remarkTaskRegister, { openModal: openRemarkTaskModal }] = useModal()
      const [updateAuditRegister, { openModal: openAuditModel }] = useModal()

      const status = computed(() => {
        const find = statusList.find((v) => v.value == detailInfo.value.status)
        return find
      })

      const atoStatus = computed(() => {
        const find = atoStatusList.find((v) => v.value == detailInfo.value.atoStatus)
        return find
      })

      // 订单信息 - 订单总额
      detailInfo.value['platform'] = handlePlatform(detailInfo.value)
      function handlePlatform(data) {
        const find: any = platform.find((v) => v.value == data.sourceFrom)
        return find?.label || '无'
      }

      // 订单信息- 审单信息
      const orderAudit: any = ref()
      if (detailInfo.value.orderAuditList && detailInfo.value.orderAuditList.length) {
        orderAudit.value = detailInfo.value.orderAuditList[0]
      }

      // 订单信息 - 平台端
      const userStore = useUserStore()
      const role = userStore.getUserInfo.role || []
      init()

      function init() {
        role.forEach((v: any) => {
          if (v.code == 'super_admin') {
            getProductList().then((res: any) => {
              res = res.list
              const find = res.find(
                (v: any) => v.merchantTerminalNo == detailInfo.value.merchantTerminalNo,
              )
              detailInfo.value['merchantTerminalNames'] = find.merchantName || '-'
            })
          }
        })

        // 订单信息 - 增值服务
        detailInfo.value['service'] = handleService(detailInfo.value)
        function handleService(data) {
          const list = data.valueAddedServiceList
          let txt = ''
          if (list && list[0]) {
            const name = list[0]?.name || ''
            const money = list[0]?.money || 0
            const sum = formatNumber(money, 2, '.', ',', '￥', '元')
            txt = `${name} ${sum}`
          }
          return txt
        }

        // 业务员所属地区
        if (detailInfo.value.salespersonId) {
          getSalespersonList({ id: detailInfo.value.salespersonId }).then((res: any) => {
            res = res.list[0]
            detailInfo.value['salespersonCity'] = `${res.province || ''}${res.city || ''}`
          })
        }
      }

      // 复制
      function handleCopy(data) {
        copyText(data, '复制成功')
      }

      // 修改渠道
      function handleUpdateAudit() {
        openAuditModel(true, {
          isUpdate: true,
          record: orderAudit.value,
        })
      }

      // 处理收货地址
      function handleDelivery(name: string) {
        openDeliveryModal(true, {
          isUpdate: true,
          record: detailInfo.value,
          name,
        })
      }

      function handleRemark(name: string) {
        openRemarkModal(true, {
          isUpdate: true,
          record: detailInfo.value,
          name,
        })
      }
      // 处理审核人员
      function handleChannelCode() {
        openChannelModel(true, {
          isUpdate: true,
          record: detailInfo.value,
        })
      }

      function handleRemarkList() {
        openRemarkTaskModal(true, {
          isTask: true,
          type: 2,
          record: {
            ...detailInfo.value,
            orderId: detailInfo.value.id,
          },
        })
      }

      async function downloadContract() {
        exportContractLoading.value = true
        const res = await exportContract({ orderId: detailInfo.value.id })
        downloadByData(res.data, '合同.zip')
        exportContractLoading.value = false
      }

      function handleIsurance() {
        go(
          `/order/isurancePreviewOrder/${detailInfo.value.id}?orderSn=${detailInfo.value.orderSn}&merchantCode=${detailInfo.value.merchantCode}`,
        )
      }

      async function downLoadEsnotary() {
        downLoadEsnotaryLoading.value = true
        const res = await downloadEsnotary({ orderSn: detailInfo.value.orderSn })
        downloadByData(res.data, '公证.zip')
        downLoadEsnotaryLoading.value = false
      }
      function downloadIsurance() {
        downloadByUrl({ url: detailInfo.value.elecPolicyUrl })
      }

      function handleSuccess() {
        parent()
      }
      async function handleRevoke() {
        await revokeContract(detailInfo.value)
        createMessage.success(`撤销成功`)
        handleSuccess()
      }

      function handleSkuName() {
        openSkuNameModal(true, {
          isUpdate: true,
          record: detailInfo.value,
        })
      }

      function handleTypeName(text: any) {
        const find: any = goodTypeList.find((v) => v.value == text)
        return find?.label
      }
      // 下载补充协议合同
      const downLoadEsgineContact = async () => {
        const orderSn = detailInfo.value.orderSn
        const res = await downloadContractList(orderSn)
        console.log(detailInfo.value, 'detailInfoShow')
        downloadByData(res.data, detailInfo.value.userIdentifyVO?.realName + '补充协议.zip')
      }
      // 生成起诉材料
      async function handleCreateOrdeSue() {
        const res = await prosecuteCreate(detailInfo.value.id)
        if (res.code == 200) {
          createMessage.success('生成起诉材料成功')
          handleSuccess()
        } else {
          createMessage.warn(res?.message)
        }
      }
      return {
        detailInfo,
        formatNumber,
        handleCopy,
        handleChannelCode,
        handleDelivery,
        handleRemark,
        handleRemarkList,
        handleSuccess,
        channelRegister,
        deliveryRegister,
        remarkRegister,
        exportContractLoading,
        downloadContract,
        skuNameRegister,
        handleRevoke,
        handleSkuName,
        hasPermission,
        handleIsurance,
        downloadIsurance,
        downLoadEsnotary,
        downLoadEsnotaryLoading,
        remarkTaskRegister,
        orderAudit,
        handleTypeName,
        status,
        atoStatus,
        updateAuditRegister,
        handleUpdateAudit,
        downLoadEsgineContact,
        handleCreateOrdeSue,
      }
    },
  })
</script>
<style lang="less" scoped>
  .icon {
    margin-left: 10px;
    cursor: pointer;
    color: #3ca2fc;
  }

  .orderInfo {
    position: relative;

    .contract {
      position: absolute;
      top: 20px;
      right: 20px;
    }

    .isurance {
      color: #096dd9;
      background: #e6f7ff;
      border-color: #91d5ff;
    }
  }
</style>
