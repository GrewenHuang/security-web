<template>
    <div class="content">
        <!-- 安全措施落实 -->
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
                label="安全措施"
                align="center"
                prop="Content"
            ></el-table-column>
            <el-table-column
                label="是否涉及"
                align="center"
                width="120"
            >
                <template slot-scope="{ row }">
                    {{ row.IsRelate == 1 ? '是' : '否' }}
                </template>
            </el-table-column>
            <el-table-column
                label="现场照片"
                width="150"
                align="center"
            >
                <template slot-scope="{ row }">
                    <div v-if="row.SafetyMeasuresPhotos.length">
                        <el-image
                            style="width: 50px;height: 50px;"
                            :src="row.SafetyMeasuresPhotos[0].url"
                            :preview-src-list="row.SafetyMeasuresPhotos.map(o=>o.url)"
                        ></el-image>
                        <el-image
                            class="image-more"
                            style="width: 50px;height: 50px;"
                            :src="row.SafetyMeasuresPhotos[0].url"
                            :preview-src-list="row.SafetyMeasuresPhotos.map(o=>o.url)"
                            v-if="row.SafetyMeasuresPhotos.length > 1"
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
                        v-for="(url, index) in row.SignList"
                        :key="index"
                        style="height: 50px;"
                        :src="url.SignInUrl" 
                    ></el-image>
                </template>
            </el-table-column>
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
    }
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