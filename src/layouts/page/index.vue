<template>
  <RouterView>
    <template #default="{ Component, route }">
      <transition
        :name="
          getTransitionName({
            route,
            openCache,
            enableTransition: getEnableTransition,
            cacheTabs: getCaches,
            def: getBasicTransition,
          })
        "
        mode="out-in"
        appear
      >
        <div>
          <keep-alive v-if="openCache" :include="getCaches">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
          <component v-else :is="Component" :key="route.fullPath" />
        </div>
      </transition>
    </template>
  </RouterView>
</template>

<script lang="ts">
  import { computed, defineComponent, unref } from 'vue'

  import { useRootSetting } from '/@/hooks/setting/useRootSetting'

  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting'
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting'
  import { getTransitionName } from './transition'

  import { useMultipleTabStore } from '/@/store/modules/multipleTab'

  export default defineComponent({
    name: 'PageLayout',
    setup() {
      const { getShowMultipleTab } = useMultipleTabSetting()
      const tabStore = useMultipleTabStore()

      const { getOpenKeepAlive } = useRootSetting()

      const { getBasicTransition, getEnableTransition } = useTransitionSetting()

      const openCache = computed(() => unref(getOpenKeepAlive) && unref(getShowMultipleTab))

      const getCaches = computed((): string[] => {
        if (!unref(getOpenKeepAlive)) {
          return []
        }
        return tabStore.getCachedTabList
      })

      return {
        getTransitionName,
        openCache,
        getEnableTransition,
        getBasicTransition,
        getCaches,
      }
    },
  })
</script>
