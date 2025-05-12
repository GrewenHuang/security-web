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
          <FormItem :data="item"
                    @saveSuccess="removeSuccessItem"></FormItem>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import API_POTENTIAL from '@/api/api_potential'
import FormItem from "./formItem";

export default {
  name: "Form",
  components: {
    FormItem
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
    getPotentialFormById (id) {
      let than = this
      than.loading = true
      API_POTENTIAL.GetEnterprisePotentialPreForm({ "Id": id }).then(function (res) {

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
.el-form-item__label {
  font-size: 16px;
  font-weight: 600;
}
.warp-main {
  padding: 0 50px;
}
</style>