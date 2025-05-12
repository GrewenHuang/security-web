<template>
    <div>
        <train ref="train" @load="load"/>
        <safeMeeting ref="safeMeeting" @load="load"/>
        <pitfall ref="pitfall" @load="load"/>
        <dailyTasks ref="dailyTasks" @load="load"/>
    </div>
</template>

<script>
import train from './components/train.vue';
import safeMeeting from './components/safeMeeting.vue';
import pitfall from './components/pitfall.vue';
import dailyTasks from './components/dailyTasks.vue';
export default {
    name: 'super-task-info',
    components: {
        train,
        safeMeeting,
        pitfall,
        dailyTasks
    },
    data() {
        return {
            taskType: '',
        }
    },
    methods: {
        show(item) {
            this.taskType = item.TaskType;
            const componentsRef = {
                1: 'train',
                2: 'safeMeeting',
                3: 'pitfall',
                4: 'dailyTasks',
            }
            let refKey = componentsRef[this.taskType];
            if (refKey && this.$refs[refKey]) {
                this.$refs[refKey].show(item);
            }
        },
        load() {
            this.$emit('load');
        }
    }
}
</script>

<style lang="scss" scoped>
</style>