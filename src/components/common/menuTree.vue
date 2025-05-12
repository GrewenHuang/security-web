<template>
  <div>
    <template v-for="(child,index) in menuData">
      <el-submenu v-if="child.children && child.children.length > 0"
                  :index="child.id+'-'+index"
                  :class="$route.path==child.path?'is-active':''">
        <template slot="title">
          <i class="iconfont" :class="child.iconCls?child.iconCls:''"></i>
          <span slot="title">{{child.title}}</span>
        </template>
        <menu-tree :menuData="child.children"></menu-tree>
      </el-submenu>
      <el-menu-item v-else
                    :index="child.url">
        <i class="iconfont" :class="child.iconCls?child.iconCls:''"></i>
        <span slot="title">{{child.title}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'menuTree',
  props: ['menuData'],
  mounted () {
    // console.log(JSON.stringify(this.menuData))
  }
}
</script>

<style scoped>
</style>
