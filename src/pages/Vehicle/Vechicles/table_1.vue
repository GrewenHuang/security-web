<template>
  <div style="padding-top:2px;padding-bottom:20px;">

    <table
           class='table'
           cellpadding="10"
           cellspacing="0">
      <tr style='width:100%'>
        <td style='width:5%'
            rowspan="10">基本情况</td>
        <td colspan="5"
            style='width:65%;'>车辆号牌信息</td>
        <td style='width:30%'
            rowspan="10">
          <el-upload :action="url()"
                     :accept="upload.image_suffix"
                     :show-file-list="false"
                     :before-upload="before"
                     :on-change="
                (file, fileList) => {
                  change(file, 1);
                }
              "
                     :before-remove="
                (file, fileList) => {
                  return before_remove(file, 1);
                }
              "
                     :file-list="arrFilesFun(1)"
                     :on-preview="preview">

            <img v-if="imageUrl"
                 :src="imageUrl"
                 style='width:300px;height:300px'>
            <i v-else
               class="el-icon-plus avatar-uploader-icon"
               style='font-size:40px'></i>
          </el-upload>
          <div>上传初次或变更《道路运输证》时，车辆正面偏右侧45度角的彩色照片</div>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:13%'></td>
        <td style='width:13%;'>车牌号</td>
        <td style='width:13%'>颜色</td>
        <td style='width:26%'
            colspan="2">注册(变更)日期</td>
      </tr>
      <tr style='width:100%'>
        <td style='width:13%'>牌号首次核发</td>
        <td style='width:13%;'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field101"></el-input>
        </td>
        <td style='width:13%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field102"></el-input>
        </td>
        <td style='width:26%'
            colspan="2">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="info.Field103"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:13%'>牌号变更1</td>
        <td style='width:13%;'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field104"></el-input>
        </td>
        <td style='width:13%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field105"></el-input>
        </td>
        <td style='width:26%'
            colspan="2">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="info.Field106"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:13%'>牌号变更2</td>
        <td style='width:13%;'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field107"></el-input>
        </td>
        <td style='width:13%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field108"></el-input>
        </td>
        <td style='width:26%'
            colspan="2">
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="info.Field109"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:100%'
            colspan="5">业户信息</td>
      </tr>
      <tr style='width:100%'>
        <td style='width:13%'></td>
        <td style='width:13%;'>车主名称</td>
        <td style='width:13%'>道路运输证号</td>
        <td style='width:13%'>经营范围</td>
        <td style='width:13%'>变更日期</td>
      </tr>
      <tr style='width:100%'>
        <td style='width:13%'>初次登记</td>
        <td style='width:13%;'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field201"></el-input>
        </td>
        <td style='width:13%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field202"></el-input>
        </td>
        <td style='width:13%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field203"></el-input>
        </td>
        <td style='width:13%'>
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="info.Field204"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:13%'>名称变更1</td>
        <td style='width:13%;'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field205"></el-input>
        </td>
        <td style='width:13%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field206"></el-input>
        </td>
        <td style='width:13%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field207"></el-input>
        </td>
        <td style='width:13%'>
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="info.Field208"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:13%'>名称变更2</td>
        <td style='width:13%;'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field209"></el-input>
        </td>
        <td style='width:13%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field210"></el-input>
        </td>
        <td style='width:13%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field211"></el-input>
        </td>
        <td style='width:13%'>
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="info.Field212"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </td>
      </tr>
    </table>
    <table class='table'
           cellpadding="10"
           cellspacing="0">
      <tr style='width:100%'>
        <td rowspan="11"
            style='width:5%;'
            normal="normal">车辆配置及主要技术参数</td>
        <td style='width:15%'>车辆类型</td>
        <td style='width:15%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field301"></el-input>
        </td>
        <td style='width:15%'>厂牌型号</td>
        <td style='width:15%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field302"></el-input>
        </td>
        <td style='width:15%'>制造厂名</td>
        <td style='width:15%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field303"></el-input>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:15.8%'>出厂日期</td>
        <td style='width:15.8%'>
          <el-date-picker type="date"
                          placeholder="选择日期"
                          v-model="info.Field304"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </td>
        <td style='width:15.8%'>国产/进口</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field305"></el-input>
        </td>
        <td style='width:15.8%'>VIN(或车架号)</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field306"></el-input>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:15.8%'>底盘型号</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field307"></el-input>
        </td>
        <td style='width:15.8%'>车辆外廓尺寸</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field308"></el-input>
        </td>
        <td style='width:15.8%'>货箱内尺寸或容积</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field309"></el-input>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:15.8%'>总质量</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field310"></el-input>
        </td>
        <td style='width:15.8%'>整备质量</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field311"></el-input>
        </td>
        <td style='width:15.8%'>准牵引质量</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field312"></el-input>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:15.8%'>核定载质量</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field313"></el-input>
        </td>
        <td style='width:15.8%'>核定载客</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field314"></el-input>
        </td>
        <td style='width:15.8%'>发动机型号</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field315"></el-input>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:15.8%'>发动机号码</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field316"></el-input>
        </td>
        <td style='width:15.8%'>发动机排量</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field317"></el-input>
        </td>
        <td style='width:15.8%'>发动机净功率</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field318"></el-input>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:15.8%'>排放标准</td>
        <td style='width:15.8%'>
          <el-select placeholder="请选择"
                     v-model="info.Field319">
            <el-option label="国III"
                       value="国III">
            </el-option>
            <el-option label="国IV"
                       value="国IV">
            </el-option>
            <el-option label="国V"
                       value="国V">
            </el-option>
            <el-option label="国VI"
                       value="国VI">
            </el-option>
            <el-option label="其它标准"
                       value="其它标准">
            </el-option>
          </el-select>
        </td>
        <td style='width:15.8%'>电池类型</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field320"></el-input>
        </td>
        <td style='width:15.8%'>驱动电机型号</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field321"></el-input>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:15.8%'>电机功率</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field322"></el-input>
        </td>
        <td style='width:15.8%'>动力类型</td>
        <td style='width:15.8%'>
          <el-select placeholder="请选择"
                     v-model="info.Field323">
            <el-option label="柴油"
                       value="柴油">
            </el-option>
            <el-option label="汽油"
                       value="汽油">
            </el-option>
            <el-option label="纯电动"
                       value="纯电动">
            </el-option>
            <el-option label="LNG"
                       value="LNG">
            </el-option>
            <el-option label="CNG"
                       value="CNG">
            </el-option>
            <el-option label="LPG"
                       value="LPG">
            </el-option>
            <el-option label="其它类型"
                       value="其它类型">
            </el-option>
          </el-select>
        </td>
        <td style='width:15.8%'>轴距(轮距)</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field324"></el-input>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:15.8%'>车轴数/驱动轴数</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field325"></el-input>
        </td>
        <td style='width:15.8%'>轮胎数/规格</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field326"></el-input>
        </td>
        <td style='width:15.8%'>行车制动方式</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field327"></el-input>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:15.8%'>制动器型式</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field328"></el-input>
        </td>
        <td style='width:15.8%'>气压制动.ABS</td>
        <td style='width:15.8%'>
          <el-radio-group v-model="info.Field329">
            <el-radio label="1">有</el-radio>
            <el-radio label="0">无</el-radio>
          </el-radio-group>
        </td>
        <td style='width:15.8%'>变速器型式</td>
        <td style='width:15.8%'>
          <el-input placeholder="请输入内容"
                    v-model="info.Field330"></el-input>
        </td>
      </tr>
      <tr style='width:100%'>
        <td style='width:15.8%'>缓速器</td>
        <td style='width:15.8%'>
          <el-radio-group v-model="info.Field331">
            <el-radio label="1">有</el-radio>
            <el-radio label="0">无</el-radio>
          </el-radio-group>
        </td>
        <td style='width:15.8%'>空调系统</td>
        <td style='width:15.8%'>
          <el-radio-group v-model="info.Field332">
            <el-radio label="1">有</el-radio>
            <el-radio label="0">无</el-radio>
          </el-radio-group>
        </td>
        <td style='width:15.8%'>卫星定位装置</td>
        <td style='width:15.8%'>
          <el-radio-group v-model="info.Field333">
            <el-radio label="1">有</el-radio>
            <el-radio label="0">无</el-radio>
          </el-radio-group>
        </td>
      </tr>
      <tr>
        <td>备注</td>
        <td colspan="6">
          <el-input type="textarea"
                    v-model="info.Field334"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="7" style="text-align:left; padding:10px;line-height:24px;">
          注1：货箱内尺寸或容积。普通栏板车、厢式车、仓栅车、自卸车等填写货箱内尺寸，罐式车填写容积。<br />
          注2：电池类型、驱动电机型号和电机功率。纯电动汽车填写，其它车辆不用填写。<br />
          注3：排放标准。指国III、国IV、国V、国VI或其它标准，纯电动车不用填写。<br />
          注4：动力类型。指汽油、柴油、纯电动、液化天然气(LNG)，压缩天然气(CNG)、液化石油汽(LPG)或其它。<br />
          注5：请填写或选择有关信息
        </td>
      </tr>
    </table>

  </div>
</template>
<script>
import upload_mixin from "@/mixins/upload-mixin.js";
import request_mixin from "@/mixins/request-mixin.js";
export default {
  mixins: [upload_mixin, request_mixin],
  props: {
    id: {
      type: Number,
    },
    datas: {
      type: Object
    }
  },
  watch: {
  },
  data () {
    return {
      info: {
        Field101: '',
        Field102: '',
        Field103: '',
        Field104: '',
        Field105: '',
        Field106: '',
        Field107: '',
        Field108: '',
        Field109: '',
        Field201: '',
        Field202: '',
        Field203: '',
        Field204: '',
        Field205: '',
        Field206: '',
        Field207: '',
        Field208: '',
        Field209: '',
        Field210: '',
        Field211: '',
        Field212: '',
        Field301: '',
        Field302: '',
        Field303: '',
        Field304: '',
        Field305: '',
        Field306: '',
        Field307: '',
        Field308: '',
        Field309: '',
        Field310: '',
        Field311: '',
        Field313: '',
        Field314: '',
        Field315: '',
        Field316: '',
        Field317: '',
        Field318: '',
        Field319: '',
        Field320: '',
        Field321: '',
        Field322: '',
        Field323: '',
        Field324: '',
        Field325: '',
        Field326: '',
        Field327: '',
        Field328: '',
        Field329: '',
        Field330: '',
        Field331: '',
        Field332: '',
        Field333: '',
        Field334: '',
      },
      imageUrl: '',
    }
  },
  created () {
    var that = this;
    that.upload.arrFiles = [[], [], [], [], []];

  },


  methods: {
    submits () {
      let imgs = JSON.parse(JSON.stringify(this.upload.arrFiles[1]));
      if (imgs.length) {
        let img = imgs[imgs.length - 1];
        imgs = [img]
      }
      this.Post('/SaveTechnicalArchives', {
        VehicleId: this.id,
        ...this.info,
        VehicleFiles: imgs
      }).then(res => {
        if (res.status == 2000) {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        }
      })
    },
    reset() {
        this.upload.arrFiles = [[], [], [], [], []];
    },
    show() {
        this.info = this.datas;
        if (this.info.VehicleFiles && this.info.VehicleFiles.length > 0) {
            this.imageUrl = this.info.VehicleFiles[0].url
            this.upload.arrFiles[1] = this.info.VehicleFiles;
        } else {
            this.imageUrl = ''
        }
    }
  }
}
</script>
<style scoped>
.el-select{
    width: 100%;
}
.table {
  width: 100%;
  height: auto;
  text-align: center;
}
.table{
  width: 100%;
  border-top: 1px #999 solid;
  border-left: 1px #999 solid;
}
.table td{
  border-bottom: 1px #999 solid;
  border-right: 1px #999 solid;
  height: 40px;
}

/deep/ .el-input__inner {
  border: none !important;
}

/deep/ .el-upload {
  width: 300px;
  height: 300px;
  line-height: 300px;
}
</style>
