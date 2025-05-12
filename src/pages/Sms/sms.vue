<template>
    <page-layout :loading="listLoading">
            <div slot="operation" class="f--c">
                <div style="font-size:14px;">短信累计充值<b style="padding:0 3px;color:#09558f;">{{MessageFinance.TotalNum}}</b>条&thinsp;&thinsp;&thinsp;&thinsp;剩余<b style="padding:0 3px;color:#F56C6C;">{{MessageFinance.RemainNum}}</b>条</div>
            </div>
            <el-table :data="list"
                :header-cell-style="$tableStyle"
            >
                <el-table-column label="序号"
                    align="center"
                    header-align="center"
                    type="index"
                    width="60"
                ></el-table-column>
                <el-table-column label="消息类型"
                    prop="MessageTypeDesc"
                    align="center"
                    width="250"
                ></el-table-column>
                <el-table-column label="站内信推送"
                    align="center"
                    width="160"
                >
                    <template slot-scope="{row}">
                        <el-switch v-model="row.PC"
                            @change="OpenPCMessage($event,row.MessageType)"
                            active-text="开启"
                            :active-value='1'
                            :inactive-value='0'
                            inactive-text="关闭"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="公众号推送"
                    align="center"
                    width="160"
                >
                    <template slot-scope="{row}">
                        <el-switch v-model="row.MiniProgram"
                            @change="OpenMiniProgram($event,row.MessageType)"
                            active-text="开启"
                            :active-value='1'
                            :inactive-value='0'
                            inactive-text="关闭"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="短信推送"
                    align="center"
                    width="160"
                >
                    <template slot-scope="{row}">
                        <el-switch v-model="row.SMS"
                            @change="OpenSMS($event,row.MessageType)"
                            active-text="开启"
                            :active-value='1'
                            :inactive-value='0'
                            inactive-text="关闭"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="推送人员"
                    align="center"
                    prop="text"
                >
                    <template slot-scope="{row}">
                        {{(row.PushUsers || []).map(item => item.UserName).join('，') || '/'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"
                    width="100"
                    align="center"
                    header-align="center"
                >
                    <template slot-scope="{row}" v-if="!row.IsSpecificUser">
                        <el-button type="text" @click="showSms(row.MessageType, row)">
                            选择推送人员
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--弹层开始-->
            <el-dialog v-dialog-drag  title="推送"
                    :visible.sync="addShow"
                    :close-on-click-modal="false"
                    width="40%">
                <el-form>
                    <el-form-item label='人员'>
                        <choose-user class="el-input" v-model="parms.UserIds" :single="false"/>
                    </el-form-item>
                </el-form>
            <div slot="footer"
                class="dialog-footer">
                <el-button @click.native="addShow = false">取消</el-button>
                <el-button type="primary"
                        @click.native="pushSms()"
                        :loading="btnloading">提交</el-button>
            </div>
            </el-dialog>
            <!--弹层结束-->
    </page-layout>
</template>


<script>
import request_mixin from "@/mixins/request-mixin.js";
export default {
  name: "list",

  mixins: [request_mixin],
  data () {
    return {
      list: [],
      CheckUsers: [],
      Users: [],
      addShow: false,
      btnloading: false,
      parms: {
        MessageType: '',
        PositionIds: [],
        UserIds: [],
      },
      MessageFinance:{
        TotalNum:0,
        RemainNum:0,
      },
      listLoading: false, // 列表加载 loading
    };
  },
  methods: {
    OpenPCMessage (e, MessageType) {
      this.Post('/OpenPC', {
        MessageType, PC: e
      }).then(res => {
        if (res.status == 2000) {
          this.getList()
        }
      })
    },
    OpenSMS (e, MessageType) {
      this.Post('/OpenSMS', {
        MessageType, SMS: e
      }).then(res => {
        if (res.status == 2000) {
          this.getList()
        }
      })
    },
    OpenMiniProgram (e, MessageType) {
      this.Post('/OpenMiniProgram', {
        MessageType, MiniProgram: e
      }).then(res => {
        if (res.status == 2000) {
          this.getList()
        }
      })
    },
    showSms (id, item) {
      this.addShow = true
      this.parms.MessageType = id
      this.parms.UserIds = item.PushUsers.map(cItem => {
        return {
            UserId: cItem.RelationId,
            UserName: cItem.UserName
        }
      });
    },
    getList () {
      this.listLoading = true;
      this.Post('/GetMessageTemplates', {
        page: 1, rows: 100
      }).then(res => {
        if (res.status == 2000) {
          if (res.data.list && res.data.list.length) {
            this.list = res.data.list
          }
        }
        this.listLoading = false;
      })
    },
    setCascaderDisableds (cityOptions) {
      let options
      options = cityOptions.map(item => {
        item.disabled = true
        item.children.forEach(res => {
          res.disabled = true
        })
        return item
      })
      return options
    },

    pushSms () {
      this.btnloading = true
      let params = {
        ...this.parms
      };
      params.UserIds = params.UserIds.map(item => item.UserId);
      this.Post('/SaveMessageTemplatePushObject', params).then(res => {
        this.btnloading = false
        this.getList () ;
        this.addShow = false
      })

    }
  },
  mounted () {
    this.getList()
    this.Get("GetMessageFinance").then(res => {
      if (res.status == 2000) {
        this.MessageFinance = res.data
      }
    })
  },
}
</script>

<style scoped>
.box-card {
  width: 49%;
  margin: 10px auto;
}

/deep/ .el-cascader {
  display: inline-block;
  position: relative;
  font-size: 14px;
  line-height: 40px;
  width: 100%;
}
</style>