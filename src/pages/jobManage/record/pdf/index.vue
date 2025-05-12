<template>
    <el-dialog
        v-dialog-drag
        :visible.sync="dislogShow"
        @close="close()"
        title="导出PDF预览"
        width="1000px"
        top="2vh"
        append-to-body
    >
        <el-scrollbar class="scrollbar">
            <!-- 导出PDF -->
            <div id="job-pdf">
                <div class="title">{{ baseInfo.Name }}</div>
                <div class="number">编号：{{ baseInfo.Number }}</div>
                <!--  >8 常规作业 1 动火 2 受限空间 3 盲板抽堵 4 高处作业 5 吊装 6 临时用电 7 动土 8 断路 -->
                <job :info="info" v-if="baseInfo.JobTemplateId > 8"/>
                <job1 :info="info" v-if="baseInfo.JobTemplateId == 1"/>
                <job2 :info="info" v-if="baseInfo.JobTemplateId == 2"/>
                <job3 :info="info" v-if="baseInfo.JobTemplateId == 3"/>
                <job4 :info="info" v-if="baseInfo.JobTemplateId == 4"/>
                <job5 :info="info" v-if="baseInfo.JobTemplateId == 5"/>
                <job6 :info="info" v-if="baseInfo.JobTemplateId == 6"/>
                <job7 :info="info" v-if="baseInfo.JobTemplateId == 7"/>
                <job8 :info="info" v-if="baseInfo.JobTemplateId == 8"/>
            </div>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="close()">关闭</el-button>
            <el-button type="primary" @click="exportPDF('job-pdf')">导出</el-button>
        </div>
    </el-dialog>
</template>

<script>
import job from './job';
import job1 from './job-1';
import job2 from './job-2';
import job3 from './job-3';
import job4 from './job-4';
import job5 from './job-5';
import job6 from './job-6';
import job7 from './job-7';
import job8 from './job-8';
import { Pdf } from '@/plugins/htmlToPdf';
export default {
    components: {
        job,
        job1,
        job2,
        job3,
        job4,
        job5,
        job6,
        job7,
        job8,
    },
    props: {
        info: {
            type: [Object, Array],
            default() {
                return {}
            }
        }
    },
    computed: {
        baseInfo() {
            return this.info.BaseInfo
        }
    },
    data() {
        return {
            dislogShow: true,
        }
    },
    methods: {
        close() {
            this.dislogShow = false;
            this.$emit('close');
        },
        exportPDF (id) {
            const loading = this.$loading({
                lock: true,
                text: '正在导出中，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, .3)'
            });
            this.$nextTick(() => {
                Pdf.downPdf(id, this.info.BaseInfo.Name).then(res => {
                    setTimeout(() => {
                        loading.close();
                    }, 1000);
                });
            })
        },
    }
}
</script>

<style lang="scss" scoped>
#job-pdf{
    // position: fixed;
    // top: 0;
    // z-index: -1;
    margin: 0 auto;
    padding: 30px 25px;
    width: 210mm;
    font-family: 宋体;
    font-size: 14px;
    background: #fff;
    box-sizing: border-box;
    .title{
        margin-bottom: 5px;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
    }
    .number{
        padding: 0 10px 5px 0;
        text-align: right;
    }
    @media print {
        @page {
            size: A4 portrait;
        }
    }
}
</style>