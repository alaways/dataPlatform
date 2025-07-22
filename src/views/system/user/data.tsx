import { h } from 'vue'
import { BasicColumn } from '/@/components/Table'
import { FormSchema } from '/@/components/Table'
import { FormItem, Input, Select, Switch, Tag } from 'ant-design-vue'
import { useMessage } from '/@/hooks/web/useMessage'
import { updateUserStatusItem } from '/@/api/system/user'
import { uploadApi } from '/@/api/sys/upload'
import { incomeModeList, workTypeList } from '../../order/orderDetail/components/detail/data'
import { phoneStatasList } from '../../order/orderDetail/components/detail/components/contacts/contactsTable'

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'nickName',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: 50,
    customRender: ({ text }) => (text == 1 ? '女' : '男'),
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 150,
  },
  {
    title: '手机号状态',
    dataIndex: 'phoneStatus',
    width: 150,
    customRender: ({ text }) => {
      const find = phoneStatasList.find((v) => v.value == text)
      return h(Tag, { color: find?.color }, find?.label)
    },
  },
  {
    title: '小程序名称',
    dataIndex: 'appletName',
    width: 150,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '身份证',
    width: 200,
    dataIndex: 'idCard',
    customRender: ({ text }) => text || '-',
  },
  {
    title: '收入方式',
    width: 120,
    dataIndex: 'incomeMode',
    customRender: ({ record }) => record.userIdentify.incomeMode || '-',
  },
  {
    title: '工作类型',
    width: 120,
    dataIndex: 'workType',
    customRender: ({ record }) => record.userIdentify.workType || '-',
  },
  {
    title: '渠道/渠道代码',
    dataIndex: 'channelCode',
    width: 120,
    customRender: ({ record }) => {
      return h('div', { textAlign: 'center' }, [
        h('span', {}, record.channelName || '-'),
        h('br'),
        h('span', {}, record.channelCode || '-'),
      ])
    },
  },
  {
    title: '是否绑卡',
    dataIndex: 'countCard',
    width: 100,
    customRender: ({ text }) => {
      const status = text != 0
      return h(Tag, { color: status ? 'green' : 'red' }, status ? '是' : '否')
    },
  },
  {
    title: '是否在租',
    dataIndex: 'countProcessing',
    width: 100,
    customRender: ({ text }) => h(Tag, { color: text ? 'green' : 'red' }, text ? '是' : '否'),
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    fiexd: 'rignt',
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'status')) {
        record.status = false
      }
      return h(Switch, {
        checked: record.status === 1,
        checkedChildren: '已启用',
        unCheckedChildren: '已禁用',
        loading: record.pendingStatus,
        onChange(checked: boolean) {
          record.pendingStatus = true
          const newStatus = checked ? 1 : 0
          const { createMessage } = useMessage()
          updateUserStatusItem({ uid: record.uid, status: newStatus })
            .then(() => {
              record.status = newStatus
              createMessage.success(record.status === 1 ? `已启用` : '已禁用')
            })
            .catch(() => {
              createMessage.error('修改状态失败')
            })
            .finally(() => {
              record.pendingStatus = false
            })
        },
      })
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    customRender: ({ text }) => text || '-',
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    field: 'nickName',
    label: '用户名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'idCard',
    label: '身份证',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'channelCode',
    label: '渠道',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      getPopupContainer: () => document.body,
    },
    colProps: { span: 6 },
  },
  {
    field: 'processingStatus',
    label: '是否在租',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'cardStatus',
    label: '是否绑卡',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
    colProps: { span: 6 },
  },
  {
    field: 'time',
    label: '日期时间',
    component: 'RangePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 6 },
  },
  {
    label: '收入方式',
    field: 'incomeMode',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: incomeModeList,
    },
  },
  {
    label: '工作类型',
    field: 'workType',
    fields: ['workTypeInput'],
    component: 'Input',
    colProps: { span: 12 },
    render({ model, field }) {
      return (
        <Input.Group compact class="flex">
          <Select
            style="width: 120px"
            allowClear
            placeholder="请选择"
            v-model:value={model[field]}
            onChange={() => (model['workTypeInput'] = '')}
          >
            {workTypeList.map((v) => {
              return <Select.Option value={v.value}>{v.value}</Select.Option>
            })}
          </Select>
          <FormItem
            style={{ display: model[field] == '其他' ? 'inline-block' : 'none' }}
            name="workTypeInput"
            rules={[{ required: model[field] == '其他', message: '请输入工作类型' }]}
          >
            <Input placeholder="请输入" v-model:value={model['workTypeInput']} />
          </FormItem>
        </Input.Group>
      )
    },
  },
]

export const userFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'uid',
    label: 'uid',
    component: 'Input',
    show: false,
  },
  {
    field: 'nickName',
    label: '用户名',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    required: true,
  },
  {
    field: 'idCard',
    label: '身份证',
    component: 'Input',
    required: true,
  },
  {
    field: 'channelCode',
    label: '渠道',
    component: 'Select',
    colProps: { span: 16 },
    componentProps: {
      placeholder: '请选择',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'processingStatus',
    label: '是否在租',
    component: 'RadioGroup',
    required: true,
    defaultValue: 1,
    colProps: { span: 24 },
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
  {
    field: 'status',
    label: '状态',
    required: true,
    component: 'RadioGroup',
    defaultValue: 1,
    colProps: { span: 24 },
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
]

export const userUpdateSchemas: FormSchema[] = [
  {
    label: 'id',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: 'uid',
    field: 'uid',
    component: 'Input',
    show: false,
  },
  {
    label: '年龄',
    field: 'age',
    component: 'Input',
    show: false,
  },
  {
    label: '民族',
    field: 'nation',
    component: 'Input',
    show: false,
  },
  {
    label: '真实姓名',
    field: 'realName',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    label: '手机号',
    field: 'phone',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    label: '身份证号码',
    field: 'idCard',
    component: 'Input',
    required: true,
    colProps: { span: 20 },
  },
  {
    label: '身份证正面',
    field: 'cardFrontImage',
    component: 'Input',
    suffix: '注：上传身份证正面会覆盖真实姓名、身份证号码',
    slot: 'cardFrontImage',
    componentProps: () => {
      return {
        accept: ['png', 'jpeg', 'jpg'],
        maxNumber: 1,
        type: 'file',
        // api: uploadOCRApiNew,
        // beforeFetch: (data) => {
        //   data.code = 'idcard'
        //   data.side = 'front'
        //   data.uid = formModel['uid']
        //   return data
        // },
        // afterFetch: (data: any) => {
        //   const res = data[0].response
        //   const info = res.data.info

        //   if (info) {
        //     formModel.realName = info.name
        //     formModel.age = info.age
        //     formModel.nation = info.nation
        //     if (validateIdCard(info.number)) {
        //       formModel.idCard = info.number
        //     } else {
        //       const { createMessage } = useMessage()
        //       createMessage.error('身份证号不正确，请核对后重新输入')
        //       formModel.idCard = ''
        //     }
        //   }
        //   return res.data.pic.split(',')
        // },
      }
    },
  },
  {
    label: '身份证背面',
    field: 'cardBackImage',
    component: 'ImageUpload',
    colProps: {
      span: 24,
    },
    slot: 'cardBackImage',
    // componentProps: ({ formModel }) => {
    //   return {
    //     accept: ['png', 'jpeg', 'jpg'],
    //     maxNumber: 1,
    //     api: uploadOCRApiNew,
    //     beforeFetch: (data) => {
    //       data.code = 'idcard'
    //       data.side = 'back'
    //       data.uid = formModel['uid']
    //     },
    //     afterFetch: (data) => {
    //       const res = data[0].response
    //       return res.data.pic.split(',')
    //     },
    //   }
    // },
  },
  {
    label: '手持身份证',
    field: 'cardHandImage',
    component: 'ImageUpload',
    colProps: {
      span: 24,
    },
    componentProps: {
      api: uploadApi,
      accept: ['png', 'jpeg', 'jpg'],
      maxNumber: 1,
      afterFetch: (data) => {
        const res = data[0].response
        return res.data.split(',')
      },
    },
  },
  {
    show: false,
    label: '紧急联系人1',
    field: 'divider-linked1',
    component: 'Divider',
    colProps: {
      span: 24,
    },
  },
  {
    show: false,
    label: '关系',
    field: 'emergentRelation1',
    component: 'Select',
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    show: false,
    label: '姓名',
    field: 'emergentName1',
    component: 'Input',
  },
  {
    show: false,
    label: '手机号',
    field: 'emergentPhone1',
    component: 'Input',
  },
  {
    show: false,
    label: '紧急联系人2',
    field: 'divider-linked2',
    component: 'Divider',
    colProps: {
      span: 24,
    },
  },
  {
    show: false,
    label: '关系',
    field: 'emergentRelation2',
    component: 'Select',
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    show: false,
    label: '姓名',
    field: 'emergentName2',
    component: 'Input',
  },
  {
    show: false,
    label: '手机号',
    field: 'emergentPhone2',
    component: 'Input',
  },
  {
    show: false,
    label: '紧急联系人列表',
    field: 'emergents',
    component: 'Input',
  },
  {
    // 紧急联系人
    label: '',
    field: 'contacts',
    component: 'Input',
    slot: 'contacts',
    colProps: {
      span: 24,
    },
  },
]

/**
 * 银行卡信息表格
 */
export const bindCardTableColumn: BasicColumn[] = [
  {
    title: '银行卡信息',
    width: 150,
    dataIndex: 'bankName',
  },
  {
    title: '银行卡号',
    dataIndex: 'bankCardNo',
  },
]
