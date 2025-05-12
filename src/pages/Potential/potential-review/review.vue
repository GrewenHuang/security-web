<template>
  <div>

    <el-row class="warp">
      <el-col :span="3">
        <label class="el-form-item__label"
               style="float:right;">检查计划名称</label>
      </el-col>
      <el-col :span="9">
        <label class="el-form-item__label">{{form.PlanName}}</label>
      </el-col>
      <el-col :span="3">
        <label class="el-form-item__label"
               style="float:right;">检查人</label>
      </el-col>
      <el-col :span="9">
        <label class="el-form-item__label">{{form.CheckUserName}}</label>
      </el-col>
    </el-row>
    <el-row class="warp">
      <el-col :span="24"
              class="warp-main"
              v-if="update">
        <div v-for='(item,i) in form.Items'
             :key="i">
          <ViewItem :data="item"
                    @saveSuccess="removeSuccessItem"></ViewItem>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API_POTENTIAL from '@/api/api_potential'
import ViewItem from "./viewItem";

export default {
  name: "review",
  components: {
    ViewItem
  },
  data () {
    return {
      loading: false,
      update: true,
      form: {

      },
    }
  },
  methods: {
    getPotentialViewById (id) {
      let than = this
      than.loading = true
      API_POTENTIAL.GetEnterprisePotentialPreView({ "Id": id }).then(function (res) {


        than.update = false
        than.$nextTick(() => {
          than.form = res.data
          than.update = true
        })
        than.loading = false
      }, function (err) {
        than.loading = false
        than.$message.error({ showClose: true, message: err.toString(), duration: 2000 });
      }).catch(function (error) {
        than.loading = false
        than.$message.error({ showClose: true, message: error, duration: 2000 });
      })
    },
    removeSuccessItem (itemId) {
      this.form.Items.some((item, i) => {
        if (item.itemId == itemId) {
          this.form.Items.splice(i, 1);
          return true;
        }
      });
      this.update = false
      this.$nextTick(() => {
        this.update = true
      })
    },
  },
}
</script>

<style scoped>
.warp-main {
  padding: 0 50px;
}
.el-form-item__label {
  font-size: 16px;
  font-weight: 600;
}
</style>
