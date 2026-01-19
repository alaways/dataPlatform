<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="loginName" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.loginName"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <FormItem name="code" class="enter-x">
      <Input size="large" v-model:value="formData.code" placeholder="验证码">
        <template #addonAfter>
          <ReImageVerify ref="reImageVerifyRef" v-model:code="imgCode" /> </template
      ></Input>
    </FormItem>

    <ARow class="enter-x" v-if="0">
      <ACol :span="12" />
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue'

  import { Form, Input, Row, Col, Button } from 'ant-design-vue'
  import LoginFormTitle from './LoginFormTitle.vue'
  import { ReImageVerify } from '/@/components/ReImageVerify'

  import { useI18n } from '/@/hooks/web/useI18n'
  import { useMessage } from '/@/hooks/web/useMessage'

  import { useUserStore } from '/@/store/modules/user'
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { getMayiToken } from '/@/api/system/log'
  //import { onKeyStroke } from '@vueuse/core';

  const ACol = Col
  const ARow = Row
  const FormItem = Form.Item
  const InputPassword = Input.Password
  const { t } = useI18n()
  const { notification, createErrorModal } = useMessage()
  const { prefixCls } = useDesign('login')
  const userStore = useUserStore()

  const { setLoginState, getLoginState } = useLoginState()
  const { getFormRules } = useFormRules()

  const formRef = ref()
  const reImageVerifyRef = ref()

  const imgCode = ref('')
  const loading = ref(false)

  let formData = reactive({
    loginName: '',
    password: '',
    code: '',
  })
  if (process.env.NODE_ENV === 'development') {
    // 开发环境下的逻辑
    formData = reactive({
      loginName: 'admin',
      password: 'Aa71800',
      code: '',
    })
  }

  const { validForm } = useFormValid(formRef)

  //onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)

  async function handleLogin() {
    const data = await validForm()
    if (!data) return
    try {
      loading.value = true
      const userInfo = await userStore.login({
        password: data.password,
        loginName: data.loginName,
        code: data.code,
        mode: 'none', //不要默认的错误提示
      })
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${
            userInfo.realName || userInfo.userName
          }`,
          duration: 3,
        })
        const res = await getMayiToken()
        localStorage.setItem('AllToken', JSON.stringify(res))
      }
      // window.location.reload()
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      })
      if (reImageVerifyRef.value) {
        reImageVerifyRef.value.getImgCode()
      }
    } finally {
      loading.value = false
    }
  }
</script>

<style>
  .ant-input-group-addon {
    width: 120px;
    height: 40px;
    border: none;
  }
</style>
