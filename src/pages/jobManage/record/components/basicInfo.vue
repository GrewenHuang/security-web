<template>
    <div>
        <template v-for="(item, index) in fieldList">
            <div class="form-col" :key="index" v-if="index % 2 == 0">
                <div class="form-item">
                    <div class="label">{{ item.label }}：</div>
                    <div v-if="Array.isArray(item.value) && !item.joinJob">
                        <el-image
                            style="width: 80px;height: 80px;"
                            v-for="(img, i) in item.value"
                            :key="i"
                            :src="img.url" 
                            :preview-src-list="item.value.map(o=>o.url)"
                        ></el-image>
                    </div>
                    <div v-else-if="item.isSign">
                        <el-image
                            style="height: 50px;"
                            :src="item.value" 
                        ></el-image>
                    </div>
                    <div v-else>{{ item.value }}</div>
                </div>
                <div class="form-item" v-if="fieldList[index + 1]">
                    <div class="label">{{ fieldList[index + 1].label }}：</div>
                    <div v-if="Array.isArray(fieldList[index + 1].value) && !fieldList[index + 1].joinJob">
                        <el-image
                            style="width: 80px;height: 80px;"
                            v-for="(img, i) in fieldList[index + 1].value"
                            :key="i"
                            :src="img.url" 
                            :preview-src-list="fieldList[index + 1].value.map(o=>o.url)"
                        ></el-image>
                    </div>
                    <div v-else-if="fieldList[index + 1].isSign">
                        <el-image
                            style="height: 50px;"
                            :src="fieldList[index + 1].value" 
                        ></el-image>
                    </div>
                    <div v-else>{{ fieldList[index + 1].value }}</div>
                </div>
            </div>
        </template>
        <div class="join-job" v-if="joinJobList.length">
            <div class="title">关联作业</div>
            <template v-for="(item, index) in joinJobList">
                <div class="form-item f" :key="index">
                    <div class="label-1">关联作业{{ index + 1 }}：</div>
                    <div class="f">
                        <div class="label">作业票类型：</div>
                        <div>{{ item.AssociatedJobTemplateName }}</div>
                    </div>
                    <div class="f">
                        <div class="label">作业票名称：</div>
                        <div>{{ item.AssociatedJobName }}</div>
                    </div>
                    <div class="f">
                        <div class="label">作业票编号：</div>
                        <div>{{ item.AssociatedJobNumber }}</div>
                    </div>
                </div>
            </template>
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
        }
    },
    data() {
        return {
            fieldList: [],
            joinJobList: [],
        }
    },
    mounted() {
        this.setFields();
    },
    methods: {
        setFields() {
			// 0 常规作业 1 动火 2 受限空间 3 盲板抽堵 4 高处作业 5 吊装 6 临时用电 7 动土 8 断路
			const jobFormObj = {
				0: [{
					label: '作业内容',
					value: '',
					key: 'Content',
				}],
				1: [
					{
						label: '动火作业级别',
						value: {},
						key: 'levelName',
					},
					{
						label: '动火地点及动火部位',
						value: '',
						key: 'field1',
					},
					{
						label: '动火方式',
						value: '',
						key: 'field2',
					},
					{
						label: '作业内容',
						value: '',
						key: 'field3',
					},
				],
				2: [
					{
						label: '受限空间名称',
						value: '',
						key: 'field1',
					},
					{
						label: '受限空间内原有介质名称',
						value: '',
						key: 'field2',
					},
					{
						label: '作业内容',
						value: '',
						key: 'field3',
					},
				],
				3: [
					{
						label: '作业类别',
						value: {},
						key: 'text',
					},
					{
						label: '设备/管道名称',
						value: '',
						key: 'field2',
					},
					// {
					// 	label: '管道参数',
					// 	value: '',
					// 	key: '',
					// 	customClass: 'highlight-label',
					// },
					{
						label: '管道参数-介质',
						value: '',
						key: 'field3',
					},
					{
						label: '管道参数-温度',
						value: '',
						key: 'field4',
					},
					{
						label: '管道参数-压力',
						value: '',
						key: 'field5',
					},
					// {
					// 	label: '盲板参数',
					// 	value: '',
					// 	key: '',
					// 	customClass: 'highlight-label',
					// },
					{
						label: '盲板参数-材质',
						value: '',
						key: 'field6',
					},
					{
						label: '盲板参数-规格',
						value: '',
						key: 'field7',
					},
					{
						label: '盲板参数-编号',
						value: '',
						key: 'field8',
					},
					{
						label: '盲板编号',
						value: '',
						key: 'field9',
					},
					{
                        label: '盲板位置图',
						value: [],
						key: 'field10',
					},
					{
						label: '编制人签字',
						value: '',
						key: 'field11',
                        isSign: true,
					},
					{
						label: '编制人签字时间',
						value: '',
						key: 'field12',
					},
				],
				4: [
					{
						label: '作业地点',
						value: '',
						key: 'field1',
					},
					{
						label: '作业内容',
						value: '',
						key: 'field2',
					},
					{
						label: '作业高度',
						value: '',
						key: 'field3',
					},
					{
						label: '高处作业级别',
						value: '',
						key: 'field4',
					},
				],
				5: [
					{
						label: '吊装地点',
						value: '',
						key: 'field1',
					},
					{
						label: '吊具名称',
						value: '',
						key: 'field2',
					},
					{
						label: '吊物内容',
						value: '',
						key: 'field3',
					},
					{
						label: '吊物质量（T）及作业级别',
						value: '',
						key: 'field4',
					},
				],
				6: [
					{
						label: '作业地点',
						value: '',
						key: 'field1',
					},
					{
						label: '作业内容',
						value: '',
						key: 'field2',
					},
					{
						label: '电源接入点及许可用电功率',
						value: '',
						key: 'field3',
					},
					{
						label: '工作电压',
						value: '',
						key: 'field4',
					},
					{
						label: '用电设备名称及额定功率',
						value: '',
						key: 'field5',
					},
				],
				7: [
					{
						label: '作业地点',
						value: '',
						key: 'field1',
					},
					{
						label: '作业内容',
						value: '',
						key: 'field2',
					},
					{
						label: '作业范围/内容/方式（包括深度/面积）',
						value: '',
						key: 'field3',
					},
					{
                        label: '作业图',
						value: [],
						key: 'field4',
					},
					{
						label: '编制人签字',
						value: '',
						key: 'field5',
                        isSign: true,
					},
					{
						label: '编制人签字时间',
						value: '',
						key: 'field6',
					},
				],
				8: [
					{
						label: '涉及相关单位（部门）',
						value: '',
						key: 'field1',
					},
					{
						label: '断路原因',
						value: '',
						key: 'field2',
					},
					{
						label: '断路地段示意图相关说明',
						value: '',
						key: 'field3',
					},
					{
                        label: '断路地段示意图',
						value: [],
						key: 'field4',
					},
					{
						label: '编制人签字',
						value: '',
						key: 'field5',
                        isSign: true,
					},
					{
						label: '编制人签字时间',
						value: '',
						key: 'field6',
					},
				],
			}
            // 基础字段
			let fieldList = [
				{
					label: '作业票编号',
					value: '',
					key: 'Number',
				},
				{
					label: '作业票名称',
					value: '',
					key: 'Name',
				},
				{
					label: '作业实施开始时间',
					value: '',
					key: 'JobTicketStartTimeDesc',
				},
				{
					label: '作业实施结束时间',
					value: '',
					key: 'JobTicketEndTimeDesc',
				},
				{
					label: '作业申请单位',
					value: '',
					key: 'ApplyCompany',
				}
			];
            // 作业内容
            let type = this.info.JobTemplateId > 8 ? 0 : this.info.JobTemplateId;
            fieldList.push(...jobFormObj[type]);
            fieldList.push(...[
				{
					label: '作业单位',
					value: '',
					key: 'Company',
				},
				{
					label: '业务单号',
					value: '',
					key: 'BusinessNumber',
				},
                {
                    label: '申请时间',
                    value: '',
                    key: 'ApplyTimeDesc',
                },
                {
                    label: '申请人签字',
                    value: '',
                    key: 'ApplyUserSignInUrl',
                    isSign: true,
                }
            ]);
            
            let info = {
                ...this.info,
                ...JSON.parse(this.info.Content)
            };
            fieldList.forEach(item => {
                if (item.nameKey) {
                } else {
                    item.value = info[item.key];
                }
            })
            this.fieldList = fieldList;
            this.joinJobList = info.AssociatedJobs;
        }
    },
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
    .join-job{
        background: #F8F8F8;
        .title{
            padding: 15px 15px 0;
            font-weight: 600;
        }
        .form-item{
            border-bottom: 1px solid #EFEFEF;
            padding: 15px;
            .label-1{
                margin-right: 10px;
                color: #FE912E;
            }
            .label{
                font-weight: 600;
            }
            .f{
                margin-right: auto;
            }
        }
    }
</style>
