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
                <div class="sign">
                    <div class="item item-1">
                        <div class="icon"></div>
                        <div class="name">年度计划投入（万元）</div>
                        <div class="num"><span class="yen">¥</span>{{ info.InvestmentMoney }}</div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="sign">
                    <div class="item item-2">
                        <div class="icon"></div>
                        <div class="name">年度提取金额（万元）</div>
                        <div class="num"><span class="yen">¥</span>{{ info.ExpenditureMoney }}</div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="sign">
                    <div class="item item-3">
                        <div class="icon"></div>
                        <div class="name">年度结余金额（万元）</div>
                        <div class="num"><span class="yen">¥</span>{{ info.BalanceMoney }}</div>
                    </div>
                </div>
            </div>
            <div class="card row-3">
                <div class="title">年度提取统计（万元）</div>
                <div class="card-content">
                    <bar :value="info.FundingPlanYears" :barWidth="60" :loading="loading"/>
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
    filters: {
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
                Pdf.downPdf(this.$refs.chart, this.filters.year + '年安全投入统计').then(res => {
                    setTimeout(() => {
                        loading.close();
                    }, 1000);
                });
            })
        },
        async getData() {
            this.loading = true;
            let res = await this.Get(`/GetFundingPlanReport1?year=${this.filters.year}&isSubEnterprise=0`);
            if (res.status == 2000) {
                res.data.FundingPlanYears = res.data.FundingPlanYears.map(item => {
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
    grid-template-rows: 125px 1fr;
    height: 100%;
}
.row-3{
    grid-column-start: 1;
    grid-column-end: 4;
}
.sign{
    display: grid;
    grid-row-gap: 20px;
    padding: 25px;
    height: 100%;
    .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 6px;
        padding: 30px;
        background: #F6F7F9;
        .icon{
            margin-right: 10px;
            width: 23px;
            height: 23px;
            background: no-repeat center center;
            background-size: 100%;
        }
        &.item-1{
            .icon{
                background-image: url('../../../../static/reports/icon19.png');
            }
        }
        &.item-2{
            .icon{
                background-image: url('../../../../static/reports/icon20.png');
            }
        }
        &.item-3{
            .icon{
                background-image: url('../../../../static/reports/icon21.png');
            }
        }
        .name{
            flex: 1;
        }
        .num{
            font-size: 23px;
            font-weight: 600;
            color: #FE912E;
            .yen{
                margin-right: 5px;
                font-size: 16px;
            }
        }
    }

}
</style>