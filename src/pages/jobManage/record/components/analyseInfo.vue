<template>
    <div class="analyse">
        <!-- 动火1、受限空间2、临时用电6 分析数据 -->
        <template v-if="jobTemplateId == 1">
            <div class="table-content">
                <div class="label">气体分析：</div>
                <el-table
                    :data="hotWorkList"
                    border
                    :header-cell-style="$tableStyle"
                >
                <!-- 
                    field1: '月 日 时 分', // 气体取样分析时间
                    field2: '', // 代表性气体
                    field3: '', // 分析结果/%
                    field4: '', // 分析人
                -->
                    <el-table-column
                        label="序号"
                        type="index"
                        width="80"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="气体取样分析时间"
                        align="center"
                        prop="field1"
                    ></el-table-column>
                    <el-table-column
                        label="代表性气体"
                        align="center"
                        prop="field2"
                    ></el-table-column>
                    <el-table-column
                        label="分析结果/%"
                        align="center"
                        prop="field3"
                    ></el-table-column>
                    <el-table-column
                        label="分析人"
                        align="center"
                        prop="field4"
                    ></el-table-column>
                </el-table>
            </div>
        </template>
        <template v-if="jobTemplateId == 2">
            <div class="table-content">
                <div class="label">气体分析：</div>
                <el-table
                    :data="confinedSpaceList"
                    border
                    :header-cell-style="$tableStyle"
                    :span-method="rowspanMethod"
                >
                <!-- 
                    field1: '月 日 时 分', // 气体取样分析时间
                    field2: '', // 代表性气体
                    field3: '', // 分析结果/%
                    field4: '', // 分析人
                -->
                    <el-table-column
                    >
                        <el-table-column
                            label="分析项目"
                            align="center"
                        >
                            <el-table-column
                                label="合格标准"
                                width="200"
                                align="center"
                                prop="tableColName"
                            >
                            </el-table-column>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                        label="有毒有害气体名称"
                        align="center"
                    >
                        <template v-for="(item, index) in toxicList">
                            <el-table-column
                                :key="index"
                                :label="item.name"
                                align="center"
                            >
                                <el-table-column
                                    :key="index"
                                    :label="item.standard"
                                    align="center"
                                    :prop="item.prop"
                                >
                                </el-table-column>
                            </el-table-column>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="可燃气体名称"
                        align="center"
                    >
                        <template v-for="(item, index) in combustibleList">
                            <el-table-column
                                :key="index"
                                :label="item.name"
                                align="center"
                            >
                                <el-table-column
                                    :key="index"
                                    :label="item.standard"
                                    align="center"
                                    :prop="item.prop"
                                >
                                </el-table-column>
                            </el-table-column>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <el-table-column
                            label="氧气含量（体积分数）"
                            align="center"
                        >
                            <el-table-column
                                label="19.5%~21%"
                                align="center"
                                prop="field1"
                            >
                            </el-table-column>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                        label="取样分析时间"
                        align="center"
                        prop="field2"
                    ></el-table-column>
                    <el-table-column
                        label="分析部位"
                        align="center"
                        prop="field3"
                    ></el-table-column>
                    <el-table-column
                        label="分析人"
                        align="center"
                        prop="field4"
                    ></el-table-column>
                </el-table>
            </div>
        </template>
        <template v-if="jobTemplateId == 6">
            <div class="table-content">
                <div class="label">气体分析：</div>
                <el-table
                    :data="tempporaryElectricityList"
                    border
                    :header-cell-style="$tableStyle"
                >
                <!-- 
                    field1: '', // 分析点
                    field2: '', // 分析人
                    field3: '月 日 时 分', // 分析时间
                    field4: '', // 可燃气体检测结果
                -->
                    <el-table-column
                        label="序号"
                        type="index"
                        width="80"
                        align="center"
                    ></el-table-column>
                    <el-table-column
                        label="分析时间"
                        align="center"
                        prop="field3"
                    ></el-table-column>
                    <el-table-column
                        label="分析点"
                        align="center"
                        prop="field1"
                    ></el-table-column>
                    <el-table-column
                        label="可燃气体检测结果"
                        align="center"
                        prop="field4"
                    ></el-table-column>
                    <el-table-column
                        label="分析人"
                        align="center"
                        prop="field2"
                    ></el-table-column>
                </el-table>
            </div>
        </template>
        <!-- 分析 -->
        <div class="form-col">
            <div class="form-item">
                <div class="label">风险辨识结果：</div>
            <div>{{ result }}</div>
            </div>
        </div>
        <div class="form-col">
            <div class="form-item">
                <div class="label">分析人签字：</div>
                <div>
                    <el-image
                        v-for="(url, index) in signUrls"
                        :key="index"
                        style="height: 50px;"
                        :src="url" 
                    ></el-image>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: [Object, Array],
            default() {
                return {}
            }
        },
        jobTemplateId: [String, Number],
    },
    computed: {
        result() {
            let results = [];
            this.info.forEach(item => {
               let itemJSON = JSON.parse(item.ItemJson);
               results.push(...itemJSON.riskIndentification.map(o=>o.Name));
            });
            return Array.from(new Set(results)).join('、');
        },
        signUrls() {
            let list = [];
            this.info.forEach(item => {
                list.push(...item.SignList.map(o=>o.SignInUrl));
            });
            return list;
        },
        hotWorkList() {
            let AnalyseInfo = this.info;
            let list = [];
            AnalyseInfo.forEach(item => {
                let itemJSON = JSON.parse(item.ItemJson);
                let arr = [];
                itemJSON.list.forEach(fields => {
                    let obj = {};
                    fields.forEach(field => {
                        if (field.key == 'field4') {
                            obj[field.key] = field.value.UserName;
                        } else {
                            obj[field.key] = field.value;
                        }
                    });
                    arr.push(obj)
                });
                list.push(...arr);
            });
            list.sort((a, b) => {
                return new Date(a.field1) - new Date(b.field1)
            });
            return list;
        },
        tempporaryElectricityList() {
            let AnalyseInfo = this.info;
            let list = [];
            AnalyseInfo.forEach(item => {
                let itemJSON = JSON.parse(item.ItemJson);
                let arr = [];
                itemJSON.list.forEach(fields => {
                    let obj = {};
                    fields.forEach(field => {
                        if (field.key == 'field2') {
                            obj[field.key] = field.value.UserName;
                        } else {
                            obj[field.key] = field.value;
                        }
                    });
                    arr.push(obj)
                });
                list.push(...arr);
            });
            list.sort((a, b) => {
                return new Date(a.field1) - new Date(b.field1)
            });
            return list;
        },
        confinedSpaceList() {
            let AnalyseInfo = this.info;
            let list = [];
            AnalyseInfo.forEach(item => {
                let itemJSON = JSON.parse(item.ItemJson);
                let arr = [];
                itemJSON.list.forEach((fields, i) => {
                    let obj = {};
                    fields.forEach(field => {
                        if (field.key == 'field4') {
                            obj[field.key] = field.value.UserName;
                        } else {
                            obj[field.key] = field.value;
                        }
                    });
                    arr.push(obj)
                });
                list.push(...arr);
            });
            list.sort((a, b) => {
                return new Date(a.field1) - new Date(b.field1)
            });
            if (list[0]) {
                list[0].tableColName = '分析数据';
            }
            return list;
        },
        // 受限空间的分析项目
        itemList() {
            let AnalyseInfo = this.info;
            let list = [];
            let fieldKeys = {
                field1: 'type',
                field2: 'name',
                field3: 'standard'
            }
            AnalyseInfo.forEach(item => {
                let itemJSON = JSON.parse(item.ItemJson);
                let arr = [];
                itemJSON.itemList.forEach(fields => {
                    let obj = {};
                    obj.prop = fields[0].joinField;
                    fields.forEach(field => {
                        let value = field.key == 'field1' ? field.value.id : field.value;
                        obj[fieldKeys[field.key]] = value;
                    });
                    arr.push(obj);
                })
                list.push(...arr);
            });
            return list;
        },
        toxicList() {
            return this.itemList.filter(item => item.type == 1);
        },
        combustibleList() {
            return this.itemList.filter(item => item.type == 2);
        },
    },
    data() {
        return {

        }
    },
    mounted() {
    },
    methods: {
        rowspanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex == 0) {
                return {
                    rowspan: this.confinedSpaceList.length,
                    colspan: rowIndex == 0 ? 1 : 0,
                }
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.table-content{
    padding: 20px 15px 0; 
}
.label{
    font-weight: 600;
    white-space: nowrap;
}
.form-col{
    display: flex;
    border-bottom: 1px solid #EFEFEF;
    padding: 15px;
    .form-item {
        flex: 1;
        display: flex;
        align-items: flex-start;
        &:not(:first-child) {
            margin-left: 10px;
        }
    }
}
.analyse{
    /deep/ .el-table__header-wrapper .el-table__cell{
        border-bottom: 1px solid #EBEEF5 !important;
    }
}
</style>
