<template>
	<!-- <page-layout> -->
	<div class="date-box" :loading="loading">
		<div class="box-title">
			<div class="name">
				<el-select v-model="yearDate" @change="onChangeSelect" style="width: 50px">
					<el-option v-for="item in yearList" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				节假日设置
			</div>
		</div>
		<div class="year-box">
			<div v-for="(date, time) in yearMo" :key="time" class="box">
				<div class="year-box-title">
					{{`${time + 1 + "月"}`}}
				</div>
				<table>
					<thead>
						<tr>
							<th v-for="(day, dayss) in days" :key="dayss">
								<span class="day-box">{{ day }}</span>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(week, index) in yearMo[time]" :key="index">
							<td v-for="(day, index) in week" :key="index" @click="selectDate(day)">
								<div class="mouth-date" v-if="day.Date">
									<div class="day-box" :class="day.IsHollyDay == 1 ? 'active' : ''">
										<span class="day-span">{{ setDate(day.Date) }}</span>
										<span class="day-nongli">{{ day.day }}</span>
										<span class="tip" v-if="day.IsHollyDay == 1">休</span>
										<span class="tip" v-else>班</span>
									</div>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="box-title save-box">
			<el-button type="primary" style="margin-top: 10px" @click="onSave"
				v-if="$_has('GZRSZBtnSave')">保存</el-button>
		</div>
	</div>
	<!-- </page-layout> -->
</template>

<script>
	import request_mixin from "@/mixins/request-mixin.js";
	export default {
		mixins: [request_mixin],
		name: 'weekdaysettings',
		data() {
			return {
				loading: false,
				days: ["日", "一", "二", "三", "四", "五", "六"],
				weeks: [],
				yearMo: [
					[],
					[],
					[],
					[],
					[],
					[],
					[],
					[],
					[],
					[],
					[],
					[]
				],
				yearDate: "",
				yearList: [],
				ageData: {}
			};
		},
		created() {
			this.yearDate = new Date().getFullYear();
			// this.onChangeYear()
			this.getYearList()

		},
		mounted() {
			this.GetListWeb()
		},
		methods: {
			setDate(day) {
				return new Date(day).format("d")
			},
			GetListWeb() {
				this.loading = true
				this.Get("/GetCalendarWeekday?year=" + this.yearDate).then((res) => {
					if (res.status == 2000) {
						this.ageData = res.data
						this.onChangeYear(this.ageData)
					}
					this.loading = false
				})
			},
			getYearList() {
				let num = new Date(); // 获取当前年
				let start = num.getFullYear() - 2; // 当前年近五年
				let endYear = num.getFullYear() + 5
				let yearList = []
				for (var i = start; i <= endYear; i++) {
					let obj = {
						value: i.toString(),
						label: i
					}
					yearList.push(obj);
				}
				this.yearList = yearList
			},
			onChangeSelect() {
				this.GetListWeb()
			},
			onChangeYear(yearMo) {
				this.yearMo.map((item, index) => {
					this.generateCalendar(index + 1, yearMo);
				});
				return
				if (yearMo) {
					this.yearMo.map((item, index) => {
						this.generateCalendar(index + 1, yearMo);
					});
				} else {
					this.yearMo.map((item, index) => {
						this.generateCalendar(index + 1);
					});
				}

			},
			onSave() {
				let mergedData = [];
				for (let array of this.yearMo) {
					for (let subArray of array) {
						mergedData = mergedData.concat(subArray);
					}
				}
				let groupedDataArray = Object.values(mergedData.reduce((grouped, item) => {
					if (item != '') {
						if (!grouped[item.month]) {
							grouped[item.month] = [];
						}
						if (item.IsHollyDay == true) {
							item.IsHollyDay = 1
						} else {
							item.IsHollyDay = 0
						}
						grouped[item.month].push(item);
					}
					return grouped;
				}, {}));
				let arr = []
				groupedDataArray.map((item, index) => {
					let obj = {
						Month: index + 1,
						MonthDesc: index + 1 + '月',
						CalendarMonth: item
					}
					arr.push(obj)
				})
				let params = {
					CalendarWeekdayId: this.ageData.CalendarWeekdayId,
					Year: this.ageData.Year,
					DateOfYear: JSON.stringify(arr),
				}
				var that = this;
				that.loading = true
				that.Post('/SaveCalendarWeekday', params).then((res) => {
					if (res.status == 2000) {
						that.$message({
							message: "保存成功",
							type: "success",
						});
					} else {
						that.$message({
							message: res.message,
							type: "error",
						});
					}
					that.loading = false;
				})
			},
			generateCalendar(data, yearMo) {
				// 生成日历
				let YearData = yearMo.Year.toString()
				let dataList = yearMo.DateOfYearDesc[data - 1]
				let date = new Date(YearData)
				let year = date.getFullYear();
				let month = data;
				let firstDay = "";
				let lastDate = "";
				firstDay = new Date(year, month - 1, 1).getDay();
				lastDate = dataList.CalendarMonth.length;
				let weeks = [
					[]
				];
				let dayCount = 1;

				for (let i = 0; i < firstDay; i++) {
					weeks[0].push("");
				}
				let dataForm = dataList.CalendarMonth
				for (let i = 1; i <= lastDate; i++) {
					if (weeks[weeks.length - 1].length === 7) {
						weeks.push([]);
					}
					let dataListRl = ''
					if (dataForm[i - 1] != undefined) {
						dataListRl = dataForm[i - 1]
					}
					let d = new Date(year, month - 1, i);
					let years = d.getFullYear();
					let months = d.getMonth() + 1;
					let day2 = d.getDate();
					let time = `${years + "-" + months + "-" + day2}`;
					let day = this.getLunar(time)
					weeks[weeks.length - 1].push({
						month: months,
						Date: dataListRl.Date,
						IsHollyDay: dataListRl.IsHollyDay,
						SetHollyDay: dataListRl.SetHollyDay,
						WeekDesc: dataListRl.WeekDesc,
						week: this.days[new Date(year, month - 1, i).getDay()],
						restDay: this.days[new Date(year, month - 1, i).getDay()] == "六" ?
							true : this.days[new Date(year, month - 1, i).getDay()] == "日" ?
							true : false,
						day: this.getLunar(dataListRl.Date)
					});
				}
				this.yearMo[data - 1] = weeks;
				this.weeks = weeks;
			},
			// generateCalendar(data, yearMo) {
			// 	// 生成日历
			// 	let date = new Date(yearMo.Year)
			// 	let year = date.getFullYear();
			// 	let month = data;
			// 	let firstDay = "";
			// 	let lastDate = "";
			// 	firstDay = new Date(year, month - 1, 1).getDay();
			// 	lastDate = new Date(year, month, 0).getDate();
			// 	let weeks = [
			// 		[]
			// 	];
			// 	let dayCount = 1;

			// 	for (let i = 0; i < firstDay; i++) {
			// 		weeks[0].push("");
			// 	}

			// 	for (let i = 1; i <= lastDate; i++) {
			// 		if (weeks[weeks.length - 1].length === 7) {
			// 			weeks.push([]);
			// 		}
			// 		let d = new Date(year, month - 1, i);
			// 		let years = d.getFullYear();
			// 		let months = d.getMonth() + 1;
			// 		let day2 = d.getDate();
			// 		let time = `${years + "-" + months + "-" + day2}`;
			// 		let day = this.getLunar(time)
			// 		weeks[weeks.length - 1].push({
			// 			date: i,
			// 			week: this.days[new Date(year, month - 1, i).getDay()],
			// 			restDay: this.days[new Date(year, month - 1, i).getDay()] == "六" ?
			// 				true : this.days[new Date(year, month - 1, i).getDay()] == "日" ?
			// 				true : false,
			// 			time,
			// 			day,
			// 		});
			// 	}
			// 	this.yearMo[data - 1] = weeks;
			// 	this.weeks = weeks;
			// },
			selectDate(day) {
				// 选择日期
				if (this.$_has('GZRSZBtnEdit')) {
					const selectedDate = day;
					day.IsHollyDay = !day.IsHollyDay;
				} else {
					this.$message.error('您的账号没有权限，请联系管理员添加')
				}

			},
			getLunar(newDate) {
				var nyear;
				var nmonth;
				var nday = -1;
				var nwday;
				var nhrs;
				var nmin;
				var nsec;
				var newDate = newDate;

				var lmonth, lday, lleap; //农历参数

				function Draw() {
					NewTick();

					//显示时间
					var s =
						nyear +
						"年" +
						nmonth +
						"月" +
						nday +
						"日 " +
						"星期" +
						cweekday(nwday) +
						" " +
						shapetime(nhrs, nmin, nsec);
					s += " 农历" + lmonth + "月" + lday; //农历
					// var lunar_month_day = lmonth + "月" + lday;
					var lunar_month_day = lday
					return lunar_month_day;
				}

				function NewTick() {
					var noww = newDate ? new Date(newDate) : new Date();
					if (noww.getDate() != nday) {
						nyear = noww.getFullYear();
						nmonth = noww.getMonth() + 1;
						nwday = noww.getDay();
						nday = noww.getDate();

						getlunar(); //获取农历
					}
					nhrs = noww.getHours();
					nmin = noww.getMinutes();
					nsec = noww.getSeconds();
				}

				//辅助函数
				var hzWeek = new Array("日", "一", "二", "三", "四", "五", "六", "日");

				function cweekday(wday) {
					return hzWeek[wday];
				}

				function shapetime(vhrs, vmin, vsec) {
					if (vsec <= 9) vsec = "0" + vsec;
					if (vmin <= 9) vmin = "0" + vmin;
					if (vhrs <= 9) vhrs = "0" + vhrs;
					return vhrs + ":" + vmin + ":" + vsec;
				}

				//农历函数开始
				var lunarInfo = new Array(
					0x04bd8,
					0x04ae0,
					0x0a570,
					0x054d5,
					0x0d260,
					0x0d950,
					0x16554,
					0x056a0,
					0x09ad0,
					0x055d2,
					0x04ae0,
					0x0a5b6,
					0x0a4d0,
					0x0d250,
					0x1d255,
					0x0b540,
					0x0d6a0,
					0x0ada2,
					0x095b0,
					0x14977,
					0x04970,
					0x0a4b0,
					0x0b4b5,
					0x06a50,
					0x06d40,
					0x1ab54,
					0x02b60,
					0x09570,
					0x052f2,
					0x04970,
					0x06566,
					0x0d4a0,
					0x0ea50,
					0x06e95,
					0x05ad0,
					0x02b60,
					0x186e3,
					0x092e0,
					0x1c8d7,
					0x0c950,
					0x0d4a0,
					0x1d8a6,
					0x0b550,
					0x056a0,
					0x1a5b4,
					0x025d0,
					0x092d0,
					0x0d2b2,
					0x0a950,
					0x0b557,
					0x06ca0,
					0x0b550,
					0x15355,
					0x04da0,
					0x0a5b0,
					0x14573,
					0x052b0,
					0x0a9a8,
					0x0e950,
					0x06aa0,
					0x0aea6,
					0x0ab50,
					0x04b60,
					0x0aae4,
					0x0a570,
					0x05260,
					0x0f263,
					0x0d950,
					0x05b57,
					0x056a0,
					0x096d0,
					0x04dd5,
					0x04ad0,
					0x0a4d0,
					0x0d4d4,
					0x0d250,
					0x0d558,
					0x0b540,
					0x0b6a0,
					0x195a6,
					0x095b0,
					0x049b0,
					0x0a974,
					0x0a4b0,
					0x0b27a,
					0x06a50,
					0x06d40,
					0x0af46,
					0x0ab60,
					0x09570,
					0x04af5,
					0x04970,
					0x064b0,
					0x074a3,
					0x0ea50,
					0x06b58,
					0x05ac0,
					0x0ab60,
					0x096d5,
					0x092e0, //1990
					0x0c960,
					0x0d954,
					0x0d4a0,
					0x0da50,
					0x07552,
					0x056a0,
					0x0abb7,
					0x025d0,
					0x092d0,
					0x0cab5,
					0x0a950,
					0x0b4a0,
					0x0baa4,
					0x0ad50,
					0x055d9,
					0x04ba0,
					0x0a5b0,
					0x15176,
					0x052b0,
					0x0a930,
					0x07954,
					0x06aa0,
					0x0ad50,
					0x05b52,
					0x04b60,
					0x0a6e6,
					0x0a4e0,
					0x0d260,
					0x0ea65,
					0x0d530,
					0x05aa0,
					0x076a3,
					0x096d0,
					0x04bd7,
					0x04ad0,
					0x0a4d0,
					0x1d0b6,
					0x0d250,
					0x0d520,
					0x0dd45,
					0x0b5a0,
					0x056d0,
					0x055b2,
					0x049b0,
					0x0a577,
					0x0a4b0,
					0x0aa50,
					0x1b255,
					0x06d20,
					0x0ada0,
					0x14b63
				);

				function lYearDays(y) {
					var i,
						sum = 348;
					for (i = 0x8000; i > 0x8; i >>= 1)
						sum += lunarInfo[y - 1900] & i ? 1 : 0;
					return sum + leapDays(y);
				}

				function leapDays(y) {
					if (leapMonth(y)) return lunarInfo[y - 1900] & 0x10000 ? 30 : 29;
					else return 0;
				}

				function leapMonth(y) {
					return lunarInfo[y - 1900] & 0xf;
				}

				function monthDays(y, m) {
					return lunarInfo[y - 1900] & (0x10000 >> m) ? 30 : 29;
				}

				function Lunar(y, m, d) {
					var i,
						leap = 0,
						temp = 0;
					var offset = (Date.UTC(y, m, d) - Date.UTC(1900, 0, 31)) / 86400000;
					for (i = 1900; i < 2050 && offset > 0; i++) {
						temp = lYearDays(i);
						offset -= temp;
					}
					if (offset < 0) {
						offset += temp;
						i--;
					}
					this.year = i;
					leap = leapMonth(i);
					this.isLeap = false;
					for (i = 1; i < 13 && offset > 0; i++) {
						if (leap > 0 && i == leap + 1 && this.isLeap == false) {
							--i;
							this.isLeap = true;
							temp = leapDays(this.year);
						} else {
							temp = monthDays(this.year, i);
						}
						if (this.isLeap == true && i == leap + 1) this.isLeap = false;
						offset -= temp;
					}
					if (offset == 0 && leap > 0 && i == leap + 1)
						if (this.isLeap) {
							this.isLeap = false;
						} else {
							this.isLeap = true;
							--i;
						}
					if (offset < 0) {
						offset += temp;
						--i;
					}
					this.month = i;
					this.day = offset + 1;
				}
				var nStr1 = new Array(
					"",
					"一",
					"二",
					"三",
					"四",
					"五",
					"六",
					"七",
					"八",
					"九",
					"十",
					"十一",
					"十二"
				);
				var nStr2 = new Array("初", "十", "廿", "卅", "□");

				function GetcDay(d) {
					var s;
					switch (d) {
						case 10:
							s = "初十";
							break;
						case 20:
							s = "二十";
							break;
						case 30:
							s = "三十";
							break;
						default:
							s = nStr2[Math.floor(d / 10)];
							s += nStr1[d % 10];
							break;
					}
					return s;
				}

				function GetcMon(m) {
					if (m == 1) return "正";
					else return nStr1[m];
				}

				function getlunar() {
					var lObj = new Lunar(nyear, nmonth - 1, nday);
					lmonth = GetcMon(lObj.month);
					lday = GetcDay(lObj.day);
					lleap = lObj.isLeap;
					if (lleap == 1) {
						lmonth = "闰" + lmonth;
					}
				}
				//农历函数结束
				return Draw();
			},
		},
	};
</script>
<style lang="less" scoped>
	/deep/.el-input--suffix .el-input__inner {
		border: none !important;
		background: none !important;
		padding: 0 5px !important;
		height: 30px !important;
		text-align: center;
		font-size: 18px;
		color: #000;
		font-weight: bold;
	}

	/deep/.el-select>.el-input {
		border-bottom: 2px solid #000;
	}

	/deep/.el-input__suffix {
		display: none !important;
	}

	.box-title {
		text-align: center;
		margin: 10px;

		.name {
			font-size: 18px;
			font-weight: bold;
			color: #000;
		}
	}

	.year-box {
		display: flex;
		flex-wrap: wrap;

		// justify-content: space-around;
		.box {
			border: 1px solid #2ba389;
			border-radius: 10px;
			// margin-bottom: 10px;
			margin: 5px;

			// margin: 10px;
			.year-box-title {
				text-align: center;
				font-size: 18px;
				height: 40px;
				line-height: 40px;
				border-bottom: 1px solid #2ba389;
			}
		}

		table {
			// min-width: 300px; 一行显示4个
			min-width: 238px;
			padding-right: 2px;

			.day-box {
				border-radius: 6px;
				// padding: 8px 6px;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;
				font-size: 14px;
				// min-width: 36px;
				position: relative;
				margin: 3px 0;
				cursor: pointer;

				.tip {
					position: absolute;
					right: -5px;
					top: -5px;
					font-size: 12px;
					background: #4b9ef2;
					color: #fff;
					padding: 2px;
					border-radius: 3px;
					transform: scale(0.7);
				}

				.day-nongli {
					font-size: 12px;
					color: #999;
				}
			}
		}

		.active {

			// background-color: #f7d0cf;
			.tip {
				color: #fff !important;
				background: red !important;
			}

			.day-span {
				color: red !important;
				font-weight: bold !important;
			}

			.day-nongli {
				color: red !important;
			}
		}
	}

	.date-box {
		padding: 15px 0px 15px 5px;
		background: #fff;
		border-radius: 10px;
		position: relative;
		.save-box {
			position: absolute;
			top: 0;
			right: 20px;
		}
	}
</style>