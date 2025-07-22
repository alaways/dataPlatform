<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button @click="handleDownload" v-if="hasPermission('SupplierQuotationImport')">
          <template #icon><DownloadOutlined /></template>
          下载导入模板
        </Button>
        <BasicUpload
          v-if="hasPermission('SupplierQuotationImport')"
          :maxSize="20"
          :maxNumber="1"
          :api="impExcelApi"
          class="my-5"
          :accept="['xls', 'xlsx']"
          @change="handleSuccess"
        >
          导入Excel
        </BasicUpload>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import { getQuotationList, impExcelApi } from '/@/api/supplier/quotation'
  import { Button } from 'ant-design-vue'
  import { BasicUpload } from '/@/components/Upload'
  import { cloneDeep } from 'lodash-es'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { DownloadOutlined } from '@ant-design/icons-vue'
  import { downloadByUrl } from '/@/utils/file/download'

  export default defineComponent({
    name: 'SupplierQuotationPage',
    components: {
      BasicTable,
      Button,
      BasicUpload,
      DownloadOutlined,
    },
    setup() {
      const exportExcelLoading = ref(false)
      const importExcelLoading = ref(false)
      const fileList = ref([])

      const { hasPermission } = usePermission()

      const [registerTable, { reload }] = useTable({
        title: '',
        beforeFetch,
        api: getQuotationList,
        columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
      })

      // 处理参数
      async function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        if (pdata.createTime) {
          pdata['beginCreateTime'] = `${pdata.createTime[0]}`
          pdata['endCreateTime'] = `${pdata.createTime[1]}`
        }
        delete pdata.createTime

        if (!pdata.supplierName) {
          delete pdata.supplierName
        }
        if (!pdata.spuName) {
          delete pdata.spuName
        }
        return pdata
      }

      function handleDownload() {
        const url =
          'https://guangsu-v2.oss-cn-shanghai.aliyuncs.com/2024-12-20/51e57a5b-e274-460d-98e5-2b741fef20d1.xlsx'
        downloadByUrl({ url, fileName: '供应商报价模板.xlsx' })
      }
      function handleSuccess() {
        reload()
      }

      return {
        registerTable,
        importExcelLoading,
        exportExcelLoading,
        fileList,
        impExcelApi,
        hasPermission,
        handleDownload,
        handleSuccess,
      }
    },
  })
</script>
