<template>
  <PageWrapper title="" contentBackground>
    <div class="m-4">
      <BasicForm
        :labelWidth="100"
        :schemas="schemas"
        :actionColOptions="{ span: 6 }"
        @submit="handleSearch"
      />
      <Spin tip="加载中..." :spinning="loading">
        <div v-if="loading" style="min-height: 300px; width: 100%"></div>
        <div style="margin-left: 33px" v-if="isCheck !== -1">
          <span>查询结果:</span>
          <Tag style="margin-left: 10px" v-if="isCheck === 1" color="green">验证通过</Tag>
          <Tag style="margin-left: 10px" v-else color="red">验证失败</Tag>
        </div>
        <div style="margin: 10px 33px 10px 33px" v-if="currentState && !loading">
          <span>手机号状态:</span>
          <Tag v-if="currentState" style="margin-left: 10px" :color="currentState.color">{{
            currentState.label || ''
          }}</Tag>
        </div>
      </Spin>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicForm, FormSchema } from '/@/components/Form'
  import { PageWrapper } from '/@/components/Page'
  import { Spin, Tag } from 'ant-design-vue'
  import { queryElements } from '/@/api/riskControl'
  import { getQueryPhoneStatus } from '/@/api/order'
  import { phoneStatasList } from '../../order/orderDetail/components/detail/components/contacts/contactsTable'

  export default defineComponent({
    name: 'Elements',
    components: {
      PageWrapper,
      BasicForm,
      Spin,
      Tag,
    },

    setup() {
      const isCheck = ref<any>(-1)
      const loading = ref(false)
      const currentState = ref<any>()

      async function handleSearch(value) {
        loading.value = true
        isCheck.value = -1
        const stateRes = await getQueryPhoneStatus({ phone: value.mobile })
        currentState.value = phoneStatasList.find((v) => v.value == stateRes.status)

        isCheck.value = await queryElements(value)

        loading.value = false
      }

      const schemas: FormSchema[] = [
        {
          field: 'userName',
          component: 'Input',
          label: '用户姓名',
          rules: [
            { required: true, message: '请输入用户姓名', trigger: 'change' },
            { pattern: new RegExp(/^[^\d]+$/ && /[\u4e00-\u9fa5]/), message: '请输入正确用户姓名' },
            // { pattern: new RegExp(/[\u4e00-\u9fa5]/), message: '请输入正确用户姓名' },
          ],
          colProps: {
            span: 9,
          },
        },
        {
          field: 'mobile',
          component: 'Input',
          label: '手机号',
          rules: [
            { required: true, message: '请输入手机号', trigger: 'change' },
            { pattern: new RegExp(/^1[3456789]\d{9}$/), message: '请输入正确的手机号' },
          ],
          colProps: {
            span: 9,
          },
        },
      ]

      return {
        loading,
        handleSearch,
        schemas,
        isCheck,
        currentState,
      }
    },
  })
</script>
