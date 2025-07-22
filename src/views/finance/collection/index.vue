<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <div class="flex flex-col justify-start p-3 flex-1">
          <div class="flex items-center">
            <div class="text-base font-semibold mr-4">收款对账</div>
            <div class="flex-1">
              <!-- <div class="flex">
                <div class="mr-4">
                  已还总金额: <span style="color: red">￥{{ availableBalance || 0 }}</span>
                </div>
                <div class="mr-4">
                  首次支付金额: <span style="color: red">￥{{ usageAmount || 0 }}</span>
                </div>
                <div class="mr-4">
                  租金还款金额: <span style="color: red">￥{{ totalRechargeAmount || 0 }}</span>
                </div>
              </div> -->
            </div>
            <Button
              v-if="hasPermission('FinanceCollectionExport')"
              class="mr-3"
              :loading="exportExcelLoading"
              @click="aoaToExcel"
            >
              <template #icon><DownloadOutlined /></template>
              申请下载Excel
            </Button>
            <Button @click="handleDownload" v-if="hasPermission('FinanceCollectionExport')">
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
  import { exportApplyForExcelCollection, getCollectionList } from '/@/api/finance/collection'
  import { handleBillList } from '../../order/utils'
  import { cloneDeep } from 'lodash-es'
  import { Button } from 'ant-design-vue'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { isIEBrowse } from '/@/utils/is'
  import { onMounted } from 'vue'
  import { getStoreList } from '/@/api/store'
  import { isValidISO8601 } from '/@/utils/tool'
  import { usePermission } from '/@/hooks/web/usePermission'
  import { cityCoding } from '/@/utils/cityData2'
  import { useModal } from '/@/components/Modal'
  import DownloadModal from '/@/components/DownloadModal/index.vue'
  import { DownloadOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'

  export default defineComponent({
    name: 'FinanceCollectionPage',
    components: { BasicTable, Button, DownloadModal, DownloadOutlined, UnorderedListOutlined },
    setup() {
      const exportExcelLoading = ref(false)
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [downloadModal, { openModal: openDownloadModal }] = useModal()

      const availableBalance: any = ref(0)
      const usageAmount: any = ref(0)
      const totalRechargeAmount: any = ref(0)

      const [registerTable, { reload, getForm, getPaginationRef }] = useTable({
        // title: '收款对账',
        beforeFetch,
        api: getCollectionList,
        afterFetch,
        columns: columns,
        scroll: { y: 600 },
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          autoAdvancedLine: 10,
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
      })

      const merchantCodeList = ref<any>([])
      async function init() {
        // getCollectionDetail({}).then((res: any) => {
        //   availableBalance.value = formatNumber(res.availableBalance || 0, 2)
        //   usageAmount.value = formatNumber(res.usageAmount || 0, 2)
        //   totalRechargeAmount.value = formatNumber(res.totalRechargeAmount || 0, 2)
        // })
        const form = await getForm()
        form.updateSchema([
          {
            field: 'status',
            componentProps: {
              onChange: () => {
                form.submit()
              },
            },
          },
        ])
        const mlist = await getStoreList({ pageSize: 999999, limit: 999999 })
        merchantCodeList.value = mlist.list

        form.updateSchema([
          {
            field: 'merchantCode',
            componentProps: {
              placeholder: '请选择',
              options: merchantCodeList.value,
              fieldNames: {
                label: 'merchantName',
                value: 'merchantCode',
                key: 'merchantCode',
              },
            },
          },
        ])
      }

      function beforeFetch(data) {
        const pdata = cloneDeep(data)
        pdata['pageIndex'] = pdata.cursor
        pdata['pageSize'] = pdata.limit
        if (pdata.createTime) {
          pdata['timeBool'] = true
          pdata['beginCreateTime'] = `${isValidISO8601(pdata.createTime[0], 'YYYY-MM-DD')}`
          pdata['endCreateTime'] = `${isValidISO8601(pdata.createTime[1], 'YYYY-MM-DD')}`
        }
        if (pdata.payTime) {
          pdata['timeBool'] = true
          pdata['beginPayTime'] = `${isValidISO8601(pdata.payTime[0], 'YYYY-MM-DD')}`
          pdata['endPayTime'] = `${isValidISO8601(pdata.payTime[1], 'YYYY-MM-DD')}`
        }
        if (pdata.city) {
          const cityArr = cloneDeep(cityCoding)
          // 将value转成中文并且添加省级
          let ipProvinces: string[] = []
          let ipCitys: string[] = []
          cityArr.forEach((v) => {
            const flist = v.children
              .filter((f) => pdata.city.some((c) => c == f.value))
              .map((m) => m.label)
            if (flist && flist.length) {
              ipCitys.push(...flist)
              ipProvinces.push(v.label)
            }
          })

          pdata.ipProvinces = ipProvinces.join(',')
          pdata.ipCitys = ipCitys.filter((v) => v != '市辖区').join(',')
        } else {
          delete pdata.ipCitys
          delete pdata.ipProvinces
        }
        delete pdata.city
        delete pdata.time
        delete pdata.createTime
        delete pdata.payTime
        return pdata
      }
      // 处理返回数据
      function afterFetch(data) {
        data.forEach((v) => {
          const res: any = handleBillList(v.orderBillItemList)
          v['firstPay'] = res.firstPay
          v['deposit'] = res.deposit
        })
        return data
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

        if (!formValue?.timeBool) {
          createMessage.error('请筛选时间进行导出')
          return
        }
        exportExcelLoading.value = true
        const pageData: any = getPaginationRef()
        const params = {
          ...formValue,
          limit: pageData.total,
        }
        const res = await exportApplyForExcelCollection(params)
        if (res.code == 200) {
          createMessage.success('已添加进下载暂存列表')
        } else {
          createMessage.success('申请失败')
        }
        exportExcelLoading.value = false
      }

      onMounted(() => {
        init()
      })

      return {
        registerTable,
        handleSuccess,
        exportExcelLoading,
        aoaToExcel,
        availableBalance,
        usageAmount,
        totalRechargeAmount,
        hasPermission,
        downloadModal,
        handleDownload,
      }
    },
  })
</script>
