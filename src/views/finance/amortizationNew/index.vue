<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <div class="flex flex-col justify-start p-3 flex-1">
          <div class="flex items-center">
            <div class="text-base font-semibold mr-4">摊销计算</div>
            <div class="flex-1"> </div>
            <Button
              class="mr-3"
              :loading="exportExcelLoading"
              @click="aoaToExcel"
              v-if="hasPermission('downLoadTanXiaoList')"
            >
              <template #icon><DownloadOutlined /></template>
              申请下载Excel
            </Button>
            <Button @click="handleDownload" v-if="hasPermission('downLoadTanXiaoList')">
              <template #icon><UnorderedListOutlined /></template>
              下载暂存列表
            </Button>
          </div>
        </div>
      </template>
    </BasicTable>
    <DownloadModal @register="downloadModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { columns, searchFormSchema } from './data'
  import {
    exportApplyForExcelAmortizationNew,
    getAmortizationListNew,
  } from '/@/api/finance/amortization'
  import { Button } from 'ant-design-vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { isIEBrowse } from '/@/utils/is'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { useModal } from '/@/components/Modal'
  import DownloadModal from '/@/components/DownloadModal/index.vue'
  import { DownloadOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
  import { cloneDeep } from 'lodash-es'
  import dayjs from 'dayjs'

  export default defineComponent({
    name: 'AmortZationNewPage',
    components: {
      BasicTable,
      Button,
      DownloadModal,
      DownloadOutlined,
      UnorderedListOutlined,
    },
    setup() {
      const exportExcelLoading = ref(false)
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [downloadModal, { openModal: openDownloadModal }] = useModal()

      const [registerTable, { reload, getForm, getPaginationRef, setColumns }] = useTable({
        beforeFetch,
        afterFetch,
        api: getAmortizationListNew,
        columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        ellipsis: false,
      })

      function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = 20 || pdata.limit
        console.log(pdata.date, 'pdataDate')
        if (typeof pdata.date != 'string' && pdata.date) {
          pdata.date = dayjs().format('YYYY-MM')
        }
        return pdata
      }
      function afterFetch(data) {
        const ndata = cloneDeep(data).sort(
          (a: any, b: any) => a.monthlyAmortizeList?.length - b.monthlyAmortizeList.length,
        )
        const maxItem = ndata[ndata.length - 1]
        if (maxItem && maxItem?.monthlyAmortizeList) {
          // 获取接口数据后动态新增table columns
          let nlist = []
          maxItem.monthlyAmortizeList.map((item, index) => {
            nlist.push({
              title: item?.monthly + '摊销金额',
              dataIndex: 'monthlyAmortizeList' + index,
              width: 120,
              customRender: (d) => {
                const cutText = d.column.customTitle.split('摊销金额')[0]
                const obj = d.record.monthlyAmortizeList.find((item) => item.monthly === cutText)
                return obj?.monthlyAmortizeAmount || '-'
              },
            })
          })
          setColumns([...columns, ...nlist])
        }
      }
      function handleSuccess() {
        reload()
      }

      function handleDownload() {
        openDownloadModal(true)
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
        console.log(params, 'paramsExport')
        const res = await exportApplyForExcelAmortizationNew(params)
        if (res.code == 200) {
          createMessage.success('已添加进下载暂存列表')
        } else {
          createMessage.success('申请失败')
        }
        exportExcelLoading.value = false
      }

      return {
        registerTable,
        handleSuccess,
        exportExcelLoading,
        aoaToExcel,
        hasPermission,
        downloadModal,
        handleDownload,
      }
    },
  })
</script>
