<template>
  <PageWrapper class="p-0 pb-10">
    <template #rightFooter>
      <a-button type="primary" @click="handleSubmit"> 保存 </a-button>
    </template>
    <Spin tip="正在加载..." size="large" :spinning="loading">
      <BasicForm @register="register">
        <template #txtOne>
          <div class="text-center">时,</div>
        </template>
        <template #txtTwo>
          <div class="text-center">乘以</div>
        </template>
        <template #del="{ field }">
          <Button v-if="Number(field) > 0" @click="() => del(field)">-</Button>
        </template>
        <template #add>
          <Button class="ml-2" @click="add"> +添加规则 </Button>
        </template>
      </BasicForm>
    </Spin>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { Button, Spin } from 'ant-design-vue'
  import { onMounted, ref } from 'vue'
  import { expireFormSchema } from '../data'
  import { PageWrapper } from '/@/components/Page'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import {
    delExpireSetting,
    getExpireSetting,
    setExpireSetting,
  } from '/@/api/collection/commission'
  import { isObject } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { cloneDeep } from 'lodash-es'

  const { createMessage } = useMessage()
  const loading = ref(false)

  const n = ref(0)
  let nList: string[] = ['add0'] // 储存按钮
  let ids: string[] = [] // 备份网络请求id - 用于删除

  const [
    register,
    { appendSchemaByField, removeSchemaByFiled, updateSchema, validate, setFieldsValue },
  ] = useForm({
    schemas: expireFormSchema(n.value),
    actionColOptions: { span: 24 },
    baseColProps: { span: 8 },
    showActionButtonGroup: false,
  })

  onMounted(() => {
    init()
  })

  async function init() {
    n.value = 0
    ids = []
    nList = ['add0']
    loading.value = true
    const res: any = await getExpireSetting()
    // 如果没值则添加
    if (!res.length) {
      loading.value = false
      add()
      return
    }
    let fieldValue: any = {}
    res.forEach((item, index) => {
      n.value = index
      add()
      ids.push(item.id)
      fieldValue = { ...fieldValue, ...handleFormItem(index, item, true) }
    })
    setFieldsValue(fieldValue)

    loading.value = false
  }

  function add() {
    // 目前版本，批量添加是假的
    expireFormSchema(n.value).forEach((v) => {
      appendSchemaByField(v, '')
    })
    nList.push(`add${n.value}`)
    n.value++
    handleAddShow()
  }

  function del(field: string) {
    const fieldList: string[] = expireFormSchema(Number(field)).map((v) => v.field)
    removeSchemaByFiled(fieldList)
    nList = nList.filter((v) => v != `add${field}`)
    handleAddShow()
  }

  // 处理 添加按钮 显示
  function handleAddShow() {
    for (let index = 0; index < nList.length; index++) {
      updateSchema({
        ifShow: index == nList.length - 1,
        field: nList[index],
      })
    }
  }

  async function handleSubmit() {
    try {
      const values = await validate()
      loading.value = true
      const formParams: any = []
      let delIds = cloneDeep(ids)
      // 判断数组总数,根据排序的总量来排序，id有可能是空的
      const search = 'sort' // 避免以后想用其他值
      // 获取后面尾值数组用于做成数组，然后循环api
      const numArr = Object.keys(values)
        .filter((v) => v.indexOf(search) != -1)
        .map((v) => String(v).replace(search, ''))

      numArr.forEach((v) => {
        const expire = values[`expire${v}`]
        const than = values[`than${v}`]
        const Ex = values[`Ex${v}`] || 'E0'
        const params = {
          code: values[`code${v}`],
          expression: `${expire} ${than} ${Ex}`, // 一定要就空格，用于init的时候好分解
          envs: String(values[`envs${v}`]),
          returnVal: String(values[`returnVal${v}`]),
          sort: String(values[`sort${v}`]),
        }
        const id = values[`id${v}`]
        if (id) {
          params['id'] = id
          delIds = delIds.filter((v) => {
            return v != id
          })
        }
        formParams.push(params)
      })
      // 此处只能每次一条条过

      for (let id of delIds) {
        await delExpireSetting(id)
      }
      for (let formItem of formParams) {
        await setExpireSetting(formItem)
      }
      createMessage.success('保存成功')
      loading.value = false

      numArr.forEach((v, i) => {
        if (i) {
          del(v)
        }
      })
      init()
    } catch (e) {
      loading.value = false
    }
  }

  /**
   * 处理表单列表
   * @param n 选中值排序
   * @param params 当前选中item
   * @param add 是否添加n true: 如id转为id${n}，false: 如id${n}转为n
   */
  function handleFormItem(n, params, add) {
    let newParams = {}
    const valueNumbers = ['envs', 'returnVal', 'sort']
    if (isObject(params)) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          if (add) {
            newParams[`${key}${n}`] = valueNumbers.includes(key) ? Number(params[key]) : params[key]
            if (key == 'expression') {
              // 将 expression 转为要显示的 expire和than
              const data = String(params['expression']).split(' ')
              newParams[`expire${n}`] = data[0] || '$P0'
              newParams[`than${n}`] = data[1] || '='
              newParams[`Ex${n}`] = data[2] || '$E0'
            }
          } else {
            const newKey = key.replace(`${n}`, '')
            newParams[`${newKey}`] = valueNumbers.includes(key) ? String(params[key]) : params[key]
            if (key == 'expire') {
              // 将 expire 转为要上传 expression
              newParams['expression'] = `${params['expire']} ${params['than']} ${params['Ex']}`
            }
          }
        }
      }
    }
    return newParams
  }
</script>
