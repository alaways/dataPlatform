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
  import { ruleFormSchema, distributeUidListOptions, distributeTypeOptions } from '../data'
  import { PageWrapper } from '/@/components/Page'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { Select } from 'ant-design-vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { onMounted, ref } from 'vue'
  import { cloneDeep, groupBy } from 'lodash-es'
  import { getRuleSetting, setRuleSetting } from '/@/api/collection/commission'
  import { InfoCircleOutlined } from '@ant-design/icons-vue'
  import RuleSettingUserTable from './RuleSettingUserTable/RuleSettingUserTable.vue'

  const { createMessage } = useMessage()
  const loading = ref(true)
  const distributeUidInfoListRef = ref<any>(null)

  const [register, { validate, setFieldsValue }] = useForm({
    labelWidth: 130,
    schemas: ruleFormSchema,
    actionColOptions: { span: 24 },
    baseColProps: { span: 8 },
    showActionButtonGroup: false,
  })

  async function init() {
    loading.value = true
    const res = await getRuleSetting()
    const distributeUidList =
      (res.distributeUidList && res.distributeUidList.map((v) => String(v))) || null
    if (!(res.scopeList && res.scopeList.length)) {
      delete res.scopeList
    }
    setFieldsValue({
      ...res,
      limit: res.collectionFrequency != -1 ? 1 : 0,
      collectionFrequency: res.collectionFrequency != -1 ? res.collectionFrequency : null,
      recycleEnable: res.recycleEnable ? 1 : 0,
      distributeEnable: res.distributeEnable ? 1 : 0,
      distributeUidList,
    })
    loading.value = false
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

          fromValues['distributeUidInfoList'] = table.map((v: any) => {
            const weightMap: any = {}
            Object.keys(v).forEach((k) => {
              if (k.indexOf('scope') != -1) {
                weightMap[k] = v[k] || 0
              }
            })
            return {
              uid: v.uid,
              clientMax: v.clientMax,
              weightMap,
            }
          })
        } else {
          fromValues['distributeUidInfoList'] = []
        }
      }
      delete fromValues.limit
      delete fromValues.seat1
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
