<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <div class="flex items-center justify-between flex-1">
          <p style="padding: 0">
            提示说明： <br />
            1、订单数、总到期订单、逾期订单(含租赁生效、已逾期、已买断、已完结订单) <br />
            2、逾期率 = 逾期订单 / 总到期订单
          </p>
          <Button
            v-if="hasPermission('BusinessOverdueExport')"
            :loading="exportExcelLoading"
            @click="aoaToExcel"
          >
            导出Excel
          </Button>
        </div>
      </template>
    </BasicTable>
    <Modal @register="registerModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { Button } from 'ant-design-vue'
  import { downloadByData } from '/@/utils/file/download'
  import { useModal } from '/@/components/Modal'
  import Modal from './Modal.vue'
  import { cloneDeep } from 'lodash-es'
  import { Recordable } from 'vite-plugin-mock'
  import { exportOverdueExcel, getOverdueProvinceList } from '/@/api/business/overdue'
  import { cityCoding } from '/@/utils/cityData2'
  import { isIEBrowse } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { isValidISO8601 } from '/@/utils/tool'

  const props = {
    currentKey: { type: String, default: '' },
  }

  export default defineComponent({
    name: 'ProvinceTable',
    components: { BasicTable, Button, Modal },
    props,
    setup(props) {
      const exportExcelLoading = ref(false)
      const cityDatas = ref<any>(cloneDeep(cityCoding))

      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [registerModal, { openModal }] = useModal()
      const [registerTable, { getForm, getPaginationRef }] = useTable({
        defSort: { field: 'sortNum', order: 'desc' },
        sortFn(sortInfo) {
          return { field: sortInfo.field, order: sortInfo.order }
        },
        beforeFetch,
        api: getOverdueProvinceList,
        afterFetch,
        columns: columns(handleOverdue, props.currentKey),
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema(),
          autoAdvancedLine: 10,
        },
        scroll: { y: 600 },
        useSearchForm: true,
        bordered: true,
        striped: false,
        showIndexColumn: false,
      })

      // 处理参数
      async function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        if (pdata.time) {
          pdata['createTimeStart'] = `${pdata.time[0]}`
          pdata['createTimeEnd'] = `${pdata.time[1]}`
        }

        // 排序
        if (pdata.field && pdata.order) {
          const order = pdata.order == 'ascend' ? 'asc' : 'desc'
          if (pdata.field == 'sortNum') {
            pdata['sortNumOrderBy'] = order
          } else {
            pdata['orderBy'] = `${pdata.field} ${order}`
          }
        }
        if (pdata.time) {
          pdata['createTimeStart'] = `${isValidISO8601(pdata.time[0], 'YYYY-MM-DD')}`
          pdata['createTimeEnd'] = `${isValidISO8601(pdata.time[1], 'YYYY-MM-DD')}`
        }
        delete pdata.time
        delete pdata.field
        delete pdata.order

        // 地区筛选
        if (pdata.ipCitysTxt) {
          // 处理省
          pdata['ipProvinces'] = pdata.ipCitysTxt.join(',')
          delete pdata.ipCitysTxt
          delete pdata.ipCitys
        } else {
          pdata.ipProvinces = ''
        }
        delete pdata.time
        return pdata
      }
      async function afterFetch(data) {
        const form = await getForm()
        cityDatas.value.forEach((v) => {
          v.children = []
        })
        form.updateSchema([
          {
            field: 'ipCitys',
            componentProps: ({ formModel }) => {
              return {
                treeData: cityDatas.value,
                treeCheckable: true,
                allowClear: true,
                showSearch: true,
                onChange: (e, v) => {
                  console.log(e)
                  formModel.ipCitysTxt = v
                },
              }
            },
          },
        ])
        return data
      }

      // 逾期订单
      async function handleOverdue(record: Recordable, isUpdate: boolean, entryType: number) {
        const form = await getForm()
        const values = await beforeFetch(await form.validate())
        openModal(true, {
          isUpdate,
          record,
          values,
          entryType,
          isProvince: true,
        })
      }

      // 导出
      async function aoaToExcel() {
        if (isIEBrowse()) {
          createMessage.error('请使用除IE之外的浏览器导出Excel')
          return
        }
        const form = await getForm()
        const value = form.getFieldsValue()
        const formValue = await beforeFetch(cloneDeep(value))

        exportExcelLoading.value = true
        const pageData: any = getPaginationRef()
        const params = {
          ...formValue,
          limit: pageData.total,
          type: 'province',
        }
        const res = await exportOverdueExcel(params)
        downloadByData(res.data, `逾期数据列表(省份).xlsx`)
        exportExcelLoading.value = false
      }

      return {
        registerTable,
        aoaToExcel,
        exportExcelLoading,
        registerModal,
        hasPermission,
      }
    },
  })
</script>
