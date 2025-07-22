import { FormSchema } from '/@/components/Form'

export const formSchema: FormSchema[] = [
  {
    field: 'oldPassword',
    label: '当前密码',
    component: 'InputPassword',
    required: true,
    colProps: { span: 22 },
  },
  {
    field: 'newPassword',
    label: '新密码',
    component: 'StrengthMeter',
    colProps: { span: 22 },
    componentProps: {
      placeholder: '新密码',
    },
    rules: [
      {
        required: true,
        message: '请输入新密码',
      },
    ],
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'InputPassword',
    colProps: { span: 22 },
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('不能为空')
            }
            if (value !== values.newPassword) {
              return Promise.reject('两次输入的密码不一致!')
            }
            return Promise.resolve()
          },
        },
      ]
    },
  },
]
