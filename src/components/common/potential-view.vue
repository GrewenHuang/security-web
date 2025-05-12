<template>
  <div>
    <div v-for='(item,index) in list'
         style='margin:10px auto'
         :key='index'>
      <div class='box'>
        <span><span style='font-weight:600'>操作人：</span>{{item.OperationUserName}}</span>
        <span style='font-size:12px;color:#888'>操作时间：{{item.OperationDateDesc}}</span>
        <div class='flag'
             :style='{background:item.color}'>{{item.PotentialOperationDesc}}</div>

        <img src="../../assets/xjt.png"
             v-if='item.isActive == false && arr.indexOf(item.PotentialOperationDesc)>-1'
             @click="checks(index,item.isActive)">
        <img src="../../assets/sjt.png"
             v-if='item.isActive == true && arr.indexOf(item.PotentialOperationDesc)>-1'
             @click="checks(index,item.isActive)">
      </div>
      <collapse>
        <div class="container"
             v-show="item.isActive">
          <el-form>
            <template v-if='item.PotentialOperationDesc.includes("整改")'>

              <el-form-item label='整改照片：'>
                    <mediaList :list="item.AttachmentFiles"/>
              </el-form-item>
              <el-form-item label='整改备注：'>
                <div>{{item.Remark}}</div>
              </el-form-item>

            </template>
            <template v-if='item.PotentialOperationDesc.includes("提交")'>

              <el-form-item label='排查照片：'>
                    <mediaList :list="item.AttachmentFiles"/>
              </el-form-item>
              <el-form-item label='排查人：'>
                <div>{{item.OperationUserName}}</div>
              </el-form-item>

            </template>

            <template v-if='item.PotentialOperationDesc.includes("下发")'>

              <el-form-item label='整改负责人：'>
                <div>{{item.OperatedUserName}}</div>
              </el-form-item>
              <el-form-item label='整改期限：'>
                <div>{{item.ReformDeadlineTimeDesc}}</div>
              </el-form-item>

            </template>
            <template v-if='item.PotentialOperationDesc.includes("复查")'>

              <el-row>
                <el-row>
                  <el-col :span='24'>
                    <el-form-item label='状态：'>
                      <div>{{item.IsPass==0?'不通过':'通过'}}</div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-col :span='12'>
                  <el-form-item label='复查人：'>
                    <div>{{item.OperationUserName}}</div>
                  </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item label='复查时间：'>
                    <div>{{item.OperationDateDesc}}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if='item.IsPass'>
                <el-col :span='24'>
                  <el-form-item label="复查照片：">
                    <mediaList :list="item.AttachmentFiles"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span='24'>
                  <el-form-item :label="item.IsPass?'复查备注：':'不通过原因'">
                    <div>{{item.Remark}}</div>
                  </el-form-item>
                </el-col>
              </el-row>

            </template>

          </el-form>

        </div>
      </collapse>
    </div>

  </div>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";
import collapse from "@/plugins/coll.js";
import mediaList from '@/components/common/media-list';
export default {
  name: "",
  components: {
    collapse,
    mediaList
  },
  mixins: [request_mixin],
  data () {
    return {
      list: [],
      isActive: false,
      arr: ['整改', '复查', '下发', '提交', '重新下发', '重新整改']
    }
  },

  methods: {
    checks (index, isActive) {
      this.list[index].isActive = !isActive
    },
    getData (PotentialId) {
      this.Post('/GetPotentialOperationRecords', { PotentialId }).then(res => {
        if (res.status == 2000) {

          res.data.forEach(e => {
            e.isActive = false
            if (e.PotentialOperationDesc == '提交') {
              e.color = '#67C23A'
            } else if (e.PotentialOperationDesc == '整改') {
              e.color = '#909399'
            } else if (e.PotentialOperationDesc == '审核') {
              e.color = '#E6A23C'
            } else if (e.PotentialOperationDesc == '下发') {
              e.color = '#409EFF'
            } else if (e.PotentialOperationDesc == '复查') {
              e.color = '#F56C6C'
            } else if (e.PotentialOperationDesc == '重新整改') {
              e.color = '#909399'
            } else if (e.PotentialOperationDesc == '归档') {
              e.color = '#409EFF'
            } else if (e.PotentialOperationDesc == '重新下发') {
              e.color = '#409EFF'
            }
          });
          this.list = res.data
        }
      })
    }
  }
}
</script>
<style scoped>
.box {
  width: 95%;
  height: 60px;
  margin: 0 auto;
  border-radius: 5px;
  position: relative;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border: 1px solid #ebeef5;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-left: 30px;
}
.flag {
  position: absolute;
  right: 0;
  top: 0;
  width: 80px;
  height: 30px;
  color: #fff;
  text-align: center;
  line-height: 30px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 20px;
}
.box > img {
  position: absolute;
  left: 50%;
  bottom: 0;
}

.container {
  height: auto;
  border: 1px solid #ebeef5;
  width: 95%;
  margin: 0 auto;
  border-top: none;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  padding: 20px;
  box-sizing: border-box;
}

/deep/ .el-form-item {
  margin-bottom: 5px;
}
</style>
