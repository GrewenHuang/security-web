<template>
    <div class="chart" ref="chart" v-loading="loading">
        <div slot="header" class="custom-operation">
            <el-date-picker
                type="year"
                placeholder="选择年"
                align="center"
                prefix-icon=""
                :clearable="false"
                :editable="false"
                value-format="yyyy"
                v-model="filters.year"
                @change="getData"
            >
            </el-date-picker>
            <el-button type="primary" @click="exportPDF">导出</el-button>
        </div>
        <div class="grid">
            <div class="card">
                <div class="title">岗前培训</div>
                <div class="card-content">
                    <pie :value="info.PreProportions" :color="['#5292FF', '#FE706E']" :loading="loading"/>
                </div>
            </div>
            <div class="card">
                <div class="title">再教育培训</div>
                <div class="card-content">
                    <bar :value="info.TrainTaskYears" :color="['#5292FF', '#3FD2C1']" :loading="loading"/>
                </div>
            </div>
            <div class="card row-2">
                <div class="content">
                    <div class="custom-table">
                        <div class="item header">
                            <div>序号</div>
                            <div>培训类型</div>
                            <div>培训名称</div>
                            <div>计划人数</div>
                            <div>完成人数</div>
                            <div>完成率</div>
                            <div>操作</div>
                        </div>
                        <div class="item" v-for="(item, index) in info.TrainList" :key="index">
                            <div>{{ index + 1 }}</div>
                            <div>{{ item.TrainTypeName }}</div>
                            <div>{{ item.TrainTaskName }}</div>
                            <div>{{ item.PlanUserCount }}</div>
                            <div>{{ item.PlanUserCompleteCount }}</div>
                            <div>{{ item.CompleteRate }}%</div>
                            <div>
                                <el-button type="text" @click="preview(item)">查看</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <preview ref="preview" disabled/>
    </div>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import bar from '../components/barLine';
import pie from '../components/pie-1';
import { Pdf } from '@/plugins/htmlToPdf';
import preview from '@/pages/Education/trainTaskInfo'
export default {
    components: {
        bar,
        pie,
        preview
    },
    mixins: [request_mixins],
    data() {
        return {
            loading: false,
            filters: {
                year: new Date().getFullYear() + ''
            },
            info: {
                MeetingYears: [],
                PreMeetingRate: [],
                SafetyMeetingRate: [],
                SafetyMeetingGroupRate: []
            },
        }
    },
    created() {
        this.getData();
    },
    methods: {
        exportPDF () {
            const loading = this.$loading({
                lock: true,
                text: '正在导出中，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, .3)'
            });
            this.$nextTick(() => {
                Pdf.downPdf(this.$refs.chart, this.filters.year + '年培训统计').then(res => {
                    setTimeout(() => {
                        loading.close();
                    }, 1000);
                });
            })
        },
        async getData() {
            this.loading = true;
            let res = await this.Get(`/GetTrainTaskReport?year=${this.filters.year}&isSubEnterprise=0`);
            if (res.status == 2000) {
                res.data.TrainTaskYears = res.data.TrainTaskYears.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        type: index === 0 ? 'bar' : 'line'
                    };
                })
                res.data.PreProportions = res.data.PreProportions.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate
                    };
                })
                this.info = res.data;
                this.loading = false;
            }
        },
        preview(item) {
            this.$refs.preview.show(item.TrainTaskId);
        }
    }
}
</script>

<style lang="scss" scoped>
.chart{
    border-radius: 0 10px 10px 10px;
    padding: 15px;
    min-height: 100%;
    background: #fff;
    /deep/ .el-scrollbar__wrap{
        overflow-x: hidden;
    }
}
.custom-operation{
    position: absolute;
    top: -6.25%;
    right: 0;
    /deep/ .el-date-editor{
        width: 120px;
    }
}
.card{
    border: 1px solid #EEEEEE;
    border-radius: 10px;
    min-height: 100%;
    .title{
        display: flex;
        align-items: center;
        border-bottom: 1px solid #EEEEEE;
        padding: 17px 18px 16px;
        font-size: 16px;
        font-weight: 600;
        &::before{
            content: '';
            margin-right: 9px;
            width: 6px;
            height: 15px;
            background: $__color-primary;
        }
    }
    .card-content{
        height: calc(100% - 55px);
    }
}
.grid{
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 300px auto;
    min-height: 100%;
}
.row-2{
    grid-column-start: 1;
    grid-column-end: 3;
}
.no-data{
    padding-top: 50px;
    text-align: center;
    color: #999;
}
.content{
    padding: 13px 16px;
    min-height: 200px;
    .custom-table{
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
        height: 100%;
        .header{
            background: #f8f8f8; 
        }
        .item{
            display: grid; 
            grid-template-columns: 70px 180px 1fr 130px 130px 130px 110px;
            align-items: center;
            text-align: center;
            >div{
                border-right: 1px solid #eee;
                border-bottom: 1px solid #eee;
                padding: 15px;
                .el-button{
                    padding: 0;
                }
            }
        }
    }
}
</style>