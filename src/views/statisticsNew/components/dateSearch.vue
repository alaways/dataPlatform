<template>
  <BasicForm @register="registerForm" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  import { BasicForm, useForm } from '/@/components/Form/index'
  import { searchFormSchema } from './data'

  export default defineComponent({
    name: 'SearchForm',
    components: { BasicForm },
    emits: ['submit', 'reset'],
    setup(_, { emit }) {
      const [registerForm, { validate }] = useForm({
        labelWidth: 100,
        schemas: searchFormSchema,
        submitFunc: handleSubmit,
        resetFunc: handleReset,
        showActionButtonGroup: true,
        actionColOptions: {
          span: 8,
        },
      })

      async function handleReset() {
        emit('submit', {
          startTime: ``,
          endTime: ``,
        })
      }

      async function handleSubmit() {
        try {
          const values = await validate()
          // TODO custom api
          emit('submit', {
            startTime: `${values.time[0]} 00:00:00`,
            endTime: `${values.time[1]} 23:59:59`,
          })
        } finally {
        }
      }

      return { registerForm, handleSubmit }
    },
  })
</script>
