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
            <el-button type="primary" @click="exportPDF" v-if="$_has('FXTJBtnExport')">导出</el-button>
        </div>
        <div class="grid">
            <div class="card">
                <div class="title">风险级别</div>
                <div class="card-content">
                    <pie :value="info.LevelProportions" :color="['#33D0BD', '#5292FF', '#FFC372', '#FE706E']" :loading="loading"/>
                </div>
            </div>
            <div class="card">
                <div class="title">风险类型</div>
                <div class="card-content">
                    <pie :value="info.TypeProportions" :color="['#33D0BD', '#5292FF', '#7585E5', '#FFC372']" :loading="loading"/>
                </div>
            </div>
            <div class="card row-2">
                <div class="content">
                    <div class="item item-1" @click="preview(0)">
                        <div class="icon"></div>
                        <div class="name">风险数</div>
                        <div class="num">{{ info.RiskCount }}</div>
                    </div>
                    <div class="item item-2" @click="preview(1)">
                        <div class="icon"></div>
                        <div class="name">已巡查数</div>
                        <div class="num">{{ info.InspectedCount }}</div>
                    </div>
                    <div class="item item-3" @click="preview(1)">
                        <div class="icon"></div>
                        <div class="name">未按时巡查数</div>
                        <div class="num">{{ info.MissedCount }}</div>
                    </div>
                    <div class="item item-4" @click="preview(1)">
                        <div class="icon"></div>
                        <div class="name">巡查异常数</div>
                        <div class="num">{{ info.AbnormalCount }}</div>
                    </div>
                </div>
            </div>
            <div class="card row-3">
                <div class="title">年度风险巡查报表</div>
                <div class="card-content">
                    <bar :value="info.RiskYears" :color="['#5292FF', '#FFC372', '#FE706E']"/>
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
            info: {
                RiskYears: [],
                LevelProportions: [],
                TypeProportions: [],
            },
			menus: [],
			url: []
        }
    },
    created() {
		this.menus = JSON.parse(window.localStorage.getItem("menus"))
		this.GetRouterPor(this.menus)
        this.getData();
    },
    methods: {
		GetRouterPor(data){
			if(data && data.length > 0){
				data.forEach(item=>{
					if(item.path == '/RiskIndex'){
						this.url.push(item.path)
					}
					if(item.children && item.children.length > 0){
						this.GetRouterPor(item.children )
					}
				})
			}
		},
        exportPDF () {
            const loading = this.$loading({
                lock: true,
                text: '正在导出中，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, .3)'
            });
            this.$nextTick(() => {
                Pdf.downPdf(this.$refs.chart, this.filters.year + '年风险统计').then(res => {
                    setTimeout(() => {
                        loading.close();
                    }, 1000);
                });
            })
        },
        async getData() {
            this.loading = true;
            let res = await this.Get(`/GetRiskReport?year=${this.filters.year}`);
            if (res.status == 2000) {
                res.data.RiskYears = res.data.RiskYears.map(item => {
                    return {
                        name: item.Name,
                        value: item.Count
                    };
                })
                res.data.LevelProportions = res.data.LevelProportions.map(item => {
                    return {
                        name: item.Name,
                        value: item.Count,
                        rate: item.Rate
                    };
                })
                res.data.TypeProportions = res.data.TypeProportions.map(item => {
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
        preview(num) {
            // let params = {
            //     StartTime: this.filters.year + '-01-01',
            //     EndTime: this.filters.year + '-12-31'
            // };
			if(!this.url.includes('/RiskIndex')){
				this.$message.error('当前账号没有风险管理页面权限,请联系管理员添加')
				return
			}
            if (num == 1) {
                this.$router.push({
                    name: '风险管理',
                    params: {
						active: num
					}
                });
                this.$parent.$parent.$parent.$parent.$parent.selectmenu('/RiskIndex');
            } else {
                this.$router.push({
                    name: '风险管理',
                });
                this.$parent.$parent.$parent.$parent.$parent.selectmenu('/RiskIndex');
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
.content{
    display: grid;
    grid-row-gap: 10px;
    padding: 20px 25px;
    height: 100%;
    .item{
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 6px;
        padding: 0 55px 0 25px;
        background: #F6F7F9;
        cursor: pointer;
        .icon{
            margin-right: 10px;
            width: 28px;
            height: 28px;
            background: no-repeat center center;
            background-size: 100%;
        }
        &.item-1{
            .icon{
                background-image: url('../../../../static/reports/icon12.png');
            }
        }
        &.item-2{
            .icon{
                background-image: url('../../../../static/reports/icon13.png');
            }
        }
        &.item-3{
            .icon{
                background-image: url('../../../../static/reports/icon14.png');
            }
        }
        &.item-4{
            .icon{
                background-image: url('../../../../static/reports/icon15.png');
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
        &::before{
            content: '';
            position: absolute;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            border-radius: 100%;
            border: 1px solid #959595;
            width: 16px;
            height: 16px;
        }
        &::after{
            content: '';
            position: absolute;
            top: 50%;
            right: 26.8px;
            transform: translateY(-50%) rotate(45deg);
            border-top: 1px solid #959595;
            border-right: 1px solid #959595;
            width: 6px;
            height: 6px;
        }
    }

}
</style>
