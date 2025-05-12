<template>
    <div class="full-screen-edit" v-if="dislogShow">
        <el-form ref="form" :model="info" :rules="rules">
            <el-scrollbar class="scrollbar" ref="scrollbar">
                <div class="card">
                    <div class="content">
                        <div class="form-2-col">
                            <el-form-item label="设备类型" prop="EquipmentTypeName" ref="EquipmentTypeName">
                                <div class="el-input">
                                    <el-autocomplete
                                        class="inline-input"
                                        v-model="info.EquipmentTypeName"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入内容"
                                        @select="handleSelect"
                                        :disabled="isPreview"
                                    >
                                        <template slot-scope="{ item }">
                                            {{ item }}
                                        </template>
                                    </el-autocomplete>
                                </div>
                            </el-form-item>
                            <el-form-item label="设备名称" prop="EquipmentName" ref="EquipmentName">
                                <el-input placeholder="请输入" v-model="info.EquipmentName" :disabled="isPreview"></el-input>
                            </el-form-item>
                        </div>
                        <div class="other-form-item" v-for="(cert, index) in certList" :key="index">
                            <div class="label">{{ cert.label }}</div>
                            <el-checkbox-group v-model="info.certs" :disabled="isPreview">
                                <el-checkbox v-for="(item, i) in cert.list" :key="i" :label="item.CertificateId">{{ item.CertificateName }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header f-b-c">
                        <div class="title">设备保养项</div>
                        <div>
                            <el-button type="primary" @click="addMaintenance({levelIndex: 1})" v-if="!isPreview">新增</el-button>
                            <el-button @click="collapseChange(1)">{{ collapses.some(index => index == 1) ? '收起' : '展开'}}</el-button>
                        </div>
                    </div>
                    <div class="card-body" v-show="collapses.some(index => index == 1)">
                        <el-table
                            border
                            :data="info.MaintainItemList"
                            :header-cell-style="$tableStyle"
                            :span-method="__handlerMergeSpan"
                        >
                            <el-table-column
                                label="保养部位"
                                min-width="280"
                                align="center"
                            >
                                <!-- <template slot-scope="{ row }">
                                    <el-input placeholder="请输入" v-model="row.id"></el-input>
                                </template> -->
                                
                                <template slot-scope="{ row , $index}">
                                    <div class="input-combination">
                                        <el-input placeholder="请输入" v-model="row.Position" :disabled="isPreview"></el-input>
                                        <div class="input-operation" v-if="!isPreview">
                                            <div class="add" @click="addMaintenance({levelIndex: 1, item: row, index: $index})"></div>
                                            <div class="remove" @click="removeMaintenance(row, $index, 1)"></div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="保养项目"
                                min-width="300"
                                align="center"
                            >
                                <template slot-scope="{ row , $index}">
                                    <div class="input-combination">
                                        <el-input placeholder="请输入" v-model="row.Item" :disabled="isPreview"></el-input>
                                        <div class="input-operation" v-if="!isPreview">
                                            <div class="add" @click="addMaintenance({levelIndex: 2, item: row, index: $index})"></div>
                                            <div class="remove" @click="removeMaintenance(row, $index, 2)"></div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="保养内容"
                                min-width="300"
                                align="center"
                            >
                                <template slot-scope="{ row }">
                                    <el-input placeholder="请输入" v-model="row.Content" :disabled="isPreview"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="保养周期"
                                min-width="180"
                                align="center"
                            >
                                <template slot-scope="{ row , $index}">
                                    <el-select v-model="row.Period" :disabled="isPreview">
                                        <el-option v-for="(item, index) in serviceInterval" :key="index" :label="item.text" :value="item.id"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                min-width="80"
                                align="center"
                            >
                                <template slot-scope="{ row , $index}" v-if="!isPreview">
                                    <el-button type="text" text-plain @click="removeMaintenance(row, $index, 1)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header f-b-c">
                        <div class="title">设备点检项</div>
                        <div>
                            <el-button type="primary" @click="addInspectionItem({levelIndex: 1})" v-if="!isPreview">新增</el-button>
                            <el-button @click="collapseChange(2)">{{ collapses.some(index => index == 2) ? '收起' : '展开'}}</el-button>
                        </div>
                    </div>
                    <div class="card-body" v-show="collapses.some(index => index == 2)">
                        <el-table
                            border
                            :data="info.SpotCheckItemList"
                            :header-cell-style="$tableStyle"
                            :span-method="__handlerMergeSpan"
                        >
                            <el-table-column
                                label="点检部位"
                                min-width="350"
                                align="center"
                            >
                                <template slot-scope="{ row , $index}">
                                    <div class="input-combination">
                                        <el-input placeholder="请输入" v-model="row.Position" :disabled="isPreview"></el-input>
                                        <div class="input-operation" v-if="!isPreview">
                                            <div class="add" @click="addInspectionItem({levelIndex: 1, item: row, index: $index})"></div>
                                            <div class="remove" @click="removeInspectionItem(row, $index, 1)"></div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="点检标准"
                                min-width="350"
                                align="center"
                            >
                                <template slot-scope="{ row , $index}">
                                    <div class="input-combination">
                                        <el-input placeholder="请输入" v-model="row.Standard" :disabled="isPreview"></el-input>
                                        <div class="input-operation" v-if="!isPreview">
                                            <div class="add" @click="addInspectionItem({levelIndex: 2, item: row, index: $index})"></div>
                                            <div class="remove" @click="removeInspectionItem(row, $index, 2)"></div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="点检周期"
                                min-width="180"
                                align="center"
                            >
                                <template slot-scope="{ row , $index}">
                                    <div class="input-combination">
                                        <el-select placeholder="请选择" v-model="row.Period" :disabled="isPreview">
                                            <el-option v-for="(item, index) in inspectionCycle" :key="index" :label="item.text" :value="item.id"></el-option>
                                        </el-select>
                                        <div class="input-operation" v-if="!isPreview">
                                            <div class="add" @click="addInspectionItem({levelIndex: 3, item: row, index: $index})"></div>
                                            <div class="remove" @click="removeInspectionItem(row, $index, 3)"></div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                min-width="80"
                                align="center"
                            >
                                <template slot-scope="{ row , $index}" v-if="!isPreview">
                                    <el-button type="text" text-plain @click="removeInspectionItem(row, $index, 1)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-scrollbar>
            <div class="edit-footer">
                <template v-if="!isPreview">
                    <el-button cancel @click="close">取消</el-button>
                    <el-button type="primary" :loading="submitLoading" @click="save">确认</el-button>
                </template>
                <el-button cancel @click="close" v-else>关闭</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import mergeSpan from '@/mixins/merge-span-mixin';
const defaultInfo = {
    EquipmentTypeName: '',
    EquipmentName: '',
    CertificateIds: '',
    MaintainItemList: [],
    SpotCheckItemList: [],
    certs: []
}
const defaultCerts = [
    {
        type: 1,
        label: '收集证件信息',
        list: [],
    },
    {
        type: 2,
        label: '收集保险信息',
        list: [],
    },
    {
        type: 3,
        label: '收集其他信息',
        list: []
    },
];
const defaultMaintainItem = {
    Position: '',// 保养部位 ,
    Item: '', //保养项目 ,
    Content: '', //保养内容 ,
    Period: '' , //周期 2周 3月 4季度 5半年 6年
};
const defaultInspectionItem = {
    Position: '',// 点检部位 ,
    Standard: '',// 点检标准 ,
    Period: '' ,// 周期 1日 2周 3月 4季度 5半年 6年
};
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
export default {
    mixins: [request_mixin, mergeSpan],
    props: {
        isPreview: false
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            collapses: [1,2],
            rules: {
                EquipmentTypeName: [{required: true, message: '请输入设备类型', trigger: ['change', 'blur']}],
                EquipmentName: [{required: true, message: '请输入设备名称', trigger: ['change', 'blur']}],
            },
            certs: _extends(defaultCerts),
            serviceInterval: [], // 保养周期 周/月/季/半年/年
            inspectionCycle: [], // 点检周期 日/周/月/季/半年/年
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.isEdit ? '编辑' : '新增'
        },
        certList() {
            return this.certs.filter(item => !!item.list.length);
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            await this.getCerts();
            await this.getServiceInterval();
            await this.getInspectionCycle();
            if (item) {
                this.loading = true;
                this.id = item.EquipmentId;
                try {
                    let res = await this.Get(`/GetEquipment?equipmentId=${item.EquipmentId}`)
                    if (res.status == 2000) {
                        res.data.certs = res.data.CertificateIds.split(',').map(id=>+id);
                        this.__generateSpanData({levelKeys: {1: 'Position'},rowspanByColIndexs: {1: '0|5', 2: '1'}, levelLength: 2, list: res.data.MaintainItemList});
                        this.__generateSpanData({levelKeys: {1: 'Position', 2: 'Standard'},rowspanByColIndexs: {1: '0|3', 2: '1'}, levelLength: 3, list: res.data.SpotCheckItemList});
                        this.info = Object.assign(_extends(defaultInfo), res.data);
                    } else {
                        this.$message.error('获取数据失败');
                        this.close();
                    }
                } catch (error) {
                   console.error(error);
                }
                this.loading = false;
            }
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo);
            this.certs = _extends(defaultCerts);
        },
        save() {
            this.$refs.form.validate(async (valid, fields) => {
                for (let key in fields) {
                    if (this.$refs[key]) {
                        this.$refs.scrollbar.wrap.scrollTop = this.$refs[key].$el.offsetTop;
                        break;
                    }
                }
                if(!this.info.SpotCheckItemList || this.info.SpotCheckItemList.length<1 || this.info.SpotCheckItemList == ''){
                 return   this.$message.error('设备点检项不能为空')
                }

                if (valid) {
                    this.submitLoading = true;
                    this.__syncField({1: ['Position']}, this.info.MaintainItemList);
                    this.__syncField({1: ['Position'], 2: ['Standard']}, this.info.SpotCheckItemList);
                    try {
                        let params = {
                        ...this.info
                        }
                        params.CertificateIds = params.certs.join(',');
                        let res = await this.Post('/SaveEquipment', params)
                        if (res.status == 2000) {
                            this.$message.success('保存成功')
                            this.$emit('load');
                            this.close();
                        } else {
                            this.$message.error(res.message);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                    this.submitLoading = false;
                }
            })
        },

        async querySearch(queryString, cb) {
            let res = await this.Get(`/GetEquipmentTypeList?QueryScope=2&equipmentTypeName=${queryString}`);
            if (res.status == 2000) {
                cb(res.data || []);
            } else {
                cb([]);
            }
        },
        async handleSelect(item) {
            this.info.EquipmentTypeName = item;
            let res = await this.Get(`/GetLastEquipment?equipmentTypeName=${item}`);
            if(res.status == 2000) {
                this.info.certs = res.data.CertificateIds.split(',').map(item => +item);
            } else {
                console.error('未获取到数据');
            }
        },
        collapseChange(n) {
            let index = this.collapses.indexOf(n);
            if (index == -1) {
                this.collapses.push(n)
            } else {
                this.collapses.splice(index, 1);
            }
        },
        generateList1(list) {
            let arr = [];
            
            return arr;
        },
        addMaintenance({item, levelIndex, index}) {
            let rowspanByColIndexs = {
                1: '0|5',
                2: '1'
            }
            this.__addTableItem({
                item: item,
                defaultItem: _extends(defaultMaintainItem),
                list: this.info.MaintainItemList,
                levelIndex: levelIndex,
                index: index,
                rowspanByColIndexs,
                levelLength: 2,
            });
        },
        removeMaintenance(item, index, levelIndex) {
            this.__removeTableItem({item, index, list: this.info.MaintainItemList, levelIndex});
        },
        addInspectionItem({item, levelIndex, index}) {
            let rowspanByColIndexs = {
                1: '0|3',
                2: '1'
            }
            this.__addTableItem({
                item: item,
                defaultItem: _extends(defaultInspectionItem),
                list: this.info.SpotCheckItemList,
                levelIndex: levelIndex,
                index: index,
                rowspanByColIndexs,
                levelLength: 3,
            });
        },
        removeInspectionItem(item, index, levelIndex) {
            this.__removeTableItem({item, index, list: this.info.SpotCheckItemList, levelIndex});
        },
        async getCerts() {
            let res = await this.Get(`/GetCertificateList?certificateType=4&certificateClassification=`);
            if (res.status == 2000) {
                res.data.forEach(item => {
                    let cert = this.certs.find(cert => item.CertificateClassification == cert.type);
                    if (cert) {
                        cert.list.push(item);
                    }
                })
            }
            return Promise.resolve();
        },
        async getServiceInterval() {
            let res = await this.Get('/GetMaintainPeriodCom');
            if (res.status == 2000) {
                this.serviceInterval = res.data.map(item => {
                    item.id = +item.id;
                    return item;
                });
            }
            return Promise.resolve();
        },
        async getInspectionCycle() {
            let res = await this.Get('/GetSpotCheckPeriodCom');
            if (res.status == 2000) {
                this.inspectionCycle = res.data.map(item => {
                    item.id = +item.id;
                    return item;
                });
            }
            return Promise.resolve();
        },
    }
}
</script>

<style lang="scss" scoped>
.full-screen-edit{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    background: #F4F5F7;
    .el-form{
        height: 100%;
    }
    /deep/ .el-form-item{
        margin-bottom: 25px;
        .el-form-item__label{
            padding-bottom: 9px;
            line-height: 20px;
        }
    }
    .el-date-editor,
    .el-select,
    .el-autocomplete{
        width: 100%;
    }
    .form-2-col{
        display: flex;
        >div{
            width: 50%;
            &:first-child{
                margin-right: 40px;
            }
        }
    }
    .split-line{
        &::before{
            content: '';
            display: block;
            margin: 0 -25px 25px;
            height: 10px;
            background: #f2f2f2;
        }
    }
    .card{
        border-radius: 10px;
        padding: 0 32px;
        background: #fff;
        &:not(:last-child) {
            margin-bottom: 10px;
        }
        .card-header{
            padding: 14px 0;
        }
        .card-body{
            padding: 3px 0 10px;
        }
        .content{
            padding: 20px 0;
        }
        .other-form-item{
            &:not(:last-child){
                margin-bottom: 20px;
            }
            .label{
                margin-bottom: 10px;
                width: 100px;
                font-weight: 600;
            }
        }
        .title{
            display: flex;
            align-items: center;
            font-size: 16px;;
            font-weight: 600;
            &::before{
                content:'';
                border-radius: 2px;
                margin-right: 8px;
                width: 5px;
                height: 16px;
                background: $--color-primary;
            }
        }
        /deep/ .el-table--border{
            border-radius: 10px;
            .el-table__header-wrapper{
                border-radius: 10px 10px 0 0;
            }
        }
    }
    .scrollbar{
        height: calc(100% - 90px);
        /deep/ .el-scrollbar__wrap{
            height: 100%;
        }
    }
    .edit-footer{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        border-radius: 10px;
        margin-top: 10px;
        padding: 0 32px;
        height: 80px;
        background: #fff;
        .el-button{
            width: 110px;
        }
        [cancel]{
            border-color: #F5F6FA;
            background: #F5F6FA;
        }
    }
    .input-combination{
        display: flex;
        width: 100%;
        .el-input{
            flex: 1;
            width: calc(100% - 20px);
        }
        .input-operation{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 5px;
            padding: 2px 0 3px;
            .add,
            .remove{
                border-radius: 100%;
                width: 15px;
                height: 15px;
                cursor: pointer;
            }
            .add{
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                background: $--color-primary;
                &::before,
                &::after{
                    content: '';
                    position: absolute;
                    width: 60%;
                    height: 1px;
                    background: #fff;
                }
                &::after{
                    transform: rotate(90deg);
                }
            }
            .remove{
                display: flex;
                justify-content: center;
                align-items: center;
                background: #D5D5D5;
                &::before{
                    content: '';
                    width: 60%;
                    height: 1px;
                    background: #fff;
                }
            }
        }
    }
}
</style>
