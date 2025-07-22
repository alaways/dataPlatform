<template>
  <PageWrapper class="pb-10" title="租赁属性" @back="goBack">
    <a-card title="基本属性" :bordered="false">
      <BasicForm @register="register" />
    </a-card>
    <a-card title="收费项目" :bordered="false" class="!mt-5">
      <chargeTable ref="chargeTableRef" :pdata="chargeData" />
    </a-card>
    <a-card title="分期计划" :bordered="false" class="!mt-5">
      <PlanTable ref="planTableRef" :fromChange="fromChange" :pdata="planData" />
    </a-card>

    <template #rightFooter>
      <a-button @click="resetAll"> 重置 </a-button>
      <a-button class="!ml-4" type="primary" @click="submitAll"> 提交 </a-button>
    </template>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { PageWrapper } from '/@/components/Page'
  import { useGo } from '/@/hooks/web/usePage'
  import { BasicForm, useForm } from '/@/components/Form'
  import PlanTable from './planTable.vue'
  import ChargeTable from './chargeTable.vue'
  import { schemas } from './data'
  import { Card } from 'ant-design-vue'
  import { addGoodsLease, getGoodsDetail, updateGoodsLease } from '/@/api/goods'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useTabs } from '/@/hooks/web/useTabs'
  import { cloneDeep } from 'lodash-es'
  import { handleBillDate, handlenAmount, handleUpdateSchema } from './utils'
  import { useGoodsStore } from '/@/store/modules/goods'

  export default defineComponent({
    name: '商品租赁属性',
    components: { BasicForm, PlanTable, ChargeTable, PageWrapper, [Card.name]: Card },
    setup() {
      const route = useRoute()
      const go = useGo()
      const goodsStore = useGoodsStore()
      const goodsId = ref(route.params?.id)
      const back = ref(route.query?.back)
      const fromChange = ref({
        type: '',
        totalAmount: '',
        totalTenancy: '',
        rentType: '',
        downPaymentRentAmount: '',
        monthPayments: '',
        dayTn: '',
      })
      const detailInfo = ref<any>()
      const { createMessage } = useMessage()
      // 设置Tab的标题（不会影响页面标题）
      const { setTitle } = useTabs()
      setTitle('租赁: ' + route.query?.title)

      // 分期计划
      const planData = ref()
      const planTableRef = ref<{ getDataSource: () => any } | null>(null)

      // 收费项目
      const chargeData = ref()
      const chargeTableRef = ref<{ getDataSource: () => any } | null>(null)

      // 基本属性
      const [register, { validate, setFieldsValue, resetFields, updateSchema }] = useForm({
        labelWidth: 100,
        baseColProps: {
          span: 8,
        },
        actionColOptions: {
          span: 24,
        },
        schemas: schemas,
        showActionButtonGroup: false,
      })
      onMounted(() => {
        handleUpdateSchema(fromChange, planData, updateSchema)
        if (goodsId.value) {
          init()
        }
      })

      async function init() {
        const res = await getGoodsDetail(goodsId.value)
        detailInfo.value = res.spuRentAttributeList[0]
        if (detailInfo.value) {
          // 计算总金额 = 日付租金 * 总租期(旧的是天) * 天数
          detailInfo.value['totalAmount'] = Number(detailInfo.value.totalAmount)

          if (detailInfo.value.type == 4) {
            detailInfo.value.dayTn = Number(detailInfo.value.dayTn || 3)
          }

          planData.value = detailInfo.value.rentPlanList || []

          // 首付
          detailInfo.value['downPaymentRentAmount'] = 0
          if (planData.value && planData.value.length) {
            detailInfo.value['downPaymentRentAmount'] = planData.value[0].repayAmount
          }

          // 每月租期
          detailInfo.value['monthPayments'] = 0
          if (detailInfo.value.totalAmount) {
            const month =
              Number(detailInfo.value.totalAmount) - Number(detailInfo.value.downPaymentRentAmount)
            const totalPeriodsNum = Number(detailInfo.value.totalPeriodsNum) - 1
            detailInfo.value['monthPayments'] = month / totalPeriodsNum
          }

          // 租赁类型
          detailInfo.value['rentType'] = detailInfo.value.rentType
          // 将旧类型2 转为3
          if (detailInfo.value.rentType == 2) {
            detailInfo.value['rentType'] = 3
          }

          // 处理可付预期 - 默认选择第一个
          detailInfo.value['prepayable'] = []
          detailInfo.value['prepayable'] = planData.value.map((v, i) => v.prepayType == 1 && i + 1)
          if (!detailInfo.value.prepayable.length) {
            detailInfo.value.prepayable = [1]
          }

          // 处理逾期罚金
          detailInfo.value['penaltyRate'] =
            Number((detailInfo.value.penaltyRate * 100).toFixed(0)) || 1

          // 总期数-按期数
          detailInfo.value['totalTenancy'] = detailInfo.value.totalPeriodsNum || 1

          // 展示期数表格
          if (detailInfo.value.rentPlanList) {
            planData.value = detailInfo.value.rentPlanList.map((v, i) => {
              return {
                ...v,
                billDate: handleBillDate(i, detailInfo.value.rentType, detailInfo.value.dayTn),
                auto: true,
                repayAmount: Number((v.repayAmount / 100).toFixed(2)),
              }
            })
          }

          // 展示增值服务表格
          if (detailInfo.value.valueAddedServiceList) {
            chargeData.value = detailInfo.value.valueAddedServiceList.map((item) => {
              return {
                ...item,
                money: (item.money / 100).toFixed(2),
              }
            })
          }

          // 将所有 金额 转成 元
          const fromValue = handlenAmount(detailInfo.value, false)

          setFieldsValue({
            ...fromValue,
            type: fromValue.type || 2,
            lockFee2: fromValue.lockFee2 || 0,
          })

          updateSchema({
            field: 'prepayable',
            componentProps: ({ formModel }) => {
              const options: any = []
              for (let i = 0; i < Number(formModel.totalTenancy); i++) {
                options.push({ label: `${i + 1}`, value: i + 1 })
              }
              return {
                options,
              }
            },
          })
        } else {
          setFieldsValue({
            type: 2,
            prepayable: [1],
            totalTenancy: 1,
            totalAmount: 0,
            deposit: 0,
            depositAmount: 0,
            residualDepreciation: 0,
            monthPayments: 0,
          })

          updateSchema({
            field: 'prepayable',
            componentProps: ({ formModel }) => {
              const options: any = []
              for (let i = 0; i < Number(formModel.totalTenancy); i++) {
                options.push({ label: `${i + 1}`, value: i + 1 })
              }
              return {
                options,
              }
            },
          })
        }
      }

      // 重置
      function resetAll() {
        planData.value = []
        if (chargeTableRef.value) {
          chargeData.value = []
        }
        resetFields()
      }

      // 处理提交数据
      async function submitAll() {
        try {
          // 基本属性
          const values = await validate()
          // 将所有 金额 转成 分
          let newValues = { ...values }
          const formParams = handlenAmount(newValues, true)
          if (formParams.downPaymentRentAmount > formParams.totalAmount) {
            createMessage.error('首付租金不能大于总租金')
            return
          }
          // if (!formParams.prepayable.length) {
          //   createMessage.error(`可预付期数不能为空`)
          // }
          formParams['prepayPeriods'] = formParams.prepayable.filter((v) => v)
          formParams['totalRentAmount'] = formParams.totalAmount
          formParams['totalPeriodsNum'] = formParams.totalTenancy
          formParams['penaltyRate'] = Number((formParams.penaltyRate / 100).toFixed(2))

          // 分期计划 - 不需要传后端已处理
          let depreciationPlanList: any[] = []
          // 此字段取决与是否由前端传
          if (planTableRef.value) {
            depreciationPlanList = cloneDeep(planTableRef.value.getDataSource())
            let totalSum = depreciationPlanList.reduce(
              (sum, currentObject) => Number(sum) + Number(currentObject.repayAmount),
              0,
            )
            totalSum = Number(totalSum.toFixed(2))
            if (totalSum != values.totalAmount) {
              createMessage.error(`总金额与分期计划金额不匹配！`)
              return
            }
          }

          // 收费项目
          let valueAddedServiceList: any = []
          if (chargeTableRef.value) {
            valueAddedServiceList = cloneDeep(chargeTableRef.value.getDataSource())
            valueAddedServiceList.forEach((v: any) => (v.money = (v.money * 100).toFixed(0)))
          }
          let params = {
            spuId: goodsId.value,
            ...formParams,
            itemAmount: depreciationPlanList.map((v) => Number((v.repayAmount * 100).toFixed(0))),
            valueAddedServiceList,
          }
          if (detailInfo.value && detailInfo.value.id) {
            params['id'] = detailInfo.value.id
            await updateGoodsLease(params)
            createMessage.success(`修改成功`)
          } else {
            await addGoodsLease(params)
            createMessage.success(`新增成功`)
            resetAll()
            init()
          }

          // goBack()
        } catch (error) {
          console.log(error)
        }
      }

      // 返回上一页
      function goBack() {
        goodsStore.setUpdateReload(true)
        go(String(back.value))
      }

      return {
        goBack,
        detailInfo,
        register,
        resetAll,
        submitAll,
        chargeTableRef,
        planTableRef,
        planData,
        chargeData,
        fromChange,
      }
    },
  })
</script>
