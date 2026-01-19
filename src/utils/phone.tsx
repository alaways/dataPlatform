import { Button } from 'ant-design-vue'
import { h } from 'vue'
export const phoneExit = (value, item) => {
  const copyValue = JSON.parse(JSON.stringify(value))
  const jiamiText = String(copyValue).substring(0, 3) + '***'
  const nvalue: string = item.showPhone ? value : jiamiText
  return h('div', { textAlign: 'center' }, [
    h('span', {}, `${nvalue} `),
    h(
      Button,
      {
        type: 'link',
        size: 'samll',
        onClick: () => {
          item.showPhone = !item.showPhone
        },
      },
      `${!item.showPhone ? '解' : '加'}密手机`,
    ),
  ])
}
