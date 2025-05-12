<template>
    <div class="tree_select">
      <el-select :value="valueTitle"
                 ref="selectEl"
                 :filterable="filterable"
                 :clearable="clearable"
                 @clear="clearHandle"
                 :filter-method="selectFilterData"
                 :size="size">
        <el-option :value="valueId" :label="valueTitle">
          <el-tree id="tree-option"
                   ref="selectTree"
                   :accordion="accordion"
                   :data="options"
                   :props="props"
                   :node-key="props.value"
                   :expand-on-click-node="false"
                   :default-expanded-keys="defaultExpandedKey"
                   :filter-node-method="filterNode"
                   @node-click="handleNodeClick">
          </el-tree>
        </el-option>
      </el-select>
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'SelectTree',
    props: {
      /* 配置项 */
      props: {
        type: Object,
        default: () => {
          return {
            value: 'id', // ID字段名
            label: 'title', // 显示名称
            children: 'children' // 子级字段名
          }
        }
      },
      /* 选项列表数据(树形结构的对象数组) */
      options: {
        type: Array,
        default: () => {
          return []
        }
      },
      /* 初始值 */
      value: {
        type: [Number, String],
        default: () => {
          return null
        }
      },
      /* 可清空选项 */
      clearable: {
        type: Boolean,
        default: () => {
          return true
        }
      },
      /* 自动收起 */
      accordion: {
        type: Boolean,
        default: () => {
          return false
        }
      },
      /**
       * 下拉选项框的大小，默认最小
       */
      size: {
        type: String,
        default: () => {
        }
      },
      // 是否可以搜索
      filterable: Boolean
    },
    data () {
      return {
        valueId: this.value, // 初始值
        valueTitle: '',
        defaultExpandedKey: []
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.initHandle()
      })
    },
    methods: {
      // 初始化值
      initHandle () {
        if (this.valueId && this.$refs.selectTree.getNode(this.valueId)) {
          this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[this.props.label] // 初始化显示
          this.$refs.selectTree.setCurrentKey(this.valueId) // 设置默认选中
          this.defaultExpandedKey = [this.valueId] // 设置默认展开
        }
        this.$nextTick(() => {
          const scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
          const scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
          scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
          scrollBar.forEach(ele => {
            ele.style.width = 0
          })
        })
      },
      // 切换选项
      handleNodeClick (node) {
        this.valueTitle = node[this.props.label]
        this.valueId = node[this.props.value]
        this.$emit('getValue', this.valueId)
        this.defaultExpandedKey = []
        // 选中后失去焦点，隐藏下拉框
        this.$refs.selectEl.blur()
        // 把数据还原
        this.selectFilterData('')
      },
      /**
       * 下拉框搜索
       */
      selectFilterData (val) {
        this.$refs.selectTree.filter(val)
      },
      /**
       * 过滤节点
       */
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      // 清除选中
      clearHandle () {
        this.valueTitle = ''
        this.valueId = null
        this.defaultExpandedKey = []
        this.clearSelected()
        this.$emit('getValue', null)
      },
      /* 清空选中样式 */
      clearSelected () {
        const allNode = document.querySelectorAll('#tree-option .el-tree-node')
        allNode.forEach((element) => element.classList.remove('is-current'))
      }
    },
    watch: {
      /**
       * 监听绑定的值变化
       */
      options() {
        this.$nextTick(function () {
          this.initHandle()
        })
      },
      value () {
        this.valueId = this.value
        this.initHandle()
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  ::v-deep .el-select .el-input .el-input__inner {
    color: #fff !important;
  }
  
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  
  .el-select-dropdown__item.selected {
    font-weight: normal;
  }
  
  ul li > > > .el-tree .el-tree-node__content {
    height: auto;
    padding: 0 20px;
  }
  
  ::v-deep .el-tree-node__content:hover,
  ::v-deep .el-tree-node__content:active,
  ::v-deep .is-current > div:first-child,
  ::v-deep .el-tree-node__content:focus {
    background-color: #F5F7FA;
    color: #409EFF;
  }
  
  </style>
  
  