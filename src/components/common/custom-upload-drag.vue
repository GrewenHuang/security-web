
<template>
    <div :class="{ 'upload-mask': mask }">
        <el-upload
            action
            v-bind="$attrs"
            :accept="accept"
            class="upload-demo"
            :drag="drag"
            :http-request="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
            :on-change="
                (file, fileList) => {
                    qiniuChange(file);
                }
            "
            v-if="uploadModel == 1"
        >
            <template
                v-if="
                    !Object.keys($slots).length ||
                    !Object.keys($scopedSlots).length
                "
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                    支持图片、视频、word、pdf等文件
                </div>
            </template>
            <slot
                v-for="(_, slotName) in $slots"
                :name="slotName"
                :slot="slotName"
            >
                {{ slotName }}
            </slot>
            <template
                v-for="(_, scopeSlotName) in $scopedSlots"
                #[scopeSlotName]="scope"
            >
                <slot :name="scopeSlotName" v-bind="scope">
                    {{ scopeSlotName }}
                </slot>
            </template>
        </el-upload>
        <el-upload
            v-bind="$attrs"
            :accept="accept"
            class="upload-demo"
            :drag="drag"
            :action="localUploadUrl"
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
            :show-file-list="false"
            v-else
        >
            <template
                v-if="
                    !Object.keys($slots).length ||
                    !Object.keys($scopedSlots).length
                "
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                    支持图片、视频、word、pdf等文件
                </div>
            </template>
            <slot
                v-for="(_, slotName) in $slots"
                :name="slotName"
                :slot="slotName"
            >
                {{ slotName }}
            </slot>
            <template
                v-for="(_, scopeSlotName) in $scopedSlots"
                #[scopeSlotName]="scope"
            >
                <slot :name="scopeSlotName" v-bind="scope">
                    {{ scopeSlotName }}
                </slot>
            </template>
        </el-upload>

        <template v-if="showFileList">
            <div v-for="(k, v) in fileList" :key="v" class="fileLists">
                <div style="display: flex">
                    <img
                        style="width: 30px; height: 30px"
                        :src="
                            $fileIcons[
                                k.name.substring(k.name.lastIndexOf('.') + 1)
                            ]
                        "
                    />
                    <div class="text">
                        <span style="color: #44566c; font-size: 12px">{{
                            k.name
                        }}</span>
                        <span style="color: #a8b0b6; font-size: 12px"
                            >{{ Math.floor(k.size / 1024) }}Kb</span
                        >
                    </div>
                </div>

                <i class="el-icon-delete" @click="delUploadFile(v)"></i>
            </div>
        </template>
    </div>
</template>

<script>
import * as qiniu from "qiniu-js";
import Cookies from "js-cookie";
import request_mixin from "@/mixins/request-mixin.js";
import axios from "axios";
function getMediaDuration(fileUrl) {
    return new Promise((resolve, reject) => {
        let audioElement = new Audio(fileUrl); //audio也可获取视频的时长
        audioElement.addEventListener("loadedmetadata", function (_event) {
            let duration = parseInt(audioElement.duration);
            resolve(duration);
        });
    });
}
const localUploadUrl = process.env.API_UPLOAD_URL;
function  dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), 
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
function base64Upload(res) {
    return new Promise(async (resolve, reject) =>{
        let blob = dataURLtoBlob(res);
        let formData = new FormData();
        formData.append('file', blob, 'sign.png');
        let config = {
            headers: {
                "Content-type": "multipart/form-data",
            },
        };
        try {
            const result = await axios.post(localUploadUrl, formData, config).then(r => r.data);
            if (result.status == 2000) {
                resolve(result.files[0].url);
            }
        } catch (error) {
            console.error(error)
        }
    })
}
function getVideoCoverUrl(file){
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file.raw)
        reader.onload = () => {
            let el = document.createElement('video');
            el.src = reader.result;
            el.currentTime = 2;
            el.oncanplay = async () => {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                canvas.setAttribute('width', 360);
                canvas.setAttribute('height', 230);
                el.setAttribute('width', 360);
                el.setAttribute('height', 230);
                ctx.drawImage(el, 0, 0, el.width, el.height);
                let imgSrc = await base64Upload(canvas.toDataURL('image/png'));
                resolve(imgSrc)
            }
        }
    });
}
const fileMessages = {
    pdf: "application/pdf",
    mp4: "video/mp4",
    mp3: "audio/mpeg",
    jpeg: "image/jpeg",
    jpg: "image/jpg",
    gif: "image/gif",
    png: "image/png",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/pdf": "pdf",
    "video/mp4": "mp4",
    "audio/mpeg": "mp3",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "image/gif": "gif",
    "image/png": "png",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
};
export default {
    props: {
        Data: {
            type: Array,
        },
        typeName: {
            type: String,
            default: "培训课件",
        },
        maxSize: {
            type: [String, Number],
            default: 500,
        },
        showFileList: {
            type: Boolean,
            default: true,
        },
        paramsType: {
            type: [Number, String],
            default: 0, // 0 普通上传参数， 1 用于学习上传。 两则参数名不一样
        },
        // 全屏遮罩上传
        // false 仅支持七牛云上传使用，会出发 onProgress 事件，返回上传进度
        mask: {
            type: Boolean,
            default: true,
        },
        drag: {
            type: Boolean,
            default: true,
        },
        acceptList: {
            type: Array,
            default() {
                return [];
            },
        },
        handleCheckFile: Function,
        single: {
            type: Boolean,
            default: false
        }
    },
    mixins: [request_mixin],
    watch: {
        Data(val) {
            this.fileList = val;
        },
        acceptList: {
            immediate: true,
            deep: true,
            handler(val) {
                if (val.length) {
                    let mimeTypes = val.map((key) => {
                        return fileMessages[key];
                    });
                    let acceptStr = mimeTypes.join(",");
                    this.accept = acceptStr;
                    this.mimeType = mimeTypes;
                }
            },
        },
    },
    data() {
        return {
            accept: "all",
            mimeType: [
                "application/pdf",
                "video/mp4",
                "image/png",
                "image/jpeg",
                "image/gif",
            ],
            unloadloading: { close() {} },
            fileList: [],
            flieArr: this.$fileIcons,
            localUploadUrl,
            uploadModel: 0, // 0 本地上传 1 七牛云上传
            currentFile: null
        };
    },
    mounted() {
        this.fileList = this.Data || [];
    },
    methods: {
        delUploadFile(index) {
            this.fileList.splice(index, 1);
        },
        getOssKey(regulatorName, type, file) {
            let key = "";
            key = key + type + "/";
            key += regulatorName + "/";
            let nowDate = new Date();
            key = key + nowDate.getFullYear();
            key = key + "-" + (nowDate.getMonth() + 1);
            key = key + "-" + nowDate.getDate();
            key = key + "/" + nowDate.getTime() + file.name;
            return key;
        },
        beforeAvatarUpload(file) {
            let that = this;
            if (
                typeof that.handleCheckFile == "function" &&
                !that.handleCheckFile(file)
            ) {
                that.unloadloading.close();
                return false;
            }
            if (that.mask) {
                that.unloadloading = this.$loading({
                    lock: true,
                    text: "上传中(0%)...",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)",
                });
            }
            if (!this.accept.includes(file.type) && this.accept != "all") {
                let acceptList = this.accept.split(",");
                let fileTypeMess = [];
                acceptList.forEach((item) => {
                    if (fileMessages[item]) {
                        fileTypeMess.push(fileMessages[item]);
                    }
                });
                if (fileTypeMess.length) {
                    that.$message.error(`仅支持${fileTypeMess.join("、")}文件`);
                } else {
                    that.$message.error("请按要求上传文件");
                }
                that.unloadloading.close();
                return false;
            }
            let fileSize = file.size / 1024 / 1024;
            let MaxFileSize = isNaN(Number(that.maxSize))
                ? 500
                : Number(that.maxSize);
            if (fileSize > MaxFileSize) {
                that.$message.error(
                    "上传的文件过大，请压缩至" + MaxFileSize + "M之内再进行上传"
                );
                that.unloadloading.close();
                return false;
            }
            that.$emit("onProgress", 0, true);
        },
        qiniuChange(file) {
            this.currentFile = file;
        },
        handleAvatarSuccess(e) {
            let that = this;
            //获取oss的token
            this.Get("/GetOssToken", {}).then((result) => {
                if (result.status == 2000) {
                    let config = {
                        useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                        forceDirect: true,
                    };
                    let key = this.getOssKey(
                        Cookies.get("RegulatorName"),
                        that.typeName,
                        e.file
                    );
                    let putExtra = {
                        params: {}, //用来放置自定义变量
                        mimeType: that.mimeType, //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
                    };
                    var observable = qiniu.upload(
                        e.file,
                        key,
                        result.data.token,
                        putExtra,
                        config
                    );
                    observable.subscribe({
                        next: (result) => {
                            if (that.mask) {
                                that.unloadloading.text =
                                    "上传中(" +
                                    result.total.percent.toFixed(2) +
                                    "%)...";
                            } else {
                                that.$emit(
                                    "onProgress",
                                    parseFloat(result.total.percent.toFixed(2)),
                                    true
                                );
                            }
                        },
                        error: (errResult) => {
                            // 失败报错信息
                            that.$message.error(
                                "上传出错:" + errResult.message
                            );
                            that.unloadloading.close();
                        },
                        complete: async (result) => {
                            let classify = /jpg|jpeg|png|gif/.test(result.ext.replace(".", "")) ? 'Image' : 'File';
                            // 接收成功后返回的信息
                            let File = {
                                classify,
                                name: result.fname,
                                url: result.key,
                                size: result.fsize,
                                ext: result.ext.replace(".", ""),
                                coverUrl: "  ",
                                lengths: 0 || Number(result.totalSeconds).toFixed(0),
                            };
                            if (that.paramsType == 1) {
                                File = {
                                    Classify: classify,
                                    Name: result.fname,
                                    Url: result.key,
                                    Size: result.fsize,
                                    Ext: result.ext.substring(
                                        1,
                                        result.ext.length
                                    ),
                                    CoverUrl: "  ",
                                    Lengths:
                                        Number(result.totalSeconds).toFixed(
                                            0
                                        ) || 0,
                                };
                            }
                            if (File.ext == 'mp4' || File.Ext == 'mp4') {
                                if (this.paramsType == 1) {
                                    File.CoverUrl = await getVideoCoverUrl(that.currentFile);
                                } else {
                                    File.coverUrl = await getVideoCoverUrl(that.currentFile);
                                }
                            }
                            if (this.single) {
                                that.fileList = [File]
                            } else {
                                that.fileList.push(File);
                            }
                            that.$emit("onProgress", 0, false);
                            that.$emit("onUpload", this.fileList, File);
                            this.$emit('update:Data', this.fileList);
                            that.currentFile = null;
                            that.unloadloading.close();
                        },
                    });
                } else {
                    that.$message.error("获取osstoken失败,请联系管理员!");
                    that.unloadloading.close();
                    return false;
                }
            });
        },
        /** 本地上传方法  start */
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
                let index = this.fileList.findIndex(
                    (item) => file.url == item.url
                );
                this.fileList.splice(index, 1);
            }
            return false;
        },
        async change(file) {
            var that = this;
            if (
                typeof that.handleCheckFile == "function" &&
                !that.handleCheckFile(file)
            ) {
                that.unloadloading.close();
                return false;
            }
            let fileSize = file.size / 1024 / 1024;
            let MaxFileSize = 500;
            if (fileSize > MaxFileSize) {
                that.$message.error(
                    "上传的文件过大，请压缩至" + MaxFileSize + "M之内再进行上传"
                );
                that.unloadloading.close();
                return false;
            }
            let type = file.type || file.raw.type;
            if (!this.accept.includes(type) && this.accept != "all") {
                let acceptList = this.accept.split(",");
                let fileTypeMess = [];
                acceptList.forEach((item) => {
                    if (fileMessages[item]) {
                        fileTypeMess.push(fileMessages[item]);
                    }
                });
                if (fileTypeMess.length) {
                    that.$message.error(`仅支持${fileTypeMess.join("、")}文件`);
                } else {
                    that.$message.error("请按要求上传文件");
                }
                that.unloadloading.close();
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
                try {
                    let config = {
                        headers: {
                            "Content-type": "multipart/form-data",
                        },
                    };
                    const res = await this.Post(
                        that.localUploadUrl,
                        formData,
                        config,
                        { timeout: 1000 * 60 * 3 }
                    );
                    if (res.status == 2000) {
                        if (res.errors.length) {
                            this.$message.error(
                                "上传失败," + res.errors[0].error
                            );
                        } else {
                            for (let i = 0; i < res.files.length; i++) {
                                let item = res.files[i];
                                item.lengths = 0;
                                if (/mp3|mp4/.test(item.ext)) {
                                    item.lengths = await getMediaDuration(
                                        item.url
                                    );
                                }
                            }
                            let result = res.files[0];
                            let File = {
                                ...result,
                                name: result.name,
                                url: result.url,
                                size: result.size,
                                ext: result.ext.replace(".", ""),
                                coverUrl: "  ",
                                lengths: Number(result.lengths).toFixed(0),
                            };
                            if (this.paramsType == 1) {
                                File = {
                                    Classify: result.classify,
                                    Name: result.name,
                                    Url: result.url,
                                    Size: result.size,
                                    Ext: result.ext.replace(".", ""),
                                    CoverUrl: "  ",
                                    Lengths: Number(result.lengths).toFixed(0) || 0,
                                };
                            }
                            if (File.ext == 'mp4' || File.Ext == 'mp4') {
                                if (this.paramsType == 1) {
                                    File.CoverUrl = await getVideoCoverUrl(file);
                                } else {
                                    File.coverUrl = await getVideoCoverUrl(file);
                                }
                            }
                            if (this.single) {
                                that.fileList = [File]
                            } else {
                                that.fileList.push(File);
                            }
                            that.$emit("onUpload", that.fileList, File);
                            this.$emit('update:Data', this.fileList);
                        }
                    }
                } catch (ex) {
                    this.$message.error("网络异常，请稍后重试");
                }
                loading.close();
            }
            return false;
        },
        /** 本地上传方法  end */
        async getUploadModel() {
            let res = await this.Get("/GetFileType");
            this.uploadModel = +res.data.fileType;
        },
    },
    created() {
        this.getUploadModel();
    },
};
</script>

<style scoped>
.fileLists {
    display: flex;
    margin-top: 20px;
    align-items: center;
    height: 50px;
    background: #f8fafb;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
}
.text {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    line-height: normal;
}

.upload-mask /deep/ .el-upload {
    width: 100%;
}
.upload-mask /deep/ .el-upload-dragger {
    background-color: #f8fafb !important;
    border: 1px dashed #ecedef !important;
    border-radius: 6px;
    box-sizing: border-box;
    width: 100%;
    height: 75px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}
.upload-mask /deep/ .el-icon-upload {
    font-size: 25px !important;
    color: #44566c !important;
    margin: 0 !important;
}
.upload-mask /deep/ .el-upload__text {
    color: #44566c !important;
    font-size: 14px;
    text-align: center;
}

.el-upload__tip {
    color: #a8b0b6;
}
</style>