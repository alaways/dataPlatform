<template>
  <PageWrapper class="p-0 pb-10">
    <template #rightFooter>
      <Button type="primary" @click="handleSubmit"> 保存 </Button>
    </template>
    <Spin tip="正在加载..." size="large" :spinning="loading">
      <BasicForm @register="register" @submit="handleSubmit">
        <template #collectionFrequency="{ model }">
          <div class="form-item">
            <div>每天最多领取</div>
            <InputNumber :min="0" class="input" v-model:value="model['collectionFrequency']" />
            <div>个催收任务</div>
          </div>
        </template>
        <template #recycleDay="{ model }">
          <div class="form-item">
            <div>超过</div>
            <InputNumber :min="0" class="input" v-model:value="model['recycleDay']" />
            <div>天“无新建跟进记录”的催收任务,由系统定时回收到公共池内</div>
          </div>
        </template>
        <template #scopeList="{ model }">
          <div class="form-item">
            <div class="dot">*</div>
            <div>使用范围</div>
            <Select
              class="select"
              :options="distributeUidListOptions"
              mode="multiple"
              v-model:value="model['scopeList']"
              placeholder="请选择"
              @change="handleScopeListChange"
            />
          </div>
        </template>
        <template #distributeType="{ model }">
          <RadioGroup v-model:value="model['distributeType']">
            <Radio v-for="item in distributeTypeOptions" :key="item.value" :value="item.value">
              <div class="flex flex-row items-center">
                <div class="mr-1">{{ item.label }}</div>
                <Tooltip placement="bottom" style="margin-top: 2px" v-if="item.helpMessage">
                  <template #title>{{ item.helpMessage }}</template>
                  <InfoCircleOutlined :style="{ color: '#ccc', fontSize: '17px' }" />
                </Tooltip>
              </div>
            </Radio>
          </RadioGroup>
        </template>
        <template #distributeUidList="{ model }">
          <div class="form-item">
            <div class="dot">*</div>
            <div>分配人员</div>
            <Select
              class="select"
              :options="distributeUidListOptions"
              mode="multiple"
              v-model:value="model['distributeUidList']"
              placeholder="请选择"
            />
          </div>
        </template>
        <template #distributeUidInfoList="{ model }">
          <RuleSettingUserTable
            class="!mt-5"
            ref="distributeUidInfoListRef"
            :pdata="model['distributeUidInfoList']"
          />
        </template>
      </BasicForm>
    </Spin>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { InputNumber, Button, Spin, RadioGroup, Radio, Tooltip } from 'ant-design-vue'
  import { ruleFormSchema, distributeUidListOptions, distributeTypeOptions } from './data'
  import { PageWrapper } from '/@/components/Page'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { Select } from 'ant-design-vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { nextTick, onMounted, ref } from 'vue'
  import { cloneDeep, groupBy } from 'lodash-es'
  import { getRuleSetting, setRuleSetting } from '/@/api/collection/commission'
  import { InfoCircleOutlined } from '@ant-design/icons-vue'
  import RuleSettingUserTable from '../RuleSettingUserTable/RuleSettingUserTable.vue'
  import { getUserList } from '/@/api/system/account'
  import { useRoute } from 'vue-router'

  const { createMessage } = useMessage()
  const loading = ref(true)
  const distributeUidInfoListRef = ref<any>(null)
  const currentDataSource = ref()
  const { query } = useRoute()
  if (query && query.dataSources) {
    currentDataSource.value = String(query.dataSources)
  }
  const [register, { validate, setFieldsValue }] = useForm({
    labelWidth: 130,
    schemas: ruleFormSchema,
    actionColOptions: { span: 24 },
    baseColProps: { span: 8 },
    showActionButtonGroup: false,
  })

  async function init() {
    loading.value = true
    const data1 = new Promise((resolve) => {
      getRuleSetting({ dataSources: currentDataSource.value }).then((res: any) => {
        resolve(res)
      })
    })
    // 获取表格的人员信息
    const data2 = new Promise((resolve) => {
      getUserList({ limit: 999999, status: '1', roleKey: 'kefu' }).then((res: any) => {
        resolve(res.list)
      })
    })
    Promise.all([data1, data2]).then((res: any) => {
      const mainRes = res[0]
      const userRes = res[1]
      // 处理使用范围
      const distributeUidList =
        (mainRes.distributeUidList && mainRes.distributeUidList.map((v) => String(v))) || null
      if (mainRes.scopeList && mainRes.scopeList.length) {
        nextTick(() => {
          // 获取 表格-人员 信息
          if (userRes && userRes.length) {
            const opstions = userRes.map((v) => {
              return { label: v.userName, value: Number(v.uid) }
            })
            distributeUidInfoListRef.value.setOptions(opstions)
          }

          handleScopeListChange(mainRes.scopeList)
        })
      } else {
        delete mainRes.scopeList
      }

      setFieldsValue({
        ...mainRes,
        limit: mainRes.collectionFrequency != -1 ? 1 : 0,
        collectionFrequency: mainRes.collectionFrequency != -1 ? mainRes.collectionFrequency : null,
        recycleEnable: mainRes.recycleEnable ? 1 : 0,
        distributeEnable: mainRes.distributeEnable ? 1 : 0,
        distributeUidList,
      })
      loading.value = false
    })
  }

  function handleScopeListChange(e) {
    const list = distributeUidListOptions.filter((v) => e.some((s) => s == v.value))
    if (distributeUidInfoListRef.value) {
      distributeUidInfoListRef.value.changeColumns(list)
    }
  }

  async function handleSubmit() {
    try {
      loading.value = true
      const values = await validate()
      const fromValues = cloneDeep(values)
      // 领取频率
      fromValues['collectionFrequency'] = values.limit ? values.collectionFrequency : -1
      if (values.limit && !values.collectionFrequency && values.collectionFrequency != 0) {
        createMessage.error('请填写领取频率规则任的务个数')
        return
      }
      // 自动回收
      fromValues['recycleEnable'] = !!values.recycleEnable
      if (values.recycleEnable && !values.recycleDay && values.recycleDay != 0) {
        createMessage.error('请填写收回规则的天数')
        return
      }
      // 自动分配
      fromValues['distributeEnable'] = !!values.distributeEnable

      if (values.scopeList && values.scopeList.length) {
        values.scopeList.sort((a, b) => a - b)
      }

      if (distributeUidInfoListRef.value) {
        const table = distributeUidInfoListRef.value.getDataSource()
        if (table && table.length) {
          const grouped = groupBy(table, 'uid')
          // 找出重复的 uid
          const duplicates = Object.keys(grouped).filter((uid) => grouped[uid].length > 1)
          if (duplicates.length > 0) {
            createMessage.error('分配人员有重复!')
            return
          }

          // 1.过滤掉未选中的
          // 2.处理不同 distributeUidListOptions 权重加起来必须 100
          try {
            distributeUidListOptions.forEach((d) => {
              if (values.scopeList.includes(d.value)) {
                const sum = table.reduce((accumulator, currentValue) => {
                  return accumulator + Number(currentValue[`scope_${d.value}`]) // 直接累加scope_xx
                }, 0)
                console.log(sum)
                // if (sum != 100) {
                //   throw `${d.label}权重相加必须等于100`
                // }
              }
            })
          } catch (error: any) {
            createMessage.error(error)
            throw `权重的值不等于100`
          }

          fromValues['distributeUidList'] = table.map((v: any) => v.uid)
          fromValues['distributeUidInfoList'] = table.map((v: any) => {
            const weightMap: any = {}
            // 初始化 weightMap
            distributeUidListOptions.forEach((d) => {
              weightMap[`scope_${d.value}`] = 0
            })
            Object.keys(v).forEach((k) => {
              if (k.indexOf('scope') != -1) {
                weightMap[k] = v[k] || 0
              }
            })

            return {
              uid: v.uid,
              clientMax: v.clientMax,
              clientLockMax: v.clientLockMax,
              weightMap,
              restDayList: v.restDayList || [],
            }
          })
        } else {
          fromValues['distributeUidList'] = []
          fromValues['distributeUidInfoList'] = []
        }
      }
      delete fromValues.limit
      delete fromValues.seat1
      console.log(fromValues)
      fromValues.dataSources = currentDataSource.value
      await setRuleSetting(fromValues)
      createMessage.success('保存成功')
      loading.value = false
    } catch (e) {
      loading.value = false
    }
  }

  onMounted(() => {
    init()
  })
</script>

<style lang="less" scoped>
  .form-item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .dot {
    color: #ff4d4f;
  }

  .input {
    width: 120px !important;
    margin: 0 10px;
  }

  .select {
    width: 200px !important;
    margin: 0 10px;
  }
</style>
