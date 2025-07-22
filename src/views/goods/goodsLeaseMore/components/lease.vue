<template>
  <div>
    <a-card title="基本属性" :bordered="false">
      <BasicForm @register="register" />
    </a-card>
    <a-card title="收费项目" :bordered="false" class="!mt-5">
      <chargeTable ref="chargeTableRef" :pdata="chargeData" />
    </a-card>
    <a-card title="分期计划" :bordered="false" class="!mt-5">
      <PlanTable ref="planTableRef" :fromChange="fromChange" :pdata="planData" />
    </a-card>
  </div>
</template>

<script lang="ts">
  import { defineComponent, inject, ref, watch } from 'vue'
  import { BasicForm, useForm } from '/@/components/Form'
  import PlanTable from './planTable.vue'
  import ChargeTable from './chargeTable.vue'
  import { schemas } from './data'
  import { Card } from 'ant-design-vue'
  import { addGoodsLease, updateGoodsLease } from '/@/api/goods'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'
  import { handleBillDate, handlenAmount, handleUpdateSchema } from './utils'

  export default defineComponent({
    components: { BasicForm, PlanTable, ChargeTable, [Card.name]: Card },
    props: {
      goodsId: String,
      currentKey: String || Number,
      rentTypeList: {
        type: Array,
        default: () => [],
      },
      info: {
        type: Array,
        default: () => [],
      },
    },
    setup(props) {
      const parentInit: any = inject('init')
      const parentLoading: any = inject('loading')
      const fromChange = ref({
        type: '',
        totalAmount: '',
        totalTenancy: 1,
        rentType: '',
        downPaymentRentAmount: '',
        monthPayments: '',
        dayTn: '',
        totalAmountMessage: '',
      })
      const detailInfo = ref<any>()
      const { createMessage } = useMessage()

      // 分期计划
      const planData = ref()
      const planTableRef = ref<{ getDataSource: () => any } | null>(null)

      // 收费项目
      const chargeData = ref()
      const chargeTableRef = ref<{ getDataSource: () => any } | null>(null)

      // 基本属性
      const [register, { validate, setFieldsValue, resetFields, updateSchema }] = useForm({
        labelWidth: 100,
        baseColProps: { span: 8 },
        actionColOptions: { span: 24 },
        schemas: schemas,
        showActionButtonGroup: false,
      })

      async function init() {
        resetAll()
        const data = props.info.find((v: any) => v.type == props.currentKey)
        detailInfo.value = cloneDeep(data)
        handleUpdateSchema(fromChange, planData, updateSchema, props.rentTypeList)
        parentLoading()
        if (!detailInfo.value) {
          return
        }
        // 计算总金额 = 日付租金 * 总租期(旧的是天) * 天数
        detailInfo.value['totalAmount'] = Number(detailInfo.value.totalAmount)

        planData.value = detailInfo.value.rentPlanList || []

        // 首付
        if (!detailInfo.value.downPaymentRentAmount) {
          detailInfo.value['downPaymentRentAmount'] = 0
          if (planData.value && planData.value.length) {
            detailInfo.value['downPaymentRentAmount'] = planData.value[0].repayAmount
          }
        }

        // 每月租期
        detailInfo.value['monthPayments'] = 0
        if (detailInfo.value.totalAmount) {
          if (detailInfo.value.type == 3) {
            detailInfo.value['monthPayments'] =
              Number(detailInfo.value.totalAmount) / Number(detailInfo.value.totalPeriodsNum)
          } else {
            const month =
              Number(detailInfo.value.totalAmount) - Number(detailInfo.value.downPaymentRentAmount)
            const totalPeriodsNum = Number(detailInfo.value.totalPeriodsNum) - 1
            detailInfo.value['monthPayments'] = month / totalPeriodsNum
          }
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
        if (detailInfo.value['penaltyRate']) {
          detailInfo.value['penaltyRate'] = Number((detailInfo.value.penaltyRate * 100).toFixed(0))
        }

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
          lockFee2: fromValue.lockFee2 || 0,
          type: props.currentKey,
        })
      }
      // 重置
      function resetAll() {
        planData.value = []
        fromChange.value = {
          type: '',
          totalAmount: '',
          totalTenancy: 1,
          rentType: '',
          downPaymentRentAmount: '',
          monthPayments: '',
          dayTn: '',
          totalAmountMessage: '',
        }
        if (chargeTableRef.value) {
          chargeData.value = []
        }
        resetFields()

        fromChange.value.totalAmountMessage = '月付租金*总租期=总租金'
        let prepayable = [1]
        let dayTn = 0
        let lockFee2 = 100
        let gzFee = 50
        if (props.currentKey == '2') {
          fromChange.value.totalAmountMessage = '首付租金+【月付租金*(总租期-1)】=总租金'
        } else if (props.currentKey == '4') {
          prepayable = []
          dayTn = 3
          lockFee2 = 0
          gzFee = 0
        }
        setFieldsValue({
          totalAmount: 0,
          deposit: 0,
          depositAmount: 0,
          residualDepreciation: 0,
          monthPayments: 0,
          prepayable,
          downPaymentRentAmount: 0,
          totalTenancy: 1,
          dayTn,
          lockFee2,
          gzFee,
          type: props.currentKey,
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

      // 处理提交数据
      async function submitAll() {
        try {
          // 基本属性
          const values = await validate()
          // 将所有 金额 转成 分
          let newValues = { ...values }
          const formParams = handlenAmount(newValues, true)
          if (formParams.type == 1 && !formParams.prepayable.length) {
            createMessage.error(`可预付期数不能为空`)
            return 'error'
          }
          if (
            [2, 3].includes(formParams.type) &&
            formParams.downPaymentRentAmount > formParams.totalAmount
          ) {
            createMessage.error(`首付租金不能大于总租金`)
            return 'error'
          }
          if (formParams.type == 3) {
            if (formParams.downPaymentRentAmount < formParams.monthPayments) {
              createMessage.error(`首付租金不能小于月付租金`)
              return 'error'
            }
          }
          if (formParams.type == 4) {
            formParams.downPaymentRentAmount = 0
          }
          formParams['prepayPeriods'] = formParams.prepayable.filter((v) => v)
          formParams['totalRentAmount'] = formParams.totalAmount
          formParams['totalPeriodsNum'] = formParams.totalTenancy
          delete formParams.penaltyRate
          // formParams['penaltyRate'] = Number((formParams.penaltyRate / 100).toFixed(2))

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
              return 'error'
            }
          }

          // 收费项目
          let valueAddedServiceList: any = []
          if (chargeTableRef.value) {
            valueAddedServiceList = cloneDeep(chargeTableRef.value.getDataSource())
            valueAddedServiceList.forEach((v: any) => (v.money = (v.money * 100).toFixed(0)))
          }
          console.log(props.goodsId)

          let params = {
            spuId: props.goodsId,
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
          }

          await parentInit()
          return ''
        } catch (error) {
          console.log(error)
          return 'error'
        }
      }

      watch(
        () => props.currentKey,
        () => {
          init()
        },
      )
      watch(
        () => props.info,
        () => init(),
      )

      return {
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
