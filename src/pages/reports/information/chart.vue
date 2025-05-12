<template>
    <div class="chart" ref="chart" v-loading="loading">
        <div slot="header" class="custom-operation">
            <el-button type="primary" @click="exportPDF">导出</el-button>
        </div>
        <div class="grid">
            <div class="card">
                <div class="title">企业</div>
                <div class="card-content">
                    <bar :value="info.Enterprises" :loading="loading"/>
                </div>
            </div>
            <div class="card">
                <div class="title">人员</div>
                <div class="card-content">
                    <bar :value="info.Users" :loading="loading"/>
                </div>
            </div>
            <div class="card">
                <div class="title">车辆</div>
                <div class="card-content">
                    <bar :value="info.Vehicles" :loading="loading"/>
                </div>
            </div>
            <div class="card">
                <div class="title">设备设施</div>
                <div class="card-content">
                    <bar :value="info.Equipments" :loading="loading"/>
                </div>
            </div>
            <div class="card row-2">
                <div class="title">信息采集统计</div>
                <div class="card-content">
                    <chartLine :value="info.TypeProportions" :loading="loading"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import bar from '../components/bar-1';
import chartLine from '../components/chart-line';
import { Pdf } from '@/plugins/htmlToPdf';
export default {
    components: {
        bar,
        chartLine,
    },
    mixins: [request_mixins],
    data() {
        return {
            loading: false,
            filters: {
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
                Pdf.downPdf(this.$refs.chart, '信息统计').then(res => {
                    setTimeout(() => {
                        loading.close();
                    }, 1000);
                });
            })
        },
        async getData() {
            this.loading = true;
            let res = await this.Get(`/GetCertificateReport?isSubEnterprise=0`);
            if (res.status == 2000) {
                res.data.Enterprises = res.data.Enterprises.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                    };
                })
                res.data.Users = res.data.Users.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                    };
                })
                res.data.Vehicles = res.data.Vehicles.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                    };
                })
                res.data.Equipments = res.data.Equipments.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                    };
                })
                res.data.TypeProportions = res.data.TypeProportions.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                    };
                })
                this.info = res.data;
                this.loading = false;
            }
        },
        preview(item) {
            this.$refs.preview.show(item.id);
        }
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
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 47% 50%;
    height: 100%;
}
.row-2{
    grid-column-start: 1;
    grid-column-end: 5;
}
.no-data{
    padding-top: 50px;
    text-align: center;
    color: #999;
}
</style>