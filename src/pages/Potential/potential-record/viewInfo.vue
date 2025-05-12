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

        <ViewItem :data="form.Items"></ViewItem>

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
        PotentialSummaryId: '',
        PlanName: '',
        CheckUserName: '',
        Items: [],
      },
    }
  },
  methods: {
    getPotentialViewById (id) {
      let than = this
      than.loading = true
      API_POTENTIAL.GetEnterprisePotentialView({ "id": id }).then(function (res) {
        than.form = res.data
        than.update = false
        than.$nextTick(() => {
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
  },
}
</script>

<style scoped>
.warp-main {
  padding: 0 50px;
}
</style>
