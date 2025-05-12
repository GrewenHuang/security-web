<template>
    <page-layout class="chart" v-loading="loading" :styleObj="{padding: '0'}">
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
        <div class="grid" ref="chart">
            <div class="card">
                <div class="title">作业类型</div>
                <div class="card-content">
                    <pie :value="info.TypeProportions" :loading="loading"/>
                </div>
            </div>
            <div class="card">
                <div class="title">作业状态</div>
                <div class="card-content">
                    <pie :value="info.StatusProportions" :loading="loading" :labelFormat="labelFormat" :color="['#2478f2', '#33d0bd', '#ffc372', '#fe706e']"/>
                </div>
            </div>
            <div class="card row-3">
                <div class="table">
                    <el-table
                        :data="info.JobTicketReportList"
                        border
                        :header-cell-style="$tableStyle"
                        style="width: 100%"
                    >
                        <el-table-column
                            type="index"
                            label="序号"
                            width="70"
                            align="center"
                        ></el-table-column>
                        <el-table-column
                            label="企业名称"
                            align="center"
                            prop="ItemName"
                        ></el-table-column>
                        <el-table-column
                            label="申请数量"
                            align="center"
                            width="120"
                            prop="ApplyCount"
                        ></el-table-column>
                        <el-table-column
                            label="进行中数量"
                            align="center"
                            width="120"
                            prop="InCount"
                        ></el-table-column>
                        <el-table-column
                            label="已验收数量"
                            align="center"
                            width="120"
                            prop="CompletedCount"
                        ></el-table-column>
                        <el-table-column
                            label="已作废数量"
                            align="center"
                            width="120"
                            prop="CancelCount"
                        ></el-table-column>
                        <el-table-column
                            label="已过期数量"
                            align="center"
                            width="120"
                            prop="ExpiredCount"
                        ></el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import pie from '../components/pie-2';
import bar from '../components/bar';
import BarLine from '../components/barLine';
import { Pdf } from '@/plugins/htmlToPdf';
export default {
    components: {
        pie,
        bar,
        BarLine
    },
    mixins: [request_mixins],
    data() {
        return {
            loading: false,
            info: {},
            filters: {
                year: new Date().getFullYear() + ''
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
                Pdf.downPdf(this.$refs.chart, this.filters.year + '年隐患统计').then(res => {
                    setTimeout(() => {
                        loading.close();
                    }, 1000);
                });
            })
        },
        async getData() {
            this.loading = true;
            let res = await this.Get(`/GetJobTicketReport?year=${this.filters.year}&isSubEnterprise=1`);
            if (res.status == 2000) {
                res.data.TypeProportions = res.data.TypeProportions.map(item => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate,
                    };
                })
                res.data.StatusProportions = res.data.StatusProportions.map(item => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate,
                    };
                })
                this.info = res.data;
                this.loading = false;
            }
        },
        labelFormat(e) {
            return `${e.value}\n${e.data.rate}%`
        },

    }
}
</script>

<style lang="scss" scoped>
.chart{
}
.custom-operation{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
    /deep/ .el-date-editor{
        margin-right: 5px;
        width: 120px;
    }
}
.card{
    border: 1px solid #EEEEEE;
    border-radius: 10px;
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
    grid-template-rows: 320px auto;
    padding: 15px;
    min-height: 100%;
    .row-3{
        grid-column-start: 1;
        grid-column-end: 3;
    }
}
.table{
    padding: 15px;
}
</style>