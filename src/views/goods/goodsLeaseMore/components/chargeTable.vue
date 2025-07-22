<template>
  <div>
    <BasicTable @register="registerTable" @edit-change="handleEditChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record)" />
        </template>
      </template>
    </BasicTable>
    <a-button v-if="!showAddButton" block class="mt-5" type="dashed" @click="handleAdd">
      新增收费项目
    </a-button>
  </div>
</template>
<script lang="ts">
  import { Recordable } from 'vite-plugin-mock'
  import { computed, defineComponent, watch } from 'vue'
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '/@/components/Table'

  const columns: BasicColumn[] = [
    {
      title: '服务名称',
      dataIndex: 'name',
      editRow: true,
      editRule: true,
      width: 120,
    },
    // {
    //   title: '服务内容',
    //   dataIndex: 'value',
    //   editRow: true,
    //   editRule: true,
    // },
    {
      title: '价格（元）',
      dataIndex: 'money',
      editRow: true,
      editRule: true,
      editComponent: 'InputNumber',
      width: 120,
      editComponentProps: () => {
        return {
          min: 0.01,
        }
      },
    },
    {
      title: '是否必选',
      dataIndex: 'ifRequired',
      editRow: true,
      editRule: true,
      width: 120,
      editComponent: 'Select',
      editComponentProps: {
        options: [
          {
            label: '是',
            value: '1',
          },
          {
            label: '否',
            value: '0',
          },
        ],
      },
    },
    {
      title: '是否开启', // 增值服务默认开启收费
      dataIndex: 'ifChecked',
      defaultValue: 1,
      ifShow: false,
    },
    {
      title: '服务说明',
      dataIndex: 'remark',
      editRow: true,
    },
  ]
  const props = {
    pdata: { type: Array, defaultValue: [] },
  }
  export default defineComponent({
    components: { BasicTable, TableAction },
    props,
    setup(props) {
      const [registerTable, { getDataSource, setTableData }] = useTable({
        columns: columns,
        showIndexColumn: false,
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
        },
        scroll: { y: '100%' },
        pagination: false,
      })

      watch(
        () => props.pdata,
        (value: any) => {
          setTableData(value)
        },
      )

      const showAddButton = computed(() => {
        try {
          return getDataSource().length || 0
        } catch (error) {
          return 0
        }
      })

      function handleEdit(record: EditRecordRow) {
        record.onEdit?.(true)
      }

      function handleCancel(record: EditRecordRow) {
        record.onEdit?.(false)
        if (record.isNew) {
          const data = getDataSource()
          const index = data.findIndex((item) => item.key === record.key)
          data.splice(index, 1)
        }
      }

      function handleSave(record: EditRecordRow) {
        record['value'] = record?.name || ''
        record.onEdit?.(false, true)
      }

      function handleEditChange(data: Recordable) {
        console.log(data)
      }

      function handleAdd() {
        const data = getDataSource()
        const addRow: EditRecordRow = {
          name: '',
          value: '',
          money: '',
          ifRequired: '',
          ifChecked: 1,
          remark: '',
          editable: true,
          isNew: true,
          key: `${Date.now()}`,
        }
        data.push(addRow)
      }

      function handleDelete(record: Recordable) {
        const data = getDataSource()
        const index = data.findIndex((item) => item.key === record.key)
        data.splice(index, 1)
      }

      function createActions(record: EditRecordRow): ActionItem[] {
        if (!record.editable) {
          return [
            {
              label: '编辑',
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
          ]
        }
        return [
          {
            label: '保存',
            onClick: handleSave.bind(null, record),
          },
          {
            label: '取消',
            popConfirm: {
              title: '是否取消编辑',
              confirm: handleCancel.bind(null, record),
            },
          },
        ]
      }

      return {
        registerTable,
        handleEdit,
        createActions,
        handleAdd,
        getDataSource,
        setTableData,
        handleEditChange,
        showAddButton,
      }
    },
  })
</script>
