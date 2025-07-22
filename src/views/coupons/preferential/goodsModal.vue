<template>
  <BasicModal
    :width="700"
    :height="480"
    :style="{ top: '10px' }"
    v-bind="$attrs"
    @register="registerGoodsModal"
    :title="getTitle"
    destroyOnClose
    @ok="handleSubmit"
  >
    <BasicTable @register="registerTable" style="padding: 0" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { BasicTable, useTable } from '/@/components/Table'
  import { goodsColumns, searchGoodsFormSchema } from './data'
  import { cloneDeep } from 'lodash-es'
  import { getGoodsList } from '/@/api/goods'

  export default defineComponent({
    name: 'GoodsModal',
    components: { BasicModal, BasicTable },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true)
      const spuValue = ref<any>([])

      const [registerGoodsModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false })
        isUpdate.value = !!data?.isUpdate
        if (data?.spuValue && data?.spuValue.length) {
          spuValue.value = data?.spuValue
        }
      })

      const getTitle = computed(() => '选择商品')

      const [registerTable, { setSelectedRowKeys, getDataSource }] = useTable({
        columns: goodsColumns,
        beforeFetch,
        api: getGoodsList,
        afterFetch,
        formConfig: {
          labelWidth: 80,
          schemas: searchGoodsFormSchema,
        },
        useSearchForm: true,
        showTableSetting: false,
        bordered: true,
        showIndexColumn: false,
        clickToRowSelect: false,
        rowKey: 'id',
        rowSelection: {
          type: 'radio',
          // type: 'checkbox',
          // 这里因为select优先级比change高，所以可以直接使用select来判断
          // onChange: rowSelectionChange,
          onSelect: rowSelectionSelect,
          onSelectAll: rowSelectionSelectAll,
        },
        pagination: {
          pageSize: 5,
        },
      })

      async function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        pdata['shelfStatus'] = 1
        return pdata
      }

      function afterFetch() {
        init()
      }

      // 初始化
      function init() {
        // 设值
        if (spuValue.value && spuValue.value.length) {
          const ids = spuValue.value.map((v) => v.id)
          setSelectedRowKeys(ids)
        }
      }

      function rowSelectionSelect(e) {
        // 单选
        spuValue.value = [e]
        // 多选
        // const find = spuValue.value.find((v) => v.id == e.id)
        // // 如果有则移除，否则获取
        // if (find) {
        //   spuValue.value = spuValue.value.filter((v) => v.id != e.id)
        // } else {
        //   spuValue.value.push(e)
        // }
      }

      function rowSelectionSelectAll(bool) {
        const row = getDataSource()
        const list = spuValue.value.filter((v) => {
          return !row.some((r) => r.id == v.id)
        })
        if (bool) {
          spuValue.value = [...list, ...row]
        } else {
          spuValue.value = list
        }
      }

      async function handleSubmit() {
        if (spuValue.value && spuValue.value.length) {
          const values = spuValue.value.map((v) => {
            return {
              id: v.id,
              name: v.name,
              pic: v.pic,
              categoryId: v.categoryId,
              categoryName: v.categoryName,
              brandId: v.brandId,
              brandName: v.brandName,
            }
          })
          console.log(values)

          emit('success', values)
        } else {
          emit('success', '')
        }
        closeModal()
      }

      return { registerGoodsModal, getTitle, registerTable, handleSubmit }
    },
  })
</script>
