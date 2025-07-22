<template>
  <div class="p-0">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          @click="reloadPhoneStatus"
          v-if="hasPermission('OrderDetailRefreshPhoneStatus')"
        >
          刷新号码状态
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record)" />
        </template>
      </template>
    </BasicTable>
    <a-button
      v-if="tableData && tableData.length && hasPermission('OrderDetailEditModal')"
      block
      class="mt-5"
      type="dashed"
      @click="handleAdd"
    >
      添加一行数据
    </a-button>
    <Modals @register="modalRegister" />
  </div>
</template>
<script lang="ts">
  import { Recordable } from 'vite-plugin-mock'
  import { defineComponent, inject, ref, toRefs } from 'vue'
  import { BasicTable, useTable, TableAction, ActionItem, EditRecordRow } from '/@/components/Table'
  import { tableColumn, tableEditRow } from './contactsTable'
  import { useMessage } from '/@/hooks/web/useMessage'
  import { queryElements } from '/@/api/riskControl'
  import { getQueryPhoneStatus, getUserConcern, updateOrderUser } from '/@/api/order'
  import { cloneDeep, debounce } from 'lodash-es'
  import { canParseJSON, validatePhone } from '/@/utils/tool'
  import { Modal } from 'ant-design-vue'
  import { useModal } from '/@/components/Modal'
  import Modals from './Modals.vue'
  import { usePermission } from '/@/hooks/web/usePermission'

  const props = {
    pdata: { type: Array, defaultValue: [] },
    isEmit: { type: Boolean, defaultValue: false },
  }

  export default defineComponent({
    components: { BasicTable, TableAction, Modals },
    props,
    emit: ['contacts'],
    setup(props, { emit }) {
      const parent: any = inject('init')
      const { createMessage } = useMessage()
      const { hasPermission } = usePermission()
      const [modalRegister, { openModal }] = useModal()
      const editRow = tableEditRow
      const { pdata } = toRefs(props)
      const phoneStatusLoading = ref(false)

      let datas: any = pdata.value
      if (datas) {
        // 保留只需要传的
        datas = {
          id: datas.id || '',
          uid: datas.uid || '',
          age: datas.age || '',
          nation: datas.nation || '',
          // phone: datas.phone, // 此处不能传手机号
          realName: datas.realName || '',
          idCard: datas.idCard || '',
          cardFrontImage: datas.cardFrontImage || '',
          cardBackImage: datas.cardBackImage || '',
          cardHandImage: datas.cardHandImage || '',
          emergentRelation1: datas.emergentRelation1 || '',
          emergentName1: datas.emergentName1 || '',
          emergentPhone1: datas.emergentPhone1 || '',
          emergentStatus1: datas.emergentStatus1 || '',
          emergentRelation2: datas.emergentRelation2 || '',
          emergentName2: datas.emergentName2 || '',
          emergentPhone2: datas.emergentPhone2 || '',
          emergentStatus2: datas.emergentStatus2 || '',
          emergents: datas.emergents,
          remark: datas.remark || '',
        }
      }
      let emergents = datas.emergents || []
      if (canParseJSON(emergents)) {
        emergents = JSON.parse(emergents)
      }
      let remark = datas.remark || {}
      if (canParseJSON(datas.remark)) {
        remark = JSON.parse(datas.remark)
      }

      const tableData = [
        {
          userName: datas.emergentName1 || '-',
          relation: datas.emergentRelation1 || '-',
          mobile: datas.emergentPhone1 || '-',
          status: datas.emergentStatus1 || '',
          remark: remark[datas.emergentPhone1] || '-',
          id: 1,
        },
        {
          userName: datas.emergentName2 || '-',
          relation: datas.emergentRelation2 || '-',
          mobile: datas.emergentPhone2 || '-',
          status: datas.emergentStatus2 || '',
          remark: remark[datas.emergentPhone2] || '-',
          id: 2,
        },
        ...emergents,
      ]
      const [registerTable, { getDataSource, setTableData, setColumns, setLoading }] = useTable({
        title: '紧急联系人',
        columns: tableColumn([], datas.realName),
        dataSource: tableData,
        pagination: false,
        showIndexColumn: false,
        loading: phoneStatusLoading,
        actionColumn: {
          title: '操作',
          dataIndex: 'action',
          width: 150,
        },
        scroll: { y: '100%' },
      })

      init()
      async function init() {
        // 获取用户关系列表
        const res = await getUserConcern({ label: 'sysConf.user.emergencyContactRelationship2' })
        let options = []
        if (canParseJSON(res)) {
          const opt = JSON.parse(res)
          options = opt.map((v) => {
            return { label: v, value: v }
          })
        }
        setColumns(tableColumn(options, datas.realName))

        reloadPhoneStatus(-1)
      }

      // 刷新号码当前状态
      async function reloadPhoneStatus(expSeconds) {
        const tdata: any = []
        try {
          phoneStatusLoading.value = true
          for (let i = 0; i < tableData.length; i++) {
            if (!tableData[i].mobile || !validatePhone(tableData[i].mobile)) {
              tdata.push(tableData[i])
              phoneStatusLoading.value = false
              continue
            }
            const params = {
              phone: tableData[i].mobile,
            }
            if (expSeconds != -1) {
              params['expSeconds'] = 0
            }
            const res = await getQueryPhoneStatus(params)
            tdata.push({
              ...tableData[i],
              checkStatus: res?.status || 'UNKNOWNv',
            })
          }
          phoneStatusLoading.value = false
        } catch (error) {
          phoneStatusLoading.value = false
        }
        setTableData(tdata)
      }

      function handleEdit(record: EditRecordRow) {
        record.onEdit?.(true)
      }

      function handleCancel(record: EditRecordRow) {
        record.onEdit?.(false)
        if (record.isNew) {
          const data = getDataSource()
          const index = data.findIndex((item) => item.id === record.id)
          data.splice(index, 1)
        }
      }

      const handleSave = debounce(async (record: EditRecordRow) => {
        if (!record.userName) {
          createMessage.error(`请输入用户姓名`)
          return
        }
        if (!record.relation) {
          createMessage.error(`请选择关系`)
          return
        }
        if (!record.mobile) {
          createMessage.error(`请输入手机号`)
          return
        }

        if (!new RegExp(/^1[3456789]\d{9}$/).test(record.mobile)) {
          createMessage.error(`请输入正确的手机号`)
          return
        }
        setLoading(true)
        // 数据参数
        const params = cloneDeep(datas)
        let isAdd = false
        // 二要素验证
        const query = await queryElements({
          userName: record.userName,
          mobile: record.mobile,
        })
        record.status = query
        // 紧急联系人1,2
        if (record.id < 3) {
          params[`emergentName${record.id}`] = record.userName
          params[`emergentRelation${record.id}`] = record.relation
          params[`emergentPhone${record.id}`] = record.mobile
          params[`emergentStatus${record.id}`] = query
          params[`emergentPhone${record.id}`] = record.mobile
          const remarks = remark
          if (record.id == 1) {
            remarks[datas.emergentPhone1] = record.remark
          } else if (record.id == 2) {
            remarks[datas.emergentPhone2] = record.remark
          }
          params['remark'] = JSON.stringify(remarks)
        } else {
          // emergents 数据
          const newRecord = {
            userName: record.userName,
            relation: record.relation,
            mobile: record.mobile,
            remark: record.remark || '',
            id: record.id,
            status: query,
          }
          if (record.id) {
            // 编辑
            const index = emergents.findIndex((v) => v.id == record.id)
            emergents[index] = newRecord
          } else {
            // 新增
            isAdd = true
            newRecord.id = record.key
            emergents.push(newRecord)
          }
          params.emergents = JSON.stringify(emergents)
        }
        if (query == 1) {
          handleUpdate()
        } else {
          Modal.confirm({
            title: () => `${record.userName}的手机号和姓名不一致,是否确认保存`,
            onCancel: () => {
              setLoading(false)
              handleCancel(record)
            },
            onOk: function () {
              handleUpdate()
            },
          })
        }

        async function handleUpdate() {
          if (!props.isEmit) {
            await updateOrderUser(params)
            createMessage.success(`${isAdd ? '添加' : '修改'}成功`)
            parent()
          }
          setLoading(false)
          isAdd = false
          record.onEdit?.(false, true)
          emit('contacts', params)
        }
      }, 500)

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

      async function handleDelete(record: Recordable) {
        const dataSource = getDataSource()
        const index = dataSource.findIndex((item) => item.id === record.id)
        dataSource.splice(index, 1)
        // 只有紧急联系人3以上才能删除
        const params = cloneDeep(datas)
        const emergents = cloneDeep(dataSource).splice(2)
        params.emergents = JSON.stringify(emergents)
        if (!props.isEmit) {
          await updateOrderUser(params)
          createMessage.success(`删除成功`)
          parent()
        } else {
          emit('contacts', params)
        }
      }

      function handlePlagiarismCheck(record: Recordable) {
        openModal(true, {
          isUpdate: true,
          record: {
            ...record,
            uid: datas.uid,
          },
        })
      }

      function createActions(record: EditRecordRow): ActionItem[] {
        if (!record.editable) {
          return [
            {
              ifShow: hasPermission('OrderDetailContactsEdit'),
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderDetailContactsCnki'),
              label: '查重',
              onClick: handlePlagiarismCheck.bind(null, record),
            },
            {
              ifShow: hasPermission('OrderDetailContactsDel') && ![1, 2].includes(record.id),
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
        modalRegister,
        createActions,
        handleAdd,
        getDataSource,
        tableData,
        reloadPhoneStatus,
        hasPermission,
      }
    },
  })
</script>
