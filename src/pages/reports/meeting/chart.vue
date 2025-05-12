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
                <div class="content content-1">
                    <div class="header">
                        <div class="icon"></div>
                        <div class="name">班前会数</div>
                        <div class="num">{{ info.PreMeetingCount }}</div>
                    </div>
                    <div class="list" style="height: calc(100% - 80px);">
                        <div class="item item-header">
                            <div>日期</div>
                            <div>主讲人</div>
                            <div>完成率</div>
                            <div>操作</div>
                        </div>
                        <el-scrollbar style="height: calc(100% - 40px);">
                            <div class="item" v-for="(item, index) in info.PreMeetingRate" :key="index">
                                <div>{{ item.Date }}</div>
                                <div>{{ item.SpeakerName }}</div>
                                <div>{{ item.Rate }}%</div>
                                <div>
                                    <el-button type="text" @click="previewPreShiftMeeting(item)">查看</el-button>
                                </div>
                            </div>
                            <div class="no-data" v-if="!info.PreMeetingRate.length">暂无数据</div>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="content content-2">
                    <div class="header">
                        <div class="icon"></div>
                        <div class="name">安全例会数</div>
                        <div class="num">{{ info.SafetyMeetingCount }}</div>
                    </div>
                    <div class="list" style="height: calc(100% - 80px);">
                        <div class="item item-header">
                            <div>类型</div>
                            <div>安全例会名称</div>
                            <div>完成率</div>
                            <div>操作</div>
                        </div>
                        <el-scrollbar style="height: calc(100% - 40px);">
                            <div class="item" v-for="(item, index) in info.SafetyMeetingRate" :key="index">
                                <div>{{ item.SafetyMeetingType }}</div>
                                <div>{{ item.MeetingName }}</div>
                                <div>{{ item.Rate || 0}}%</div>
                                <div>
                                    <el-button type="text" @click="previewMeetTableDetail(item)">查看</el-button>
                                </div>
                            </div>
                            <div class="no-data" v-if="!info.SafetyMeetingRate.length">暂无数据</div>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="content content-3">
                    <div class="header">
                        <div class="icon"></div>
                        <div class="name">安全生产领导小组会议数</div>
                        <div class="num">{{ info.SafetyMeetingGroupCount }}</div>
                    </div>
                    <div class="list" style="height: calc(100% - 80px);">
                        <div class="item item-header">
                            <div>类型</div>
                            <div>例会名称</div>
                            <div>完成率</div>
                            <div>操作</div>
                        </div>
                        <el-scrollbar style="height: calc(100% - 40px);">
                            <div class="item" v-for="(item, index) in info.SafetyMeetingGroupRate" :key="index">
                                <div>{{ item.SafetyMeetingType }}</div>
                                <div>{{ item.MeetingName }}</div>
                                <div>{{ item.Rate || 0}}%</div>
                                <div>
                                    <el-button type="text" @click="previewMeetTableDetail(item)">查看</el-button>
                                </div>
                            </div>
                            <div class="no-data" v-if="!info.SafetyMeetingGroupRate.length">暂无数据</div>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
            <div class="card row-3">
                <div class="title">年度例会报表</div>
                <div class="card-content">
                    <bar :value="info.MeetingYears" :loading="loading"/>
                </div>
            </div>
        </div>
        <preShiftMeeting ref="preShiftMeeting" />
        <meet-table-detail ref="meetTableDetail" />
    </div>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import bar from '../components/bar';
import { Pdf } from '@/plugins/htmlToPdf';
import preShiftMeeting from '@/pages/preShiftMeeting/preview';
import MeetTableDetail from '@/pages/Meeting/meetTableDetail.vue';
export default {
    components: {
        bar,
        preShiftMeeting,
        MeetTableDetail
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
                Pdf.downPdf(this.$refs.chart, this.filters.year + '年例会统计').then(res => {
                    setTimeout(() => {
                        loading.close();
                    }, 1000);
                });
            })
        },
        async getData() {
            this.loading = true;
            let res = await this.Get(`/GetMeetingReport?year=${this.filters.year}&isSubEnterprise=0`);
            if (res.status == 2000) {
                res.data.MeetingYears = res.data.MeetingYears.map(item => {
                    return {
                        name: item.Name,
                        value: item.Count
                    };
                })
                this.info = res.data;
                this.loading = false;
            }
        },
        previewPreShiftMeeting(item) {
            item.PreMeetingSignId = item.MeetingId;
            this.$refs.preShiftMeeting.show(item);
        },
        async previewMeetTableDetail(item) {
            let res = await this.Post('/GetSafetyMeeting?type=1&id=' + item.MeetingId);
            this.$refs.meetTableDetail.show(res.data);
        },
    }
}
</script>

<style lang="scss" scoped>
.chart{
    border-radius: 0 10px 10px 10px;
    padding: 15px;
    height: 100%;
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
    height: 100%;
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
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 50%;
    height: 100%;
}
.row-3{
    grid-column-start: 1;
    grid-column-end: 4;
}
.content{
    padding: 12px;
    height: 100%;
    &.content-1{
        .header{
            background: #EEF0FC;
            .icon{
                background-image: url('../../../../static/reports/icon9.png');
            }
            .num{
                color: #5B6CD5;
            }
        }
    }
    &.content-2{
        .header{
            background: #EAF2FF;
            .icon{
                background-image: url('../../../../static/reports/icon10.png');
            }
            .num{
                color: #004BFF;
            }
        }
        .item{
            grid-template-columns: 90px 1fr 90px 90px;
        }
    }
    &.content-3{
        .header{
            background: #FFF8E7;
            .icon{
                background-image: url('../../../../static/reports/icon11.png');
            }
            .num{
                color: #FE912E;
            }
        }
        .item{
            grid-template-columns: 90px 1fr 90px 90px;
        }
    }
    .header{
        display: flex;
        align-items: center;
        border-radius: 6px;
        margin-bottom: 10px;
        padding: 19px 33px;
        .icon{
            margin-right: 15px;
            width: 31px;
            height: 31px;
            background: no-repeat center center;
            background-size: 100%;
        }
        .name{
            flex: 1;
            font-size: 16px;
        }
        .num{
            font-size: 28px;
            font-weight: 600; 
        }
    }
}
.list{
    .item{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        align-items: center;
        min-height: 40px;
        text-align: center;
        &.item-header{
            border-radius: 6px;
            background: #f8f8f8;
            font-weight: 600;
        }
        &:not(.item-header){
            border-bottom: 1px solid #F1F1F1;
        }
    }
}
.no-data{
    padding-top: 50px;
    text-align: center;
    color: #999;
}
</style>
