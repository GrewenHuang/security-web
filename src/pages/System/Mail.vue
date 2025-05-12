<template>
    <page-layout
        :loading="loading"
        :pages="pages"
        @current-change="handleCurrentChange"
    >
        <!-- 条件栏 开始 -->
        <div slot="operation" class="f-b-c">
            <div class="input-content">
                <el-select
                    clearable
                    placeholder="类型"
                    v-model="filters.MessageType"
                >
                    <el-option
                        v-for="(item, index) in TypeCom"
                        :key="index"
                        :label="item.text"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-button type="primary" @click="handleSearch()"
                    >查询</el-button
                >
            </div>
        </div>
        <!-- 条件栏 结束 -->

        <!--列表 开始-->
        <el-table :data="list" :header-cell-style="$tableStyle">
            <el-table-column
                label="序号"
                align="center"
                header-align="center"
                type="index"
                width="60"
            >
            </el-table-column>
            <el-table-column
                prop="MessageTypeDesc"
                label="消息类型"
                align="center"
                header-align="center"
                width="200"
            >
            </el-table-column>
            <el-table-column prop="MessageContent" label="内容">
            </el-table-column>
            <el-table-column
                prop="SendDateDesc"
                align="center"
                header-align="center"
                label="推送时间"
                width="160"
            >
            </el-table-column>
            <el-table-column width="100" label="状态" align="center">
                <template slot-scope="{ row }">
                    <span class="badge" :class="{ success: row.IsRead }">{{
                        row.IsRead == 1 ? "已读" : "未读"
                    }}</span>
                </template>
            </el-table-column>

            <el-table-column
                label="操作"
                align="center"
                header-align="center"
                width="100"
            >
                <template slot-scope="scope">
                    <div class="table-operation">
                        <el-button
                            type="text"
                            @click="toUrl(scope.row.MessageType, scope.row)"
                            >查看</el-button
                        >
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 列表 结束 -->
        <!-- 班前会召开 -->
        <preShiftMeetingInfo ref="preShiftMeetingInfo" add-title="班前会召开" @load="handleSearch"/>
        <meetTableInfo ref="meetTableInfo" add-title="安全例会召开" @success="handleSearch"/>
        <enterpriseCertInfo ref="enterpriseCertInfo" edit-title="编辑企业证件" @load="handleSearch" />
        <vehicleCertInfo ref="vehicleCertInfo" edit-title="编辑车辆证件" @load="handleSearch" />
        <personnelCertInfo ref="personnelCertInfo" edit-title="编辑人员证件" @load="handleSearch" />
        <equipmentCertInfo ref="equipmentCertInfo" edit-title="编辑设备证件" @load="handleSearch" />
        <interestedPartyCerts ref="interestedPartyCerts" edit-title="相关方证件" @load="handleSearch" />
    </page-layout>
</template>
<script>
import request_mixin from "@/mixins/request-mixin.js";
import preShiftMeetingInfo from '@/pages/preShiftMeeting/info';
import meetTableInfo from '@/pages/Meeting/meetTableInfo.vue';

import enterpriseCertInfo from '@/pages/certManage/enterprise/info.vue';
import vehicleCertInfo from '@/pages/certManage/vehicle/info.vue';
import personnelCertInfo from '@/pages/certManage/personnel/info.vue';
import equipmentCertInfo from '@/pages/certManage/equipment/info.vue';
import interestedPartyCerts from '@/pages/interested-party/roster/certs';

export default {
    name: "Mail",
    components: {
        preShiftMeetingInfo,
        meetTableInfo,
        enterpriseCertInfo,
        vehicleCertInfo,
        personnelCertInfo,
        equipmentCertInfo,
        interestedPartyCerts
    },
    mixins: [request_mixin],
    data() {
        return {
            list: [],
            loading: false, //页面加载遮罩层显示状态
            pages: {
                page: 1,
                rows: 10,
                total: 0,
            },
            filters: {
                MessageType: "",
            },
            TypeCom: [], //消息类型
        };
    },
    //自定义方法
    methods: {
        toUrl(type, item) {
            let obj = {
                10: () => {
                    // 导出完成提醒
                    this.$bus.$emit("getDownloadList");
                },
                11: () => {
                    // 隐患审核
                    this.$bus.$emit("Getroute", {
                        url: "/potential/government?active=0",
                    });
                },
                12: () => {
                    // 隐患整改
                    this.$bus.$emit("Getroute", {
                        url: "/potential/government?active=1",
                    });
                },
                13: () => {
                    // 隐患超期未整改
                    this.$bus.$emit("Getroute", {
                        url: "/potential/government?active=1",
                    });
                },
                14: () => {
                    // 隐患复查
                    this.$bus.$emit("Getroute", {
                        url: "/potential/government?active=2",
                    });
                },
                15: () => {
                    // 班前会召开
                    this.$refs.preShiftMeetingInfo.show();
                },
                16: () => {
                    // 班前会参与
                    this.$alert('请进入小程序参与班前会', '提示');
                },
                17: () => {
                    // 月度安全例会召开
                    this.$refs.meetTableInfo.show()('0002303');
                },
                18: () => {
                    // 安全生产领导小组召开
                    this.$refs.meetTableInfo.show()('0002301');
                },
                19: () => {
                    // 安全例会参与
                    this.$alert('请进入小程序参与安全例会', '提示');
                },
                20: () => {
                    // 证照到期提醒
                    let infos = ['enterpriseCertInfo', 'personnelCertInfo', 'vehicleCertInfo', 'equipmentCertInfo'];
                    if (infos[item.Filed2]) {
                        this.$refs[infos[item.Filed2]].show(item, item.Filed2, item.Filed3);
                    }
                },
                21: () => {
                    // 行车日志
                    this.$bus.$emit("Getroute", {
                        url: "/Logbook",
                    });
                },
                22: () => {
                    // 培训提醒
                    this.$alert('请进入小程序参与培训', '提示');
                },
                23: () => {
                    // 风险巡查
                    this.$alert('请使用小程序进行风险巡查', '提示');
                },
                24: () => {
                    // 每日一学
                    this.$alert('请进入小程序完成每日一学', '提示');
                },
                25: () => {
                    // 体系文件上传
                    this.$bus.$emit("Getroute", {
                        url: "/Document",
                    });
                },
                26: () => {
                    // 任务管理
                    this.$bus.$emit("Getroute", {
                        url: "/taskDistribution",
                    });
                },
                28: () => {
                    // 在线签名
                    this.$alert('请进入小程序完成签名', '提示');
                },
                27: () => {
                    // 安全目标
                    this.$bus.$emit('safetyObjectives');
                },
                30: () => {
                    // 设备设施保养
                    this.$alert('请进入小程序完成设备保养', '提示');
                },
                31: () => {
                    // 设备设施超期未保养
                    this.$alert('请进入小程序完成设备保养', '提示');
                },
                32: () => {
                    // 设备设施点检
                    this.$alert('请进入小程序完成设备点检', '提示');
                },
                34: () => {
                    // 打卡提醒
                    this.$alert('请进入小程序完成每日一学的打卡', '提示');
                },
                35: () => {
                    // 相关证书到期提醒
                    this.$refs.interestedPartyCerts.show(item.Filed2);
                },
                36: () => {
                    // 安全检查
                    this.$alert('请进入小程序完成安全检查', '提示');
                }
            }
            /* 
            10：导出完成提醒；11：隐患审核；12：隐患整改；13：隐患超期未整改；14：隐患复查；15：班前会召开；
            16：班前会参与；17：月度安全例会召开；18：安全生产领导小组召开；19：安全例会参与；20：证照到期提醒；
            21：行车日志；22：培训提醒；23：风险巡查；24：每日一学；25：体系文件上传；26：任务管理；27：安全目标；
            28：在线签名；29：应急演练；30：设备设施保养；31：设备设施超期未保养；32：设备设施点检；
            33：设备设施超期未点检；34：打卡提醒；35：相关方证书到期提醒；36：安全检查
            */
            let fn = obj[type];
            if (fn) {
                fn();
            }
            // this.$bus.$emit("dialogWarningOpen"); // 原版的到期提醒弹窗
        },
        handleCurrentChange(val) {
            this.pages.page = val;
            this.GetList();
        },

        handleSearch() {
            this.GetList();
        },
        //加载列表数据
        GetList() {
            let params = Object.assign(
                {
                    page: this.pages.page,
                    rows: this.pages.rows,
                },
                this.filters
            );
            this.loading = true;
            this.Post("/GetSystemMessageRecords", params).then(
                (res) => {
                    this.loading = false;

                    if (res && res.status == 2000) {
                        this.list = res.data.list;
                        this.pages.total = res.data.count;
                    }
                },
                (err) => {
                    this.loading = false;
                    this.$message.error({
                        showClose: true,
                        message: err.toString(),
                        duration: 2000,
                    });
                }
            );
        },
    },
    //页面初始化加载事件
    mounted() {
        this.GetList();
        this.Get("/GetMessageTypeCom").then((res) => {
            if (res.status == 2000) {
                this.TypeCom = res.data;
            }
        });
    },
};
</script>
<style scoped lang="scss">
.badge {
    display: flex;
    justify-content: center;
    align-items: center;
    &::before {
        content: "";
        width: 8px;
        height: 8px;
        margin-right: 6px;
        border-radius: 8px;
        background: #f56c6c;
    }
    &.success {
        &::before {
            background: #67c23a;
        }
    }
    
}
</style>
