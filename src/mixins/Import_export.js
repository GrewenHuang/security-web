import axios from 'axios'

export default {
	methods: {
		downloadmb(url) {
			const loading = this.$loading({
				lock: true,
				text: '下载中,请稍等...',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});

			this.Get("/" + url).then(res => {
				loading.close();
				if (res.status == 2000) {
					if (res.data.Url.substring(res.data.Url.length - 3).toUpperCase() == "PDF") {
						window.open(res.data.Url, '_blank');
					} else {
						var elemIF = document.createElement('iframe')
						elemIF.src = res.data.Url
						elemIF.style.display = 'none'
						document.body.appendChild(elemIF)
					}
				} else {
					this.$message.error({
						showClose: true,
						message: res.message
					});
				}
			})
		},
		downloadmbs(FileBigType, FileType, DownloadParameter, EnterpriseId) {
			if (DownloadParameter instanceof Object) {
				if(DownloadParameter.length){
					DownloadParameter = JSON.stringify(DownloadParameter)
				}else {
					let filteredObj = Object.fromEntries(
						Object.entries(DownloadParameter).filter(([key, value]) => {
							// 过滤掉空字符串、undefined 和 null 值
							return value !== "" && value !== undefined && value !== null;
						})
					);
					DownloadParameter = JSON.stringify(filteredObj)
				}
				
			}
			this.Post("/SaveFileExportRecord", {
				FileBigType,
				FileType,
				DownloadParameter,
				EnterpriseId,
				DownloadType: 1
			}).then(res => {
				if (res.status == 2000) {
					this.$bus.$emit("getDownloadList");
				}
			})
		},

		async handleExcel(file, url, params) { //导入
			var that = this;
			const loading = this.$loading({
				lock: true,
				text: '导入中...',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});
			if (file && file.status === "ready") {
				let formData = new FormData();
				formData.set("file", file.raw);
				if (({}).toString.call(params) == '[object Object]') {
					for (let key in params) {
						formData.set(key, params[key]);
					}
				}
				try {
					const res = await axios.post(process.env.API_ROOT + url, formData, {
						headers: {
							"Content-type": "multipart/form-data",
							"ttoken": window.localStorage.getItem('ttoken')
						}
					})

					if (res.data.status === 2000) {
						that.$message.success({
							showClose: true,
							message: res.data.message,
							duration: 1500,
						});
						this.GetList()
						loading.close()
					} else if (res.data.status === 2050) {
						res.data.message = res.data.message.replace(/,|，/g, "<br>")
						res.data.message = res.data.message + ",文件导入失败，请完善文件后重新导入"
						that.$message.error({
							dangerouslyUseHTMLString: true,
							showClose: true,
							message: res.data.message,
							duration: 0
						});
						loading.close()
					}

				} catch (ex) {
					console.log(ex);
				}
			}
		},
	}
}