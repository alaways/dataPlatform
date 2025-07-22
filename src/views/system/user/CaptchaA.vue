<template>
  <div>
    <div id="captcha-button" :ref="captchaBtn" @click="clickBefore">{{ infoText }}</div>
    <div :ref="captchaElement" id="captcha-element"></div>
  </div>
</template>

<script setup>
  import {
    onMounted,
    ref,
    defineEmits,
    defineProps,
    computed,
    inject,
    defineExpose,
    watch,
  } from 'vue'
  const parentFn = inject('handleSubmit')
  const captchaElement = ref()
  const emit = defineEmits({})
  const props = defineProps({
    text: String,
    captchaResult: Boolean,
    beforeCheck: Function,
  })
  const infoText = computed(() => {
    return props.text
  })
  const captchaResult = ref()
  watch(
    () => props.captchaResult,
    (res) => {
      captchaResult.value = res
    },
  )
  const clickBefore = () => {
    captchaElement.value = null
    document.getElementById('aliyunCaptcha-mask').style.height = 0
    document.getElementById('aliyunCaptcha-window-popup').style.height = 0
    document.getElementById('aliyunCaptcha-window-popup').style.padding = 0
    document.getElementById('aliyunCaptcha-window-popup').style.overflow = 'hidden'
    props?.beforeCheck?.().then((res) => {
      if (res == 'ok') {
        document.getElementById('aliyunCaptcha-mask').style.height = '100%'
        document.getElementById('aliyunCaptcha-window-popup').style.height = '350px'
        document.getElementById('aliyunCaptcha-window-popup').style.padding = '16px 16px 12px 16px'
        document.getElementById('aliyunCaptcha-window-popup').style.overflow = 'static'
      }
    })
  }
  const init = () => {
    captchaElement.value = null
    window.initAliyunCaptcha({
      SceneId: 'kminon5l', // 场景ID。根据步骤二新建验证场景后，您可以在验证码场景列表，获取该场景的场景ID
      prefix: '140n9v', // 身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标
      mode: 'popup', // 验证码模式。popup表示要集成的验证码模式为弹出式。无需修改
      element: '#captcha-element', // 页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致。
      button: '#captcha-button', // 触发验证码弹窗的元素。button表示单击登录按钮后，触发captchaVerifyCallback函数。您可以根据实际使用的元素修改element的值
      captchaVerifyCallback: captchaVerifyCallback, // 业务请求(带验证码校验)回调函数，无需修改
      onBizResultCallback: onBizResultCallback, // 业务请求结果回调函数，无需修改
      getInstance: captchaElement.value, // 绑定验证码实例函数，无需修改
      slideStyle: {
        width: 360,
        height: 40,
      }, // 滑块验证码样式，支持自定义宽度和高度，单位为px。其中，width最小值为320 px
      language: 'cn', // 验证码语言类型，支持简体中文（cn）、繁体中文（tw）、英文（en）
    })
  }
  onMounted(() => {
    init()
  })
  // 验证通过后调用
  const onBizResultCallback = () => {
    emit('onBizResultCallback')
  }
  const captchaVerifyCallback = async (captchaVerifyParam) => {
    emit('captchaVerifyParam', captchaVerifyParam)
    await parentFn?.handleSubmit?.()
    return {
      captchaResult: captchaResult.value,
      bizResult: captchaResult.value,
    }
  }
  defineExpose(clickBefore)
</script>

<style>
  #aliyunCaptcha-mask {
    z-index: 1000 !important;
  }

  #captcha-button {
    position: fixed;
    right: 24px;
    bottom: 22px;
    z-index: 99;
    width: 70px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid transparent;
    cursor: pointer;
    background-color: #347ced;
    color: #fff;
    font-size: 14px;
    line-height: 32px;
    text-align: center;
    height: 32px;
  }

  #captcha-element {
    display: none !important;
  }
</style>
