<template>
    <el-dialog v-dialog-drag 
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="disclose-completion"
        width="700px"
        top="8vh"
        v-loading="loading"
        element-loading-text="数据加载中"
    >
        <el-scrollbar class="scrollbar">
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
                ></el-table-column>
                <el-table-column
                    label="负责人"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="完成时间"
                    align="center"
                    width="140"
                >
                    <template slot-scope="{ row }">
                        {{ row.date ? row.date : '/' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态"
                    align="center"
                    width="120"
                >
                    <template slot-scope="{ row }">
                        <span class="status" :class="{undone: row.Status}">{{ row.Status ? '未完成' : '完成' }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>
    
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()"
                >关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
export default {
    name: 'disclose-completion',
    mixins: [request_mixin],
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
        }
    },
    computed: {
        title() {
            return '交底人数/完成人数'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            if (item) {
                this.loading = true;
                this.id = item.id;
                try {
                   let res = await this.Get('')
                   if (res.status == 2000) {
                   } else {
                       this.$message.error('获取数据失败');
                       this.close();
                   }
                } catch (error) {
                   console.error(error);
                }
                this.loading = false;
            }
        },
        close() {
            this.dislogShow = false;
            this.id = '';
        },
    }
}
</script>

<style lang="scss" scoped>
    .disclose-completion{
        /deep/ .el-dialog__body{
            padding: 16px 25px 25px !important;
        }
        /deep/ .el-dialog{
            min-width: 700px;
        }
        .status{
            color: $--color-primary;
        }
    }
</style>