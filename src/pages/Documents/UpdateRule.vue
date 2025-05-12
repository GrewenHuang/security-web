<!--
 * @Description:
 * @Date: 2021-04-07 18:53:29
 * @LastEditors: ZY
 * @LastEditTime: 2021-04-07 18:53:29
 * @FilePath: \zt-traffic-enterprise-view\src\pages\Documents\UpdataRule.vue
-->
<template>
  <div>
    <el-form
        :model="parms"
        :rules="rules"
        ref='formName'
    >
        <el-form-item
            label="更新规则"
            prop="UpdateFrequency"
        >
            <el-select class="el-input" placeholder="请选择" v-model="info.UpdateFrequency" :disabled="isPreview">
                <el-option v-for="(item, index) in UpdateFrequencyCom" :key="index" :label="item.text" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            label="系统自动生成"
            prop="AssociatedForm"
            ref="AssociatedForm"
            v-if="info.UpdateFrequency != actualTimeId"
        >
            <el-select class="el-input" placeholder="请选择" v-model="info.AssociatedForm" :disabled="isPreview">
                <el-option v-for="(item, index) in AssociatedFormCom" :key="index" :label="item.text" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
      <!-- <el-form-item label="更新规则："
                    prop="UpdateFrequency">
        <el-select placeholder="请选择更新规则"
                   clearable
                   v-model="parms.UpdateFrequency"
                   @change='UpdateChange()'>
          <el-option v-for='(item,index) in UpdateFrequencyCom'
                     :key='index'
                     :label="item.text"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="季度："
                    v-if='showSelect'
                    prop="ExecutionFrequency">
        <div style='display:flex;'>
          <el-select :placeholder="item.name"
                     clearable
                     v-for='(item,index) in selectArr'
                     @change='quarterchanges($event,item.name,index)'
                     v-model='item.id'
                     :key='index'>
            <el-option :label="items.text"
                       v-for='(items,i) in item.value'
                       :key='i'
                       :value="items.id"></el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="更新方式："
                    prop="UpdateMethod">
        <el-select placeholder="请选择更新方式"
                   clearable
                   @change='MethodChange()'
                   v-model="parms.UpdateMethod">
          <el-option v-for='(item,index) in UpdateMethodCom'
                     :key='index'
                     :label="item.text"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联表单："
                    v-if='shows'
                    prop="AssociatedForm">
        <el-select placeholder="请选择关联表单"
                   clearable
                   v-model="parms.AssociatedForm">
          <el-option v-for='(item,index) in AssociatedFormCom'
                     :key='index'
                     :label="item.text"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
  </div>
</template>
<script>


import request_mixin from "@/mixins/request-mixin.js";
import RULECONFIG from "@/common/ruleConfig";
export default {
  components: {},
  mixins: [request_mixin], //page_mixin
  props: {
    FolderId: {
      type: Number
    },
    datas: {
      type: Object
    }
  },
  watch: {
    'datas': function (e) {
      let ExecutionFrequency = e.ExecutionFrequency.split(",")
      this.parms = e
      this.parms.ExecutionFrequency = ExecutionFrequency
      if (e.UpdateFrequency == 5) {
        for (let item in ExecutionFrequency) {
          this.quarter[item].id = ExecutionFrequency[item]
        }
      } else if (e.UpdateFrequency == 6) {
        for (let item in ExecutionFrequency) {
          this.yearArr[item].id = ExecutionFrequency[item]
        }
      } else if (e.UpdateFrequency == 7) {
        for (let item in ExecutionFrequency) {
          this.allyearArr[item].id = ExecutionFrequency[item]
        }
      } else if (e.UpdateFrequency == 8) {
        for (let item in ExecutionFrequency) {
          this.Holidays[item].id = ExecutionFrequency[item]
        }
      }
      this.MethodChange()
      this.UpdateChange()
    }
  },
  data () {
    return {
      UpdateFrequencyCom: [],
      UpdateMethodCom: [],
      AssociatedFormCom: [],
      showSelect: false,
      shows: true,
      parms: {
        FolderId: '', //long 必填 体系文件模板Id
        UpdateFrequency: '',// string 必填 更新频率类别
        ExecutionFrequency: [],// string 必填 更新频率表达式
        UpdateMethod: '',// int 必填 更新方式
        AssociatedForm: '',// int 必填 关联表单
      },
      selectArr: [],
      Holidays: [
        {
          name: '节假',
          id: '',
          value: []
        }
      ],
      allyearArr: [
        {
          name: '全年',
          id: '',
          value: [
            { id: '1-1', text: '一月' }, { id: '2-1', text: '二月' }, { id: '3-1', text: '三月' }, { id: '4-1', text: '四月' }, { id: '5-1', text: '五月' }, { id: '6-1', text: '六月' },
            { id: '7-1', text: '七月' }, { id: '8-1', text: '八月' }, { id: '9-1', text: '九月' }, { id: '10-1', text: '十月' }, { id: '11-1', text: '十一月' }, { id: '12-1', text: '十二月' }
          ],
        },
      ],
      yearArr: [
        {
          name: '上半季度',
          id: '',
          value: [
            { id: '1-1', text: '一月' }, { id: '2-1', text: '二月' }, { id: '3-1', text: '三月' }, { id: '4-1', text: '四月' }, { id: '5-1', text: '五月' }, { id: '6-1', text: '六月' }
          ],
        },
        {
          name: '下半季度',
          id: '',
          value: [
            { id: '7-1', text: '七月' }, { id: '8-1', text: '八月' }, { id: '9-1', text: '九月' }, { id: '10-1', text: '十月' }, { id: '11-1', text: '十一月' }, { id: '12-1', text: '十二月' }
          ],
        },
      ],
      quarter: [
        {
          name: '一季度',
          id: '',
          value: [
            { id: '1-1', text: '一月' }, { id: '2-1', text: '二月' }, { id: '3-1', text: '三月' }
          ],
        },
        {
          name: '二季度',
          id: '',
          value: [
            { id: '4-1', text: '四月' }, { id: '5-1', text: '五月' }, { id: '6-1', text: '六月' }
          ],
        },
        {
          name: '三季度',
          id: '',
          value: [
            { id: '7-1', text: '七月' }, { id: '8-1', text: '八月' }, { id: '9-1', text: '九月' }
          ],
        }, {
          name: '四季度',
          id: '',
          value: [
            { id: '10-1', text: '十月' }, { id: '11-1', text: '十一月' }, { id: '12-1', text: '十二月' }
          ]
        }
      ],
      rules: {
        UpdateFrequency: RULECONFIG.Text("更新频率类别"),
        ExecutionFrequency: RULECONFIG.Text("更新频率"),
        UpdateMethod: RULECONFIG.Text("更新方式"),
        AssociatedForm: RULECONFIG.Text("关联表单"),
      },
    };
  },
  //自定义方法
  methods: {
    submitForm (e) {
      this.$refs['formName'].validate((valid) => {
        if (valid) {
          this.parms.ExecutionFrequency = typeof this.parms.ExecutionFrequency == "object" ? this.parms.ExecutionFrequency.join(',') : this.parms.ExecutionFrequency
          this.parms.FolderId = this.FolderId
          this.Post('SetFolderUpdateRule', this.parms).then(res => {
            if (res.status == 2000) {
              this.$message({
                message: res.message,
                type: "success",
              });
              e(1)
            } else {
              this.parms.ExecutionFrequency = this.parms.ExecutionFrequency.split(',')
              this.$message({
                message: res.message,
                type: "error",
              });
            }
          })
        } else {
          return false;
        }
      });
    },
    quarterchanges (e, name, index) {
      if (this.parms.ExecutionFrequency.length == this.selectArr.length) {
        let value = this.selectArr.filter(k => {
          if (k.name == name) {
            return k
          }
        })
        this.parms.ExecutionFrequency[index] = value[0].id
      } else {
        if (e) {
          this.parms.ExecutionFrequency.push(e)
        }
      }
    },
    MethodChange () {
      if (this.parms.UpdateMethod == 2) {
        this.shows = false
      } else {
        this.shows = true
      }
    },

    UpdateChange () {
      this.ExecutionFrequency = []
      if (this.parms.UpdateFrequency == 5) {
        this.showSelect = true
        this.selectArr = this.quarter
      } else if (this.parms.UpdateFrequency == 6) {
        this.showSelect = true
        this.selectArr = this.yearArr
      } else if (this.parms.UpdateFrequency == 7) {
        this.showSelect = true
        this.selectArr = this.allyearArr
      } else if (this.parms.UpdateFrequency == 8) {
        this.showSelect = true
        this.Get('GetHolidayTimeCom').then(res => {
          if (res.status == 2000) {
            this.Holidays[0].value = res.data
            this.selectArr = this.Holidays

          }
        })

      } else {
        this.showSelect = false
      }

    },
    clearValue () {
      this.parms = {};
    },


  },
  //页面初始化加载事件
  mounted () {
    this.selectArr = this.quarter

    this.Get('GetUpdateFrequencyCom').then(res => { //获取更新规则
      if (res.status == 2000) {
        this.UpdateFrequencyCom = res.data
      }
    })

    this.Get('GetUpdateMethodCom').then(res => { // 更新方式
      if (res.status == 2000) {
        this.UpdateMethodCom = res.data
      }
    })

    this.Get('GetAssociatedFormCom').then(res => { // 更新方式
      if (res.status == 2000) {
        this.AssociatedFormCom = res.data
      }
    })
  },
};
</script>
<style scoped>
</style>