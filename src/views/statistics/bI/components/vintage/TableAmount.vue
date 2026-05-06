<template>
  <div class="topCont">
    <span>统计时间：{{ updateTime }}</span>
    <Button @click="restHuanCun" size="small" type="primary">重新统计</Button>
  </div>
  <div class="paddingCont" v-if="loading">当前正在加载数据中，请稍后再看。。。</div>
  <BasicTable @register="registerTable">
    <template #toolbar>
      <div class="btnlist">
        <Button @click="resetAll"> 重置 </Button>
        <Button class="!ml-4" :loading="loading" type="primary" @click="handleSearchInfoFn">
          搜索
        </Button>
      </div>
    </template>
  </BasicTable>
</template>
<script lang="tsx">
  import { defineComponent, h, onMounted, ref, watch } from 'vue'
  import { BasicTable, useTable } from '/@/components/Table'
  import { columns, searchAmountFormSchema } from './data'
  import {
    getSysApiCache,
    getVintageOrderListOnline,
    getOverdueAmountListAsync,
  } from '/@/api/statistics'
  import { Button, DatePicker } from 'ant-design-vue'
  import { handleMobValue, handleThanData } from './utils'
  import { FallOutlined, RiseOutlined } from '@ant-design/icons-vue'

  export default defineComponent({
    name: 'VintageTable',
    components: { BasicTable, Button },
    props: {
      currentKey: { type: String },
    },
    setup(props) {
      const loading = ref<boolean>(true)
      const rentModeNameType = ref()
      const overdueDays = ref<any>(30)
      const pointType = ref<any>(1)
      const historyAttachment = ref<any>('')
      const historyAttachment2 = ref<any>('')
      const rentType = ref<any>(2)
      const spuType = ref<any>('')
      const rentModeFullList = ref<any>([])
      const merchantTerminalNoList = ref<any>('')
      const updateTime = ref()
      const uinfo: any = localStorage.getItem('USERINFO')
        ? JSON.parse(localStorage.getItem('USERINFO'))
        : null
      const iswAdmin = uinfo?.uid == '42398518'
      const [registerTable, { getForm, setColumns, setTableData }] = useTable({
        title: '',
        columns,
        loading,
        bordered: true,
        showIndexColumn: false,
        pagination: false,
        formConfig: {
          schemas: iswAdmin
            ? searchAmountFormSchema?.filter((item) => item.field != 'merchantTerminalNoList')
            : searchAmountFormSchema,
          showActionButtonGroup: false,
        },
        useSearchForm: true,
      })
      const handleSearchInfoFn = async () => {
        const params: any = await getForm().validate()
        merchantTerminalNoList.value = params?.merchantTerminalNoList?.join(',')
        overdueDays.value = params?.overdueDays
        pointType.value = params?.pointType
        rentModeFullList.value = params?.rentModeFullList
        rentModeNameType.value = params?.rentModeNameType

        setTableData([])
        getData()
      }
      const resetAll = () => {
        historyAttachment.value = null
        historyAttachment2.value = null
        merchantTerminalNoList.value = null
        overdueDays.value = 30
        pointType.value = 1
        rentModeFullList.value = []
        // 重制筛选
        const form = getForm()
        form.resetFields()
        setTableData([])
        getData()
      }
      const timer = ref()
      const getNdata = async (id) => {
        let nres = await getSysApiCache({
          id,
        })
        loading.value = true
        timer.value = setInterval(async () => {
          loading.value = true
          nres = await getSysApiCache({
            id,
          })
          if (nres) {
            clearInterval(timer.value)
            if (historyAttachment.value) {
              pdata = historyAttachment.value ? handleMobValue(nres, true) : []
            } else {
              thanData = historyAttachment2.value ? handleMobValue(nres) : []
            }
            if (!nres) return
            if (historyAttachment2.value && historyAttachment.value) {
              nres = handleThanData(pdata, thanData)
            }
            handleData(nres)
          }
        }, 5000)
      }
      let pdata: any = [] // 当前时间数据
      let thanData: any = [] // 对比时间数据
      async function getData(than = false) {
        loading.value = true
        let res: any = []
        const historyTime = than ? historyAttachment2.value : historyAttachment.value
        let rentModeFullListInit: any = null
        if (typeof rentModeFullList.value == 'string') {
          rentModeFullListInit = rentModeFullList.value
        } else {
          rentModeFullListInit = rentModeFullList.value?.join(',')
        }
        const rentModeFullList1 = rentModeFullListInit != '' ? rentModeFullListInit : null
        if (props.currentKey == '1') {
          res = await getVintageOrderListOnline({
            percentage: '1.0',
            overdueDays: overdueDays.value,
            historyAttachment: historyTime,
            spuType: spuType.value,
            rentType: rentType.value,
            rentModeFullList: rentModeFullList1,
            merchantTerminalNoList: '2023111709466887' || merchantTerminalNoList.value,
          })
        } else {
          const nres = await getOverdueAmountListAsync(
            {
              percentage: '1.0',
              overdueDays: overdueDays.value,
              pointType: pointType.value,
              historyAttachment: historyTime,
              spuType: spuType.value,
              rentType: rentType.value,
              rentModeFullList: rentModeFullList1,
              merchantTerminalNoList: '2023111709466887' || merchantTerminalNoList.value,
              rentModeNameType: rentModeNameType.value?.join(','),
            },
            { updateForce: 0 },
          )
          updateTime.value = nres?.updateTime
          if (nres?.id) getNdata(nres?.id)
          return
        }
        if (!than) {
          pdata = historyAttachment.value ? handleMobValue(res, true) : []
        } else {
          thanData = historyAttachment2.value ? handleMobValue(res) : []
        }
        if (!res) return
        if (historyAttachment2.value && historyAttachment.value) {
          res = handleThanData(pdata, thanData)
        }
        handleData(res)
      }
      function handleData(data) {
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
              const uinfo = localStorage.getItem('USERINFO')
                ? JSON.parse(localStorage.getItem('USERINFO'))
                : null
              const iswAdmin = uinfo?.uid == '42398518'
              if (
                iswAdmin &&
                (v == '剩余租金+买断总额' || v == '租金+买断总额' || v == '订单数' || v == '在租')
              ) {
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
        }
      }
      const init = async () => {
        const form = await getForm()
        form.updateSchema([
          {
            field: 'historyAttachment',
            renderColContent() {
              return (
                <div style={{ display: 'flex', 'flex-direction': 'row', alignItems: 'center' }}>
                  <div style={{ marginRight: '10px', border: 'none' }}>数据对比</div>
                  <DatePicker
                    style={{ width: '150px' }}
                    allowClear
                    v-model:value={historyAttachment.value}
                    valueFormat="YYYY-MM-DD"
                    placeholder="请选择当前日期"
                    onChange={(e) => {
                      historyAttachment.value = e
                    }}
                  />
                  <div style={{ margin: '0 10px', border: 'none' }}>VS</div>
                  <DatePicker
                    style={{ width: '150px' }}
                    allowClear
                    v-model:value={historyAttachment2.value}
                    valueFormat="YYYY-MM-DD"
                    placeholder="请选择对比日期"
                    onChange={(e) => {
                      historyAttachment2.value = e
                    }}
                  />
                </div>
              )
            },
          },
        ])
      }
      onMounted(async () => {
        timer.value = null
        init()
        await getData()
      })

      watch(
        () => props.currentKey,
        async () => {
          timer.value = null
          overdueDays.value = 30
          pointType.value = 1
          historyAttachment.value = ''
          historyAttachment2.value = ''
          const form = await getForm()
          form.setFieldsValue({
            overdueDays: 30,
            pointType: 1,
            historyAttachment: null,
            historyAttachment2: null,
          })
          getData()
        },
      )

      // 重置
      const restHuanCun = async () => {
        const historyTime = historyAttachment.value
        let rentModeFullListInit: any = null
        if (typeof rentModeFullList.value == 'string') {
          rentModeFullListInit = rentModeFullList.value
        } else {
          rentModeFullListInit = rentModeFullList.value?.join(',')
        }
        const rentModeFullList1 = rentModeFullListInit != '' ? rentModeFullListInit : null
        const nres = await getOverdueAmountListAsync(
          {
            percentage: '1.0',
            overdueDays: overdueDays.value,
            pointType: pointType.value,
            historyAttachment: historyTime,
            spuType: spuType.value,
            rentType: rentType.value,
            rentModeFullList: rentModeFullList1,
            merchantTerminalNoList: '2023111709466887' || merchantTerminalNoList.value,
            rentModeNameType: rentModeNameType.value?.join(','),
          },
          {
            updateForce: 1,
          },
        )
        updateTime.value = nres?.updateTime
        if (nres?.id) getNdata(nres?.id)
      }
      return {
        registerTable,
        loading,
        restHuanCun,
        updateTime,
        resetAll,
        handleSearchInfoFn,
      }
    },
  })
</script>
<style>
  .topCont {
    display: flex;
    align-items: center;
    padding: 12px 30px;
  }
  .topCont > span {
    padding-right: 20px;
  }
  .paddingCont {
    padding-left: 30px;
    color: red;
  }
</style>
