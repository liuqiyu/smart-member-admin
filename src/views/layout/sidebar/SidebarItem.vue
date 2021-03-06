<template>
  <div v-if="!item.hidden"
       class="menu-item-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && !onlyOneChild.children && !item.showRoot">
      <app-link v-if="onlyOneChild.meta"
                :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)"
                      :class="{'submenu-title-noDropdown':!isNest}">
          <i class="icon iconfont"
             :class="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"></i>
          <span slot="title">{{onlyOneChild.meta.title}}</span>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else
                ref="subMenu"
                :index="resolvePath(item.path)"
                popper-append-to-body>
      <template slot="title">
        <i class="icon iconfont"
           :class="item.meta && item.meta.icon"></i>
        <span slot="title">{{item.meta.title}}</span>
      </template>
      <sidebar-item v-for="child in item.children"
                    :key="child.path"
                    :is-nest="true"
                    :item="child"
                    :base-path="resolvePath(child.path)"
                    class="nest-menu" />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import AppLink from './Link'

export default {
  name: 'SidebarItem',
  components: { AppLink },
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild (children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath (routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/style/variable";
.menu-item-wrapper {
  width: 100%;
  > a {
    display: block;
    width: 100%;
    overflow: hidden;
  }
  /deep/ .el-menu-item {
    height: $menuItemHeight;
    line-height: $menuItemHeight;
    &:hover,
    &.focus {
      background-color: $menuHover !important;
    }
    &.is-active {
      background-color: $menuHover !important;
    }
  }
  /deep/ .el-submenu__title {
    height: $menuItemHeight;
    line-height: $menuItemHeight;
    &:hover,
    &.focus {
      background-color: $menuHover !important;
    }
  }
  /deep/ .nest-menu {
    .el-menu-item,
    .el-submenu__title {
      color: $subMenuText !important; // 二级菜单默认颜色
    }
  }
  /deep/ .el-menu-item.is-active {
    color: $menuActiveText !important; // 选中颜色
  }
}
</style>
