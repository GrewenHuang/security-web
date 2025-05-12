<template>
  <div>
    <el-popover
      class="custom-tree"
      placement="bottom-start"
      popper-class="popper-content"
      v-model="flag"
      @show="popoverShow"
      v-if="!isSelect"
    >
      <el-scrollbar class="scrollbar">
        <div class="scrollbar-content">
          <el-tree
            ref="customTree"
            :data="data"
            :show-checkbox="showCheckbox"
            :node-key="nodeKey"
            :default-expanded-keys="currentSelected"
            :default-checked-keys="currentSelected"
            :default-expand-all="expandAll"
            :props="treeProps"
            :check-strictly="checkStrictly"
            @check="handleCheck"
          ></el-tree>
        </div>
      </el-scrollbar>
      <div class="operation f-c-c" v-if="!immediately">
        <el-button size="mini" @click="close()">取消</el-button>
        <el-button type="primary" size="mini" @click="submit()">确定</el-button>
      </div>
      <div class="cursor-p" slot="reference">
        <el-select
          class="custom-input"
          :placeholder="placeholder"
          multiple
          :collapse-tags="collapseTags"
          v-model="selected"
          :disabled="disabled"
          @remove-tag="removeTag"
        >
          <el-option
            v-for="(item, index) in selected"
            :key="index"
            :label="item[treeProps.label]"
            :value="item"
          ></el-option>
        </el-select>
      </div>
    </el-popover>
    <div v-if="isSelect">
      <el-scrollbar class="scrollbar" ref="scrollbar">
        <div class="scrollbar-content" style="padding-bottom: 35px;">
          <el-tree
            ref="customTree"
            :data="data"
            :show-checkbox="showCheckbox"
            :node-key="nodeKey"
            :default-expanded-keys="currentSelected"
            :default-checked-keys="currentSelected"
            :default-expand-all="expandAll"
            :props="treeProps"
            :check-strictly="checkStrictly"
            @check="handleCheck"
          ></el-tree>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array
    },
    treeData: Array,
    showCheckbox: {
      type: Boolean,
      default: true
    },
    data: {
      type: [Object, Array]
    },
    nodeKey: {
      type: String,
      default: "id"
    },
    treeProps: {
      type: Object,
      default() {
        return {
          children: "children",
          label: "label"
        };
      }
    },
    // tree 父子互不关联
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 选中后的展示形式， true 归拢，只显示一个，其他用数字代替
    collapseTags: {
      type: Boolean,
      default: false
    },
    // 是否展开所有 tree
    expandAll: {
      type: Boolean,
      default: false
    },
    selectedId: {
      type: String,
      default: ""
    },
    isSelect: {
      type: Boolean,
      default: false
    },
    immediately: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    // 父关联子，子不关联父。需要将 checkStrictly 开启
    parentJoinChild: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      selected: "",
      selectedList: [],
      flag: false
    };
  },
  computed: {
    currentSelected() {
      return this.selectedList;
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        if (this.isSelect) {
          this.flag = this.isSelect;
        } else {
          this.flag = false;
        }
        let currentVal = val || [];
        if (currentVal) {
          this.selectedList = currentVal.map(item => {
            if (this.selectedId) {
              return item[this.selectedId];
            } else {
              return item;
            }
          });
          this.resetTreeChecked();
        }
        this.$nextTick(() => {
          if (this.$refs.customTree) {
            let checked = this.$refs.customTree.getCheckedNodes();
            this.selected = checked;
          }
        });
      }
    }
  },
  methods: {
    reset() {
      this.$nextTick(() => {
        this.$refs.scrollbar.wrap.scrollTop = 0;
      });
    },
    close() {
      this.flag = false;
    },
    submit() {
      this.close();
      this.emitChange();
    },
    emitChange() {
      this.selected = this.$refs.customTree.getCheckedNodes();
      this.selectedList = this.$refs.customTree.getCheckedKeys();
      this.$emit(
        "change",
        this.selectedList.map(item => {
          if (this.selectedId) {
            let obj = {};
            obj[this.selectedId] = item;
            return obj;
          } else {
            return item;
          }
        })
      );
    },
    resetTreeChecked() {
      this.$nextTick(() => {
        this.$refs.customTree.setCheckedKeys(this.selectedList);
      });
    },
    popoverShow() {
      this.resetTreeChecked();
    },
    removeTag(item) {
      let index = this.selectedList.indexOf(item.value);
      if (index != -1) {
        this.selectedList.splice(index, 1);
        if (this.$refs.customTree) {
          this.resetTreeChecked();
          this.$nextTick(() => {
            this.emitChange();
          });
        }
      }
    },
    handleCheck(data, node) {
      if (this.parentJoinChild) {
        const isChecked = this.$refs.customTree.getNode(data).checked;
        if (isChecked) {
          this.setCheckedChild(data);
        } else {
          this.delCheckedChild(data);
        }
      }
      if (this.immediately) {
        this.emitChange();
      }
    },
    setCheckedChild(data) {
      if (data.children && data.children.length) {
        data.children.forEach(node => {
          this.setCheckedChild(node);
          this.$refs.customTree.setChecked(node[this.nodeKey], true);
        });
      }
    },
    delCheckedChild(data) {
      if (data.children && data.children.length) {
        data.children.forEach(node => {
          this.delCheckedChild(node);
          this.$refs.customTree.setChecked(node[this.nodeKey], false);
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.custom-tree {
  /deep/ .el-tag__close {
    pointer-events: all;
  }
}

.scrollbar-content {
  padding: 0 15px 10px;
}

.operation {
  padding: 8px 0 0;
  width: 100%;
}

.custom-input {
  width: 100%;
  pointer-events: none;

  /deep/ .el-input__suffix-inner {
    pointer-events: none;
  }
}
</style>
<style lang="scss">
.el-popover.popper-content {
  padding: 15px 0;
  min-width: 210px;

  .el-scrollbar__wrap {
    max-height: 50vh;
  }

  .el-scrollbar__wrap {
    height: 100%;
    overflow-x: hidden;
    margin-bottom: 0 !important;
  }
}
</style>
