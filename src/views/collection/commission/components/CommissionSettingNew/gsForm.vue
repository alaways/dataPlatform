<template>
  <BasicForm @register="register">
    <template #ge0>
      <div>初始提成</div>
    </template>
    <template #txtOne>
      <div class="text-center">&nbsp;</div>
    </template>
    <template #del="{ field }">
      <Button v-if="Number(field) === 0" @click="add">+</Button>
      <Button v-if="Number(field) > 0" @click="() => del(field)">-</Button>
    </template>
  </BasicForm>
</template>

<script lang="ts" setup>
  import { Button } from 'ant-design-vue'
  import { nextTick, ref, watch } from 'vue'
  import { geFormSchema } from './data'
  import { BasicForm, useForm } from '/@/components/Form/index'

  const props = defineProps({
    pdata: Object,
  })

  defineExpose({ getValues })

  const n = ref(0)

  const [register, { appendSchemaByField, removeSchemaByFiled, validate, setFieldsValue }] =
    useForm({
      layout: 'vertical',
      schemas: geFormSchema(n.value),
      actionColOptions: { span: 24 },
      baseColProps: { span: 8 },
      showActionButtonGroup: false,
    })

  function add() {
    n.value++
    geFormSchema(n.value).forEach((v) => {
      appendSchemaByField(v, '')
    })
  }

  function del(field: string) {
    const fieldList: string[] = geFormSchema(Number(field)).map((v) => v.field)
    removeSchemaByFiled(fieldList)
  }

  async function getValues() {
    return await validate()
  }

  watch(
    () => props.pdata,
    (val) => {
      nextTick(() => init(val))
    },
  )

  function init(rules: any) {
    if (rules && rules.length) {
      const values: any = {}

      rules.forEach((v, i) => {
        values[`ge${i}`] = v.ge
        values[`val${i}`] = Number((v.val * 100).toFixed(2))
        if (i) {
          add()
        }
      })

      setFieldsValue(values)
    }
  }
</script>
