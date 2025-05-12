<template>
    <div class="f job-setting">
        <div class="side">
            <el-input placeholder="搜索作业类型" clearable suffix-icon="el-icon-search" v-model="filters.name" @change="sreach()"></el-input>
            <el-scrollbar class="el-scrollbar" ref="sideScrollbar">
                <div class="side-item" v-for="(item, index) in list" :key="index" :class="{active: item.JobTemplateId == typeActive}" :ref="item.Name" @click="chooseType(item.JobTemplateId, item)">
                    <div class="title" v-html="item.textHtml"></div>
                    <div class="operation" v-if="item.IsSystem != 1">
                        <el-button type="text" icon="el-icon-edit" @click.stop="add(item)"></el-button>
                        <el-button type="text" icon="el-icon-delete" @click.stop="remove(item)"></el-button>
                    </div>
                    <div class="active-dot"></div>
                </div>
            </el-scrollbar>
            <el-button type="primary" plain @click="add()">新增</el-button>
        </div>
        <div class="content">
            <el-tabs type="border-card" v-model="currentTab">
                <el-tab-pane v-for="(item, index) in tabs" :key="index" :lazy="true" :label="item.title" :name="item.title">
                    <component
                        :is="item.url"
                        :jobTemplateId="typeActive"
                        :approvals="currentJob.approvals"
                        v-if="item.title == currentTab">
                    </component>
                </el-tab-pane>
            </el-tabs>
        </div>
        <info ref="info" @load="getList"/>
    </div>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import info from './info';
export default {
    components: {
        info
    },
    mixins: [request_mixins],
    data() {
        return {
            loading: false,
            list: [],
            typeActive: 1,
            currentJob: {},
            filters: {
                name: ''
            },
            tabs: [
                {
                    title: '安全措施',
                    url: () => import("@/pages/jobManage/setting/safetyMeasures")
                },
                {
                    title: '过程监督',
                    url: () => import("@/pages/jobManage/setting/processInspection")
                },
                {
                    title: '作业流程 ',
                    url: () => import("@/pages/jobManage/setting/flow")
                },
            ],
            currentTab: '安全措施',
        }
    },
    created() {
        this.getList(1);
    },
    methods: {
        async getList() {
            let params = {
                ...this.filters,
            }
            this.loading = true;
            try {
                let res = await this.Get('/GetJobTemplateList', params);
                if (res.status === 2000) {
                    this.list = res.data.map(item => {
                        return {
                            ...item,
                            approvals: JSON.parse(item.ApprovalsJson),
                            textHtml: item.Name
                        }
                    });
                    this.active = this.list[0].JobTemplateId;
                    this.currentJob = this.list[0];
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        add(item) {
            this.$refs.info.show(item)
        },
        remove(row) {
            let id = row.JobTemplateId;
            this.$confirm('确认删除该条数据吗？').then((_) => {
                this.Post('/DeleteJobTemplate', {
                    Ids: [id],
                }).then((res) => {
                    if (res.status == 2000) {
                        if (id == this.typeActive) {
                            this.typeActive = this.list[0].JobTemplateId;
                            this.currentJob = this.list[0];
                        }
                        this.getList();
                        this.$message({
                            message: '删除成功！',
                            type: 'success',
                        });
                    } else {
                        this.$message.error(res.message);
                    }
                });
            });
        },
        sreach() {
            this.list.forEach(item => {
                item.textHtml = item.Name;
            })
            let item = this.list.find(item => item.Name.indexOf(this.filters.name) != -1);
            if (item) {
                this.$refs.sideScrollbar.wrap.scrollTop = this.$refs[item.Name][0].offsetTop;
                this.list.filter(itme => item.Name.indexOf(this.filters.name) != -1).forEach(item => {
                    item.textHtml = item.Name.replace(new RegExp(`(${this.filters.name})`), '<span class="highlight">$1</span>')
                })
            }
        },
        chooseType(index, item) {
            this.typeActive = index;
            this.currentJob = item;
        }
    }
}
</script>

<style lang="scss" scoped>
.job-setting{
    height: 100%;
    min-height: 150px;
    .side, .content{
        height: 100%;
    }
    .side{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 15px;
        padding: 20px 18px;
        border-radius: 10px;
        width: 300px;
        background: #fff;
        .el-scrollbar{
            flex: 1;
            margin: 20px 0 10px;
            /deep/ .el-scrollbar__wrap{
                overflow-x: hidden;
            }
        }
        .side-item{
            display: flex;
            border-radius: 6px;
            border: 1px solid #F3F3F3;
            padding: 0 15px;
            height: 45px;
            line-height: 45px;
            cursor: pointer;
            &:not(:last-child){
                margin-bottom: 2px;
            }
            .title{
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            &.active {
                border-color: $__color-primary;
                color: $__color-primary;
                .active-dot{
                    margin: auto 0;
                    border-radius: 8px;
                    width: 8px;
                    height: 8px;
                    background: $__color-primary;
                }
            }
            /deep/ .highlight{
                color: $__color-primary;
            }
        }
        .el-button.is-plain{
            border-style: dashed;
        }
        .operation + .active-dot{
            display: none;
        }
    }
    .content{
        flex: 1;
        min-width: 400px;
        /deep/ .el-tabs{
            height: 100%;
            background: transparent;
            border: 0;
            box-shadow: none;
            .el-tabs__content{
                border-radius: 0 10px 10px 10px;
                padding: 0;
                height: calc(100% - 49px);
                .el-tab-pane{
                    height: 100%;
                }
            }
            .operation-content{
                border-top-left-radius: 0 !important;
            }
            .el-tabs__header{
                background: transparent;
                border: 0;
                .el-tabs__item{
                    border: 0;
                    border-radius: 10px 10px 0 0;
                    margin-right: 5px;
                    padding: 0 38px !important;
                    height: 50px;
                    line-height: 50px;
                    background: #ebedf3;
                    &.is-active,
                    &:hover{
                        border: 0;
                        background: #fff;
                    }
                    &.is-active{
                        position: relative;
                        &::after{
                            content: '';
                            position: absolute;
                            bottom: 6px;
                            left: 50%;
                            transform: translateX(-50%);
                            border: 4px solid transparent;
                            border-bottom: 0;
                            border-left-width: 5.5px;
                            border-right-width: 5.5px;
                            border-top-color: $primary-color;
                            width: 0;
                            height: 0;
                        }
                    }
                }
            }
            
        }
    }
}
</style>
