<template>
    <div>
        <div class="form-col form-item">
            <div class="f--c">
                <div class="label">设备名称：</div>
                <div>{{ info.EquipmentName }}</div>
            </div>
            <div class="f--c">
                <div class="label">设备类型：</div>
                <div>{{ info.EquipmentTypeName }}</div>
            </div>
        </div>
        <div class="form-col form-item">
            <div class="f--c">
                <div class="label">规格型号：</div>
                <div>{{ info.Specification }}</div>
            </div>
            <div class="f--c">
                <div class="label">主要性能参数：</div>
                <div>{{ info.MainParameter }}</div>
            </div>
        </div>
        <div class="form-col form-item">
            <div class="f--c">
                <div class="label">出厂日期：</div>
                <div>{{ info.FactoryDateDesc }}</div>
            </div>
            <div class="f--c">
                <div class="label">出厂编号：</div>
                <div>{{ info.FactoryNo }}</div>
            </div>
        </div>
        <div class="form-col form-item">
            <div class="f--c">
                <div class="label">自编码：</div>
                <div>{{ info.OwnCode }}</div>
            </div>
            <div class="f--c">
                <div class="label">状态：</div>
                <div>{{ info.SupplyStatusDesc }}</div>
            </div>
        </div>
        <div class="f--c form-item">
            <div class="label">设备照片：</div>
            <div>
                <el-image
                    style="width: 90px;height: 90px; margin-right: 10px;"
                    v-for="(item, index) in info.EquipmentPhotos"
                    :key="index"
                    :src="item.url"
                    :preview-src-list="info.EquipmentPhotos.map(item=>item.url)"
                ></el-image>
            </div>
        </div>
        <!-- <div class="f--c form-item">
            <div class="label">设备附件：</div>
            <file-list v-model="info.EquipmentFiles" style="margin-top: 10px;"></file-list>
        </div> -->
    </div>
</template>

<script>
import fileList from '@/components/common/file-list.vue';
export default {
    components: {
        fileList
    },
    props: {
        info: {
            type: Object,
            default() {
                return {}
            }
        }
    }
}
</script>

<style lang="scss" scoped>

.form-col{
    display: flex;
    >div{
        flex: 1;
        &:not(:last-child){
            margin-right: 40px;
        }
    }
}
.form-item{
    border-bottom: 1px solid #EFEFEF;
    padding: 20px 15px;
    .label{
        font-weight: 600;
    }
}
</style>