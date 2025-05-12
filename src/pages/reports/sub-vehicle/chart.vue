<template>
    <div class="chart" ref="chart" :loading="loading">
        <div slot="header" class="custom-operation">
            <el-button type="primary" @click="exportPDF">导出</el-button>
        </div>
        <div class="grid">
            <div class="card">
                <div class="title">车辆状态</div>
                <div class="card-content">
                    <pie :value="info.StatusProportions" :color="['#5292FF', '#33D0BD', '#FFC372', '#FD706E']" :labelFormat="labelFormat"/>
                </div>
            </div>
            <div class="card">
                <div class="title">车辆类型</div>
                <div class="card-content">
                    <pie :value="info.TypeProportions"
                        :color="['#5292FF', '#33D0BD', '#FFC372', '#FD706E', '#88CA8C', '#33D0BD', '#FFC372', '#FE706E ', '#FFC372', '#FD706E']"
                        :labelFormat="labelFormat"/>
                </div>
            </div>
            <div class="card">
                <div class="title">企业</div>
                <div class="card-content">
                    <pie :value="info.EnterpriseProportions" :labelFormat="labelFormat"/>
                </div>
            </div>
            <div class="card">
                <div class="title">车辆信息</div>
                <div class="card-content">
                    <bar :value="info.VehicleCertificates" :color="['#88CA8C', '#FFC372', '#FE706E']"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import pie from '../components/pie';
import bar from '../components/bar-1'
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
                Year: new Date().getFullYear() + ''
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
                Pdf.downPdf(this.$refs.chart, '车辆统计').then(res => {
                    setTimeout(() => {
                        loading.close();
                    }, 1000);
                });
            })
        },
        async getData() {
            this.loading = true;
            let res = await this.Get(`/GetVehicleReport?year=${this.filters.year}&isSubEnterprise=1`);
            if (res.status == 2000) {
                res.data.StatusProportions = res.data.StatusProportions.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate
                    };
                })
                res.data.TypeProportions = res.data.TypeProportions.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate
                    };
                })
                res.data.EnterpriseProportions = res.data.EnterpriseProportions.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate
                    };
                })
                res.data.VehicleCertificates = res.data.VehicleCertificates.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count
                    };
                })
                this.info = res.data;
                this.loading = false;
            }
        },
        labelFormat(e) {
            return `${e.data.rate}%`
        },
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
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 50%;
    height: 100%;
    .row-2{
        grid-column-start: 3;
        grid-row-start: 1;
        grid-row-end: 3;
    }
}
.user{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 12px;
    padding: 10px 15px;
    height: 100%;
    .item{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius: 6px;
        padding: 30px 20px;
        height: calc(100% -60px);
        .icon{
            border-radius: 10px;
            width: 50px;
            height: 50px;
            background: no-repeat center center;
            background-size: 60%;
        }
        .num{
            font-size: 28px;
            font-weight: 600;
            line-height: 42px;
        }
        &.color-1{
            background: #FFF8E7;
            .icon{
                background-color: #FFC372;
                background-image: url('../../../../static/reports/icon1.png');
            }
        }
        &.color-2{
            background: #FDF2F2;
            .icon{
                background-color: #FE706E;
                background-image: url('../../../../static/reports/icon2.png');
            }
        }
        &.color-3{
            background: #F6F7F9;
            .icon{
                background-color: #959595;
                background-image: url('../../../../static/reports/icon3.png');
            }
        }
    }
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
            width: 30px;
            height: 30px;
            background: no-repeat center center;
            background-size: 100%;
        }
        &.item-1{
            .icon{
                background-image: url('../../../../static/reports/icon4.png');
            }
        }
        &.item-2{
            .icon{
                background-image: url('../../../../static/reports/icon5.png');
            }
        }
        &.item-3{
            .icon{
                background-image: url('../../../../static/reports/icon6.png');
            }
        }
        &.item-4{
            .icon{
                background-image: url('../../../../static/reports/icon7.png');
            }
        }
        &.item-5{
            .icon{
                background-image: url('../../../../static/reports/icon8.png');
            }
        }
        .name{
            flex: 1;
        }
        .num{
            font-size: 28px;
            font-weight: 600;
            color: #FE912E;
        }
    }

}
</style>