<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    destroyOnClose
    @ok="handleSubmit"
    @cancel="handleReload"
  >
    <Spin tip="正在校验交易单号..." size="large" :spinning="spinLoading">
      <BasicForm @register="registerForm">
        <template #isDiscount="{ model }">
          <ATabs
            v-model:default-active-key="activeKey"
            v-model:activeKey="model['isDiscount']"
            @change="handleDiscount"
          >
            <ATabPane v-for="item in menuList" :key="item.key" :tab="item.label" />
          </ATabs>
        </template>
        <template #deposit="{ model }">
          <div style="color: red">{{ model['deposit'] }}</div>
        </template>
        <template #getCode>
          <Button type="primary" @click="handleGetCode()">获取二维码</Button>
        </template>
      </BasicForm>
    </Spin>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref, h, nextTick, computed } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { bizTypeList, paidFormSchema } from './data'
  import { Button, Image, Modal, Spin, Tabs } from 'ant-design-vue'
  import {
    getOfflineNew,
    getChinaumsAuthcode,
    getPayBool,
    getPayLog,
    getUploadAuthcode,
  } from '/@/api/order'
  import { floatToIntNumber, formatNumber } from '/@/utils/tool'
  import dayjs from 'dayjs'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import { usePermission } from '/@/hooks/web/usePermission'
  const props = {
    payTab: Boolean,
    couponTab: Boolean,
  }
  export default defineComponent({
    name: 'Modal',
    components: { BasicModal, BasicForm, Button, ATabs: Tabs, ATabPane: Tabs.TabPane, Spin },
    props,
    emits: ['success', 'register', 'cancle'],
    setup(props, { emit }) {
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const isUpdate = ref(true)
      const orderId = ref()
      const totalAmountBackups = ref() // 备份totalAmount
      const base64QRCode = ref() // 缓存base64QRCode
      const payType = ref(0)
      const payShow = ref(1)
      const spinLoading = ref(false)
      const activeKey = ref('pay')
      let menuList = ref([
        { label: '正常支付', key: 'pay' },
        { label: '折扣/减免', key: 'discount' },
      ])
      const baseMenuItem = (aStatus, bStatus) => {
        if (aStatus && !bStatus) {
          activeKey.value = 'pay'
          menuList.value = menuList.value.filter((item: any) => item.key === 'pay')
        }
        if (!aStatus && bStatus) {
          activeKey.value = 'discount'
          menuList.value = menuList.value.filter((item: any) => item.key === 'discount')
        }
      }
      const getMenuList = computed(() => {
        // 线下收款
        if (payShow.value === 1) {
          const aStatus = hasPermission('pay_offline') && !hasPermission('paycoupon_offline')
          const bStatus = !hasPermission('pay_offline') && hasPermission('paycoupon_offline')
          if (aStatus || bStatus) {
            baseMenuItem(hasPermission('pay_offline'), hasPermission('paycoupon_offline'))
          }
        }
        // 二维码收款
        if (payShow.value === 2) {
          const aStatus = hasPermission('payInit') && !hasPermission('payCoupon')
          const bStatus = !hasPermission('payInit') && hasPermission('payCoupon')
          if (aStatus || bStatus) {
            baseMenuItem(hasPermission('payInit'), hasPermission('payCoupon'))
          }
        }
        return menuList.value
      })

      const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
        labelWidth: 130,
        schemas: cloneDeep(paidFormSchema),
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      })

      function handleBillItemSnSort(str: string) {
        if (!str) return ''
        const list = str.split(',')
        const sortedStrings = list.sort((a: any, b: any) => {
          // 提取字符串中的数字部分进行比较
          const numA = parseInt(a.match(/\d+/)[0], 10)
          const numB = parseInt(b.match(/\d+/)[0], 10)
          return numA - numB
        })
        return sortedStrings.join(',')
      }

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        resetFields()
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        payType.value = data.record?.payType || 0
        orderId.value = data.record?.orderId
        totalAmountBackups.value = data.record?.totalAmount
        payShow.value = data.record?.payShow
        data.record['billItemSn'] = handleBillItemSnSort(data.record?.billItemSn)

        // let downPayAmounts = 0
        // // 账单 列表
        // const billsList = data.record?.billsList || []
        // // 筛选还未首付的账单
        // const downPayAmountList = billsList.filter(
        //   (v) => v.sourceType == 0 && ![3, 4].includes(v.status),
        // )
        // // 获取应付首期金额
        // if (downPayAmountList && downPayAmountList.length) {
        //   downPayAmounts = downPayAmountList
        //     .map((v) => v.repayAmount)
        //     .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        //   downPayAmounts = downPayAmounts / 100
        // }
        let downPayAmounts = 0

        updateSchema({
          field: 'totalAmount',
          rules: [{ required: true, message: '金额不能为空' }],
        })
        if (data.record?.status == 401) {
          downPayAmounts = data.record?.totalAmount
          updateSchema({
            label: '线下收款金额',
            field: 'totalAmount',
            rules: [
              { required: true, message: '金额不能为空' },
              {
                trigger: 'blur',
                validator(_, value) {
                  return new Promise((resolve, reject) => {
                    if (value >= downPayAmounts && data.record?.status == 401) return resolve()
                    reject('收款金额不能小于首次支付金额')
                  })
                },
              },
            ],
          })
        }

        // 统一处理账单金额
        updateSchema([
          {
            field: 'paymentChannels',
            componentProps: {
              options: [
                { label: '乐刷', value: '0' },
                { label: '银联', value: '1' },
              ],
              onChange: () => {
                nextTick(() => handleGetCode())
              },
            },
          },
          {
            field: 'tradeNo',
            componentProps: {
              onblur: (e) => {
                const value = e.target.value
                if (value) {
                  getTradeNoPayLog(value)
                }
              },
            },
          },
          {
            label: '收款方式',
            field: 'payment',
            componentProps: ({ formModel, formActionType }) => {
              return {
                options: [
                  {
                    label: '线下收款',
                    value: '0',
                  },
                  {
                    label: '二维码收款',
                    value: '1',
                  },
                ],
                onChange: async (e: any) => {
                  const { value } = e.target
                  const { totalAmount } = formModel
                  const { updateSchema } = formActionType
                  if (value == 0) {
                    updateSchema({
                      ifShow: true,
                      field: 'tradeNo',
                      componentProps: {
                        onblur: (e) => {
                          const value = e.target.value
                          if (value) {
                            getTradeNoPayLog(value)
                          }
                        },
                      },
                    })
                  } else {
                    updateSchema({
                      ifShow: false,
                      field: 'tradeNo',
                    })
                  }
                  // 切换时如果没有填金额
                  if (!totalAmount && totalAmount != 0) return
                  updateSchema({
                    field: 'payCode',
                    colProps: { span: 16 },
                    render: () => h(Spin, { tip: '加载中...', spinning: true }),
                  })

                  // 如果金额小于首付则不显示二维码
                  const downPayAmounts = formModel['downPayAmounts'] || 0
                  if (value == 1 && totalAmount >= downPayAmounts) {
                    const params = { ...formModel, totalAmount: floatToIntNumber(totalAmount) }
                    const res = await getUploadAuthcode(params)
                    updateSchema({
                      field: 'payCode',
                      colProps: { span: 16 },
                      render: () => h(Image, { width: 200, height: 200, src: res.base64QRCode }),
                    })
                  } else {
                    updateSchema({
                      field: 'payCode',
                      render: () => h('div', {}, ''),
                      colProps: { span: 6 },
                    })
                  }
                },
              }
            },
          },
        ])
        // 校验 交易单号是否存在
        async function getTradeNoPayLog(value) {
          spinLoading.value = true
          const res = await getPayLog({ tradeNo: value })
          if (res) {
            setFieldsValue({
              payTime: res.payTime,
            })
          } else {
            setFieldsValue({
              payTime: '',
            })
          }
          spinLoading.value = false
        }

        if (unref(isUpdate)) {
          const isDepositShow = data.record?.isDepositShow
          const deposit = formatNumber(data.record?.deposit || 0, 2)

          let payment = '0'
          // 首付默认显示二维码
          if (payShow.value == 2 || (downPayAmounts && payShow.value != 1)) {
            payment = '1'
            updateSchema({
              ifShow: false,
              field: 'tradeNo',
            })
          } else {
            updateSchema({
              ifShow: true,
              field: 'tradeNo',
            })
          }
          setFieldsValue({
            ...data.record,
            payment,
            deposit,
            isDepositShow,
            downPayAmounts,
            payShow: payShow.value, //payShow 0.两个选择 1.线下支付 2.二维码支付
            isDiscount: 'pay',
          })

          if (payType.value == 1) {
            updateSchema({
              label: '实际买断金额',
              field: 'totalAmount',
            })
          }

          if (payShow.value == 2 || (downPayAmounts && payShow.value != 1)) {
            nextTick(() => handleGetCode())
          }
        }
      })

      const getTitle = computed(() => (payType.value == 1 ? '确认买断' : '确认支付'))

      // 处理tab折扣切换
      async function handleDiscount(e) {
        if (payShow.value == 2) {
          nextTick(() => handleGetCode())
        }
        if (e == 'pay') {
          updateSchema({
            label: '线下收款金额',
            field: 'totalAmount',
          })
        } else {
          updateSchema({
            label: '实际付款金额',
            field: 'totalAmount',
          })
        }
      }

      // 修改二维码
      async function handleGetCode() {
        const values = await validate()
        const totalAmount = floatToIntNumber(values.totalAmount)
        if (!totalAmount && totalAmount != 0) return
        updateSchema({
          field: 'payCode',
          colProps: { span: 16 },
          render: () => h(Spin, { tip: '加载中...', spinning: true }),
        })

        const params = { ...values, totalAmount, payAmount: totalAmount }
        if (values.isDiscount == 'discount') {
          params['totalAmount'] = floatToIntNumber(totalAmountBackups.value)
          if (values.isDiscount == 'discount') {
            params['actualAmout'] = totalAmount
            params['payType'] = 2
          }
        }
        let res: any = {}
        if (params['paymentChannels'] == 0) {
          res = await getUploadAuthcode(params)
        } else if (params['paymentChannels'] == 1) {
          params['actualAmount'] = params['actualAmout']
          res['base64QRCode'] = await getChinaumsAuthcode(params)
        }
        if (res.base64QRCode) {
          base64QRCode.value = res.base64QRCode
        } else {
          createMessage.error(res.message || '您点击的太频繁，请一分钟后再尝试')
        }
        updateSchema({
          field: 'payCode',
          colProps: { span: 16 },
          render: () => h(Image, { width: 200, height: 200, src: base64QRCode.value }),
        })
      }

      function handleReload() {
        emit('cancle')
      }

      function handleSend(values) {
        // 如果不是扫码支付就请求接口
        if (values.payment == 0) {
          const totalAmount = floatToIntNumber(values.totalAmount)
          const params = {
            ...values,
            id: values.orderId,
            totalAmount,
            payAmount: totalAmount,
          }
          // 如果是买断/折扣减免，则带上totalAmount
          if (values.isDiscount == 'discount') {
            params['totalAmount'] = floatToIntNumber(totalAmountBackups.value)
            params['actualAmout'] = totalAmount
            params.payType = 2
          }
          setModalProps({ confirmLoading: true })
          const payCount = values.isDiscount == 'discount' ? params.actualAmout : params.totalAmount
          const bizFind = bizTypeList.find((f) => f.value == params.bizType)
          // TODO custom api
          Modal.confirm({
            title: () => '请核对收款金额无误后，操作确认！',
            content: () => {
              return h('div', {}, [
                h('p', {}, `线下收款: ${formatNumber(payCount, 2)}元`),
                h('p', {}, `交易单号: ${params.tradeNo}`),
                h('p', {}, `支付时间: ${params.payTime}`),
                h('p', {}, `支付来源: ${bizFind?.label || ''}`),
              ])
            },
            onCancel: () => '',
            onOk: async () => {
              const res = await getOfflineNew(params)
              if (res.code == 500) {
                createMessage.error(res.message)
              } else {
                createMessage.success(`确认收款成功`)
                emit('success')
              }
            },
          })
          // emit('success', {
          //   showPwd: true,
          //   data: {
          //     come: 'paid',
          //     data: params,
          //   },
          // })
        } else {
          emit('success')
        }

        closeModal()
      }

      async function handleSubmit() {
        try {
          const values = await validate()
          const res = await getPayBool({ orderId: values.orderId })
          if (res && res.payTime) {
            /**
             * 用支付时间，判断2小时是否支付过
             */
            // 获取当前时间
            const current = dayjs()
            // 将给定时间转换为 Day.js 对象
            const payTime = dayjs(res.payTime)
            // 计算给定时间和当前时间之间的小时差
            const hourDiff = current.diff(payTime, 'hour')
            // 检查小时差是否超过2小时
            if (hourDiff <= 2) {
              Modal.confirm({
                title: () => '提示',
                content: '2小时内有完成支付记录,是否确认继续支付?',
                onCancel: () => {
                  closeModal()
                },
                onOk: async () => {
                  handleSend(values)
                },
              })
            } else {
              handleSend(values)
            }
          } else {
            handleSend(values)
          }
        } finally {
          setModalProps({ confirmLoading: false })
        }
      }

      return {
        registerModal,
        registerForm,
        getTitle,
        handleSubmit,
        handleGetCode,
        handleReload,
        menuList: getMenuList,
        handleDiscount,
        spinLoading,
        activeKey,
      }
    },
  })
</script>

<style lang="less" scoped>
  .ant-tabs {
    ::v-deep(.ant-tabs-nav) {
      padding: 0 100px;

      &::before {
        border-width: 0;
      }

      .ant-tabs-nav-list {
        flex: 1;
        justify-content: space-around;
      }
    }
  }
</style>
