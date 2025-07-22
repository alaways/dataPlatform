<template>
  <BasicModal :width="650" v-bind="$attrs" @register="registerModal" title="领取记录">
    <BasicTable @register="registerTable" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import { BasicModal, useModalInner } from '/@/components/Modal'
  import { checkColumns } from './data'
  import { useTable } from '/@/components/Table'
  import { getPreferentialRecordList } from '/@/api/coupons/preferential'

  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal },
    emits: ['success', 'register'],
    setup() {
      const id = ref('')
      const [registerModal, { setModalProps }] = useModalInner(async (data) => {
        id.value = data.id
        setModalProps({ confirmLoading: false })
      })

      function beforeFetch(data) {
        data['pageIndex'] = data.cursor
        data['pageSize'] = data.limit
      }

      const [registerTable] = useTable({
        title: '',
        beforeFetch,
        api: getPreferentialRecordList,
        columns: checkColumns,
        showIndexColumn: false,
        useSearchForm: false,
        showTableSetting: false,
        bordered: true,
      })

      return { registerModal, registerTable }
    },
  })
</script>
