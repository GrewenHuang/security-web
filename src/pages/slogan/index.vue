<template>
  <div class="dictionariesBox">
    <div class="itemTitle">
      <el-tree
        :data="data"
        :props="defaultProps"
        accordion
        @node-click="handleNodeClick"
      >
      </el-tree>
    </div>
    <div class="itmeContent">
      <shogan-content :dictsObj="dictsObj" v-if="dictsObj.dictId"></shogan-content>
    </div>
  </div>
</template>

<script>
import request_mixin from "@/mixins/request-mixin.js";
import shoganContent from "./shoganContent.vue";
import Qs from "qs";
export default {
  mixins: [request_mixin],
  components: {
    shoganContent
  },
  data() {
    return {
      data: [
        {
          label: "班前会",
          children: [
            {
              label: "口号"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "name"
      },
      dictsObj: {}
    };
  },
  mounted() {
    this.getTree();
  },
  methods: {
    handleNodeClick(data) {
      let that = this;
      if (!data.children) {
        console.log(data, "数据");
        that.dictsObj = data;
      }
    },
    getTree() {
      console.log(this, "确认方法");
      let that = this;
      this.Get("/GetDictsBak").then(res => {
        if (res.status == "2000") {
          that.data = res.data;
        }
      });
    }
  }
};
</script>

<style>
.dictionariesBox {
  width: 100%;
  height: 100%;
  display: flex;
  background: white;
  padding-top: 5px;
  padding-bottom: 5px;
}
.itemTitle {
  width: 20%;
  height: 100%;
  border-right: 1px solid #ebeef5;
  padding: 15px;
}
.itmeContent {
  flex: 1;
  padding: 15px;
  box-sizing: border-box;
}
</style>
