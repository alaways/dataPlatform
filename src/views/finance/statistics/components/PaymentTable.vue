<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <div class="flex justify-between p-3 flex-1 items-center">
          <div>
            <!-- <span class="text-base font-semibold">汇总统计</span>
            <span class="text-sm ml-2">(默认显示近30天)</span> -->
          </div>

          <Button
            v-if="hasPermission('FinanceStatisticsExport')"
            :loading="exportExcelLoading"
            @click="aoaToExcel"
          >
            导出Excel
          </Button>
        </div>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { paymentColumns, paymentSearchFormSchema } from '../data'
  import { downloadByData } from '/@/utils/file/download'
  import { cloneDeep } from 'lodash-es'
  import { Button } from 'ant-design-vue'
  import { exportExcel, getStatisticsList } from '/@/api/finance/statistics'
  import { isIEBrowse } from '/@/utils/is'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { isValidISO8601 } from '/@/utils/tool'

  export default defineComponent({
    name: 'StatisticsCollection',
    components: { BasicTable, Button },
    setup() {
      const exportExcelLoading = ref(false)
      const { createMessage } = useMessage()

      const { hasPermission } = usePermission()

      const [registerTable, { reload, getForm, getPaginationRef, expandAll }] = useTable({
        // title: '汇总统计(默认显示近30天)',
        beforeFetch,
        api: getStatisticsList,
        afterFetch,
        columns: paymentColumns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 120,
          schemas: paymentSearchFormSchema,
          autoAdvancedLine: 10,
        },
        isTreeTable: true,
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        pagination: false,
        fetchSetting: {
          listField: 'data',
        },
      })

      async function beforeFetch(data) {
        // const pdata = toRefs(data)
        // let timeValue = pdata.timeSelect.value

        data['pageIndex'] = data.cursor
        data['pageSize'] = data.limit

        // if (data.time) {
        //   if (timeValue == '订单创建时间') {
        //     data['beginCreateTime'] = `${data.time[0]}`
        //     data['endCreateTime'] = `${data.time[1]}`
        //   } else if (timeValue == '支付时间') {
        //     data['beginPayTime'] = `${data.time[0]}`
        //     data['endPayTime'] = `${data.time[1]}`
        //   } else if (timeValue == '首付支付时间') {
        //     data['beginFirstPayTime'] = `${data.time[0]}`
        //     data['endFirstPayTime'] = `${data.time[1]}`
        //   }
        // }

        if (data.createTime) {
          data['beginCreateTime'] = `${isValidISO8601(data.createTime[0], 'YYYY-MM-DD')}`
          data['endCreateTime'] = `${isValidISO8601(data.createTime[1], 'YYYY-MM-DD')}`
        }
        if (data.payTime) {
          data['beginPayTime'] = `${isValidISO8601(data.payTime[0], 'YYYY-MM-DD')}`
          data['endPayTime'] = `${isValidISO8601(data.payTime[1], 'YYYY-MM-DD')}`
        }

        delete data.timeSelect
        delete data.time
        delete data.createTime
        delete data.payTime
        return data
      }

      // 处理返回数据
      function afterFetch(data) {
        if (!data || !Object.keys(data).length) {
          return []
        }
        let pdata: any = []
        if (hasPermission('isFinanceStatistics')) {
          data.sub.forEach((v, i) => {
            if (i == 0 && !v.merchantName) {
              // v.time = '商户分配订单'
              v.time = '自营'
            } else {
              v.time = v.merchantName
            }
          })
          // pdata = [{ ...data, children: data.sub }]
          pdata = [{ ...data }, ...data.sub]
        } else {
          data.sub.forEach((v) => {
            v.time = v.merchantName
          })
          pdata = data.sub
        }
        return pdata
      }

      function handleSuccess() {
        reload()
      }

      function onFetchSuccess() {
        nextTick(expandAll)
      }

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
        }
        const res = await exportExcel(params)
        downloadByData(res.data, '货款汇总统计.xlsx')
        exportExcelLoading.value = false
      }

      return {
        registerTable,
        handleSuccess,
        exportExcelLoading,
        onFetchSuccess,
        aoaToExcel,
        hasPermission,
      }
    },
  })
</script>

<style lang="less" scoped>
  ::v-deep(.ant-table-cell) {
    .vben-basic-arrow {
      display: none;
    }
  }
</style>
