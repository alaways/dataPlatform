<template>
  <PageWrapper title="支付设置" contentBackground contentClass="p-4">
    <template #footer>
      <ATabs v-model:activeKey="currentKey" @change="handleTabChange">
        <ATabPane v-for="item in menuData" :tab="item.tab" :key="item.key" />
      </ATabs>
    </template>
    <div class="m-4">
      <BasicForm @register="register" />
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form'
  import { computed, defineComponent, ref } from 'vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { PageWrapper } from '/@/components/Page'
  import { getConfigList, updateConfigItem } from '/@/api/system/config'
  import { canParseJSON } from '/@/utils/tool'
  import { cloneDeep } from 'lodash-es'
  import { Tabs } from 'ant-design-vue'

  export default defineComponent({
    name: 'PaySetting',
    components: { BasicForm, PageWrapper, ATabs: Tabs, ATabPane: Tabs.TabPane },
    setup() {
      const { createMessage } = useMessage()
      const [
        register,
        { validate, appendSchemaByField, setFieldsValue, updateSchema, setProps, resetFields },
      ] = useForm({
        labelCol: {
          span: 8,
        },
        schemas: [
          {
            field: `id`,
            component: 'Input',
            label: 'Id',
            ifShow: false,
          },
        ],
        wrapperCol: {
          span: 15,
        },
        actionColOptions: {
          offset: 8,
          span: 23,
        },
        submitButtonOptions: {
          text: '提交',
        },
        submitFunc: customSubmitFunc,
      })

      const currentKey = ref()
      const menuData = ref<any>([])
      const pdata = ref<any>({})
      const reqData = ref<any>({})
      init()
      async function init() {
        // 获取平台顶部信息
        const res = await getConfigList({ label: 'sysConf.saas' })
        if (res) {
          const data = res[0]
          if (canParseJSON(data.value)) {
            const formValues = JSON.parse(String(data.value))
            menuData.value = formValues.map((v) => {
              return { tab: v.label, key: v.id, saas: v.key, applet: v.applet }
            })
            currentKey.value = menuData.value[0].key
          }
        }

        // 获取支付选择
        const pRes = await getConfigList({ label: 'sysConf.paySchemas' })
        if (pRes) {
          const data = pRes[0]
          if (canParseJSON(data.value)) {
            const formValues = JSON.parse(String(data.value))
            const item = currentTab.value

            formValues.forEach((e) => {
              let show = true
              if (item.applet == '微信') {
                show = !['支付宝', '支付宝代扣'].includes(e.label)
              } else if (item.applet == '支付宝') {
                show = !['微信', '支付宝口令'].includes(e.label)
              }

              appendSchemaByField(
                { ...e, show, component: 'Select', componentProps: { options: e.list } },
                '',
              )
            })
          }
        }

        // 获取平台支付相关信息
        getConfigList({ label: 'sysConf.platform.pay' }).then((res) => {
          if (res) {
            const data = res[0]
            reqData.value = data
            if (canParseJSON(data.value)) {
              const formValues = JSON.parse(String(data.value))
              pdata.value = formValues
              const values = formValues[currentTab.value.saas]
              setFieldsValue({ ...values })
            }
          }
        })
      }

      function handleTabChange(e) {
        resetFields()
        const find = menuData.value.find((v) => v.key == e)
        const values = cloneDeep(pdata.value[find.saas])
        setFieldsValue({ ...values })

        if (find.applet == '微信') {
          updateSchema([
            { show: true, field: 'wechat' },
            { show: true, field: 'alipayCommand' },
            { show: false, field: 'alipay' },
            { show: false, field: 'alipayAgreementNo' },
          ])
        } else if (find.applet == '支付宝') {
          updateSchema([
            { show: false, field: 'wechat' },
            { show: false, field: 'alipayCommand' },
            { show: true, field: 'alipay' },
            { show: true, field: 'alipayAgreementNo' },
          ])
        }
      }

      async function customSubmitFunc() {
        try {
          const values = await validate()
          const formParams = cloneDeep(values)
          pdata.value[currentTab.value.saas] = formParams

          setProps({
            submitButtonOptions: {
              loading: true,
            },
          })
          await updateConfigItem({
            ...reqData.value,
            value: JSON.stringify(pdata.value),
          })
          setProps({
            submitButtonOptions: {
              loading: false,
            },
          })
          createMessage.success('修改成功！')
        } catch (error) {
          setProps({
            submitButtonOptions: {
              loading: false,
            },
          })
        }
      }

      // 当前Tab
      const currentTab = computed(() => {
        const find = menuData.value.find((v) => v.key == currentKey.value)
        return find
      })

      return { register, menuData, currentKey, handleTabChange }
    },
  })
</script>
<style lang="less" scoped>
  .form-wrap {
    background-color: @component-background;
    width: 450px;
    margin: 0 auto;
  }
</style>
