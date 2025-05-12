<template>
    <div class="custom-upload">
        <el-upload
			:limit="limit"
            :action="url()"
            :accept="$attrs.accept || all_suffix"
            :list-type="listType"
            :before-upload="before"
            :on-change="
                (file, fileList) => {
                    change(file);
                }
            "
            :before-remove="
                (file, fileList) => {
                    return before_remove(file);
                }
            "
            :file-list="fileList"
            v-bind="$attrs"
            :on-preview="preview"
        >
            <slot v-for="(_, slotName) in $slots" :name="slotName" :slot="slotName"/>
            <template v-for="(_, scopeSlotName) in $scopedSlots" #[scopeSlotName]="scope" >
                <slot :name="scopeSlotName" v-bind="scope" />
            </template>
        </el-upload>
    </div>
</template>

<script>
function getMediaDuration(fileUrl) {
    return new Promise((resolve, reject) => {
        let audioElement = new Audio(fileUrl);//audio也可获取视频的时长
        audioElement.addEventListener("loadedmetadata", function (_event) {
            let duration = parseInt(audioElement.duration);
            resolve(duration)
        });
    })
}
import axios from "axios";
function transformTitleCase(list) {
    list.forEach(item => {
        for(let key in item) {
            let upperCase = key.replace(/[a-z]{0,1}/, function(a,b,c) {
                return a.toLocaleUpperCase()
            });
            item[upperCase] = item[key];
        }
    });
}
export default {
    name: "custom-upload",
    inheritAttrs: false,
    props: {
        fileList: {
            type: [Array, null],
            default: () => []
        },
        onlyUpload: Boolean,
        listType: {
            type: String,
            default: 'list'
        },
		limit: {
			type: Number,
			default: 10000000000
		},
        titleCase: false,
        single: false
    },
    data() {
        return {
            preview_url: "",
            fileShow: false,
            preview_visible: false,
            document_suffix: ".txt,.doc,.docx,.xls,.xlsx,.pdf",
            image_suffix: ".jpg,.png,.gif,.bmp",
            all_suffix:
                ".txt,.doc,.xls,.ppt,.pdf,.jpg,.png,.gif,.bmp,.docx,.xlsx,.pptx,.mp4,.avi,.mov",
        };
    },
    methods: {
        url: function () {
            var API_UPLOAD_URL = process.env.API_UPLOAD_URL;
            return API_UPLOAD_URL;
        },
        before() {
            return false;
        },
        before_remove(file) {
            var that = this;
            if (file && file.status === "success") {
                return this.$confirm(
                    `确定移除 ${file.name}？`,
                    "提示",
                    {}
                ).then(
                    () => {
                        that.remove(file);
                        return reject(false);
                    },
                    () => {
                        reject(false);
                    } //取消 时的处理
                );
            }
        },
        remove(file) {
            if (file && file.status === "success") {
                let index = this.fileList.findIndex(item => file.url == item.url);
                this.fileList.splice(index, 1);
                this.$emit('update:fileList', this.fileList);
            }
            return false;
        },
        async change(file) {
            var that = this;

            let name = file.name || file.raw.name;
            let type = name.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)[0];
            if (!(this.$attrs.accept||this.all_suffix).includes(type)) {
                that.$message.error(`仅支持${this.$attrs.accept||this.all_suffix}文件`);
                return false;
            }

            const loading = this.$loading({
                lock: true,
                text: "上传中...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            if (file && file.status === "ready") {
                let formData = new FormData();
                formData.set("file", file.raw);
				// formData.set("IsWater",'1')
				// formData.set("Location",'布莱克')
                try {
                    let config = {
                        headers: {
                            "Content-type": "multipart/form-data",
                        },
                    };
                    const res = await axios.post(that.url(), formData, config);
                    if (res.status == 200 && res.data.status == 2000) {
                        if (res.data.errors.length) {
                            this.$message.error(
                                "上传失败," + res.data.errors[0].error
                            );
                        } else {
                            for(let i = 0; i < res.data.files.length; i++) {
                                let item = res.data.files[i];
                                if (/mp3|mp4/.test(item.ext)) {
                                    item.duration = await getMediaDuration(item.url);
                                }
                            }
                            if (this.titleCase) {
                                transformTitleCase(res.data.files);
                            }
                            if (this.single) {
                                this.fileList.splice(0, 1, res.data.files[0]);
                            } else {
                                this.fileList.push(...res.data.files);
                            }
                            this.$emit('change', this.fileList);
                            this.$emit('update:fileList', this.fileList);
							this.$emit('OcrChange');
                            if (this.onlyUpload) {
                                this.fileList.splice(0, 1);
                            }
                        }
                    }
                } catch (ex) {
                    this.$message.error("网络异常，请稍后重试");
                }
                loading.close();
            }
            return false;
        },
        preview(file) {
            window.open(file.viewurl);
        },
    },
};
</script>

<style lang="scss" scoped>
</style>