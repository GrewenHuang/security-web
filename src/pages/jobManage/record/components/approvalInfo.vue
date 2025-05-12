<template>
    <div class="content">
        <!-- 审批 -->
        <el-table
            :data="list"
            border
            :header-cell-style="$tableStyle"
            :span-method="handlerMergeSpan"
        >
            <el-table-column
                type="index"
                label="序号"
                align="center"
                width="60"
            ></el-table-column>
            <el-table-column
                label="审批节点"
                align="center"
                width="200"
                prop="ApprovalNode"
            ></el-table-column>
            <el-table-column
                label="审批人"
                align="center"
                width="180"
                prop="UserName"
            ></el-table-column>
            <el-table-column
                label="审批时间"
                align="center"
                width="160"
                prop="ApprovalTimeDesc"
            ></el-table-column>
            <el-table-column
                label="意见"
                align="center"
                prop="ApprovalOpinion"
                min-width="200"
            ></el-table-column>
            <el-table-column
                label="照片"
                width="150"
                align="center"
            >
                <template slot-scope="{ row }">
                    <div v-if="row.FlowApprovalPhotos.length">
                        <el-image
                            style="width: 50px;height: 50px;"
                            :src="row.FlowApprovalPhotos[0].url"
                            :preview-src-list="row.FlowApprovalPhotos.map(o=>o.url)"
                        ></el-image>
                        <el-image
                            class="image-more"
                            style="width: 50px;height: 50px;"
                            :src="row.FlowApprovalPhotos[0].url"
                            :preview-src-list="row.FlowApprovalPhotos.map(o=>o.url)"
                            v-if="row.FlowApprovalPhotos.length > 1"
                        ></el-image>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="签名"
                align="center"
                width="120"
            >
                <template slot-scope="{ row }">
                    <el-image
                        style="height: 50px;"
                        :src="row.SignInUrl" 
                        v-if="row.SignInUrl"
                    ></el-image>
                </template>
            </el-table-column>
            <el-table-column
                label="备注"
                align="center"
                prop="Remark"
                min-width="200"
            ></el-table-column>
        </el-table>
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
    computed: {
        list() {
            let list = [];
            this.info.forEach(item => {
                item.Users.forEach((user, index) => {
                    list.push({
                        ...item,
                        ...user,
                        rows: index == 0 ? item.Users.length : 0
                    })
                });
            });
            return list;
        }
    },
    methods: {
        handlerMergeSpan({ row, column, rowIndex, columnIndex }) {
            if (columnIndex == 1) {
                return {
                    rowspan: row.rows,
                    colspan: row.rows > 0 ? 1 : 0,
                };
            }
        },
    },
}
</script>

<style lang="scss" scoped>
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