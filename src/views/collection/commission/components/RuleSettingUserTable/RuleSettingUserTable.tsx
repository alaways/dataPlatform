import { BasicColumn } from '/@/components/Table'

/**
 *
 * @param options 关系列表
 * @param realName 本人名称
 * @returns
 */
export function tableColumn(options): BasicColumn[] {
  return [
    {
      title: '人员',
      dataIndex: 'uid',
      editRow: true,
      editRule: true,
      editComponent: 'Select',
      width: 160,
      editComponentProps: () => {
        return {
          options,
          placeholder: '请选择',
        }
      },
    },
    // {
    //   title: '即将到期订单-未有逾期',
    //   dataIndex: 'scope_11',
    //   editRow: true,
    //   editRule: true,
    //   width: 160,
    //   editComponent: 'InputNumber',
    //   customHeaderRender: () => {
    //     return (
    //       <div style={{ textAlign: 'center' }}>
    //         <div>即将到期订单-未有逾期</div>
    //         <div>
    //           <span style={{ color: 'red' }}>*</span>
    //           <span>分配权重</span>
    //         </div>
    //       </div>
    //     )
    //   },
    // },

    // {
    //   title: '即将到期订单-单期逾期',
    //   dataIndex: 'scope_12',
    //   editRow: true,
    //   editRule: true,
    //   width: 160,
    //   editComponent: 'InputNumber',
    //   customHeaderRender: () => {
    //     return (
    //       <div style={{ textAlign: 'center' }}>
    //         <div>即将到期订单-单期逾期</div>
    //         <div>
    //           <span style={{ color: 'red' }}>*</span>
    //           <span>分配权重</span>
    //         </div>
    //       </div>
    //     )
    //   },
    // },

    // {
    //   title: '即将到期订单-多期逾期',
    //   dataIndex: 'scope_13',
    //   editRow: true,
    //   editRule: true,
    //   width: 160,
    //   editComponent: 'InputNumber',
    //   customHeaderRender: () => {
    //     return (
    //       <div style={{ textAlign: 'center' }}>
    //         <div>即将到期订单-多期逾期</div>
    //         <div>
    //           <span style={{ color: 'red' }}>*</span>
    //           <span>分配权重</span>
    //         </div>
    //       </div>
    //     )
    //   },
    // },
    // {
    //   title: '逾期订单-单期逾期',
    //   dataIndex: 'scope_14',
    //   editRow: true,
    //   editRule: true,
    //   width: 160,
    //   editComponent: 'InputNumber',
    //   customHeaderRender: () => {
    //     return (
    //       <div style={{ textAlign: 'center' }}>
    //         <div>逾期订单-单期逾期</div>
    //         <div>
    //           <span style={{ color: 'red' }}>*</span>
    //           <span>分配权重</span>
    //         </div>
    //       </div>
    //     )
    //   },
    // },
    // {
    //   title: '逾期订单-多期逾期',
    //   dataIndex: 'scope_15',
    //   editRow: true,
    //   editRule: true,
    //   width: 160,
    //   editComponent: 'InputNumber',
    //   customHeaderRender: () => {
    //     return (
    //       <div style={{ textAlign: 'center' }}>
    //         <div>逾期订单-多期逾期</div>
    //         <div>
    //           <span style={{ color: 'red' }}>*</span>
    //           <span>分配权重</span>
    //         </div>
    //       </div>
    //     )
    //   },
    // },
    {
      title: '拥有任务数上限',
      dataIndex: 'clientMax',
      editRow: true,
      width: 160,
      editComponent: 'InputNumber',
    },
    {
      title: '用户级别锁任务上限',
      dataIndex: 'clientLockMax',
      editRow: true,
      width: 160,
      editComponent: 'InputNumber',
    },
  ]
}

export const tableEditRow = {
  uid: '',
  clientMax: '',
  clientLockMax: '',
}
