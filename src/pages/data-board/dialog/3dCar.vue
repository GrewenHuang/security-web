<template>
	<div>
		<div class="dashboard-editor-container" v-loading="loading">
			<div id="container" v-if="isShowF" ref="three_container"></div>
			<!-- <div id="info">3D-数据表</div> -->
			<div id="menu" v-if="isShowF">
				<button id="grid">网格</button>
				<button id="table">表面</button>
				<button id="sphere">球体</button>
				<button id="helix">螺旋</button>
			</div>
		</div>
		<JobAdd ref="job" />
	</div>
</template>

<script>
	import JobAdd from '@/pages/job/add'
	import * as THREE from "three";
	import TWEEN from "@tweenjs/tween.js";
	import {
		CSS3DRenderer,
		CSS3DObject,
	} from "three/examples/jsm/renderers/CSS3DRenderer";
	import {
		TrackballControls
	} from "three/examples/jsm/controls/TrackballControls.js";
	import request_mixin from "@/mixins/request-mixin.js";
	import ImgHH from '../imges/hh.jpg'
	export default {
		name: "HelloWorld",
		mixins: [request_mixin],
		components: {
			JobAdd
		},
		data() {
			return {
				isShowF: false,
				loading: false,
				table: [],
				camera: "",
				scene: "",
				renderer: "",
				controls: "",
				initialCameraPosition: "",
				ImgHH,
				objects: [],
				targets: {
					table: [],
					sphere: [],
					helix: [],
					grid: [],
				},
			};
		},
		props: ['EnterpriseId','DepartmentIdStr'],
		beforeDestroy() {
			this.isShowFlase()
		},
		deactivated() {
			this.isShowFlase()
		},
		mounted() {},
		methods: {
			isShowFlase() {
				this.isShowF = false
				this.camera = ""
				this.scene = ""
				this.renderer = ""
				this.controls = ""
				this.initialCameraPosition = ""
				this.objects = []
				this.targets = {
					table: [],
					sphere: [],
					helix: [],
					grid: [],
				}
				this.table = []
				// this.destroyThreejs();
			},
			show() {
				this.isShowF = true
				this.$nextTick(() => {
					this.getPerList()
				})
			},
			getPerList() {
				const dCarloading = this.$loading({
					lock: true,
					text: '车辆数据加载中，请稍等...',
					spinner: 'el-icon-loading',
					color: '#fff',
					background: 'rgba(0, 0, 0, .3)'
				});
				this.Post("/GetVehicles", {
					page: 1,
					rows: 9999,
					SearchDepartmentIds2: this.DepartmentIdStr,
					EnterpriseId: this.EnterpriseId
				}).then(res => {
					if (res.status == 2000) {
						res.data.list = res.data.list.filter(item => !item.LicensePlateNumber.includes('挂'))
						this.table = res.data.list;
						this.init();
						this.animate();
						dCarloading.close()
					}else {
						dCarloading.close()
					}
				});
				
			},
			init() {
				this.camera = new THREE.PerspectiveCamera(
					30,
					window.innerWidth / window.innerHeight,
					0.1,
					10000
				);
				//透视投影相机,PerspectiveCamera(fov, aspect, near, far)
				// - fov 可视角度
				// - aspect 为width/height,通常设置为canvas元素的高宽比。
				// - near近端距离
				// - far远端距离
				//只有离相机的距离大于near值，小于far值，且在相机的可视角度之内，才能被相机投影到。

				this.camera.position.z = 3000;
				//3000是camera的竖直高度,可以理解为值越大可见度越大

				this.scene = new THREE.Scene();
				this.initialCameraPosition = new THREE.Vector3(1, 1, 3000);
				// this.camera.position.copy(this.initialCameraPosition);
				var _this = this;
				if (!this.table && !this.table.length > 0) {
					return
				}
				// table 表格
				//这里是对table表格里的数据进行解析,然后分配到每个div中构成模块
				this.table.forEach((item, i) => {
					// for (var i = 0; i < this.table.length; i += 5) {
					var element = document.createElement("div");
					element.className = "myelement";
					// element.style.backgroundColor =
					// 	"rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";
					element.style.backgroundColor =
						"rgba(0,127,127,0.25)";
					element.addEventListener(
						"click",
						function(event) {
							var divs = document.getElementsByClassName('myelement');
							for (let index = 0; index < divs.length; index++) {
								const element = divs[index];
								element.onclick = function() {
									//移除下划线样式
									for (let index = 0; index < divs.length; index++) {
										const element = divs[index];
										element.classList.remove("active")
									}
									//添加当前元素的下划线样式
									this.classList.add("active")
								}
							}
							_this.onClickDetail(event, i); //展示表格
						},
						false
					);

					var number = document.createElement("div");
					number.className = "number";
					number.textContent = "车队:" + item.VehicleGroupSetName || "无";
					element.appendChild(number);

					var EnterpriseName = document.createElement("div");
					EnterpriseName.className = "EnterpriseName";
					EnterpriseName.textContent = "车牌号:" + item.LicensePlateNumber || "";
					element.appendChild(EnterpriseName);

					var Name = document.createElement("div");
					Name.className = "number";
					Name.textContent = "车型简称:" + item.VehicleTypeName || "";
					element.appendChild(Name);


					var object = new CSS3DObject(element);
					object.position.x = i + 3 * 40 - 130;
					object.position.y = -(i + 4 * 30) + 190;
					this.scene.add(object);
					this.objects.push(object);

					var object = new THREE.Object3D();
					object.position.x = Math.random() * 2000 - 1000;
					object.position.y = Math.random() * 2000 - 1000;
					object.position.z = Math.random() * 2000 - 2000;
					this.targets.table.push(object);
				});

				// sphere 球
				for (var i = 0, l = this.objects.length; i < l; i++) {
					var vector = new THREE.Vector3();
					var phi = Math.acos(-1 + (2 * i) / l);
					var theta = Math.sqrt(l * Math.PI) * phi;

					var object = new THREE.Object3D();

					object.position.x = 800 * Math.cos(theta) * Math.sin(phi);
					object.position.y = 600 * Math.sin(theta) * Math.sin(phi);
					object.position.z = 500 * Math.cos(phi);

					vector.copy(object.position).multiplyScalar(2);

					object.lookAt(vector);

					this.targets.sphere.push(object);
				}

				// helix 螺旋

				var vector = new THREE.Vector3();

				for (var i = 0, l = this.objects.length; i < l; i++) {
					var phi = i * 0.175 + Math.PI;

					var object = new THREE.Object3D();

					object.position.x = 900 * Math.sin(phi);
					object.position.y = -(i * 8) + 450;
					object.position.z = 900 * Math.cos(phi);

					vector.x = object.position.x * 2;
					vector.y = object.position.y;
					vector.z = object.position.z * 2;

					object.lookAt(vector);

					this.targets.helix.push(object);
				}

				// grid 网格

				for (var i = 0; i < this.objects.length; i++) {
					var object = new THREE.Object3D();
					object.position.x = (i % 5) * 400 - 800;
					object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
					object.position.z = Math.floor(i / 25) * 1000 - 1000;

					this.targets.grid.push(object);
				}

				//

				this.renderer = new CSS3DRenderer();
				this.renderer.setSize(window.innerWidth - 100, window.innerHeight - 200);
				this.renderer.domElement.style.position = "absolute";
				document
					.getElementById("container")
					.appendChild(this.renderer.domElement);

				//

				this.controls = new TrackballControls(
					this.camera,
					this.renderer.domElement
				);
				this.controls.rotateSpeed = 0.5; //旋转速度
				this.controls.minDistance = 100; //最小距离
				this.controls.maxDistance = 5000; //最大距离
				this.controls.addEventListener("change", this.render);

				var button = document.getElementById("table");
				button.addEventListener(
					"click",
					function(event) {
						_this.resetView()
						_this.transform(_this.targets.table, 1000); //展示表格
					},
					false
				);

				var button = document.getElementById("sphere");
				button.addEventListener(
					"click",
					function(event) {
						_this.resetView()
						_this.transform(_this.targets.sphere, 1000); //展示球
					},
					false
				);

				var button = document.getElementById("helix");
				button.addEventListener(
					"click",
					function(event) {
						_this.transform(_this.targets.helix, 2000); //展示螺旋
					},
					false
				);

				var button = document.getElementById("grid");
				button.addEventListener(
					"click",
					function(event) {
						_this.resetView()
						_this.transform(_this.targets.grid, 1000); //展示网格
					},
					false
				);

				this.transform(_this.targets.grid, 1000);

				//

				window.addEventListener("resize", _this.onWindowResize, false);
			},
			resetView() {
				if (this.controls) {
					this.controls.reset();
				} else {
					this.camera.position.copy(this.initialCameraPosition);
					this.camera.rotation.copy(this.initialCameraQuaternion);
				}
				// this.targets.sphere.rotation.set(0, 0, 0);
				// 用于重置相机位置的方法
				// this.camera.position.copy(this.initialCameraPosition);
				// this.camera.rotation.set(0, 0, 0);
				// 记得重新渲染场景以更新视图
				this.renderer.render(this.scene, this.camera);
			},
			transform(targets, duration) {
				//targets对象,duration持续时间

				TWEEN.removeAll();

				for (var i = 0; i < this.objects.length; i++) {
					var object = this.objects[i];
					var target = targets[i];

					new TWEEN.Tween(object.position)
						.to({
								x: target.position.x,
								y: target.position.y,
								z: target.position.z,
							},
							Math.random() * duration + duration
						)
						.easing(TWEEN.Easing.Exponential.InOut)
						.start();

					new TWEEN.Tween(object.rotation)
						.to({
								x: target.rotation.x,
								y: target.rotation.y,
								z: target.rotation.z,
							},
							Math.random() * duration + duration
						)
						.easing(TWEEN.Easing.Exponential.InOut)
						.start();
				}

				new TWEEN.Tween(this)
					.to({}, duration * 2)
					.onUpdate(this.render)
					.start();
			},

			onWindowResize() {
				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix();

				this.renderer.setSize(window.innerWidth, window.innerHeight);

				this.render();
			},

			animate() {
				if (!this.renderer) {
					return;
				}
				requestAnimationFrame(this.animate);
				this.controls.update();
				TWEEN.update();
				this.renderer.render(this.scene, this.camera)
			},
			destroyThreejs() {
				try {
					this.controls.dispose();
					this.renderer.forceContextLoss();
					this.renderer.content = null;
					let gl = this.renderer.domElement.getContext("webgl");
					if (gl && gl.getExtension("WEBGL_lose_context")) {
						gl.getExtension("WEBGL_lose_context").loseContext();
					}
					this.renderer = null;
					this.camera = null;
					this.scene.traverse((child) => {
						if (child.material) {
							child.material.dispose();
						}
						if (child.geometry) {
							child.geometry.dispose();
						}
						child = null;
					});
					this.scene = null;
				} catch (e) {
					console.error("Failed to destroy threejs", e);
				}
			},
			onClickDetail(event, i) {
				this.$emit('success', this.table[i])
			},
			render() {
				this.renderer.render(this.scene, this.camera);
			},
		},
	};
</script>

<style lang="less" scoped>
	.dashboard-editor-container {
		width: 100%;
		height: 100%;
		min-height: calc(100vh - 240px);

		// background: url("../../../assets/images/background.png");
		// background: #000000;
		.container {}

		#info {
			position: absolute;
			width: 100%;
			color: #ffffff;
			padding: 5px;
			font-family: Monospace;
			font-size: 13px;
			font-weight: bold;
			text-align: center;
			z-index: 1;
		}

		#menu {
			position: absolute;
			bottom: 100px;
			width: 100%;
			text-align: center;
			font-family: verdana, Tahoma, Arial, Hei, "Microsoft Yahei", SimHei;
		}

		/deep/ .active {
			background: rgba(0, 127, 127, 0.5) !important;
		}

		/deep/ .myelement {
			width: 350px;
			height: 280px;
			border-radius: 10px;
			// box-shadow: 0px 0px 30px rgba(9, 166, 161, 0.955);
			border: 1px solid rgba(127, 255, 255, 0.25);
			text-align: center;
			cursor: pointer;
			padding: 30px 10px;
			color: #fff;
			font-size: 32px;
			border-radius: 10px;
			box-sizing: border-box;

			.number {
				font-size: 36px;
			}

			.EnterpriseName {
				display: inline-block;
				margin-top: 20px;
				width: 350px;
				font-size: 36px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.cardImg {
				width: 100px;
				height: 100px;
				border-radius: 50%;
			}
		}

		button {
			color: rgba(127, 255, 255, 0.75);
			background: transparent;
			outline: 1px solid rgba(127, 255, 255, 0.75);
			border: 0px;
			padding: 5px 10px;
			cursor: pointer;
		}

		button:hover {
			background-color: rgba(0, 255, 255, 0.5);
		}

		button:active {
			color: #000000;
			background-color: rgba(0, 255, 255, 0.75);
		}
	}

	a {
		color: #ffffff;
	}
</style>