<template>
  <PageWrapper title="" contentBackground>
    <div class="m-4">
      <BasicForm
        :labelWidth="100"
        :schemas="schemas"
        :actionColOptions="{ span: 6 }"
        @submit="handleSearch"
      />
      <div class="p-1" style="color: red; font-size: 16px">
        温馨提示：输入的用户信息三要素不一致展示的数据会不正确，请仔细核对。
      </div>
      <Spin tip="加载中..." :spinning="loading">
        <RiskNewControl v-if="detailInfo && !loading" :detailInfo="detailInfo" />
        <div v-if="!detailInfo && loading" style="min-height: 500px; width: 100%"></div>
      </Spin>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicForm, FormSchema } from '/@/components/Form'
  import { PageWrapper } from '/@/components/Page'
  import RiskNewControl from '/@/views/order/orderDetail/components/riskNewControl/index.vue'
  import { Spin } from 'ant-design-vue'
  import { getNewRiskControl, queryNewRiskControl } from '/@/api/riskControl'

  export default defineComponent({
    // 随心系风控
    name: 'RiskNewQuery',
    components: {
      PageWrapper,
      RiskNewControl,
      BasicForm,
      Spin,
    },

    setup() {
      const detailInfo = ref<any>()
      const uid = ref<any>('')
      const loading = ref(false)
      const time = ref<any>()

      async function handleSearch(value) {
        loading.value = true
        detailInfo.value = {}
        const res = await queryNewRiskControl(value)
        if (res.code != 200) {
          loading.value = false
          return
        }
        time.value = setInterval(() => {
          getNewRiskControl({ reqId: res.data }).then((info) => {
            console.log(info)
            if (info.code == 200) {
              detailInfo.value = info.data
              loading.value = false
              clearInterval(time.value)
            }
          })
        }, 3000)
      }

      const schemas: FormSchema[] = [
        {
          field: 'name',
          component: 'Input',
          label: '用户姓名',
          rules: [
            { required: true, message: '请输入用户姓名', trigger: 'change' },
            { pattern: new RegExp(/^[^\d]+$/ && /[\u4e00-\u9fa5]/), message: '请输入正确用户姓名' },
          ],
          colProps: {
            span: 10,
          },
        },
        {
          field: 'phone',
          component: 'Input',
          label: '手机号',
          rules: [
            { required: true, message: '请输入手机号', trigger: 'change' },
            { pattern: new RegExp(/^1[3456789]\d{9}$/), message: '请输入正确的手机号' },
          ],
          colProps: {
            span: 10,
          },
        },
        {
          field: 'idNo',
          component: 'Input',
          label: '身份证',
          rules: [
            { required: true, message: '请输入身份证', trigger: 'change' },
            {
              pattern: new RegExp(
                /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}(\d|X|x)$/,
              ),
              message: '请输入有效身份证',
            },
          ],
          colProps: {
            span: 18,
          },
        },
      ]

      return {
        detailInfo,
        loading,
        handleSearch,
        schemas,
        uid,
      }
    },
  })
</script>
