<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.realName || getUserInfo.userName }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem key="password" :text="t('layout.header.password')" icon="carbon:password" />
        <!-- <MenuDivider v-if="getShowDoc" />
        <MenuItem
          key="passwordAction"
          :text="t('layout.header.passwordAction')"
          icon="solar:lock-password-broken"
        /> -->
        <MenuDivider v-if="getShowDoc" />
        <MenuItem
          key="logout"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="ion:power-outline"
        />
      </Menu>
    </template>
  </Dropdown>
</template>
<script lang="ts">
  // components
  import { Dropdown, Menu } from 'ant-design-vue'
  import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface'

  import { defineComponent, computed } from 'vue'

  import { DOC_URL } from '/@/settings/siteSetting'

  import { useUserStore } from '/@/store/modules/user'
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting'
  import { useI18n } from '/@/hooks/web/useI18n'
  import { useDesign } from '/@/hooks/web/useDesign'
  import { useModal } from '/@/components/Modal'

  import headerImg from '/@/assets/images/header.jpg'
  import { propTypes } from '/@/utils/propTypes'
  import { openWindow } from '/@/utils'

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent'
  import { useGo } from '/@/hooks/web/usePage'

  type MenuEvent = 'logout' | 'doc' | 'password' | 'passwordAction'

  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Dropdown,
      Menu,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      MenuDivider: Menu.Divider,
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown')
      const { t } = useI18n()
      const { getShowDoc } = useHeaderSetting()
      const userStore = useUserStore()
      const go = useGo()

      const getUserInfo = computed(() => {
        const { realName = '', userName = '', avatar, desc } = userStore.getUserInfo || {}
        return { realName, userName, avatar: avatar || headerImg, desc }
      })

      const [register] = useModal()

      //  login out
      function handleLoginOut() {
        userStore.confirmLoginOut()
      }

      // open doc
      function openDoc() {
        openWindow(DOC_URL)
      }

      function handleMenuClick(e: MenuInfo) {
        switch (e.key as MenuEvent) {
          case 'logout':
            handleLoginOut()
            break
          case 'password':
            go(`/System/Password`)
            break
          case 'passwordAction':
            go(`/system/passwordAction`)
            break
          case 'doc':
            openDoc()
            break
        }
      }

      return {
        prefixCls,
        t,
        getUserInfo,
        handleMenuClick,
        getShowDoc,
        register,
      }
    },
  })
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
