<template>
  <div>
    <el-select :placeholder="placeholder"
               @change='returnData()'
               v-model="value"
               :size="size"
               clearable
               v-bind="$attrs"
               >
      <el-option v-for='(item,i) in selectList'
                 :key='i'
                 :label="item.name"
                 :value='item.id'></el-option>
    </el-select>
  </div>
</template>
 
<script>
import request_mixin from "@/mixins/request-mixin.js";
export default {
  name: 'test-code',
  mixins: [request_mixin],
  props: {
    // 树结构数据
    url: {
      type: String,
    },
    size: {
      value: "",
      type: String,
    },
    placeholder: {
      type: String,
      value: '请选择'
    },
    propid: {
      type: String,
      value: 'id'
    },
    propname: {
      type: String,
      value: 'name'
    },
    val: {
      type: [String, Number]
    }
  },
  model: {
    prop: 'val',
    event: 'change'
  },
  //上面是父组件可传入参数
  data () {
    return {
      selectList: [],
      value: this.val
    };
  },

  watch: {
    val: {
        immediate: true,
        handler(value) {
            this.value = value;
        }
    }
  },

  methods: {
    returnData () {
      let name = this.selectList.filter(item => item[this.propid] == this.value)[0];
      name = name ? name[this.propname] : '';
      this.$emit('returnData', this.value, name)
      this.$emit('change', this.value, name);
    }
  },
  mounted () {

    this.Get(this.url).then(res => {
      if (res.status == 2000) {
        res.data.forEach(res => {
          if (!res.hasOwnProperty('id')) {
            res.id = res[this.propid]
          }

          if (!res.hasOwnProperty('name')) {
            res.name = res[this.propname]
          }
        });
        this.selectList = res.data
      } else {
        this.$message({
          showClose: true,
          message: '获取下拉数据失败！',
          type: 'error'
        });
      }
    })
  },

};
</script>
 
<style scoped>
.el-select{
    width: 100%;
}
</style>
