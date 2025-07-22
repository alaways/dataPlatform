<template>
  <div class="p-0">
    <BasicTable @register="registerTable" @edit-change="handleEditChange">
      <template #toolbar>
        <div class="flex justify-end text-[#dc2626]">每列人员分配的比例总和需为100%</div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '排班设置',
                onClick: handleEdit.bind(null, record),
              },
              {
                label: '删除',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <a-button block class="mt-5" type="dashed" @click="handleAdd"> 添加一行数据 </a-button>
    <Modal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="tsx">
  import { Recordable } from 'vite-plugin-mock'
  import { defineComponent, ref, watch } from 'vue'
  import { BasicTable, useTable, TableAction, EditRecordRow } from '/@/components/Table'
  import { tableColumn, tableEditRow } from './RuleSettingUserTable'
  import { distributeUidListOptions } from '../RuleSettingNew/data'
  import { useModal } from '/@/components/Modal'
  import Modal from './Modal.vue'
  const props = {
    pdata: { type: Array, defaultValue: [] },
  }
  export default defineComponent({
    components: { BasicTable, TableAction, Modal },
    props,
    setup(props) {
      const editRow = tableEditRow
      const options = ref<any>([])
      const total = ref<any>([{}])
      const [registerModal, { openModal }] = useModal()

      const [registerTable, { getDataSource, setTableData, setColumns, setLoading }] = useTable({
        columns: tableColumn([]),
        showIndexColumn: false,
        bordered: true,
        actionColumn: {
          title: '操作',
          dataIndex: 'action',
          width: 160,
        },
        scroll: { y: '100%' },
        pagination: false,
        showSummary: true,
        summaryData: total.value,
      })

      // 处理总值的变化
      function handleEditChange({ column }) {
        const key = column.dataIndex
        if (['uid', 'clientMax', 'clientLockMax'].includes(key)) {
          return
        }

        const item = total.value[0]
        const data = getDataSource()

        const sum = data.reduce((sum, item) => {
          const value = item[key] || 0
          return sum + value
        }, 0)
        item[key] = `${sum}%`
      }

      /**
       * 初始化合计
       */
      function handleTotal(list: any) {
        distributeUidListOptions.forEach((v) => {
          const item = total.value[0]
          const sum = list.reduce((sum, its) => {
            const value = its.weightMap[`scope_${v.value}`] || 0
            return sum + value
          }, 0)
          item[`scope_${v.value}`] = `${sum}%`
        })
      }

      watch(
        () => props.pdata,
        (value: any) => {
          const data = value.map((v) => {
            v.editable = true
            return {
              ...v,
              ...v.weightMap,
            }
          })

          setTableData(data)
          handleTotal(value)
        },
      )

      function setOptions(option: any) {
        options.value = option
      }

      function changeColumns(list: any) {
        setLoading(true)
        const column: any = tableColumn(options.value)
        const index = column.length - 1 // 索引

        list.forEach((v: any) => {
          column.splice(index, 0, {
            title: '',
            dataIndex: `scope_${v.value}`,
            editRow: true,
            editRule: true,
            width: 160,
            editComponent: 'InputNumber',
            customHeaderRender: () => {
              return (
                <div style={{ textAlign: 'center' }}>
                  <div>{v.label}</div>
                  <div>
                    <span style={{ color: 'red' }}>*</span>
                    <span>分配权重</span>
                  </div>
                  {/* <div>(单位:%)</div> */}
                </div>
              )
            },
          })
        })
        column.sort((a, b) => {
          if (a.dataIndex === 'uid') return -1 // uid始终排在前面
          if (b.dataIndex === 'uid') return 1 // uid排在前面，所以b是uid时a应该排在b后面
          if (a.dataIndex === 'max') return 1 // max始终排在后面
          if (b.dataIndex === 'max') return -1 // max排在后面，所以b是max时a应该排在b前面

          // 对于其他项，根据数字部分进行排序
          const numA = getScopeNumber(a.dataIndex)
          const numB = getScopeNumber(b.dataIndex)
          return numA - numB // 升序排序scope_项
        })

        setColumns(column)
        setTimeout(() => {
          setLoading(false)
        }, 666)
      }

      function getScopeNumber(item) {
        if (item.startsWith('scope_')) {
          return parseInt(item.split('_')[1], 10) // 将字符串中的数字部分转换为整数
        }
        return Infinity
      }

      function handleAdd() {
        const data = getDataSource()
        const addRow: EditRecordRow = {
          ...editRow,
          editable: true,
          isNew: true,
          key: `${Date.now()}`,
        }
        if (data) {
          data.push(addRow)
        } else {
          setTableData([addRow])
        }
      }

      function handleDelete(record: Recordable) {
        const data = getDataSource()
        const index = data.findIndex((item) => item.key === record.key)
        data.splice(index, 1)
      }
      // 编辑的痰喘
      const handleEdit = (record) => {
        const data = getDataSource()
        const item = data.find((item) => item.key === record.key)
        openModal(true, {
          isUpdate: false,
          record: item,
        })
      }
      function handleSuccess(selectPayload) {
        const data = getDataSource()
        const dindex = data.findIndex((item: any) => item.uid === selectPayload.uid)
        if (dindex > -1) {
          data[dindex].restDayList = selectPayload.selectedList
        }
        setTableData(data)
      }
      return {
        registerTable,
        handleAdd,
        handleDelete,
        getDataSource,
        changeColumns,
        setOptions,
        handleEditChange,
        handleEdit,
        registerModal,
        handleSuccess,
      }
    },
  })
</script>
