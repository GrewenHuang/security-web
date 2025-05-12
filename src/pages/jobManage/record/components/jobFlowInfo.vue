<template>
    <div>
        <!-- 负责人审批 -->
        <template v-for="(item, index) in fieldList">
            <div class="form-col" :key="index" v-if="index % 2 == 0">
                <div class="form-item">
                    <div class="label">{{ item.Name }}：</div>
                    <div>{{ item.value }}</div>
                </div>
                <div class="form-item" v-if="fieldList[index + 1]">
                    <div class="label">{{ fieldList[index + 1].Name }}：</div>
                    <div>{{ fieldList[index + 1].value }}</div>
                </div>
            </div>
        </template>
        <div class="form-col">
            <div class="form-item">
                <div class="label">作业负责人审批签字：</div>
                <div>
                    <el-image
                        style="height: 50px;"
                        :src="signUrl" 
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
        signUrl: [String],
        jobTemplateId: [String, Number]
    },
    computed: {
        fieldList() {
            let certNames = {
                1: '动火证',
                6: '电工证'
            }
            let certName = certNames[this.jobTemplateId];
            return this.info.map(item => {
                return {
                    ...item,
                    value: item.Users.map(user => {
                        return user.UserName + (user.CertificateNo && certName ? `（${certName}：${user.CertificateNo}）` : '');
                    }).join('、')
                }
            })
        }
    },
    mounted() {
    }
}
</script>

<style lang="scss" scoped>

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
        .label{
            font-weight: 600;
            white-space: nowrap;
        }
    }
}
</style>
