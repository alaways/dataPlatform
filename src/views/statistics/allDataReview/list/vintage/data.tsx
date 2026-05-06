import { BasicColumn } from '/@/components/Table'

export const columns: BasicColumn[] = [
  {
    title: '放款月份',
    dataIndex: 'postMonth',
    width: 150,
  },
  {
    title: '放款金额',
    dataIndex: 'loanAmt',
    width: 100,
    customRender: ({ text }) => {
      return text || '-'
    },
  },
  {
    title: 'MOB1(%)',
    dataIndex: 'mob1Amt',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text)}%` : '-'
    },
  },
  {
    title: 'MOB2(%)',
    dataIndex: 'mob2Amt',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text)}%` : '-'
    },
  },
  {
    title: 'MOB3(%)',
    dataIndex: 'mob3Amt',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text)}%` : '-'
    },
  },
  {
    title: 'MOB4(%)',
    dataIndex: 'mob4Amt',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text)}%` : '-'
    },
  },
  {
    title: 'MOB5(%)',
    dataIndex: 'mob5Amt',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text)}%` : '-'
    },
  },
  {
    title: 'MOB6(%)',
    dataIndex: 'mob6Amt',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text)}%` : '-'
    },
  },
  {
    title: 'MOB7(%)',
    dataIndex: 'mob7Amt',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text)}%` : '-'
    },
  },
  {
    title: 'MOB8(%)',
    dataIndex: 'mob8Amt',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text)}%` : '-'
    },
  },
  {
    title: 'MOB9(%)',
    dataIndex: 'mob9Amt',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text)}%` : '-'
    },
  },
  {
    title: 'MOB10(%)',
    dataIndex: 'mob10Amt',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text)}%` : '-'
    },
  },
  {
    title: 'MOB11(%)',
    dataIndex: 'mob11Amt',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text)}%` : '-'
    },
  },
  {
    title: 'MOB12(%)',
    dataIndex: 'mob12Amt',
    width: 100,
    customRender: ({ text }) => {
      return text ? `${(text)}%` : '-'
    },
  },
]
