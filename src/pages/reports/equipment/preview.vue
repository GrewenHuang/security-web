<template>
    <el-dialog
        v-dialog-drag
        :title="title"
        :visible.sync="dislogShow"
        @close="close()"
        class="info"
        width="1300px"
        top="8vh"
    >
        <div style="height: 75vh;">
            <info style="height: 100%;" ref="info" :customStyles="{position: 'initial'}" @close="close"/>
        </div>
    </el-dialog>
</template>

<script>
import info from '@/pages/equipmentManage/preview';
export default {
    components: {
        info
    },
    data() {
        return {
            dislogShow: false,
        }
    },
    computed: {
        title() {
            return '查看'
        }
    },
    methods: {
        async show(item) {
            this.dislogShow = true;
            this.$nextTick(() => {
                this.$refs.info.show(item);
            });
        },
        close() {
            this.dislogShow = false;
        }
    }
}
</script>

<style lang="scss" scoped>
    .info{
        /deep/ .el-dialog__body{
            padding: 0 !important;
           .el-scrollbar__wrap{
               margin-bottom: 0 !important;
           }
        }
        /deep/ .full-screen-edit{
            #euipment-detail{
                padding: 15px 15px 0;
            }
        }
    }
</style>