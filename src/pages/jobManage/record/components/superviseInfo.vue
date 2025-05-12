<template>
    <div class="content">
        <!-- 监督 -->
        <el-table
            :data="info"
            border
            :header-cell-style="$tableStyle"
        >
            <el-table-column
                type="index"
                label="序号"
                align="center"
                width="60"
            ></el-table-column>
            <el-table-column
                label="监督时间"
                align="center"
                min-width="160"
                prop="RecordTimeDesc"
            ></el-table-column>
            <el-table-column
                label="监督人"
                align="center"
                min-width="180"
                prop="UserName"
            ></el-table-column>
            <el-table-column
                label="签名"
                align="center"
                min-width="120"
            >
                <template slot-scope="{ row }">
                    <el-image
                        style="height: 50px;"
                        :src="row.SignInUrl" 
                    ></el-image>
                </template>
            </el-table-column>
            <el-table-column
                label="监督详情"
                align="center"
                min-width="120"
            >
                <template slot-scope="{ row }">
                    <el-button type="text" @click="preview(row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <el-dialog
            v-dialog-drag
            title="监督详情"
            :visible.sync="dislogShow"
            @close="close()"
            class="info"
            width="700px"
            append-to-body
        >
            <el-scrollbar class="scrollbar">
                <div class="title">{{ detail.Name }}</div>
                <div class="item" v-for="(item, index) in detail.Contents" :key="index">
                    <div class="name">{{ item.Name }}</div>
                    <div class="f">
                        <div class="custom-btn" :class="{active: item.whether == 0}">否</div>
                        <div class="custom-btn" :class="{active: item.whether == 1}">是</div>
                    </div>
                </div>
            </el-scrollbar>
        </el-dialog>
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
        }
    },
    data() {
        return {
            dislogShow: false,
            detail: {}
        }
    },
    methods: {
        preview(item) {
            this.dislogShow = true;
            this.detail = JSON.parse(item.ItemJson);
        },
        close() {
            this.dislogShow = false;
            this.detail = {};
        }
    }
}
</script>

<style lang="scss" scoped>
.title{
    font-size: 16px;
    font-weight: 600;
    text-align: center;
}
.item{
    border-bottom: 1px solid #EFEFEF;
    padding: 15px;
    .name{
        border-bottom: 1px solid #efefef;
        margin-bottom: 10px;
        padding-bottom: 15px;
    }
    .custom-btn{
        flex: 1;
        border-radius: 4px;
        border: 1px solid #959595;
        height: 30px;
        line-height: 30px;
        text-align: center;
        &:first-child{
            margin-right: 10px;
        }
        &.active{
            border-color: $__color-primary;
            background: $__color-primary;
            color: #fff;
        }
    }
}
.content{
    padding: 20px 15px; 
    
    .image-more{
        position: relative;
        border-radius: 4px;
        margin-left: 7px;
        overflow: hidden;
        &::before{
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: #F8F8F8;
            pointer-events: none;
        }
        &::after{
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-top: 2px dotted #959595;
            width: 10px;
        }
    }
}
</style>