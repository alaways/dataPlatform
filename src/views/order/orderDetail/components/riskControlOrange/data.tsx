import { Tag, Tooltip } from 'ant-design-vue'
import { h } from 'vue'
import { DescItem } from '/@/components/Description'
import { InfoCircleOutlined } from '@ant-design/icons-vue'

// 风控基本信息
export const riskSchema: DescItem[] = [
  {
    field: 'score',
    label: '用户评分',
    render: (value) => {
      return (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ color: 'red', marginRight: '6px' }}>{value || '-'}</div>
            <Tooltip>
              {{
                title: () => '评分比值越大客户质量越好',
                default: () => <InfoCircleOutlined style={{ color: 'red' }} />,
              }}
            </Tooltip>
          </div>
        </>
      )
    },
  },
  {
    field: 'result',
    label: '风控评级',
    render: (value) => {
      return (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '6px' }}>{value}</div>
            <Tooltip>
              {{
                title: () => 'L1~L6,其中L1最优等',
                default: () => <InfoCircleOutlined style={{ color: '#999' }} />,
              }}
            </Tooltip>
          </div>
        </>
      )
    },
  },
  {
    field: 'decision',
    label: '风控结果',
    render: (value) => {
      const params = {
        accept: { txt: '通过', color: 'green' },
        reject: { txt: '不通过', color: 'red' },
      }
      return h(Tag, { color: params[value]?.color || 'orange' }, params[value]?.txt || '暂无建议')
    },
  },
  {
    field: 'mobile_operator',
    label: '运营商',
    render: (value) => {
      const obj = { CM: '移动', CU: '联通', CT: '电信' }
      return obj[value] || '未知'
    },
  },
]
export const riskControlList: any = [
  // 保留结构
  // {
  //   name: '注册报告',
  //   span: 8,
  //   key: 'cert_info',
  //   children: [
  //     {
  //       value: '-',
  //       title: '注册平台数',
  //       key: 'count',
  //       color: '',
  //       span: 5,
  //     },
  //   ],
  // },
]
