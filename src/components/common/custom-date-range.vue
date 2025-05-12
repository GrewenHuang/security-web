<template>
    <div class="date-range">
        <el-date-picker
            ref="startDate"
            :placeholder="startDatePlaceholder"
            value-format="yyyy-MM-dd"
            :disabled="isLong"
            v-model="startDate"
            @change="changeDate('endDate')"
        ></el-date-picker>
        <span class="delimiter">{{ delimiter }}</span>
        <el-date-picker
            ref="endDate"
            :placeholder="endDatePlaceholder"
            value-format="yyyy-MM-dd"
            v-model="endDate"
            @change="changeDate('startDate')"
            :disabled="isLong"
        ></el-date-picker>
        <div class="is-long" v-if="hasIsLong">
            <el-checkbox v-model="isLong" @change="changeCheckbox">长期</el-checkbox>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: String, // 返回值：'startDate,endDate,isLong'  逗号分割
            default: ''
        },
        delimiter: {
            type: String,
            default: '-'
        },
        hasIsLong: {
            type: Boolean,
            default: true
        },
        startDatePlaceholder: {
            type: String,
            default: '开始日期'
        },
        endDatePlaceholder: {
            type: String,
            default: '结束日期'
        }
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    data() {
        return {
            startDate: '',
            endDate: '',
            isLong: false
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(val='') {
                let newVal = val || '';
                let list = newVal.split(',');
                this.startDate = list[0] || '';
                this.endDate = list[1] || '';
                this.isLong = list[2] == 1;
            }
        }
    },
    computed: {
        valueFormat() {
            return [this.startDate, this.endDate, +this.isLong].join(',')
        }
    },
    methods: {
        changeDate(key) {
            if (!this[key]) {
                this.$refs[key].focus();
            }
            this.$emit('change', this.valueFormat)
        },
        changeCheckbox() {
            if (this.isLong) {
                this.startDate = '';
                this.endDate = '';
            }
            this.$emit('change', this.valueFormat)
        }
    },

}
</script>

<style lang="scss" scoped>
.date-range{
    display: flex;
    align-items: center;
    width: 100%;
    .delimiter{
        margin: 0 8px;
    }
    .el-date-editor{
        width: 100%;
        /deep/ input{
            padding-right: 10px;
        }
    }
    .is-long{
        margin-left: 18px;
        /deep/ .el-checkbox__input{
            transform: scale(1.3);
            .el-checkbox__inner{
                border-color: #DDDDDD;
            }
            &.is-checked{
                .el-checkbox__inner{
                    border-color: $--color-primary;
                }
            }
        }
    }
}

</style>