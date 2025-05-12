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
                <div class="title">隐患级别</div>
                <div class="card-content">
                    <pie :value="info.LevelProportions" :loading="loading" :color="[ '#FE706E', '#5292FF']"/>
                </div>
            </div>
            <div class="card">
                <div class="title">隐患状态</div>
                <div class="card-content">
                    <pie :value="info.StatusProportions" :loading="loading" :color="['#33D0BD', '#5292FF', '#FFC372']"/>
                </div>
            </div>
            <div class="card">
                <div class="title">隐患来源</div>
                <div class="card-content">
                    <pie :value="info.SourceProportions" :loading="loading" :legendGap="6"/>
                </div>
            </div>
            <div class="card row-3">
                <div class="title">年度隐患报表</div>
                <div class="card-content">
                    <bar :value="info.PotentialYears" :color="['#2478F2','#FD706E','#88CA8C','#5292FF','#FFC372']"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import pie from '../components/pie-1';
import bar from '../components/bar';
import { Pdf } from '@/plugins/htmlToPdf';
export default {
    components: {
        pie,
        bar
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
            let res = await this.Get(`/GetPotentialReport?year=${this.filters.year}&isSubEnterprise=1`);
            if (res.status == 2000) {
                res.data.PotentialYears = res.data.PotentialYears.map(item => {
                    return {
                        name: item.Name,
                        value: item.Count,
                    };
                })
                res.data.StatusProportions = res.data.StatusProportions.map(item => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate,
                    };
                })
                res.data.SourceProportions = res.data.SourceProportions.map(item => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate,
                    };
                })
                res.data.LevelProportions = res.data.LevelProportions.map(item => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate,
                    };
                })
                this.info = res.data;
                this.loading = false;
            }
        }

    }
}
</script>

<style lang="scss" scoped>
.chart{
    border-radius: 0 10px 10px 10px;
    padding: 15px;
    background: #fff;
    height: 100%;
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
    .row-3{
        grid-column-start: 1;
        grid-column-end: 4;
    }
}
</style>