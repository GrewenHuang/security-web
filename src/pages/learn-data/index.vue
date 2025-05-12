<template>
    <page-layout ref="pageLayout" :loading="loading" :pages="pages" @current-change="handlePageChange" :updateWindow="filterTabChangeFlag">
       <div slot="header" class="header f-c" v-if="0">
          <!-- <div class="f-c-c" v-if="userInfo.Enterprise.IsSingleEnterprise == 1">
              <div class="item" :class="{active: IsPrivate == 0}" @click="changeStore(0)">公共学习资源（{{ superCount }}）</div>
              <div class="item" :class="{active: IsPrivate == 1}" @click="changeStore(1)">企业学习资源（{{ enterpriseCount }}）</div>
            </div>
            <div class="header-tab f-c-c">
                <div class="item" :class="{active: IsPrivate == 0}" @click="changeStore(0)">公共学习资源（{{ superCount }}）</div>
                <div class="item" :class="{active: IsPrivate == 1}" @click="changeStore(1)">企业学习资源（{{ enterpriseCount }}）</div>
            </div> -->
           <!-- <div class="operation">
                <el-button style="float: right;" type="primary" @click="add()" v-if="$_has('XXYDKBtnAdd')">新增</el-button>
            </div> -->
        </div>
        <div class="custom-operation" slot="muiltOperation">
            <div class="filter-tabs">
                <div class="tab-item" v-for="(item, index) in filterTabs" :key="index" :class="{active: filterTabIndex == index}" @click="changeType(index)">
                    {{ item.title }}（{{ item.count }}）
                </div>
            </div>
            <template v-if="!!filterTabs[filterTabIndex].filterList.length">
                <div class="filter f f--s" v-for="(item, index) in filterTabs[filterTabIndex].filterList" :key="index">
                    <div class="label">{{ item.label }}：</div>
                    <div style="flex: 1;">
                        <el-checkbox
                            class="check-box-all"
                            style="margin-right: 30px;"
                            v-model="item.checkAll"
                            @change="handleCheckAllChange(item, $event)"
                        >全选</el-checkbox>
                        <el-checkbox-group v-model="filterTabs[filterTabIndex].filters[item.filterKey]">
                            <el-checkbox
                                v-for="(checkbox, i) in item.list"
                                :key="i"
                                :label="checkbox[item.valueKey]"
                                @change="handleCheckedChange(item)"
                            >{{ checkbox[item.labelKey] }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="filter f">
                    <div class="label">已筛条件：</div>
                    <div>
                        <el-input placeholder="请输入名称关键词搜索" v-model="filters.SearchText">
                            <el-button slot="append" type="primary" icon="el-icon-search" @click="handlePageChange(1)"></el-button>
                        </el-input>
                    </div>
                    <div class="filtered f" style="flex: 1;" v-if="filterTags.length">
                        <div class="tag" v-for="(item, index) in filterTags" :key="index" @click="removeTag(item)">{{ item.name }} <i class="el-icon-close"></i></div>
                        <div class="remove" @click="clearFilter"><i class="el-icon-brush"></i>清空筛选</div>
                    </div>
                    <el-button style="margin-left: auto;" type="primary" @click="add()" v-if="$_has('XXYDKBtnAdd')">新增</el-button>
                </div>
            </template>
            <div class="filter f" v-if="filterTabIndex == 5">
                <el-button style="margin-left: auto;" type="primary" @click="add()" v-if="$_has('XXYDKBtnAdd')">新增</el-button>
            </div>
        </div>
        <!-- 安全生产法律法规 -->
        <template v-if="filterTabIndex == 0">
            <el-table
                :data="list"
                highlight-current-row
                :header-cell-style="$tableStyle"
                style="width: 100%"
            >
                <el-table-column
                    label="序号"
                    type="index"
                    align="center"
                    width="50"
                >
                </el-table-column>
                <el-table-column
                    label="名称"
                    align="center"
                    prop="Name"
                >
                </el-table-column>
                <el-table-column
                    label="发文机关"
                    align="center"
                    width="200"
                    prop="ReleaseAuthority"
                >
                </el-table-column>
                <el-table-column
                    label="分类"
                    align="center"
                    width="180"
                    prop="CategoryName"
                >
                </el-table-column>
                <el-table-column
                    label="实施日期"
                    align="center"
                    width="150"
                    prop="ImplementTimeDesc"
                >
                </el-table-column>
                <el-table-column
                    label="浏览次数"
                    align="center"
                    width="150"
                    prop="BrowseCount"
                ></el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="190"
                >
                    <template slot-scope="{ row }">
                        <div class="table-operation">
                            <el-button type="text" @click="preview(row)" v-if="$_has('XXYDKBtnLook')">查看</el-button>
                            <el-button type="text" @click="add(row)" v-if="$_has('XXYDKBtnEdit')">编辑</el-button>
                            <el-button type="text" text-plain @click="remove(row)" v-if="$_has('XXYDKBtnDelete')">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!-- 安全生产技术规范 -->
        <template v-if="filterTabIndex == 1">

            <el-table
                :data="list"
                highlight-current-row
                :header-cell-style="$tableStyle"
                style="width: 100%"
            >
                <el-table-column
                    label="序号"
                    type="index"
                    align="center"
                    width="50"
                >
                </el-table-column>
                <el-table-column
                    label="名称"
                    align="center"
                    prop="Name"
                >
                </el-table-column>
                <el-table-column
                    label="标准编号"
                    align="center"
                    width="200"
                    prop="ReleaseAuthority"
                >
                </el-table-column>
                <el-table-column
                    label="分类"
                    align="center"
                    width="180"
                    prop="CategoryName"
                >
                </el-table-column>
                <el-table-column
                    label="实施日期"
                    align="center"
                    width="150"
                    prop="ImplementTimeDesc"
                >
                </el-table-column>
                <el-table-column
                    label="浏览次数"
                    align="center"
                    width="150"
                    prop="BrowseCount"
                ></el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="190"
                >
                    <template slot-scope="{ row }">
                        <div class="table-operation">
                            <el-button type="text" @click="preview(row)" v-if="$_has('XXYDKBtnLook')">查看</el-button>
                            <el-button type="text" @click="add(row)" v-if="$_has('XXYDKBtnEdit')">编辑</el-button>
                            <el-button type="text" text-plain @click="remove(row)" v-if="$_has('XXYDKBtnDelete')">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!-- 典型事故案例 -->
        <template v-if="filterTabIndex == 2">
            <div class="card-list">
                <div class="card-item cursor-p" v-for="(item, index) in list" :key="index" @click="preview(item)">
                    <div class="title f-b-c" :class="'level-' + levelIndex(item.AccidentLevelName)">
                        <div class="f--c">
                            <i class="round"></i> {{ item.AccidentLevelName }}
                        </div>
                        <div class="tag">{{ item.CategoryName }}</div>
                    </div>
                    <div class="content">{{ item.Name }}</div>
                    <div class="footer f-b-c">
                        <div class="f">
                            <div>浏览：{{ item.BrowseCount }}</div>
                            <div style="margin-left: 12px;">{{ item.ImplementTimeDesc }}</div>
                        </div>
                        <div class="f">
                            <el-tooltip content="编辑">
                                <i class="edit-icon el-icon-edit cursor-p" @click.stop="add(item)" v-if="$_has('XXYDKBtnEdit')"></i>
                            </el-tooltip>
                            <el-tooltip content="删除">
                                <i class="remove-icon el-icon-delete cursor-p" @click.stop="remove(item)"  v-if="$_has('XXYDKBtnDelete')"></i>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <no-data top="105" v-if="!list.length"></no-data>
        </template>
        <!-- 培训课件 -->
        <template v-if="filterTabIndex == 3">
            <div class="card-list1">
                <div class="card-item cursor-p" v-for="(item, index) in list" :key="index" @click="preview(item)">
                    <div class="content">{{ item.Name }}</div>
                    <div class="footer f-b-c">
                        <div class="f">
                            <div>浏览：{{ item.BrowseCount }}</div>
                            <div style="margin-left: 12px;">{{ item.CreateTimeDesc }}</div>
                        </div>
                        <div class="f">
                            <el-tooltip content="编辑">
                                <i class="edit-icon el-icon-edit cursor-p" @click.stop="add(item)" v-if="$_has('XXYDKBtnEdit')"></i>
                            </el-tooltip>
                            <el-tooltip content="删除">
                                <i class="remove-icon el-icon-delete cursor-p" @click.stop="remove(item)" v-if="$_has('XXYDKBtnDelete')"></i>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <no-data top="105" v-if="!list.length"></no-data>
        </template>
        <!-- 安全专题 -->
        <template v-if="filterTabIndex == 4">
            <div class="card-list1">
                <div class="card-item cursor-p" v-for="(item, index) in list" :key="index" @click="preview(item)">
                    <div class="content">{{ item.Name }}</div>
                    <div class="footer f-b-c">
                        <div class="f">
                            <div>浏览：{{ item.BrowseCount }}</div>
                            <div style="margin-left: 12px;">{{ item.CreateTimeDesc }}</div>
                        </div>
                        <div class="f">
                            <el-tooltip content="编辑">
                                <i class="edit-icon el-icon-edit cursor-p" @click.stop="add(item)" v-if="$_has('XXYDKBtnEdit')"></i>
                            </el-tooltip>
                            <el-tooltip content="删除">
                                <i class="remove-icon el-icon-delete cursor-p" @click.stop="remove(item)" v-if="$_has('XXYDKBtnDelete')"></i>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <no-data top="105" v-if="!list.length"></no-data>
        </template>
        <!-- 教育培训视频 -->
        <template v-if="filterTabIndex == 5">
            <div class="card-list2">
                <div class="card-item cursor-p" v-for="(item, index) in list" :key="index" @click="preview(item)">
                    <div class="img-content">
                        <img :src="item.LearningFiles[0].coverUrl" alt="">
                        <div class="desc f-b-c">
                            <div>浏览：{{ item.BrowseCount }}</div>
                            <div>{{ item.LearningFiles[0].lengths | dateFormat(true) }}</div>
                        </div>
                    </div>
                    <div class="title">
                        {{ item.Name }}
                        <div class="video-operation">
                            <el-tooltip content="编辑">
                                <i class="edit-icon el-icon-edit cursor-p" @click.stop="add(item)" v-if="$_has('XXYDKBtnEdit')"></i>
                            </el-tooltip>
                            <el-tooltip content="删除">
                                <i class="remove-icon el-icon-delete cursor-p" @click.stop="remove(item)" v-if="$_has('XXYDKBtnDelete')"></i>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <no-data top="105" v-if="!list.length"></no-data>
        </template>
        <add1 ref="add1" @load="handlePageChange"></add1>
        <add2 ref="add2" @load="handlePageChange"></add2>
        <add3 ref="add3" @load="handlePageChange"></add3>
        <add4 ref="add4" @load="handlePageChange"></add4>
        <add5 ref="add5" @load="handlePageChange"></add5>
        <add6 ref="add6" @load="handlePageChange"></add6>
        <detail1 ref="detail1" @load="handlePageChange"></detail1>
        <detail2 ref="detail2" @load="handlePageChange"></detail2>
        <detail3 ref="detail3" @load="handlePageChange"></detail3>
        <detail4 ref="detail4" @load="handlePageChange"></detail4>
        <detail5 ref="detail5" @load="handlePageChange"></detail5>
        <detail6 ref="detail6" @load="handlePageChange"></detail6>
    </page-layout>
</template>

<script>
import request_mixins from '@/mixins/request-mixin';
import util from '../../common/util';
import { mapGetters } from 'vuex';
import add1 from './add1';
import add2 from './add2';
import add3 from './add3';
import add4 from './add4';
import add5 from './add5';
import add6 from './add6';
import detail1 from './detail1';
import detail2 from './detail2';
import detail3 from './detail3';
import detail4 from './detail4';
import detail5 from './detail5';
import detail6 from './detail6';
import Qs from "qs";
function _extends(obj) {
    return JSON.parse(JSON.stringify(obj));
}
const limitYear = 3;
const threeDecade = (() => {
    let list = [];
    let year = new Date().getFullYear() - limitYear;
    for(let i = 0; i < 30; i++) {
        list.push(year - i);
    }
    return list;
})();
export default {
    components: {
        add1,
        add2,
        add3,
        add4,
        add5,
        add6,
        detail1,
        detail2,
        detail3,
        detail4,
        detail5,
        detail6,
    },
    mixins: [request_mixins],
    filters: {
        dateFormat: util.durationFormat
    },
    data() {
        const Years = (() => {
            let list = [];
            let year = new Date().getFullYear();
            for(let i = 0; i < limitYear; i++) {
                list.push({
                    id: year - i,
                    text: year - i + '年'
                });
            }
            list.push({
                id: '更早',
                text: '更早'
            })
            return list;
        })();
        return {
            userInfo:Qs.parse(window.localStorage.getItem("userinfo")),
            loading: false,
            list: [],
            pages: {
                rows: 10,
                page: 1,
                total: 0
            },
            IsPrivate: 0,
            filters: {
                SearchText: '',
            },
            filterTabChangeFlag: false,
            filterTabIndex: 0,
            superCount: 0,
            enterpriseCount: 0,
            filterTabs: [
                {
                    title: '安全生产法律法规',
                    count: 0,
                    filters: {
                        CategoryCode: [], // 标签分类
                        Year: [], // 实施年份
                    },
                    filterList: [
                        {
                            label: '标签分类',
                            list: [],
                            labelKey: 'text',
                            valueKey: 'id',
                            filterKey: 'CategoryCode',
                            checkAll: true,
                            dictionaryCode: '200003'

                        },
                        {
                            label: '实施年份',
                            list: _extends(Years),
                            labelKey: 'text',
                            valueKey: 'id',
                            filterKey: 'Year',
                            checkAll: true,
                        }
                    ]
                },
                {
                    title: '安全生产技术规范',
                    count: 0,
                    filters: {
                        CategoryCode: [], // 标签分类
                        Year: [], // 实施年份
                    },
                    filterList: [
                        {
                            label: '标签分类',
                            list: [],
                            labelKey: 'text',
                            valueKey: 'id',
                            filterKey: 'CategoryCode',
                            checkAll: true,
                            dictionaryCode: '200001'
                        },
                        {
                            label: '实施年份',
                            list: _extends(Years),
                            labelKey: 'text',
                            valueKey: 'id',
                            filterKey: 'Year',
                            checkAll: true,
                        }
                    ]
                },
                {
                    title: '典型事故案例',
                    count: 0,
                    filters: {
                        CategoryCode: [], // 事故类型
                        AccidentLevelCode: [], // 事故等级
                        Year: [], // 实施年份
                    },
                    filterList: [
                        {
                            label: '事故类型',
                            list: [],
                            labelKey: 'text',
                            valueKey: 'id',
                            filterKey: 'CategoryCode',
                            checkAll: true,
                            dictionaryCode: '200004'
                        },
                        {
                            label: '事故等级',
                            list: [],
                            labelKey: 'text',
                            valueKey: 'id',
                            filterKey: 'AccidentLevelCode',
                            checkAll: true,
                            dictionaryCode: '00019'
                        },
                        {
                            label: '实施年份',
                            list: _extends(Years),
                            labelKey: 'text',
                            valueKey: 'id',
                            filterKey: 'Year',
                            checkAll: true,
                        }
                    ]
                },
                {
                    title: '培训课件',
                    count: 0,
                    filters: {
                        CategoryCode: [], // 课件类型
                        ThrongCode: [], // 适用人群
                        Year: [], // 实施年份
                    },
                    filterList: [
                        {
                            label: '课件类型',
                            list: [],
                            labelKey: 'text',
                            valueKey: 'id',
                            filterKey: 'CategoryCode',
                            checkAll: true,
                            dictionaryCode: '200005'
                        },
                        {
                            label: '适用人群',
                            list: [],
                            labelKey: 'text',
                            valueKey: 'id',
                            filterKey: 'ThrongCode',
                            checkAll: true,
                            dictionaryCode: '200002'
                        }
                    ]
                },
                {
                    title: '安全专题',
                    count: 0,
                    filters: {
                        CategoryCode: [], // 专题类型
                    },
                    filterList: [
                        {
                            label: '专题类型',
                            list: [],
                            labelKey: 'text',
                            valueKey: 'id',
                            filterKey: 'CategoryCode',
                            checkAll: true,
                            dictionaryCode: '200006'
                        }
                    ]
                },
                {
                    title: '教育培训视频',
                    count: 0,
                    filters: {},
                    filterList: []
                },
            ],
        }
    },
    computed: {
        ...mapGetters(['getDictionaryById']),
        filterTags() {
            let list = [];
            let tab = this.filterTabs[this.filterTabIndex];
            for(let key in tab.filters) {
                let ids = tab.filters[key];
                let filterItem = tab.filterList.filter(item => item.filterKey == key)[0] || {};
                list.push(...(filterItem.list || []).filter(item => ids.indexOf(item[filterItem.valueKey]) != -1).map(item => {
                    return {
                        filterKey: filterItem.filterKey,
                        id: item[filterItem.valueKey],
                        name: item[filterItem.labelKey]
                    }
                }));
            }
            return list;
        },
    },
    async created() {
        // 筛选条件赋值
        for (let i = 0; i < this.filterTabs.length; i++) {
            let tab = this.filterTabs[i];
            for(let j = 0; j < tab.filterList.length; j++) {
                let item = tab.filterList[j];
                if (item.dictionaryCode) {
                    item.list = await this.getDictionaryById(item.dictionaryCode);
                }
            }
            if (i == 0) {
                this.handlePageChange(1);
            }
        }
    },
    methods: {
        handlePageChange(val) {
            this.pages.page = val;
            this.getList();
        },
        getParams() {
            let params = {
                ...this.pages,
                ...this.filters,
                LearningType: this.filterTabIndex + 1,
                QueryScope: 2,
                IsPrivate: this.IsPrivate,
                ..._extends(this.filterTabs[this.filterTabIndex].filters)
            }
            this.filterTabs[this.filterTabIndex].filterList.forEach(item => {
                if (item.checkAll) {
                    params[item.filterKey] = item.list.map(cItem => cItem[item.valueKey]);
                }
            });
            if (params.Year) {
                for(let i = 0; i < params.Year.length; i++) {
                    if (params.Year[i] == '更早') {
                        params.Year.splice(i, 1);
                        params.Year.push(...threeDecade);
                        break;
                    }
                }
            }
            return params;
        },
        async getList() {
            let params = this.getParams();
            this.loading = true;
            this.getCount();
            try {
                let res = await this.Post('/GetLearnings', params);
                if (res.status === 2000) {
                    this.list = res.data.list;
                    this.pages.total = res.data.count;
                }
            } catch (error) {
                console.error(error)
            }
            this.loading = false;
        },
        changeStore(num) {
            this.IsPrivate = num;
            this.handlePageChange(1);
        },
        changeType(index) {
            this.filterTabIndex = index;
            this.filterTabChangeFlag = true;
            this.$nextTick(() => {
                this.handlePageChange(1);
                this.filterTabChangeFlag = false;
            });
        },
        remove(row) {
            this.$confirm('确认删除该条数据吗？').then((_) => {
                this.Get('/DeleteLearning', {
                    learningId: row.LearningId,
                }).then((res) => {
                    if (res.status == 2000) {
                        this.getList();
                        this.$message({
                            message: '删除成功！',
                            type: 'success',
                        });
                    } else {
                        this.$message.error(res.message);
                    }
                });
            });
        },
        clearFilter() {
            for(let key in this.filterTabs[this.filterTabIndex].filters) {
                this.filterTabs[this.filterTabIndex].filters[key] = [];
            }
            this.filterTabs[this.filterTabIndex].filterList.forEach(item => {
                item.checkAll = true;
            });
            this.handlePageChange(1);
        },
        handleCheckAllChange(item) {
            item.checkAll = true;
            this.filterTabs[this.filterTabIndex].filters[item.filterKey] = [];
            this.handlePageChange(1);
        },
        async handleCheckedChange(item) {
            item.checkAll = !this.filterTabs[this.filterTabIndex].filters[item.filterKey].length;
            this.handlePageChange(1);
        },
        removeTag(item) {
            let tab = this.filterTabs[this.filterTabIndex];
            let filterIds = tab.filters[item.filterKey];
            let index = filterIds.indexOf(item.id);
            filterIds.splice(index, 1);
            tab.filterList.forEach(filterItem => {
                if (item.filterKey == filterItem.filterKey && !filterIds.length) {
                    filterItem.checkAll = true;
                }
            });
            this.handlePageChange(1);
        },
        add(item) {
            this.$refs['add' + (this.filterTabIndex + 1)].show(item)
        },
        preview(item) {
            this.$refs['detail' + (this.filterTabIndex + 1)].show(item)
        },
        levelIndex(name) {
            let list = ['', '一般事故', '较大事故', '重大事故', '特别重大事故'];
            return list.indexOf(name)
        },
        async getCount() {
            let res = await this.Get('/GetLearningSqlTotal');
            if (res.status == 2000) {
                let key = 'Count';
                if (this.IsPrivate == 0) {
                    key = 'Sup' + key;
                }
                this.filterTabs.forEach((item, index) => {
                    item.count = res.data[key + (index + 1)];
                })
                this.superCount = res.data.SupTotalCount;
                this.enterpriseCount = res.data.TotalCount
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.header{
    position: relative;
    padding-bottom: 24px;
    font-size: 18px;
    font-weight: 600;
    .header-tab{
        margin: 0 auto;
        position: relative;
        &::before{
            content: '';
            position: absolute;
            border-radius: 74px;
            border: 1px solid #fff;
            width: 74px;
            height: 74px;
            background: #63B0FF url(../../assets/images/data-base/learn.png) no-repeat center center;
            background-size: cover;
        }
    }
    .item{
        border-radius: 6px;
        padding: 15px 72px;
        background: #fff;
        color: $--color-primary;
        cursor: pointer;
        &.active{
            background: $--color-primary;
            color: #fff;
        }
    }
    .operation{
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
    }
}
.custom-operation{
    border-radius: 10px;
    background: #fff;
}
.filter-tabs{
    display: flex;
    border-bottom: 1px solid #F4F5F7;
    padding: 15px 34px 14px;
    .tab-item{
        margin-right: 70px;
        cursor: pointer;
        &.active{
            color: $--color-primary;
        }
    }
}
.filter{
    border-bottom: 1px solid #F4F5F7;
    padding: 15px 34px 14px;
    &.f--s{
        align-items: start;
    }
    .label{
        margin-right: 16px;
        white-space: nowrap;
    }
    .check-box-all{
        float: left;
    }
    .filtered{
        margin-left: 30px;
        flex-wrap: wrap;
        .remove{
            color: #959595;
            cursor: pointer;
            i{
                margin-right: 6px;
            }
            &:hover{
                color: #181B3B;
            }
        }
    }
    .tag{
        border: 1px dashed #DDDDDD;
        margin-right: 16px;
        padding: 6px 10px 6px 10px;
        color: #959595;
        &:last-child{
            margin-right: 23px;
        }
        i{
            margin-left: 15px;
            cursor: pointer;
        }
    }
}
.card-list{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 13px;
    grid-row-gap: 26px;
    width: 100%;
    .card-item{
        border-radius: 10px;
        padding-bottom: 28px;
        box-shadow: 0px 3px 15px 1px rgba(165,165,165,0.1608);
        overflow: hidden;
        .title{
            $colors: (
                1: #004BFF,
                2: #FE912E,
                3: #FF6F00,
                4: #FE3F51
            );
            $white-color: #fff;
            padding: 11px 20px;
            @each $key, $val in $colors {
                &.level-#{$key}{
                    color: $val;
                    background: mix($val, $white-color, 6%);
                    .tag{
                        border: 1px solid $val;
                    }
                    .round{
                        background: mix($val, $white-color, 16%);
                        &::before{
                            background: mix($val, $white-color, 54%);
                        }
                        &::after{
                            background: mix($val, $white-color, 100%);
                        }
                    }
                }
            }
            .tag{
                border-radius: 4px;
                padding: 4px 9px 3px;
                font-size: 13px;
            }
            .round{
                position: relative;
                margin-right: 10px;
                border-radius: 22px;
                width: 22px;
                height: 22px;
                &::before{
                    content: '';
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    bottom: 4px;
                    left: 4px;
                    border-radius: 100%;
                }
                &::after{
                    content: '';
                    position: absolute;
                    top: 7px;
                    right: 7px;
                    bottom: 7px;
                    left: 7px;
                    border-radius: 100%;
                }
            }
        }
        .content{
            margin-top: 27px;
            padding: 0 20px;
            line-height: 25px;
        }
        .footer{
            margin-top: 20px;
            padding: 0 20px;
            color: #959595;
        }
    }
}
.card-list1{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 34px;
    grid-row-gap: 22px;
    width: 100%;
    .card-item{
        border-radius: 4px 4px 10px 10px;
        border-top: 3px solid $--color-primary;
        box-shadow: 0px 3px 15px 1px rgba(165,165,165,0.1608);
        .content{
            padding: 26px 17px 27px 19px;
        }
        .footer{
            border-top: 1px solid #EFEFEF;
            padding: 14px 17px 13px 19px;
            color: #959595;
        }
    }
}
.card-list2{
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-column-gap: 30px;
    grid-row-gap: 39px;
    width: 100%;
    .card-item{
        border-radius: 6px;
        box-shadow: 0px 3px 15px 1px rgba(165,165,165,0.1608);
        overflow: hidden;
        .img-content{
            position: relative;
            width: 100%;
            height: 180px;
            background: #efefef;
            img{
                width: 100%;
                height: 100%;
            }
            .desc{
                position: absolute;
                right: 12px;
                bottom: 9px;
                left: 14px;
                color: #fff;
            }
        }
        .title{
            position: relative;
            padding: 18px 60px 17px 15px;
            display: block;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
        .video-operation{
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
        }
    }
}
.edit-icon{
    color: #959595;
    &:hover{
        color: $--color-primary;
    }
}
.remove-icon{
    margin-left: 8px;
    color: #959595;
    &:hover{
        color: $--color-danger;
    }
}
</style>
