<template>
    <div class="chart" ref="chart" v-loading="loading">
        <div slot="header" class="custom-operation">
            <el-button type="primary" @click="exportPDF" v-if="$_has('SBSSTJBtnExport')">导出</el-button>
        </div>
        <div class="grid">
            <div class="card">
                <div class="title">设备设施类型</div>
                <div class="card-content">
                    <pie :value="info.TypeProportions" :loading="loading"/>
                </div>
            </div>
            <div class="card">
                <div class="title">今天点检情况</div>
                <div class="card-content">
                    <pie :value="info.SpotCheckProportions" :loading="loading" :legendGap="6" :color="[ '#FFC372', '#5292FF']"/>
                </div>
            </div>
			<div class="card" style="border: none">
			    <div class="sign">
			        <div class="item item-1">
			            <div class="icon"></div>
			            <div class="name">今日待完成保养数</div>
			            <div class="num">{{ info.NoMaintenanceCount }}</div>
			        </div>
			        <div class="item item-2">
			            <div class="icon"></div>
			            <div class="name">逾期未完成保养数</div>
			            <div class="num">{{ info.OverdueMaintenanceCount }}</div>
			        </div>
			        <div class="item item-3">
			            <div class="icon"></div>
			            <div class="name">已完成保养数</div>
			            <div class="num">{{ info.MaintenanceCount }}</div>
			        </div>
			    </div>
			</div>
           <!-- <div class="card">
                <div class="title">
                    <div class="f-b-c" style="flex: 1;">
                        <div>检验结论</div>
                        <div style="font-size: 14px;font-weight: 400;">
                            <span>特种设备：{{ info.SpecialEquipmentCount }}</span>
                            <span>检验次数：{{ info.InspectCount }}</span>
                        </div>
                    </div>
                </div>
                <div class="card-content">
                    <pie :value="info.InspectProportions" :loading="loading" :color="[ '#33D0BD', '#5292FF']"/>
                </div>
            </div> -->
            <div class="card">
                <div class="title">设备异常来源</div>
                <div class="card-content">
                    <pie :value="info.SourceProportions" :loading="loading" :color="[ '#33D0BD', '#5292FF']"/>
                </div>
            </div>
            <div class="card">
                <div class="title">设备处理情况</div>
                <div class="card-content">
                    <pie :value="info.HandleProportions" :loading="loading" :color="[ '#FE706E', '#5292FF']"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import pie from '../components/pie-1';
import { Pdf } from '@/plugins/htmlToPdf';
export default {
    components: {
        pie,
    },
    mixins: [request_mixins],
    data() {
        return {
            loading: false,
            info: {},
            filters: {
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
                Pdf.downPdf(this.$refs.chart, '设备设施统计').then(res => {
                    setTimeout(() => {
                        loading.close();
                    }, 1000);
                });
            })
        },
        async getData() {
            this.loading = true;
            let res = await this.Get(`/GetEquipmentManageReport`);
            if (res.status == 2000) {
                res.data.TypeProportions = res.data.TypeProportions.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate
                    };
                })
                res.data.SpotCheckProportions = res.data.SpotCheckProportions.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate
                    };
                })
                // res.data.InspectProportions = res.data.InspectProportions.map((item, index) => {
                //     return {
                //         name: item.Name,
                //         value: item.Count,
                //         rate: item.Rate
                //     };
                // })
                res.data.SourceProportions = res.data.SourceProportions.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate
                    };
                })
                res.data.HandleProportions = res.data.HandleProportions.map((item, index) => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate
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
.sign{
    display: grid;
    grid-row-gap: 20px;
    padding: 23px 25px;
    height: 100%;
    .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 6px;
        padding: 78px 30px;
        // background: #F6F7F9;
        .icon{
            margin-right: 10px;
            width: 23px;
            height: 23px;
            background: no-repeat center center;
            background-size: 100%;
        }
        &.item-1{
			background: rgba(255,195,114,0.3);
            .icon{
                background-image: url('../../../../static/reports/icon16.png');
            }
        }
        &.item-2{
			background: rgba(254,112,110,0.3);
            .icon{
                background-image: url('../../../../static/reports/icon17.png');
            }
        }
        &.item-3{
			background: rgba(51,208,189,0.3);
            .icon{
                background-image: url('../../../../static/reports/icon18.png');
            }
        }
        .name{
            flex: 1;
        }
        .num{
            font-size: 23px;
            font-weight: 600;
            color: #FE912E;
        }
    }

}
</style>