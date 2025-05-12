<template>
    <div class="editor" :class="{disabled: disabled}">
        <quill-editor class="quill-editor" ref="quillEditor"
            v-model='content'
            :options='editorOption'
            v-bind="$attrs"
            @change="change"
        />
    </div>
</template>

<script>
import { ImageDrop } from 'quill-image-drop-module';
import ImageResize from 'quill-image-resize-module';
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module';
import axios from "axios";
Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/ImageExtend', ImageExtend);
const localUploadUrl = process.env.API_UPLOAD_URL;
export default {
    props: {
        value: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: String,
            default: '请输入'
        },
		isTitle: {
			type: Boolean,
			default: true
		}
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                if(!this.watchUpdate) {
                    this.content = val;
                }
            }
        },
        content(val) {
            this.watchUpdate = true;
            this.$emit('change', val);
            this.$nextTick(() => {
                this.watchUpdate = false;
            });
        },
        disabled: {
            deep: true,
            immediate: true,
            handler(val) {
                this.$nextTick(() => {
                    this.$refs.quillEditor.quill.enable(!val);
                    let el = this.$refs.quillEditor.$el.querySelector('[contenteditable]');
                    el.setAttribute('data-placeholder', this.placeholder);
                });
            }
        },
		isTitle: {
            deep: true,
            immediate: true,
            handler(val) {
               if(!val){
				   this.editorOption.modules.toolbar = false
			   }else {
				   this.editorOption.modules.toolbar = {
					   container: [
					       ['bold', 'italic', 'underline', 'strike', {'color': []}, {'background': []}],        // 字体
					       ['image', { 'align': [] }]// 图片与文本居中
					   ],
					   handlers: {
					       image: function() {
					           QuillWatch.emit(this.quill.id);
					       }
					   }
				   }
			   }
            }
        },
    },
    data() {
        return {
            content: '',
            editorOption: {  //富文本配置
                placeholder: "请输入",
                modules: {
                    toolbar: {
                        container: [
                            ['bold', 'italic', 'underline', 'strike', {'color': []}, {'background': []}],        // 字体
                            ['image', { 'align': [] }]// 图片与文本居中
                        ],
                        handlers: {
                            image: function() {
                                QuillWatch.emit(this.quill.id);
                            }
                        }
                    },
                    imageDrop: true,
                    imageResize: {
                        displaySize: true
                    },
                    ImageExtend: {
                        name: 'img',
                        size: 5,
                        action: localUploadUrl,
                        headers: (xhr) => {  //请求头
                        },
                        response: (res) => {
                            return res.files[0].url;   //返回的图片信息
                        }

                    }
                }
            }
        }
    },
    methods: {
        createEditorPasteEvent(ref) {
            //  quill-editor 自定义粘贴图片功能
            this.$nextTick(() => {
                let quill = this.$refs[ref].quill;
                this.$forceUpdate();
                if (quill) {
                    quill.root.addEventListener(
                        "paste", this.pasteHandler,
                        false
                    );
                }
            });
        },
        pasteHandler(evt) {
            if (
                evt.clipboardData &&
                evt.clipboardData.files &&
                evt.clipboardData.files.length
            ) {
            evt.preventDefault();
            [].forEach.call(evt.clipboardData.files, (file) => {
                if (!file.type.match(/^image\/(gif|jpe?g|a?png|bmp)/i)) {
                    return;
                }
                const formData = new FormData();
                formData.append("pictureFile", file);
                axios.post(process.env.API_UPLOAD_URL, formData, {
                    headers: {
                        "Content-type": "multipart/form-data"
                    }
                })
                .then((res) => {
                    if (res.data.status == 2000) {
                        // const formdata = _.extend({}, this.formdata)
                        let length = quill.getSelection().index; //光标位置
                        // 插入图片  图片地址
                        quill.insertEmbed(length, "image", res.data.files[0].url);
                        // 调整光标到最后
                        quill.setSelection(length + 1); //光标后移一位
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
            });
            }
        },
        removeEditroPasteEvent(ref) {
            let quill = this.$refs[ref].quill;
            if (quill) {
                quill.root.removeEventListener('paste', this.pasteHandler);
                this.$forceUpdate();
            }
        },
        change({html, text, quill}) {
            // 固定图片大小
            let imgs = quill.root.querySelectorAll('img');
            if (imgs) {
                imgs.forEach(img => {
                    if (!img.getAttribute('width')) {
                        img.setAttribute('width', 100);
                    }
                })
            }
            this.content = this.$refs.quillEditor.$refs.editor.children[0].innerHTML;
        }
    },
    mounted() {
        this.createEditorPasteEvent('quillEditor');
    },
    beforeDestroy() {
        this.removeEditroPasteEvent('quillEditor');
    }
}
</script>

<style lang="scss" scoped>
.editor{
    height: 200px;
    .quill-editor{
        height: 100%;
        /deep/ .ql-container{
            height: calc(100% - 42px);
        }
    }
    &.disabled{
        background: #F8F8F8;
        .quill-editor{
            pointer-events: none;
        }
    }
}
</style>
