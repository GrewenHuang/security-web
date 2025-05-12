<template>
    <el-dialog v-dialog-drag  
        :title="title"
        :visible.sync="dialogFlag"
        width="1100px"
        top="6vh"
        class="choose-enterprise"
        @close="close"
    >
        <!-- 条件栏 结束 -->
        <div class="dialog-operation">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input
                        v-model="filters.EnterpriseName"
                        placeholder="公司名称"
                        clearable
                        style="min-width: 200px"
                    ></el-input>
                </el-form-item>
                <!-- <el-form-item>
                    <el-select
                        v-model="filters.IndustryCode"
                        placeholder="所属行业"
                        clearable
                        style="min-width: 200px"
                    >
                        <el-option v-for="(item, index) in industryCode" :key="index" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="handleCurrentChange(1)"
                        >查询</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    <div class="f-b">
            <!--列表 开始-->
            <div :style="{width: `calc(${!single ? '100%' : '100% - 300px'})`}">
                <el-scrollbar class="scrollbar">
                    <el-table
                        ref="chooseUser"
                        v-if="!single"
                        :data="list"
                        highlight-current-row
                        v-loading="loading"
                        style="width: 100%"
                        :cell-style="{ textAlign: 'center' }"
                        :header-cell-style="{...$tableStyle, textAlign: 'center' }"
                        @current-change="handleChooseChange"
                    >
                        <el-table-column label="序号" type="index" width="50">
                        </el-table-column>
                        <el-table-column label="所属行业" prop="IndustryName" width="180">
                        </el-table-column>
                        <el-table-column label="公司名称" prop="EnterpriseName">
                        </el-table-column>
                    </el-table>
                    <el-table
                        v-else
                        ref="chooseUser"
                        :data="list"
                        v-loading="loading"
                        style="width: 100%"
                        :cell-style="{ textAlign: 'center' }"
                        :header-cell-style="{...$tableStyle,  textAlign: 'center' }"
                    >
                        <el-table-column
                            width="55"
                        >
                            <div slot="header">
                                <el-checkbox size="mini" v-model="checkAll" :indeterminate="indeterminate" @change="chooseAll"></el-checkbox>
                            </div>
                            <template slot-scope="{ row }">
                                <el-checkbox size="mini" :value="tableCheckboxChecked(row)" @change="checkedItem(row, $event)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="序号" type="index" width="50">
                        </el-table-column>
                        <el-table-column label="所属行业" prop="IndustryName" width="180">
                        </el-table-column>
                        <el-table-column label="公司名称" prop="EnterpriseName">
                        </el-table-column>
                    </el-table>
                </el-scrollbar>
            </div>
            <!-- 列表 结束 -->
            <div class="choosed-list" v-if="single">
                <el-scrollbar class="scrollbar" ref="scrollbar">
                    <div class="content">
                        <el-table
                            :data="choosed"
                            empty-text="未选择公司"
                            :cell-style="{ textAlign: 'center' }"
                            :header-cell-style="{...$tableStyle,  textAlign: 'center' }"
                            @selection-change="handleRightSelectionChange"
                        >
                            <el-table-column
                                v-if="single"
                                type="selection"
                                width="45"
                            >
                            </el-table-column>
                            <el-table-column label="公司名称" prop="EnterpriseName" >
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
                
                <div class="f-b-c operation">
                    <div style="font-size: 12px; color: #666;">已选 {{ choosed.length }} 个</div>
                    <el-button type="text" style="padding: 0;" @click="removeChoose(rightChooseList)" :disabled="!rightChooseList.length">删除</el-button>
                </div>
            </div>
        </div>
        <div class="f-b-c">
            <div v-if="!single">
                已选：{{ choosed[0] ? choosed[0].EnterpriseName : '未选择公司' }}
            </div>
            <!--分页 开始-->
            <el-pagination
                class="dialog-pagination"
                layout="total, prev, pager, next"
                background
                @current-change="handleCurrentChange"
                :page-size="pages.rows"
                :total="pages.total"
            >
            </el-pagination>
            <!-- 分页 结束 -->
        </div>
        <div slot="footer">
            <el-button @click="close">取消</el-button>
            <el-tooltip :disabled="!!choosed.length" placement="top" content="请选择公司">
                <el-button type="primary" @click="choose" :disabled="!choosed.length">
                    确认
                </el-button>
            </el-tooltip>
        </div>
    </el-dialog>
</template>
  <script>
import request_mixin from "@/mixins/request-mixin.js";
import Qs from "qs";
import ZYselect from "@/components/common/zy_select";
import store from '@/vuex/store';
export default {
    components: {
        ZYselect,
    },
    mixins: [request_mixin],
    data() {
        return {
            list: [],
            option1: [],
            option2: [],
            loading: false,
            //查询条件
            filters: {},
            //分页
            pages: { total: 0, page: 1, rows: 10 },
            title: "选择公司",
            dialogFlag: false,
            callback: null,
            choosed: [],
            rightChooseList: [],
            single: true,
            checkAll: false,
            indeterminate: false, // 全选按钮是否显示半选样式
            isAll: 0
        };
    },
    computed: {
        industryCode() {
            return store.state.industryCode;
        },
    },
    watch: {
        choosed: {
            deep: true,
            handler() {
                this.updateCheckAll();
            }
        },
    },
    methods: {
        show(callback) {
            this.dialogFlag = true;
            this.callback = callback;
        },
        close() {
            this.dialogFlag = false;
            this.callback(false);
        },
        choose() {
            if (!this.choosed.length) {
                return this.$message.error('请选择公司');
            }
            if (typeof this.callback === 'function') {
                let list = JSON.parse(JSON.stringify(this.choosed));
                this.callback(true, this.single ? list : list[0]);
                this.dialogFlag = false;
            }
        },
        choosedScrollbarToBttom() {
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = this.$refs.scrollbar.wrap.scrollHeight;
            });
        },
        chooseAll() {
            this.removeChoose(this.list);
            if (this.checkAll){
                this.choosed.push(...this.list);
                this.choosedScrollbarToBttom();
            }
        },
        updateCheckAll() {
            let pageIds = this.list.map(item => item.EnterpriseId);
            let currentPageChoosedTotal = this.choosed.filter(item => pageIds.includes(item.EnterpriseId)).length;
            this.checkAll = currentPageChoosedTotal === this.list.length;
            this.indeterminate = currentPageChoosedTotal > 0 && !this.checkAll;
        },
        tableCheckboxChecked(row) {
            return this.choosed.some(item => item.EnterpriseId == row.EnterpriseId);
        },
        checkedItem(item, event ) {
            let index = this.choosed.map(item => item.EnterpriseId).indexOf(item.EnterpriseId);
            if (index == -1) {
                this.choosed.push(item);
            } else {
                this.choosed.splice(index, 1);
            }
        },
        handleChooseChange(val) {
            if (val) {
                this.choosed = [val];
            }
        },
        handleRightSelectionChange(val) {
            this.rightChooseList = val;
        },
        removeChoose(list) {
            if (list.length) {
                let removeIds = list.map(item => item.EnterpriseId);
                this.choosed = this.choosed.filter(u => !removeIds.includes(u.EnterpriseId));
            }
        },
        handleCurrentChange(val) {
            this.pages.page = val;
            this.getList();
        },
        async getList() {
            let params = {
                ...this.pages,
                ...this.filters,
                isAll: this.isAll
            };
            this.loading = true;
            try {
                let res = await this.Post("/GetSubEnterprisePageList", params);
                if (res.status == 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                    this.updateCheckAll();
                } else {
                    this.$message.error({
                        showClose: true,
                        message: res.message,
                        duration: 2000,
                    });
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
    },
    mounted() {
        this.handleCurrentChange(1);
    },
};
</script>
<style lang="scss" scoped>
.dialog-pagination{
    margin-top: 20px;
    text-align: center;
}
.choose-enterprise{
    /deep/ .el-dialog{
        margin-bottom: 0;
    }
    .choosed-list{
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-left: 8px;
        width: 300px;
        .content{
            padding: 0 8px;
        }
        .el-scrollbar{
            height: calc(100% - 37px);
        }
        /deep/ .scrollbar .el-scrollbar__wrap{
            height: 55vh;
        }
        .operation{
            border-top: 1px solid #ccc;
            padding: 10px 16px;
        }
    }
    /deep/ .el-table__body {
        tr.current-row > td.el-table__cell{
            background: $primary-color;
            color: #fff;
        }
    }
}
</style>
  