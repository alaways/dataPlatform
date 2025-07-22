<script setup lang="ts">
  import { ref, defineProps, watch } from 'vue'
  import { getCodeUrl, getCaptcha } from '/@/api/utils'
  const props = defineProps({
    type: String,
    reloadKey: String,
  })
  const codeImg = ref()
  const uuid = ref(null)
  getImgCode()
  async function getImgCode() {
    if (props.type == 'uuid') {
      const res = await getCaptcha()
      codeImg.value = 'data:image/jpeg;base64,' + res.data.data.imageBase64
      uuid.value = res.data.data.uuid
      window.uuid = res.data.data.uuid
    } else {
      getCodeUrl().then((res: any) => {
        const blobData = new Blob([res.data], { type: 'image/jpeg' })
        codeImg.value = URL.createObjectURL(blobData)
      })
    }
  }
  defineExpose({ getImgCode, uuid })
  // 监听props 数据变化
  watch(props, (newVal) => {
    if (newVal?.reloadKey) {
      getImgCode()
    }
  })
</script>

<template>
  <!-- ref="domRef" -->
  <img
    :src="codeImg"
    style="width: 120px; height: 40px"
    class="cursor-pointer"
    @click="getImgCode"
  />
</template>
