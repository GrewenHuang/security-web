<template>
	<div class="container" style="height: 100%">
		<!-- 左侧 -->
		<div class="left-content">
			<div>
				<a href="/" class="logo" :title="TITLE">
					{{TITLE}}
					<!-- <img src="../assets/images/logo.png" alt=""> -->
				</a>
			</div>
			<!--左侧导航-->
			<el-scrollbar class="el-scrollbar slider-menu">
				<!--导航菜单-->
				<el-menu class="el-menu-vertical-demo" :default-active="$route.path" unique-opened router
					@select="selectmenu">
					<template v-for="(item, index) in menus">
						<el-submenu v-if="item.children && item.children.length" :index="index + ''" :key="index">
							<template slot="title">
								<i class="menu-icon iconfont" :class="item.iconCls"></i>
								<span slot="title">{{ item.title }}</span>
							</template>
							<menu-tree :menuData="item.children"></menu-tree>
						</el-submenu>
						<el-menu-item class="first-menu" :key="index" :index="item.path" v-else-if="item.pid == 0">
							<span slot="title">
								<i class="menu-icon iconfont" :class="item.iconCls"></i>
								{{ item.title }}
							</span>
						</el-menu-item>
						<el-menu-item :key="index" :index="item.path" v-else>
							<span slot="title">
								{{ item.title }}
							</span>
						</el-menu-item>
					</template>
				</el-menu>
			</el-scrollbar>
		</div>
		<!-- 右侧 -->
		<div class="right">
			<!-- 头部 -->
			<div class="f-b-c topbar-account">
				<div class="enterprise-name">{{ enterprise.EnterpriseName }}</div>
				<div class="f">
					<div class="f messages" @click="onFull">
						<i class="el-icon-full-screen" style="font-size: 18px"></i>
						切换屏幕
					</div>
					<div class="f messages" v-if="$_has('SJKBBTNLOOK')">
						<el-link href="#/transit-board" target="_blank">
							<i class="el-icon-s-platform" style="font-size: 18px"></i>
							数据看板
						</el-link>
						<!-- <el-link href="#" target="_blank">
						      <i class="el-icon-s-platform" style="font-size: 18px"></i>
						      数据看板
						  </el-link> -->
					</div>
					<div class="f messages" style="position: relative" v-if="$_has('XZLBLOOK')">
						<i class="el-icon-download" style="font-size: 18px"></i>
						<span @click="dropdownShow()">下载列表</span>
						<el-badge :is-dot="DownloadNum > 0" type="danger" class="item"></el-badge>
						<div class="dropdown" ref="treeWrap" v-if="false && dropdownFlag">
							<div class="dropdown_title">
								<span>
									<i class="el-icon-folder-opened" style="font-size: 15px"></i>
									<span>文件下载列表</span>
								</span>
								<span @click="DeleteFileExportRecord('', 2)" style="cursor: pointer">
									清空全部
								</span>
							</div>
							<div style="height: 365px">
								<el-scrollbar style="height: 100%">
									<div class="dropdown_list" v-for="(item, i) in DownloadList" :key="i">
										<div>
											<div v-if="item.FileName" style="
                                                    width: 200px;
                                                    overflow: hidden;
                                                    text-overflow: ellipsis;
                                                    white-space: nowrap;
                                                ">
												<i class="i"></i>{{ item.FileName }}
											</div>
											<div>
												<span :style="{
                                                        color: item.ColorCode,
                                                    }">{{
                                                        item.TaskStateDesc
                                                    }}</span>
												<el-button type="text" v-if="item.TaskState == 2" @click="
                                                        GetFileExportRecord(
                                                            item.FileExportRecordId
                                                        )
                                                    ">下载</el-button>
											</div>
										</div>
										<div>
											<i class="el-icon-delete" @click="
                                                    DeleteFileExportRecord(
                                                        item.FileExportRecordId,
                                                        1
                                                    )
                                                "></i>
										</div>
									</div>
								</el-scrollbar>
							</div>
						</div>
					</div>

					<!--  <div class="f messages" @click="Navtourl('/Mail')">
                        <i class="el-icon-s-comment"></i>
                        待办事项<el-badge
                            :is-dot="messageCount > 0"
                            type="danger"
                            class="item"
                        ></el-badge>
                    </div> -->
					<el-dropdown trigger="click" placement="bottom-start">
						<span class="el-dropdown-link userinfo-inner">
							<i class="el-icon-user-solid"></i>
							{{ nickname }}
							<i class="el-icon-arrow-down"></i>
						</span>
						<el-dropdown-menu slot="dropdown" style="min-width: 100px;">
							<el-dropdown-item>
								<div @click="dialogOpen('userInfo')">
									<span style="color: #555; font-size: 14px">个人信息</span>
								</div>
							</el-dropdown-item>
							<el-dropdown-item>
								<div @click="dialogOpen('Password')">
									<span style="color: #555; font-size: 14px">修改密码</span>
								</div>
							</el-dropdown-item>
							<!-- <el-dropdown-item>
                                <div
                                    @click="
                                        downloadmb(
                                            'GetTemplateFile?templateFileEnumNum=6'
                                        )
                                    "
                                >
                                    <span style="color: #555; font-size: 14px"
                                        >操作手册</span
                                    >
                                </div>
                            </el-dropdown-item> -->
							<el-dropdown-item>
								<div @click="logout">
									<span style="color: #555; font-size: 14px">退出登录</span>
								</div>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</div>
			<!--  -->
			<layout-header></layout-header>
			<!--右侧内容区-->
			<div class="main">
				<transition name="main" mode="out-in">
					<!-- <keep-alive> -->
						<router-view style="height: 100%;" v-if="routerAlive"></router-view>
					<!-- </keep-alive> -->
				</transition>
			</div>
		</div>

		<!--编辑弹层 开始-->
		<el-dialog v-dialog-drag :title="title" :visible.sync="dialogEditShow" :close-on-click-modal="false"
			@close="dialogEditClose()" width="25%">
			<template>
				<Password v-if="block" />
				<UserInfo :fatherMethod="dialogEditClose" v-else />
			</template>
		</el-dialog>

		<!--编辑弹层 开始-->
		<el-dialog v-dialog-drag title="到期提醒" v-loading="loading" :visible.sync="dialogWarning"
			:close-on-click-modal="false" @close="dialogHideWarning()" width="80%">
			<el-row>
				<el-col :span="24">
					<el-form :inline="true">
						<el-form-item>
							<ZYselect url="GetExpirationReminderFormCom" clearable placeholder="表单类型" propid="id"
								propname="text" @returnData="getFormValue($event)" />
						</el-form-item>
						<el-form-item>
							<ZYselect url="GetExpirationReminderTypeCom" clearable placeholder="过期类型" propid="id"
								propname="text" @returnData="getTypeValue($event)" />
						</el-form-item>
						<el-form-item>
							<el-input v-model="filter.expirationReminderContent" placeholder="表单内容" clearable>
							</el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="Seach()">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="Seach()">刷新</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="warning" @click="
                                    downloadmbs(130, 1301, {
                                        ExpirationReminderForm:
                                            filter.expirationReminderForm,
                                        ExpirationReminderContent:
                                            filter.expirationReminderContent,
                                        ExpirationReminderType:
                                            filter.expirationReminderType,
                                    });
                                    dialogWarning = false;
                                ">导出</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<el-table style="width: 100%" :data="tableData" height="500" :header-cell-style="{ 'text-align': 'center' }"
				:cell-style="{ 'text-align': 'center' }">
				<el-table-column label="序号" align="center" type="index">
				</el-table-column>
				<el-table-column label="表单类型" align="center" prop="CategoryLabel">
				</el-table-column>
				<el-table-column label="表单内容" align="center" prop="Content">
				</el-table-column>
				<el-table-column label="过期内容" align="center" prop="FieldLabel">
				</el-table-column>
				<el-table-column label="有效期" align="center" width="300px">
					<template slot-scope="scope">
						<el-row>
							<el-col :span="18">
								<el-date-picker v-model="scope.row.ExpirationTime" type="date" value-format="yyyy-MM-dd"
									placeholder="选择日期" style="width: 100px">
								</el-date-picker>
							</el-col>
							<el-col :span="6">
								<el-button type="primary" @click="
                                        UpdateExpiration(
                                            scope.row.Id,
                                            scope.row.Category,
                                            scope.row.Field,
                                            scope.row.ExpirationTime
                                        )
                                    " style="margin-left: 2px">更新</el-button>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column label="过期类型" align="center">
					<template slot-scope="scope">
						<el-tag size="small" :type="
                                scope.row.TypeDesc == '已过期'
                                    ? 'danger'
                                    : 'warning'
                            ">{{ scope.row.TypeDesc }}</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
		<el-dialog v-dialog-drag title="下载列表" :visible.sync="dropdownFlag" :close-on-click-modal="true"
			@close="dropdownFlag = false" width="600" class="todo" :modal="false">
			<el-scrollbar class="scrollbar">
				<ul class="download-list">
					<li class="f-b-c" v-for="(item, index) in DownloadList" :key="index">
						<div class="file-icon" :class="getFileIcon(item)"></div>
						<div class="f1">
							<div class="f-b-c">
								<div class="file-name">
									{{ item.FileName }}
								</div>
							</div>
							<div class="download-status">
								<template v-if="item.TaskState == 2">
									<span>{{ item.Size | sizeStr }}</span>
								</template>
								<span :style="{
                                        // color: item.ColorCode,
                                    }">{{
                                        item.TaskStateDesc
                                    }}</span>
							</div>
						</div>
						<div>
							<div class="down-operation">
								<i class="operation-icon el-icon-download cursor-p" v-if="item.TaskState == 2" @click="
                                        GetFileExportRecord(
                                            item.FileExportRecordId
                                        )
                                    "></i>
								<i class="operation-icon cursor-p"
									:class="item.TaskState == 2 ? 'el-icon-delete' : 'el-icon-error'" @click="
                                        DeleteFileExportRecord(
                                            item.FileExportRecordId,
                                            1
                                        )
                                    "></i>
							</div>
						</div>
					</li>
				</ul>
			</el-scrollbar>
			<div slot="footer">
				<el-button type="primary" @click="DeleteFileExportRecord('', 2)">一键清空</el-button>
			</div>
		</el-dialog>
	</div>
</template>


<script>
	import util from "@/common/util.js";
	import {
		bus
	} from "../bus.js";
	import API from "../api/api_user";
	import menuTree from "@/components/common/menuTree";
	import layoutHeader from "@/components/common/tabNav";
	import {
		mapActions
	} from "vuex";
	import request_mixin from "@/mixins/request-mixin.js";
	import formatter_mixin from "@/mixins/formatter-mixin.js";
	import page_mixin from "@/mixins/page-minxin.js";
	import Import_export from "@/mixins/Import_export.js";
	import ZYselect from "@/components/common/zy_select";
	//修改密码
	import Password from "@/pages/System/Password";
	//用户信息
	import UserInfo from "@/pages/System/UserInfo";
	/**
	 * 字典获取
	 */
	import '@/common/setDictionaries'

	import Qs from "qs";

	let loginUrl = util.getLoginUrl();

	function isFullscreen() {
		return !!(document.fullScreenElement || document.fullscreenElement || document.webkitFullscreenElement || document
			.mozFullScreenElement || document.msFullscreenElement);
	}
	export default {
		name: "home",
		components: {
			layoutHeader,
			menuTree,
			Password,
			UserInfo,
			ZYselect,
		},
		watch: {
			DownloadList() {
				this.timer();
			}
		},
		mixins: [request_mixin, formatter_mixin, page_mixin, Import_export],
		filters: {
			sizeStr: util.change_size
		},
		data() {
			return {
				DownloadNum: 0,
				dropdownFlag: false,
				DownloadList: "", //下载任务list
				dialogWarning: false, //过期弹框
				dialogEditShow: false, //弹窗显示状态
				title: "修改密码",
				block: true,
				nickname: "",
				enterprise: {},
				messageCount: 0,
				loop: 1, //刷新 消息通知次数,-1无限刷新,1刷新一次
				frequency: 30000, //刷新 消息通知频率,毫秒
				func: null, //刷新 消息通知函数
				menus: [],
				tableData: [],
				FormCom: [], //表单类型
				TypeCom: [], //到期类型
				loading: false,
				filter: {
					expirationReminderForm: "", //string 选填 表单类型
					expirationReminderContent: "", //string 选填 表单内容
					expirationReminderType: -100, // int 选填 过期类型
				},
				routerAlive: true, //解决多路由跳转到同一个页面不刷新问题
				TITLE: process.env.TITLE, //备案号
				isFull: ""
			};
		},
		created() {
			bus.$on("goto", (url) => {
				if (url === loginUrl) {
					localStorage.removeItem("userinfo");
					localStorage.removeItem("ttoken");
					localStorage.removeItem("enterpriseId");
					localStorage.removeItem("menus");
				}
				this.$router.push(url);
			});
		},
		
		methods: {
			onFull() {
				let flag = isFullscreen();
				if (!flag) {
					var el = document.documentElement;
					// 进入全屏模式
					if (el.requestFullscreen) {
						el.requestFullscreen();
					} else if (el.mozRequestFullScreen) {
						el.mozRequestFullScreen();
					} else if (el.webkitRequestFullscreen) {
						el.webkitRequestFullscreen();
					} else if (el.msRequestFullscreen) {
						el.msRequestFullscreen();
					}
				} else {
					if (document.exitFullscreen) {
						document.exitFullscreen();
					} else if (document.mozCancelFullScreen) {
						/* Firefox */
						document.mozCancelFullScreen();
					} else if (document.webkitExitFullscreen) {
						/* Chrome, Safari and Opera */
						document.webkitExitFullscreen();
					} else if (document.msExitFullscreen) {
						/* IE/Edge */
						document.msExitFullscreen();
					}
				}
				this.isFull = !this.isFull
			},
			GetFileExportRecord(fileExportRecordId) {
				let that = this;
				this.Get("/GetFileExportRecord", {
					fileExportRecordId,
				}).then((res) => {
					if (res.status == 2000) {
						var elemIF = document.createElement("a");
						if (res.data.Url.indexOf("http") == -1) {
							that.Get("/GetOssUrl", {
								key: res.data.Url
							}).then(
								(result) => {
									elemIF.href = result.data.url;
								}
							);
						} else {
							elemIF.href = res.data.Url;
						}
						elemIF.click();
						that.getDownloadList();
					} else {
						that.$message.error({
							showClose: true,
							message: "下载失败",
							duration: 2000,
						});
					}
				});
			},
			UpdateExpiration(Id, Category, Field, ExpirationTime) {
				let that = this;
				that.Post("/UpdateExpiration", {
					Id,
					Category,
					Field,
					ExpirationTime,
				}).then((res) => {
					if (res.status == 2000) {
						that.GetExpirationReminders();
						that.$message({
							type: "success",
							message: "更新成功!",
						});
					}
				});
			},
			DeleteFileExportRecord(fileExportRecordId, delType) {
				let that = this;
				that.Post("/DeleteFileExportRecord", {
					fileExportRecordId,
					delType,
				}).then((res) => {
					if (res.status == 2000) {
						that.getDownloadList();
					}
				});
			},
			dropdownShow() {
				this.dropdownFlag = true;
				this.getDownloadList();
			},

			getDownloadList() {
				this.Post("/GetFileExportRecords", {
					page: 1,
					rows: 100,
				}).then((res) => {
					if (res.status == 2000) {
						this.DownloadNum = res.data.count;
						this.DownloadList = res.data.list;
					}
				});
			},
			timer() {
				const delay = 1000 * 60 * 2; // 2分钟刷新数据
				return setTimeout(() => {
					this.getDownloadList();
					this.GetSystemMessageRecordCount();
				}, delay);
			},
			Seach() {
				this.GetExpirationReminders();
			},
			getFormValue(e) {
				if (e) {
					this.filter.expirationReminderForm = e;
				} else {
					this.filter.expirationReminderForm = "";
				}
			},
			getTypeValue(e) {
				if (e) {
					this.filter.expirationReminderType = e;
				} else {
					this.filter.expirationReminderType = -100;
				}
			},
			Navtourl(url) {
				this.$router.push(url);
				this.selectmenu(url);
			},
			toPage(url) {
				this.$router.push(url);
			},
			dialogEditClose() {
				this.dialogEditShow = false;
			},
			dialogHideWarning() {
				this.dialogWarning = false;
			},
			dialogWarningOpen() {
				this.GetExpirationReminders();
				this.dialogWarning = true;
			},
			dialogOpen(t) {
				this.dialogEditShow = true;
				if (t == "userInfo") {
					this.block = false;
					this.title = "用户信息";
				} else {
					this.block = true;
					this.title = "修改密码";
				}
			},

			//折叠导航栏
			collapse() {
				this.$store.dispatch("collapse");
			},
			selectmenu(key) {
				let router = this.menus;
				let name = false;
				let _this = this;
				let navTitle2 = function(fullPath) {
					// 没有菜单的页面获取标题
					let path = "";
					if (fullPath.indexOf("?") != -1) {
						path = fullPath.slice(0, fullPath.indexOf("?")); // 去掉参数
					} else {
						path = fullPath;
					}
					_this.$store.state.tabnavBox.forEach((item) => {
						// path有带参数并且参数不同时
						if (
							item.path.indexOf("?") != -1 &&
							item.path.slice(0, fullPath.indexOf("?")) === path &&
							item.path !== fullPath
						) {
							item.path = fullPath; // 重新赋值
							name = item.title;
						} else {
							let p = _this.$store.state.noMenuPages.filter(
								(v) => v.path === path
							);
							if (p && p.length > 0) name = p[0].title;
						}
					});
					return name;
				};
				let navTitle = function(path, routerARR) {
					// path = path.split('?')[0];
					// 左边菜单页面获取标题
					let path1 = path.replace(/\=.+&{0,}/, '');
					for (let i = 0; i < Object.keys(routerARR).length; i++) {
						let pathStr = ((routerARR[i] || {}).path || '');
						let path2 = pathStr.replace(/\=.+&{0,}/, '');
						if (routerARR[i].children || path1 === path2) {
							if (pathStr.includes(path1)) {
								name = routerARR[i].title;
								_this.routerAlive = false;
								_this.$nextTick(() => {
									_this.routerAlive = true;
								});
								break;
							}
							navTitle(path, routerARR[i].children);
						}
					}
					return name;
				};
				if (!key.startsWith("http")) {
					_this.$store.dispatch("addTab", {
						title: navTitle(key, router) || navTitle2(key),
						path: key,
					});
				}
			},
			logout() {
				let that = this;
				this.$confirm("确认退出吗?", "提示", {

				}).then(() => {
					//确认
					that.loading = true;
					API.logout()
						.then(function(res) {
							window.localStorage.removeItem("userinfo");
							window.localStorage.removeItem("ttoken");
							window.localStorage.removeItem("enterpriseId");
							window.localStorage.removeItem("menus");
							that.headHTMLObserve && that.headHTMLObserve.disconnect();
							that.$router.go(loginUrl); //用go刷新
						})
						.catch((err) => {
							that.$message.error({
								showClose: true,
								message: err.message,
								duration: 2000,
							});
						});
				}).catch(() => {});
			},
			GetSystemMessageRecordCount() {
				let that = this;
				that.Get("/GetSystemMessageRecordCount", {}).then((result) => {
					if (result != null && result.status == 2000) {
						that.messageCount = result.data;
					}
				});
			},
			GetExpirationReminders() {
				let that = this;
				that.loading = true;
				this.Post("/GetExpirationReminders", this.filter).then((res) => {
					if (res.status == 2000) {
						this.tableData = res.data;
					}
					that.loading = false;
				});
			},

			GetSystemMessage() {
				//获取待办事项
				this.Get("/GetSystemMessageRecordNotic").then((res) => {
					//待办事项
					if (res.status == 2000) {
						if (res.data && res.data.length) {
							res.data.forEach((item, index) => {
								setTimeout(() => {
									this.$notify({
										message: item.MessageContent,
										position: "bottom-right",
										type: "warning",
										duration: 0,
										onClick: () => {
											this.$router.push("/Mail");
											this.selectmenu("/Mail");
										},
									});
								}, 100 * index);
							});
						} else {
							return false;
						}
					}
				});
			},
			getFileIcon(item) {
				let config = {
					pdf: 'pdf',
					mp4: 'mp4',
					docx: 'docx',
					doc: 'docx',
					xls: 'xlsx',
					xlsx: 'xlsx',
					jpg: 'jpg',
					jpeg: 'jpg',
					png: 'jpg',
				}
				let suffix = item.Url;
				if (suffix) {
					let index = suffix.lastIndexOf('.');
					suffix = suffix.substring(index + 1);
				}
				return config[suffix || 'doc'];
			},
		},
		destroyed() {
			clearTimeout(this.timer);
		},
		mounted() {
			/* document.addEventListener("mouseup", (e) => {
			    //鼠标失去焦点事件
			    let tree = this.$refs.treeWrap;
			    if (tree) {
			        if (!tree.contains(e.target)) {
			            this.dropdownFlag = false;
			        }
			    }
			}); */
			let that = this;
			let userInfo = Qs.parse(window.localStorage.getItem("userinfo"));

			that.nickname = userInfo.UserName;
			that.enterprise = userInfo.Enterprise;
			that.menus = JSON.parse(window.localStorage.getItem("menus"));
			// 刷新保留当前路径和首页
			that.$router.push(that.$route.fullPath);
			that.selectmenu(that.$route.fullPath);

			setTimeout(function() {
				that.getDownloadList();
				that.GetSystemMessageRecordCount();
			}, 10);

			that.func = setInterval(function() {
				that.getDownloadList();
				that.GetSystemMessageRecordCount();
				if (that.loop <= 0) {
					clearInterval(that.func);
				}
				that.loop--;
			}, that.frequency);

			this.getDownloadList();
			this.$bus.$on("getDownloadList", () => {
				this.getDownloadList();
				if (this.$_has('XZLBLOOK')) {
					this.dropdownShow();
				} else {
					this.$message.warning('当前账号没有下载的权限,请联系管理员添加')
				}
			});
			this.$bus.$on("dialogWarningOpen", () => {
				this.dialogWarningOpen();
			});

			this.$bus.$on("Getroute", (e) => {
				this.$router.push(e.url);
				this.selectmenu(e.url);
			});
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
	.container {
		display: flex;
	}

	.dropdown {
		position: absolute;
		top: 25px;
		left: 0;
		width: 300px;
		height: 400px;
		background: #fff;
		z-index: 999;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
		border-radius: 5px;
		padding: 10px;
		box-sizing: border-box;
	}

	.dropdown_title {
		color: #939399;
		font-size: 14px;
		height: 30px;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #939399;
	}

	.dropdown_title>span:nth-child(1) {
		font-weight: 550;
	}

	.dropdown_title>span:nth-child(2) {
		color: #409eff;
		font-size: 14px;
	}

	.dropdown_list {
		color: #333333;
		font-size: 14px;
		margin: 10px 0;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px dashed #ddd;
	}

	.i {
		width: 5px;
		height: 5px;
		display: inline-block;
		background: #000;
		border-radius: 50%;
	}

	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;

		.left-content {
			width: 264px;
			min-width: 264px;
			height: 100%;
			padding: 0 10px;
			background: #1A43A9;

			.logo {
				display: flex;
				align-items: center;
				justify-content: center;
				border-bottom: 1px solid #6078a8;
				margin: 0 -10px;
				padding: 11px 26px 12px;
				height: 70px;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
				font-size: 18px;
				color: #fff;

				img {
					width: auto;
					height: 38px;
				}
			}

			.el-scrollbar {
				height: calc(100% - 77px);
			}
		}

		.topbar-account {
			border-bottom: 1px solid #F0F4F8;
			height: 70px;
			color: #212844;
			background: #fff;

			.enterprise-name {
				padding-left: 21px;
				font-size: 23px;
				font-weight: bold;
			}

			.messages {
				margin-right: 20px;
				cursor: pointer;

				i {
					font-size: 20px;
					margin-right: 6px;
				}

				a {
					color: #212844;

					&:hover {
						color: #212844;
						text-decoration: none;

						&::after {
							display: none;
						}
					}
				}
			}

			.userinfo-inner {
				display: flex;
				align-items: center;
				font-size: 14px;
				margin-right: 28px;
				display: inline-block;
				cursor: pointer;
				padding-left: 10px;
				color: #212844;

				i.el-icon-user-solid {
					font-size: 20px;
					margin-right: 6px;
					vertical-align: middle;
				}

				i.el-icon-arrow-down {
					vertical-align: middle;
					font-size: 18px;
					margin-left: 6px;
				}
			}
		}

		.right {
			width: calc(100% - 264px);
			min-width: 1000px;
			height: 100%;
			background: #F4F5F7;

			.main {
				padding: 20px 25px 0;
				height: calc(100% - 155px);
				overflow: auto;
			}

			footer {
				height: 35px;
				margin: 0 21px;
				line-height: 35px;
				text-align: center;
				font-size: 14px;
				color: #204192;
				box-sizing: border-box;
			}
		}

		.item {
			margin-top: -5px;
		}

		.el-table--scrollable-y {
			/deep/.el-table__body-wrapper::-webkit-scrollbar {
				width: 4px;
			}

			/deep/.gutter {
				width: 4px !important;
			}
		}

		.el-table--scrollable-y {
			/deep/.el-table__body-wrapper::-webkit-scrollbar-thumb {
				background-color: #d8d8d8ff;
				border-radius: 7px;
				// box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
			}
		}

		/*定义滚动条的轨道颜色、内阴影及圆角*/
		.el-table--scrollable-y {
			/deep/.el-table__body-wrapper::-webkit-scrollbar-track {
				// box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
				background-color: #fff;
				border-radius: 3px;
			}
		}
	}

	.download-list {
		color: #181B3B;

		li {
			padding: 13px 25px 14px;
			margin-right: -10px;

			&:not(:last-child) {
				border-bottom: 1px solid #ECEDEF;
			}

			.file-icon {
				margin-right: 12px;
				width: 28.82px;
				height: 33.25px;
				background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAtFJREFUWEftl11IVEEUx/9zd+/HLpYpZOhL0EOSgRJBpa8SgVApFEhFSFCQJpImaJ8U5WpG3xolpSCEYmj2YATli7AhBEFID5k9pGkYbvi5H969N2YGdZW9e/curvTgvNy5M+fM/OZ/zrmXIQhph0pmqglsRYC+PXTcan9kZHBcVsRcd3vGgJkvWTA4XDxXD4ILZg7RzI+N/sDs7ORcYlLSXjMIBnC0WE8IEO90NItHY0MBPBNjkBWnKQQDKCiZy9YAdzSLR2OzAEBtzSDiDmAGsSYAkSDWDMAIIi4Afz2/MfprKGy6rMyJuADQnf+MD2N6yhMWQtO1xeqIG4BZtQhATleD8+M6wP+vQFoKQXIi/2UMDGpmoWXzuzJs7Dn0U8PUjB7Wx1IOXC+VkZUuIP+cd9liisRffYGlYYEAnY8cbGClfaizJYDCPBGFeXZU1PkxNMxVSN1M8OSawvqnLvngmeQn3ZNpw8UzErp7VTR3zhsqZglgxzYBrnIZrz+oaOniix45YMeJgyLrt/WoaOvh4yXHROzPsePyA3/EkFkCoAs3XlXgdABF1T620b1qGVtTBQgC2OmpCrQ11yggZMnOSALLAKXHJeRm21BW44ckAvWVMvo+BSFLXHYaHocC3CyT8d6t4vFLY/kplGWAzHQBN0plFoJNGwnyc+2obQpA08Fi/uqdCrsdbNz1LID+L0HD+McEQJ067jvw9buGtC0EsgicrOKyt9YpmFcBrw9ISSYorPAiaFKxlhWgG1WdlrAvi9f42z4VT9u5zEUFIjs5be7PQdx+HlKXBjrEBLB7pw1XzvLiD81y+qF6cYuX5MPWAHr7I8sfcwhowrnOy2yj8jr/srPdreIAtU1+jE+E//qFOsSkQMSssji5DrCuwDIFVvtqFk0+SrpjQ0cjmYnL5dQUQMed7kZnJbVbBKAvq3U9NwYg33QEW940JLgWbP4BTtWVMKuGSEIAAAAASUVORK5CYII=') no-repeat center center;
				background-size: contain;
				$fileImages: (pdf 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAkBJREFUWEdjZEACiUciK5kY/yf8Z2BQQxYnlX3n6r1XHBwszrvijl0hpJcRpiDxSEQ3IyNDCSENxMg/uPmA4eP7T9+ERQXMCTkC7ICs/aE8P9iYPxNjODFqQA548fglAycPJ0FHgB2QdDTSkoHh/zFiDCdGDcwBILWEHEFzBxByBF0cgM8RdHMALkfQxAEvn7xiuH/jPtbkgp4maOIAkM1P7j1leP/mPVZH/Pv3D547aOYAwrmF0Wqe9fLjow4YWiGgJ2jIwMrEynD27SmsUWwibMHw699PhkvvzxNOAgwkpgFFHmWGbI1CBgFWQYYpN/sYLrw7i2IJyPJM9XyG97/eMky90c9w/8tdAo4g0QEg0/xkgxn8ZUMY/vz7zTD1Zj/cpzDLQWo2Pl7DsOnxWuqHAMxEmCN+/v3BMO3mBAYOZk6wz0mzHKSajBCAOSJANpTBVzaI4dufrwzTb01kCJWPYjj/7gyRPoeZQoEDQEbAHPH59yeGGbcmMdz4eJWIYEdWQoEDQHFuKGTM8PrHK3BIfPj1nmHGrYkMtz/dJMERZDoAPcExMjAx+MkGMbz9+YZhxs2JDPe+3CHSEWQ4AFdqhyXMVz9eMEy/OZHh0dcHRDiCRAcQymowRzz//hTsiKffHlO/HPCQ9mVgY2LDmdpBjgABmpYDRIQtkUpIjAIiTSVB2agDBlMIULtrRkxC4Pj1l3ea4+ovNOmcEnLA//8MPfNtVpSC60RkxdTqnuNyACMDw61//xkXzLdZ3g5TAwC/iYowy2fakQAAAABJRU5ErkJggg==',
					mp4 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAtFJREFUWEftl11IVEEUx/9zd+/HLpYpZOhL0EOSgRJBpa8SgVApFEhFSFCQJpImaJ8U5WpG3xolpSCEYmj2YATli7AhBEFID5k9pGkYbvi5H969N2YGdZW9e/curvTgvNy5M+fM/OZ/zrmXIQhph0pmqglsRYC+PXTcan9kZHBcVsRcd3vGgJkvWTA4XDxXD4ILZg7RzI+N/sDs7ORcYlLSXjMIBnC0WE8IEO90NItHY0MBPBNjkBWnKQQDKCiZy9YAdzSLR2OzAEBtzSDiDmAGsSYAkSDWDMAIIi4Afz2/MfprKGy6rMyJuADQnf+MD2N6yhMWQtO1xeqIG4BZtQhATleD8+M6wP+vQFoKQXIi/2UMDGpmoWXzuzJs7Dn0U8PUjB7Wx1IOXC+VkZUuIP+cd9liisRffYGlYYEAnY8cbGClfaizJYDCPBGFeXZU1PkxNMxVSN1M8OSawvqnLvngmeQn3ZNpw8UzErp7VTR3zhsqZglgxzYBrnIZrz+oaOniix45YMeJgyLrt/WoaOvh4yXHROzPsePyA3/EkFkCoAs3XlXgdABF1T620b1qGVtTBQgC2OmpCrQ11yggZMnOSALLAKXHJeRm21BW44ckAvWVMvo+BSFLXHYaHocC3CyT8d6t4vFLY/kplGWAzHQBN0plFoJNGwnyc+2obQpA08Fi/uqdCrsdbNz1LID+L0HD+McEQJ067jvw9buGtC0EsgicrOKyt9YpmFcBrw9ISSYorPAiaFKxlhWgG1WdlrAvi9f42z4VT9u5zEUFIjs5be7PQdx+HlKXBjrEBLB7pw1XzvLiD81y+qF6cYuX5MPWAHr7I8sfcwhowrnOy2yj8jr/srPdreIAtU1+jE+E//qFOsSkQMSssji5DrCuwDIFVvtqFk0+SrpjQ0cjmYnL5dQUQMed7kZnJbVbBKAvq3U9NwYg33QEW940JLgWbP4BTtWVMKuGSEIAAAAASUVORK5CYII=',
					docx 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAtFJREFUWEftl11IVEEUx/9zd+/HLpYpZOhL0EOSgRJBpa8SgVApFEhFSFCQJpImaJ8U5WpG3xolpSCEYmj2YATli7AhBEFID5k9pGkYbvi5H969N2YGdZW9e/curvTgvNy5M+fM/OZ/zrmXIQhph0pmqglsRYC+PXTcan9kZHBcVsRcd3vGgJkvWTA4XDxXD4ILZg7RzI+N/sDs7ORcYlLSXjMIBnC0WE8IEO90NItHY0MBPBNjkBWnKQQDKCiZy9YAdzSLR2OzAEBtzSDiDmAGsSYAkSDWDMAIIi4Afz2/MfprKGy6rMyJuADQnf+MD2N6yhMWQtO1xeqIG4BZtQhATleD8+M6wP+vQFoKQXIi/2UMDGpmoWXzuzJs7Dn0U8PUjB7Wx1IOXC+VkZUuIP+cd9liisRffYGlYYEAnY8cbGClfaizJYDCPBGFeXZU1PkxNMxVSN1M8OSawvqnLvngmeQn3ZNpw8UzErp7VTR3zhsqZglgxzYBrnIZrz+oaOniix45YMeJgyLrt/WoaOvh4yXHROzPsePyA3/EkFkCoAs3XlXgdABF1T620b1qGVtTBQgC2OmpCrQ11yggZMnOSALLAKXHJeRm21BW44ckAvWVMvo+BSFLXHYaHocC3CyT8d6t4vFLY/kplGWAzHQBN0plFoJNGwnyc+2obQpA08Fi/uqdCrsdbNz1LID+L0HD+McEQJ067jvw9buGtC0EsgicrOKyt9YpmFcBrw9ISSYorPAiaFKxlhWgG1WdlrAvi9f42z4VT9u5zEUFIjs5be7PQdx+HlKXBjrEBLB7pw1XzvLiD81y+qF6cYuX5MPWAHr7I8sfcwhowrnOy2yj8jr/srPdreIAtU1+jE+E//qFOsSkQMSssji5DrCuwDIFVvtqFk0+SrpjQ0cjmYnL5dQUQMed7kZnJbVbBKAvq3U9NwYg33QEW940JLgWbP4BTtWVMKuGSEIAAAAASUVORK5CYII=',
					xlsx 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAkBJREFUWEdjZEACiUciK5kY/yf8Z2BQQxYnlX3n6r1XHBwszrvijl0hpJcRpiDxSEQ3IyNDCSENxMg/uPmA4eP7T9+ERQXMCTkC7ICs/aE8P9iYPxNjODFqQA548fglAycPJ0FHgB2QdDTSkoHh/zFiDCdGDcwBILWEHEFzBxByBF0cgM8RdHMALkfQxAEvn7xiuH/jPtbkgp4maOIAkM1P7j1leP/mPVZH/Pv3D547aOYAwrmF0Wqe9fLjow4YWiGgJ2jIwMrEynD27SmsUWwibMHw699PhkvvzxNOAgwkpgFFHmWGbI1CBgFWQYYpN/sYLrw7i2IJyPJM9XyG97/eMky90c9w/8tdAo4g0QEg0/xkgxn8ZUMY/vz7zTD1Zj/cpzDLQWo2Pl7DsOnxWuqHAMxEmCN+/v3BMO3mBAYOZk6wz0mzHKSajBCAOSJANpTBVzaI4dufrwzTb01kCJWPYjj/7gyRPoeZQoEDQEbAHPH59yeGGbcmMdz4eJWIYEdWQoEDQHFuKGTM8PrHK3BIfPj1nmHGrYkMtz/dJMERZDoAPcExMjAx+MkGMbz9+YZhxs2JDPe+3CHSEWQ4AFdqhyXMVz9eMEy/OZHh0dcHRDiCRAcQymowRzz//hTsiKffHlO/HPCQ9mVgY2LDmdpBjgABmpYDRIQtkUpIjAIiTSVB2agDBlMIULtrRkxC4Pj1l3ea4+ovNOmcEnLA//8MPfNtVpSC60RkxdTqnuNyACMDw61//xkXzLdZ3g5TAwC/iYowy2fakQAAAABJRU5ErkJggg==',
					jpg 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAtFJREFUWEftl11IVEEUx/9zd+/HLpYpZOhL0EOSgRJBpa8SgVApFEhFSFCQJpImaJ8U5WpG3xolpSCEYmj2YATli7AhBEFID5k9pGkYbvi5H969N2YGdZW9e/curvTgvNy5M+fM/OZ/zrmXIQhph0pmqglsRYC+PXTcan9kZHBcVsRcd3vGgJkvWTA4XDxXD4ILZg7RzI+N/sDs7ORcYlLSXjMIBnC0WE8IEO90NItHY0MBPBNjkBWnKQQDKCiZy9YAdzSLR2OzAEBtzSDiDmAGsSYAkSDWDMAIIi4Afz2/MfprKGy6rMyJuADQnf+MD2N6yhMWQtO1xeqIG4BZtQhATleD8+M6wP+vQFoKQXIi/2UMDGpmoWXzuzJs7Dn0U8PUjB7Wx1IOXC+VkZUuIP+cd9liisRffYGlYYEAnY8cbGClfaizJYDCPBGFeXZU1PkxNMxVSN1M8OSawvqnLvngmeQn3ZNpw8UzErp7VTR3zhsqZglgxzYBrnIZrz+oaOniix45YMeJgyLrt/WoaOvh4yXHROzPsePyA3/EkFkCoAs3XlXgdABF1T620b1qGVtTBQgC2OmpCrQ11yggZMnOSALLAKXHJeRm21BW44ckAvWVMvo+BSFLXHYaHocC3CyT8d6t4vFLY/kplGWAzHQBN0plFoJNGwnyc+2obQpA08Fi/uqdCrsdbNz1LID+L0HD+McEQJ067jvw9buGtC0EsgicrOKyt9YpmFcBrw9ISSYorPAiaFKxlhWgG1WdlrAvi9f42z4VT9u5zEUFIjs5be7PQdx+HlKXBjrEBLB7pw1XzvLiD81y+qF6cYuX5MPWAHr7I8sfcwhowrnOy2yj8jr/srPdreIAtU1+jE+E//qFOsSkQMSssji5DrCuwDIFVvtqFk0+SrpjQ0cjmYnL5dQUQMed7kZnJbVbBKAvq3U9NwYg33QEW940JLgWbP4BTtWVMKuGSEIAAAAASUVORK5CYII=',
				);

				@each $key,
				$value in $fileImages {
					&.#{$key} {
						background-image: url($value);
					}
				}
			}

			.file-name {
				font-weight: 500;
				line-height: 20px;
			}

			.download-status {
				font-size: 12px;
				color: #A8B0B6;
				line-height: 17px;
			}

			.down-operation {
				font-size: 16px;
				color: #959595;
				transition: all .05 linear;

				>*:not(:first-child) {
					margin-left: 15px;
					;
				}

				.operation-icon:hover {
					color: $primary-color;
				}
			}
		}
	}

	.form_box /deep/ input {
		width: 100% !important;
	}

	/deep/ .slider-menu {
		.el-menu {
			position: relative;
			height: 100%;
			width: 100%;
			border-radius: 0px;
			background-color: transparent;
			border-right: 0px;
			color: #fff;

			.el-menu-item,
			.el-submenu__title {
				color: #e1e2e4;
			}

			.el-submenu__title,
			.el-menu-item {
				border-radius: 8px;
				padding-left: 55px !important;
				padding-right: 23px;
				height: 50px;
				line-height: 50px;
			}

			.el-submenu__title:hover {
				background: rgba(255, 255, 255, .07);
				color: #fff;

				.menu-icon {
					color: #fff;
				}
			}

			.el-menu-item:hover,
			.el-menu-item.is-active {
				background: $primary-color;
				color: #fff;

				.menu-icon {
					color: #fff;
				}

				&::before {
					background: #fff !important;
				}
			}

			.el-menu-item:not(.first-menu) {
				position: relative;
				margin-left: 20px;

				&::before {
					content: '';
					position: absolute;
					top: 50%;
					left: 16%;
					transform: translateY(-50%);
					border-radius: 8px;
					width: 8px;
					height: 8px;
					background: #9C9EB2;
				}
			}

			.menu-icon {
				position: absolute;
				top: 50%;
				left: 17px;
				transform: translateY(-50%);
				width: 20px;
				height: 20px;
				font-size: 20px;
				color: #9C9EB2;
				line-height: 1;
			}
		}

		.el-submenu {
			&.is-active {
				position: relative;
			}

			&.is-opened {
				>.el-submenu__title {
					background: rgba(255, 255, 255, .07);
					color: #fff;

					i {
						color: #fff;
					}
				}
			}

			.el-menu .is-active {
				border: none;
			}
		}

		.el-submenu__icon-arrow {
			color: #fff;
		}

		.el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow {
			transform: rotate(0) !important;
		}

		.el-submenu:not(.is-opened)>.el-submenu__title .el-submenu__icon-arrow {
			transform: rotate(-90deg) !important;
		}

		.el-scrollbar__wrap {
			overflow-x: hidden;
		}
	}

	.todo {
		/deep/ .el-dialog__body {
			padding: 0 !important;
		}

		.scrollbar {
			/deep/ .el-scrollbar__wrap {
				overflow-x: hidden;
			}
		}
	}
</style>