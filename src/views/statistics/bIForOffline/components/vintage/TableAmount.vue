<template>
  <BasicTable @register="registerTable" />
</template>
<script lang="tsx">
  import { defineComponent, h, onMounted, ref, watch } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { columns, searchAmountFormSchema } from './data'
  import { getVintageAmountList, getVintageOrderList } from '/@/api/statistics'
  import { DatePicker } from 'ant-design-vue'
  import { handleMobValue, handleThanData } from './utils'
  import { FallOutlined, RiseOutlined } from '@ant-design/icons-vue'
  import { getStoreNoPageList } from '/@/api/store'

  export default defineComponent({
    name: 'VintageTable',
    components: { BasicTable },
    props: {
      currentKey: { type: String },
    },
    setup(props) {
      const loading = ref<boolean>(true)

      const overdueDays = ref<any>(3)
      const pointType = ref<any>(2)
      const historyAttachment = ref<any>('')
      const historyAttachment2 = ref<any>('')
      const rentType = ref<any>(2)
      const spuType = ref<any>('')
      const merchantCode = ref()
      const otherList = ref([])
      const yxzList = ref([])
      const otherJZList = ref([])
      const [registerTable, { getForm, setColumns, setTableData }] = useTable({
        title: '',
        columns,
        loading,
        bordered: true,
        showIndexColumn: false,
        pagination: false,
        formConfig: {
          schemas: searchAmountFormSchema,
          showActionButtonGroup: false,
        },
        useSearchForm: true,
      })

      let pdata: any = [] // 当前时间数据
      let thanData: any = [] // 对比时间数据
      async function getData(than = false) {
        loading.value = true
        let res: any = []
        const historyTime = than ? historyAttachment2.value : historyAttachment.value
        const objStatusList = {
          Other: otherList.value?.join(',') + ',with_null',
          YXZ: yxzList.value?.join(','),
          JZYF: otherJZList.value?.join(','),
        }
        let params: any = { merchantCode: objStatusList[merchantCode.value] }
        if (merchantCode.value == 'All') {
          params = {}
        }
        if (props.currentKey == '1') {
          res = await getVintageOrderList({
            percentage: '1.0',
            overdueDays: overdueDays.value,
            historyAttachment: historyTime,
            spuType: spuType.value,
            rentType: rentType.value,
            ...params,
          })
        } else {
          res = await getVintageAmountList({
            percentage: '1.0',
            overdueDays: overdueDays.value,
            pointType: pointType.value,
            historyAttachment: historyTime,
            spuType: spuType.value,
            rentType: rentType.value,
            ...params,
          })
        }

        if (!than) {
          pdata = historyAttachment.value ? handleMobValue(res, true) : []
        } else {
          thanData = historyAttachment2.value ? handleMobValue(res) : []
        }
        if (historyAttachment2.value && historyAttachment.value) {
          res = handleThanData(pdata, thanData)
        }
        handleData(res)
      }

      function handleData(data) {
        try {
          if (data && data.length) {
            // 获取key
            const column: any = []
            const item = data[0]
            Object.keys(item).forEach((v) => {
              if (v.indexOf('MOB') != -1 && v.indexOf('status') != -1) {
                return
              } else if (v.indexOf('MOB') != -1) {
                column.push({
                  title: v,
                  dataIndex: v,
                  customRender: ({ record }) => {
                    let status = 0
                    if (record && record[`${v}status`]) {
                      status = record[`${v}status`]
                    }
                    return h('div', { class: 'flex items-center justify-center' }, [
                      h('div', {}, record[v]),
                      h(RiseOutlined, {
                        style: {
                          color: 'red',
                          fontSize: '24px',
                          marginLeft: '10px',
                          display: status == 1 ? 'block' : 'none',
                        },
                      }),
                      h(FallOutlined, {
                        style: {
                          color: 'green',
                          fontSize: '24px',
                          marginLeft: '10px',
                          display: status == 2 ? 'block' : 'none',
                        },
                      }),
                    ])
                  },
                })
              } else {
                const uinfo = localStorage.getItem('USERINFO') ? JSON.parse(localStorage.getItem('USERINFO')) : null
                const iswAdmin = uinfo?.uid == '42398518'
                if (iswAdmin && (v == '剩余租金+买断总额' || v == '租金+买断总额' || v == '订单数'|| v == '在租')) {

                } else {
                  column.push({
                    title: v,
                    dataIndex: v,
                    customRender: ({ text }) => text || '-',
                  })
                }
                
              }
            })
            setColumns(column)
            setTableData(data)
            loading.value = false
          } else {
            loading.value = false
            setTableData([])
          }
        } catch (error) {
          loading.value = false
        }
      }

      onMounted(() => {
        init()
        getData()
      })

      watch(
        () => props.currentKey,
        async () => {
          overdueDays.value = 3
          pointType.value = 2
          historyAttachment.value = ''
          historyAttachment2.value = ''
          const form = await getForm()
          form.setFieldsValue({
            overdueDays: 3,
            pointType: 2,
            historyAttachment: null,
            historyAttachment2: null,
          })
          getData()
        },
      )

      async function init() {
        const form = await getForm()
        const data = await getStoreNoPageList()

        //云享租
        yxzList.value =
          data
            ?.filter((item: any) => item.merchantCode == 'YXZ')
            ?.map((item: any) => item.merchantCode) || []
        //其他
        otherList.value =
          data
            ?.filter((item: any) => item.merchantCode != 'YXZ' && item.merchantCode != 'JZYF')
            ?.map((item: any) => item.merchantCode) || []
        const isPro = location.href.indexOf('pro') > -1
        otherJZList.value =
          data
            ?.filter((item: any) => item.merchantCode == 'JZYF')
            ?.map((item: any) => item.merchantCode) || []
        let optionsList = [
          {
            label: '全部',
            value: 'All',
          },
          // 剔除云享租跟锦州月付
          {
            label: '线下监管机 + 电动车',
            value: 'Other',
          },
          {
            label: '锦州月付',
            value: 'JZYF',
          },
          {
            label: isPro ? '云享租' : 'YXZ',
            value: 'YXZ',
          },
        ]
        form.updateSchema([
          {
            field: 'pointType',
            componentProps: {
              onChange: (e) => {
                if (typeof e == 'number') {
                  pointType.value = e
                  getData()
                }
              },
            },
          },
          {
            field: 'overdueDays',
            componentProps: {
              onChange: (e) => {
                if (typeof e == 'number') {
                  overdueDays.value = e
                  getData()
                }
              },
            },
          },
          {
            field: 'rentType',
            componentProps: {
              onChange: (e) => {
                if (typeof e == 'number') {
                  rentType.value = e
                  getData()
                } else if (!e) {
                  rentType.value = ''
                  getData()
                }
              },
            },
          },
          {
            field: 'spuType',
            componentProps: {
              onChange: (e) => {
                if (typeof e == 'number') {
                  spuType.value = e
                  getData()
                } else if (!e) {
                  spuType.value = ''
                  getData()
                }
              },
            },
          },
          {
            field: 'merchantCode',
            label: '商家',
            component: 'Select',
            colProps: { span: 6 },
            componentProps: {
              showSearch: true,
              placeholder: '请选择',
              options: optionsList,
              onChange: (e) => {
                merchantCode.value = e
                getData()
              },
            },
          },
          {
            field: 'historyAttachment',
            renderColContent({ model, field }) {
              return (
                <div style={{ display: 'flex', 'flex-direction': 'row', alignItems: 'center' }}>
                  <div style={{ marginRight: '10px', border: 'none' }}>数据对比</div>
                  <DatePicker
                    style={{ width: '150px' }}
                    allowClear
                    v-model:value={model[field]}
                    valueFormat="YYYY-MM-DD"
                    placeholder="请选择当前日期"
                    onChange={(e) => {
                      historyAttachment.value = e
                      getData()
                    }}
                  />
                  <div style={{ margin: '0 10px', border: 'none' }}>VS</div>
                  <DatePicker
                    style={{ width: '150px' }}
                    allowClear
                    v-model:value={model['historyAttachment2']}
                    valueFormat="YYYY-MM-DD"
                    placeholder="请选择对比日期"
                    onChange={(e) => {
                      historyAttachment2.value = e
                      if (!historyAttachment.value) return
                      const bool = !!e
                      getData(bool)
                    }}
                  />
                </div>
              )
            },
          },
        ])
      }

      return {
        registerTable,
      }
    },
  })
</script>
