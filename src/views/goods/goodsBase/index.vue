<template>
  <PageWrapper class="pb-10" title="商品信息" contentBackground @back="goBack">
    <div class="p-10 pl-4">
      <BasicForm @register="register">
        <template #specs="{ model }">
          <div class="text-sm mt-2" style="color: red">
            注: 商品规格必须要有规格名叫颜色,且除 颜色 可以重复之外，其他规格名是唯一的，不能重复
          </div>
          <ComTable
            name="商品规格"
            class="!mt-5"
            ref="specsTableRef"
            :spuId="model['id']"
            :pdata="model['specsList']"
          />
          <a-divider />
        </template>
        <template #advertiseAttribute="{ model }">
          <ComTable
            isTitle
            name="宣传属性"
            class="!mt-5"
            ref="advertiseTableRef"
            :pdata="model['advertiseAttributeList']"
          />
          <a-divider />
        </template>
        <template #spuAttribute="{ model }">
          <ComTable
            isTitle
            name="商品属性"
            class="!mt-5"
            ref="spuTableRef"
            :pdata="model['spuAttributeList']"
          />
          <a-divider />
        </template>
        <template #deliveryAttribute="{ model }">
          <ComTable
            isTitle
            name="发货属性"
            class="!mt-5"
            ref="deliveryTableRef"
            :pdata="model['deliveryAttributeList']"
          />
        </template>
      </BasicForm>
    </div>

    <template #rightFooter>
      <a-button @click="resetAll"> 重置 </a-button>
      <a-button class="!ml-4" type="primary" @click="submitAll"> 提交 </a-button>
    </template>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { PageWrapper } from '/@/components/Page'
  import { useGo } from '/@/hooks/web/usePage'
  import { BasicForm, useForm } from '/@/components/Form'
  import ComTable from './comTable/comTable.vue'
  import { handlenAmount, schemas } from './data'
  import { Card, Divider } from 'ant-design-vue'
  import { addGoodsBase, getGoodsDetail, updateGoodsBase } from '/@/api/goods'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { useTabs } from '/@/hooks/web/useTabs'
  import { getCategoryTree } from '/@/api/goods/category'
  import { getBrandList } from '/@/api/goods/brand'
  import { skuItem, specsItem } from './utils'
  import { useGoodsStore } from '/@/store/modules/goods'
  import { platform } from '../../order/utils'

  export default defineComponent({
    name: '商品基本信息',
    components: {
      BasicForm,
      ComTable,
      PageWrapper,
      [Divider.name]: Divider,
      [Card.name]: Card,
    },
    setup() {
      const goodsStore = useGoodsStore()
      const route = useRoute()
      const go = useGo()
      const goodsId = ref(route.params?.id)
      const back = ref(route.query?.back)
      const title = ref(route.query?.title)
      const detailInfo = ref<any>()

      // 商品规格
      const specsTableRef = ref<{ getDataSource: () => any } | null>(null)
      // 宣传属性
      const advertiseTableRef = ref<{ getDataSource: () => any } | null>(null)
      // 商品属性
      const spuTableRef = ref<{ getDataSource: () => any } | null>(null)
      // 发货属性
      const deliveryTableRef = ref<{ getDataSource: () => any } | null>(null)

      const { createMessage } = useMessage()
      // 设置Tab的标题（不会影响页面标题）
      const { setTitle } = useTabs()
      setTitle(title.value ? `商品: ${title.value}` : '新增商品')

      // 基本属性
      const [register, { validate, setFieldsValue, resetFields, updateSchema }] = useForm({
        labelWidth: 150,
        schemas: schemas,
        showActionButtonGroup: false,
      })

      // function getCategoryName(data, v) {
      //   let name = data[v].name
      //   if (data[v].children) {
      //     name = getCategoryName(data[v].children)
      //   }
      //   return name
      // }
      init()
      async function init() {
        // 获取分类
        getCategoryTree().then((res) => {
          updateSchema([
            {
              field: 'categoryId',
              componentProps: ({ formModel }) => {
                return {
                  options: res,
                  fieldNames: {
                    label: 'name',
                    value: 'id',
                    key: 'id',
                  },
                  onChange: (e, v) => {
                    console.log(e)
                    if (v && v.length) {
                      const len = v.length
                      formModel.categoryName = v[len - 1].name
                    }
                  },
                }
              },
            },
          ])
        })
        // 获取品牌
        getBrandList().then((res) => {
          updateSchema([
            {
              field: 'brandId',
              componentProps: ({ formModel }) => {
                return {
                  options: res,
                  fieldNames: {
                    label: 'name',
                    value: 'id',
                    key: 'id',
                  },
                  onChange: (e, v) => {
                    console.log(e)
                    formModel.brandName = v.name
                  },
                }
              },
            },
          ])
        })
        // 获取详情
        if (goodsId.value && goodsId.value != '0') {
          detailInfo.value = await getGoodsDetail(goodsId.value)
          // 处理可见范围
          const sourceFrom = detailInfo.value['sourceFrom'].split(',')
          detailInfo.value['showRange'] = sourceFrom.map((v) => Number(v))

          // 将所有 金额 转成 元
          const fromValue = handlenAmount(detailInfo.value, false)
          setFieldsValue({
            ...fromValue,
            categoryId: fromValue.categoryIdList,
          })

          // categoryId: cdata.id,
        }
      }

      // 重置
      function resetAll() {
        resetFields()
      }

      // 处理空item
      function handleNullItem(list) {
        return (list && list.length && list.filter((v) => v.name || v.value)) || []
      }

      // 处理提交数据
      async function submitAll() {
        try {
          // 基本属性
          const values = await validate()

          // 将所有 金额 转成 分
          const formParams = handlenAmount({ ...values }, true)
          formParams.sourceFrom = platform.map((v) => v.value).join(',')
          delete formParams.showRange

          // 处理分类
          if (Array.isArray(formParams.categoryId)) {
            formParams.categoryId = formParams.categoryId[formParams.categoryId.length - 1]
          }

          // 处理主图
          if (Array.isArray(formParams.pic)) {
            formParams['pic'] = formParams.pic
              .map((v) => {
                if (typeof v == 'string') {
                  return v
                } else {
                  return v.url
                }
              })
              .join(',')
          }
          // 处理图片
          if (Array.isArray(formParams.albums)) {
            formParams['albums'] = formParams.albums.map((v) => {
              if (typeof v == 'string') {
                return v
              } else {
                return v.url
              }
            })
          }

          // 商品规格
          let skuList: skuItem[] = []
          let specsList: specsItem[] = []

          if (specsTableRef.value) {
            specsList = specsTableRef.value.getDataSource()
            specsList = handleNullItem(specsList)
            /**
             * 生成规格列表
             * 规格这里有点坑，是根据颜色来的，一个颜色对应其他多个规格，得区分
             */
            // 截取所有颜色
            const colorList = specsList.filter((v: specsItem) => v.name == '颜色')
            // 将非颜色转为id数组
            const unColorList = specsList.filter((v: specsItem) => v.name != '颜色') // 获取规格等对象
            // 获取除颜色外 id
            const skuIdList = unColorList.map((v) => v.id || v.uniqueId)
            // 获取除颜色外 名称
            const skuNames = unColorList.map((v) => v.value).join(' ')

            // 拼接specsIds
            colorList.forEach((v: specsItem) => {
              const ids = v.id || v.uniqueId
              const name = `${v.value} ${skuNames}`
              const specsIds = [ids, ...skuIdList].join('_') // 将值转为 xxx_xxx_xxx
              skuList.push({
                name,
                pic: v.pic || '',
                spuId: v.spuId,
                specsIds,
              })
            })
          }
          if (!specsList.length) {
            createMessage.error(`请添加商品规格`)
            return
          }

          // 宣传属性
          let advertiseAttributeList = []
          if (advertiseTableRef.value) {
            advertiseAttributeList = advertiseTableRef.value.getDataSource()
            advertiseAttributeList = handleNullItem(advertiseAttributeList)
          }

          // 商品属性
          let spuAttributeList = []
          if (spuTableRef.value) {
            spuAttributeList = spuTableRef.value.getDataSource()
            spuAttributeList = handleNullItem(spuAttributeList)
          }

          // 发货属性
          let deliveryAttributeList = []
          if (deliveryTableRef.value) {
            deliveryAttributeList = deliveryTableRef.value.getDataSource()
            deliveryAttributeList = handleNullItem(deliveryAttributeList)
          }

          let params = {
            spuId: goodsId.value,
            ...formParams,
            specsList,
            skuList, // 规格
            advertiseAttributeList, // 宣传属性
            spuAttributeList, // 商品属性
            deliveryAttributeList, // 发货属性
          }
          if (params.price <= 0) {
            createMessage.error(`请填写官网价`)
            return
          }
          if (goodsId.value && goodsId.value != '0') {
            params['id'] = goodsId.value
            await updateGoodsBase(params)
            createMessage.success(`修改成功`)
          } else {
            const res = await addGoodsBase(params)
            goodsId.value = res
            createMessage.success(`新增成功`)
          }

          goodsStore.setUpdateReload(true)
          // goBack()
        } catch (error) {}
      }

      // 返回上一页
      function goBack() {
        go(String(back.value))
      }

      return {
        goBack,
        detailInfo,
        register,
        resetAll,
        submitAll,
        specsTableRef,
        advertiseTableRef,
        spuTableRef,
        deliveryTableRef,
      }
    },
  })
</script>
