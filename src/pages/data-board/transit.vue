<template>
  <dv-full-screen-container ref="fullScreenContainer">
    <div class="map-box" v-loading="loading">
      <!--
          amap-manager： 地图管理对象
          vid：地图容器节点的ID
          zooms： 地图显示的缩放级别范围，在PC上，默认范围[3,18]，取值范围[3-18]；在移动设备上，默认范围[3-19]，取值范围[3-19]
          center： 地图中心点坐标值
          plugin：地图使用的插件
          events： 事件
        -->

      <el-amap v-if="isShow" ref="amap" vid="amap-demo" class="all-amap" :mapStyle="`amap://styles/${color}`"
        :zoom="mapSet.zoom" :viewMode="mapSet.viewMode" :rotation="mapSet.rotation" :pitch="mapSet.pitch"
        :buildingAnimation="true" :expandZoomRange="true" :events="events" :terrain="true" :features="mapSet.features"
        :center="mapSet.center" :zooms="mapSet.zooms">
        <el-amap-marker v-for="marker in markers" :position="marker.position" :vid="marker.id" :key="marker.id"
          :content="marker.markerImg" :events="marker.events">
          <!-- :label="marker.label" -->
        </el-amap-marker>
        <el-amap-info-window v-if="currentWindow.visible" :position="currentWindow.position"
          :visible="currentWindow.visible" :content="currentWindow.content" :close-when-click-map="true"
          :is-custom="true" :offset="currentWindow.offset">
          <div style="z-map-box" @click="onCarDetail">
            <div class="box-window amap-info-content ">
              <div>{{ currentWindow.car }}</div>
              <div>{{ currentWindow.address }}</div>
            </div>
            <div class="amap-info-sharp"></div>
          </div>
        </el-amap-info-window>

        <!-- <el-amap-loca @init="initLoca">
          <el-amap-loca-pulse-line
            :visible="visible"
            :source-url="sourceUrl"
            :layer-style="layerStyle"
            :visible-duration="500"
          />
        </el-amap-loca> -->

      </el-amap>
      <div v-if="isShow" class="bg-page">
        <div class="box">
          <div class="title-switch">
            <div>{{ value | dateFormat }}</div>
            <div class="enterprise-name" @click="onSelectPersonnel('选择企业', '60%', 'E')">{{ EnterpriseName }}
              <p>安全管理看板</p>
            </div>
            <div @click="loginOut" class="loginOut">
              <span>{{ userInfo.UserName }},欢迎你</span>
            </div>

            <!-- <button @click="changeShowBox">显示/隐藏</button> -->

          </div>
          <transition enter-active-class="animate__animated animate__fadeInLeft"
            leave-active-class="animate__animated animate__fadeOutLeft">
            <div class="select-box-left" v-show="showBox">

              <div class="personnel-box top-box" style="text-align: left;padding-top: 0;">
                <transition enter-active-class="animate__animated animate__zoomInLeft"
                  leave-active-class="animate__animated animate__backOutLeft">
                  <dv-border-box-12 v-if="showTrans">
                    <div style="display: flex;justify-content: space-around;">
                      <div @click="onSelectPersonnelPower('部门', '50%', 'D', 0)">
                        <span class="round-box"></span>
                        <span class="num-box">
                          <CountFlop :val="formData.UserCount" suffix="人" />
                        </span>
                        <p style="padding-left: 30px;">员工数</p>
                      </div>
                      <div @click="onSelectPersonnelPower('部门', '50%', 'D', 1)">
                        <span class="round-box"></span>
                        <span class="num-box">
                          <CountFlop :val="formData.EntryCount" suffix="人" />
                        </span></span>
                        <p style="padding-left: 20px;">司 机人数</p>
                      </div>
                    </div>
                  </dv-border-box-12>
                </transition>
              </div>

              <div class="glide-line"></div>

              <div class="top-box car-height">
                <transition enter-active-class="animate__animated animate__zoomInLeft"
                  leave-active-class="animate__animated animate__backOutLeft">
                  <dv-border-box-12 v-if="showTrans">
                    <dv-decoration-7 style="width:100%;height:50px;">
                      <div class="title">
                        <span>车辆统计</span>
                      </div>
                    </dv-decoration-7>
                    <div class="car-box"
                      v-if="formData.VehicleDepartmentList && formData.VehicleDepartmentList.length > 0">
                      <div v-for="(item, index) in formData.VehicleDepartmentList" :key="index"
                        @click="onVehiclData(item)">
                        <span class="round-box"></span>
                        <span class="num-box">{{ item.DepartmentName }}</span>
                        <p>{{ item.VehicleCount }}<em>辆</em></p>
                      </div>
                    </div>
                    <div style="height:70%">
                      <carPie :key="getTimerCarPie" :value="formData.VehicleTypeList" />
                    </div>
                  </dv-border-box-12>
                </transition>
              </div>

              <div class="glide-line"></div>

              <div class="top-box facility-height">
                <transition enter-active-class="animate__animated animate__zoomInLeft"
                  leave-active-class="animate__animated animate__backOutLeft">
                  <dv-border-box-12 v-if="showTrans">
                    <dv-decoration-7 style="width:100%;height:50px;">
                      <div class="title">
                        <span>设备设施</span>
                      </div>
                    </dv-decoration-7>
                    <el-carousel :autoplay="true" :loop="true" type="card" height="7rem" indicator-position="none"
                      arrow="always">
                      <el-carousel-item v-for="item in formData.EquipmentWarehourseList" :key="item.id">
                        <div @click="onFacilityData(item)" class="carousel-item">
                          <img src="../data-board/imges/cangku.png">
                          <h3 class="medium">{{ item.WarehouseName }}</h3>
                        </div>
                      </el-carousel-item>
                    </el-carousel>
                    <!-- <facilityPie :value="formData.EquipmentWarehourseList" @success="FacititySuccess" /> -->
                  </dv-border-box-12>
                </transition>
              </div>

              <div class="glide-line"></div>

              <div class="top-box jy-box">
                <transition enter-active-class="animate__animated animate__zoomInLeft"
                  leave-active-class="animate__animated animate__backOutLeft">
                  <dv-border-box-12 v-if="showTrans">
                    <dv-decoration-7 style="width:100%;height:50px;">
                      <div class="title">
                        <span>教育培训</span>
                      </div>
                    </dv-decoration-7>
                    <div style="height: 90%;">
                      <train-number-column :value="formData.TrainUserMonthList" />
                    </div>
                  </dv-border-box-12>
                </transition>
              </div>

            </div>
          </transition>

          <div class="select-box-center" v-show="showBox"
            v-if="formData.TaskWarning && formData.TaskWarning.length > 0">
            <div class="top-box danger-center-box">
              <transition enter-active-class="animate__animated animate__zoomInUp"
                leave-active-class="animate__animated animate__backOutDown">
                <dv-border-box-1 v-if="showTrans">
                  <div class="type-box">
                    <dv-decoration-7 style="width:100%;height:50px;">
                      <div class="title" style="margin-left: 20px">
                        <span>任务概况</span>
                      </div>
                    </dv-decoration-7>

                  </div>
                  <el-scrollbar ref="scrollbar " class="scrollbar" style="height: 100%">
                    <div class="center-box">
                      <div v-for="(item, index) in formData.TaskWarning" :key="index" class="box-content"
                        @click="onTaskWarning(item, '70%', 'W')">
                        <div class="title-box">
                          <span>{{ item.name }}</span>
                        </div>
                        <span class="round-box"></span>
                        <span class="num"
                          :style="{ 'color': item.id == 1 || item.id == 5 ? '#c75458' : item.id == 2 || item.id == 6 ? '#4a9acf' : item.id == 3 || item.id == 7 ? '#cfa458' : item.id == 4 || item.id == 8 ? '#37f29a' : '' }">{{
                            item.num }}</span>
                        <span class="status">未完成</span>
                      </div>
                    </div>
                  </el-scrollbar>
                </dv-border-box-1>
              </transition>
            </div>
          </div>

          <transition enter-active-class="animate__animated animate__fadeInRight"
            leave-active-class="animate__animated animate__fadeOutRight">
            <div class="select-box-right" v-show="showBox">

              <div class="personnel-box safe-box top-box">
                <transition enter-active-class="animate__animated animate__zoomInRight"
                  leave-active-class="animate__animated animate__backOutRight">
                  <dv-border-box-12 :reverse="true" v-if="showTrans">
                    <div style="display: flex;justify-content: space-around;">
                      <div @click="onCheckInfo('安全检查', '80%', 'C', 1, formData.SafetyCheckWeekCount)"
                        style="padding-top: 5%;">
                        <span class="round-box"></span>
                        <span class="num-box" style="color: #c75458">{{ formData.SafetyCheckWeekCount ?
                          formData.SafetyCheckWeekCount : 0 }}<em>次/周</em></span>
                        <p>安全检查</p>
                      </div>
                      <!-- <div @click="onCheckInfo('车辆巡查', '80%', 'C', 2, formData.VehicleSafelyCheckWeekCount)">
                        <span class="round-box"></span>
                        <span class="num-box" style="color: #4a9acf">{{ formData.VehicleSafelyCheckWeekCount ?
                          formData.VehicleSafelyCheckWeekCount : 0 }}<em>次/周</em></span>
                        <p>车辆巡查</p>
                      </div> -->
                      <div @click="onCheckInfo('行车日志', '80%', 'C', 3, formData.LogBookWeekCount)"
                        style="padding-top: 5%;">
                        <span class="round-box"></span>
                        <span class="num-box" style="color: #cfa458">{{ formData.LogBookWeekCount ?
                          formData.LogBookWeekCount
                          :
                          0 }}<em>次/周</em></span>
                        <p>行车日志</p>
                      </div>
                    </div>
                  </dv-border-box-12>
                </transition>
              </div>

              <div class="glide-line"></div>

              <div class="zy-box top-box">
                <transition enter-active-class="animate__animated animate__zoomInRight"
                  leave-active-class="animate__animated animate__backOutRight">
                  <dv-border-box-12 :reverse="true" v-if="showTrans">
                    <div style="display: flex;justify-content: space-around;padding-top: 2%;">
                      <div class="f-b-c" @click="onSelectPersonnel('作业标准书', '98%', 'J')">
                        <img src="../data-board/imges/xz2.png" alt="" style="width:50%">
                        <div>
                          <span class="num-box">作业标准书</span>
                          <p>{{ formData.OperationStandardCount ? formData.OperationStandardCount : 0 }}<em>份</em>
                          </p>
                        </div>
                      </div>
                      <div class="f-b-c" @click="onSelectTrain('培训', '98%', 'M')">
                        <img src="../data-board/imges/xz1.png" alt="" style="width: 50%">
                        <div>
                          <span class="num-box">当月培训数</span>
                          <p>{{ formData.OperationStandardTrainUserCount ? formData.OperationStandardTrainUserCount :
                            0 }}<em>份</em>
                          </p>
                        </div>
                      </div>
                    </div>
                  </dv-border-box-12>
                </transition>
              </div>

              <div class="glide-line"></div>

              <div class="top-box risk-height">
                <transition enter-active-class="animate__animated animate__zoomInRight"
                  leave-active-class="animate__animated animate__backOutRight">
                  <dv-border-box-12 :reverse="true" v-if="showTrans">
                    <dv-decoration-7 style="width:100%;height:50px;">
                      <div class="title">
                        <span>安全口号</span>
                      </div>
                    </dv-decoration-7>
                    <vue-danmaku :danmus="danmus" ref="danmaku" @play-end="end" loop use-slot randomChannel isSuspend
                      :speeds="40" style="width: 100%;height:calc(100% - 50px); margin: auto 2%;">
                      <template slot="dm" slot-scope="{ danmu }">
                        <div class="danmu-item" :style="{ 'color': danmu.color }"
                          @click="onDanmuClick(danmu, 'handle')">
                          <div class="content">{{ danmu.WarehouseName }}</div>
                        </div>
                      </template>
                    </vue-danmaku>

                    <i v-if="!showDanmus" class="el-icon-circle-close"
                      style="position: absolute;top: 1%;right: 1%;font-size: 30px;color: #fff;cursor: pointer;"
                      @click="handleDanmuVideoEnd"></i>
                    <video v-if="!showDanmus" :src="danmusVedio" @ended="handleDanmuVideoEnd" controls autoplay
                      style="width: 98%;height:calc(100% - 40px); margin: auto 1%;position: absolute;top: 14%;"></video>


                    <!-- <risk-pie @pieSuccess="pieSuccess" :value="formData.RiskControlList" /> -->
                  </dv-border-box-12>
                </transition>
              </div>
              <div class="glide-line"></div>

              <div class="top-box danger-box">
                <transition enter-active-class="animate__animated animate__zoomInRight"
                  leave-active-class="animate__animated animate__backOutRight">
                  <dv-border-box-12 :reverse="true" v-if="showTrans">
                    <dv-decoration-7 style="width:100%;height:50px;">
                      <div class="title">
                        <span>隐患统计</span>
                      </div>
                    </dv-decoration-7>
                    <div style="height: 85%;margin:0 3% ">
                      <!--<dangerBar :value="formData.PotentialTypeAndStatusList"
                      :color="['#F7FA70', '#EF2B67', '#3FD2C1', '#4A80E5', '#B5BCE7']" :loading="loading"
                      @success="onDangerSuccess" />-->
                      <dv-scroll-board :config="config" style="width:100%;height:100%" @click="onDangerSuccess" />

                    </div>
                  </dv-border-box-12>
                </transition>
              </div>

            </div>
          </transition>
        </div>

        <el-dialog v-dialog-drag :title="titleName" :visible.sync="addShow" :close-on-click-modal="false" :width="width"
          append-to-body top="1vh" @close="close">
          <transition enter-active-class="animate__animated animate__backInLeft"
            leave-active-class="animate__animated animate__bounceOutRight">
            <div v-show="addShow">
              <el-scrollbar class="scrollbar" ref="scrollbar" v-if="selectType == 'E'">
                <div class="dialog-box" style="padding-bottom: 30px;">
                  <ETable @EnterprisesName="EnterprisesNameOption"></ETable>
                </div>
              </el-scrollbar>

              <el-scrollbar class="scrollbar" ref="scrollbar" v-if="selectType == 'D'">
                <div class="dialog-box" style="padding-bottom: 30px;">
                  <DepartmentTable :key="getTimerDepartmentList" :EnterpriseId="EnterpriseId"
                    :IsEntryThisYear="IsEntryThisYear">
                  </DepartmentTable>
                </div>
              </el-scrollbar>

              <el-scrollbar class="scrollbar" ref="scrollbar" v-if="selectType == 'V'">
                <div class="dialog-box" style="padding-bottom: 30px;">
                  <CarList :key="getTimerCarList" @success="CarSuccess" :EnterpriseId="EnterpriseId" :type="carType"
                    :DepartmentIdStr="DepartmentIdStr">
                  </CarList>
                </div>
              </el-scrollbar>

              <el-scrollbar class="scrollbar" ref="scrollbar" v-if="selectType == 'F'">
                <div class="dialog-box" style="padding-bottom: 30px;">
                  <FacilityList :key="getTimerFacilityList" @success="facitySuccess" :EnterpriseId="EnterpriseId"
                    :WarehouseSetId="WarehouseSetId">
                  </FacilityList>
                </div>
              </el-scrollbar>

              <el-scrollbar class="scrollbar" ref="scrollbar" v-if="selectType == 'Danger'">
                <div class="dialog-box" style="padding-bottom: 30px;">
                  <HiddenDanger :isData="isData" :EnterpriseId="EnterpriseId"></HiddenDanger>
                </div>
              </el-scrollbar>

              <el-scrollbar class="scrollbar" ref="scrollbar" v-if="selectType == 'W'">
                <div class="dialog-box">
                  <TaskWarning :isWarning="isWarning" :EnterpriseId="EnterpriseId"></TaskWarning>
                </div>
              </el-scrollbar>
              <el-scrollbar class="scrollbar" ref="scrollbar" v-if="selectType == 'WA'">
                <div class="dialog-box">
                  <warehouseTable :isWarehouseSetId="isWarehouseSetId" :EnterpriseId="EnterpriseId">
                  </warehouseTable>
                </div>
              </el-scrollbar>
              <el-scrollbar class="scrollbar" ref="scrollbar" v-if="selectType == 'C'">
                <div class="dialog-box">
                  <CheckWeek :isCheck="isCheck" :EnterpriseId="EnterpriseId"></CheckWeek>
                </div>
              </el-scrollbar>
              <div class="dialog-box" v-if="selectType == 'J'">
                <JobInfo ref="Job" :EnterpriseId="EnterpriseId" />
              </div>
              <div class="dialog-box" v-if="selectType == 'R'">
                <Risk @success="RiskSuccess" ref="RiskForm" :EnterpriseId="EnterpriseId"></Risk>
              </div>

              <div class="dialog-box" v-if="selectType == 'M'">
                <Train3D @success="TrainSuccess" ref="train" :EnterpriseId="EnterpriseId"></Train3D>
              </div>

              <!-- <div class="dialog-box" v-if="selectType == 'V'">
            <Car3D @success="CarSuccess" ref="Car" :EnterpriseId="EnterpriseId" :DepartmentIdStr="DepartmentIdStr">
            </Car3D>
          </div> -->
            </div>
          </transition>
        </el-dialog>

        <el-dialog v-dialog-drag title="车辆视频" :visible.sync="VideoShow" :close-on-click-modal="false" width="95%"
          append-to-body top="1vh" @close="VideoClose">
          <div class="dialog-box">
            <div class="el_card_right_box" style="padding-left: 20px;height: 80vh">
              <div style="width: 100%; height: 100%; margin: auto;" class="main">
                <div class="box" style="display: flex;flex-wrap: wrap;" v-if="listForm && listForm.length > 0">
                  <div v-for="(item, index) in listForm" :key="index" :style="{
                    'marginRight': '5px',
                    'marginBottom': '5px',
                    'width': listForm.length == 1 ? '100%' : listForm.length == 2 ? '49.5%' : listForm.length == 3 || listForm.length == 4 ? '49%' : listForm.length > 4 ? '30%' : '',
                    'height': listForm.length == 1 ? '100%' : listForm.length == 2 ? '100%' : listForm.length == 3 || listForm.length == 4 ? '49%' : listForm.length > 4 ? '50%' : '',
                  }">
                    <video style="width: 100%;height: 100%" :id="'video' + index" :disablePictureInPicture="true"
                      controls autoplay muted></video>
                  </div>
                  <div style="width:49%;height: 49%;text-align: center;box-sizing: border-box;"
                    v-if="listForm.length == 3">
                    <el-image style="width: 50%; height: 50%;margin-top: 70px;"
                      src="https://file.hnztjia.com/mini/icons/empty2.png" fit="cover">
                    </el-image>
                    <div style="margin-top: 5px; color: #999;">暂无视频</div>
                  </div>
                </div>
                <div
                  style="display: flex;flex-direction:column;align-items: center;justify-content: center; height: 100%;"
                  v-else>
                  <el-image style="width: 210px; height: 140px;" src="https://file.hnztjia.com/mini/icons/empty2.png"
                    fit="cover">
                  </el-image>
                  <div style="margin-top: 5px; color: #999;">暂无视频</div>
                </div>
              </div>
            </div>
          </div>
        </el-dialog>

        <el-dialog v-dialog-drag title="" class="dialog-pdf-box" :visible.sync="contentShow"
          :close-on-click-modal="false" top="0.1vh" width="75%" height="100%" append-to-body>
          <transition enter-active-class="animate__animated animate__backInLeft"
            leave-active-class="animate__animated animate__bounceOutRight">
            <div class="dialog-box" v-show="contentShow">
              <Vuepdf2 :url="UrlPdf"></Vuepdf2>
            </div>
          </transition>
        </el-dialog>

        <el-dialog v-dialog-drag title="培训详情" :visible.sync="trainShow" :close-on-click-modal="false"
          @close="trainShow = false" width="60%" append-to-body top="1vh">
          <div class="dialog-box" style="padding-bottom: 30px;">
            <el-scrollbar ref="scrollbar" class="scrollbar">
              <el-table :data="TrainList" :cell-style="{ textAlign: 'center' }" :header-cell-style="tableStayle"
                style="min-height: 600px">
                <el-table-column label="培训对象" align="center" prop="UserName">
                </el-table-column>
                <el-table-column label="电话" align="center" prop="Tel">
                </el-table-column>
                <el-table-column label="课程总时长" align="center">
                  <template slot-scope="scope">
                    <div>{{ dateFormatTrain(scope.row.TotalDuration) }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="已学习时长" align="center">
                  <template slot-scope="scope">
                    <div>
                      {{ dateFormatTrain(scope.row.LearnedTotalDuration) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="学习状态" align="center" prop="TrainTaskStatuDesc">
                </el-table-column>
                <el-table-column label="考试状态" align="center" prop="ExamStateDesc">
                </el-table-column>
              </el-table>
            </el-scrollbar>
          </div>
        </el-dialog>

        <el-dialog v-dialog-drag title="风险告知卡" :visible.sync="dialogEwmShow" :close-on-click-modal="false"
          @close="dialogEwmClose()" width="50%" append-to-body>
          <el-scrollbar class="scrollbar">
            <table class="risk-table" id="printMe">
              <tr>
                <td colspan="4" style="font-weight: 700; font-size: 16px">
                  {{ ewm.EnterpriseName }}风险告知卡
                </td>
              </tr>
              <tr>
                <td>风险单元</td>
                <td>{{ ewm.RiskUnitName }}</td>
                <td>风险点</td>
                <td>{{ ewm.RiskPointName }}</td>
              </tr>
              <tr>
                <td>风险类型</td>
                <td>{{ ewm.RiskTypeName }}</td>
                <td>风险分级</td>
                <td>{{ ewm.RiskLevelName }}</td>
              </tr>
              <tr>
                <td>风险因素</td>
                <td colspan="3">{{ ewm.RiskFactors }}</td>
              </tr>
              <tr>
                <td>事故类型</td>
                <td colspan="3">
                  <div v-for="(item, i) in ewm.RiskAccidentTypeList" :key="i">
                    {{ item }}
                  </div>
                </td>
              </tr>
              <tr>
                <td>管控措施</td>
                <td colspan="3" style="text-align: left">
                  <div v-for="(item, i) in ewm.MeasuresList" :key="i">
                    {{ item }}
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  <img :src="ewm.QRCodes" width="300px;" />
                </td>
              </tr>
              <tr v-if="ewm.RiskControlResponsibilityList != null &&
                ewm.RiskControlResponsibilityList.length > 0
              ">
                <td>管控层级</td>
                <td>管控频次</td>
                <td>责任部门</td>
                <td>责任人</td>
              </tr>
              <tr v-for="(item, i) in ewm.RiskControlResponsibilityList" :key="i">
                <td>{{ item.RiskControlDegreeName }}</td>
                <td>{{ item.RiskCheckFrequencyName }}</td>
                <td>{{ item.ResponsibilityDepartmentName }}</td>
                <td>{{ item.ResponsibilityUserName }}</td>
              </tr>
              <tr>
                <td>备注</td>
                <td colspan="3">{{ ewm.Remark }}</td>
              </tr>
            </table>
          </el-scrollbar>
        </el-dialog>
      </div>
    </div>
  </dv-full-screen-container>
</template>

<script>
import flvjs from "flv.js";
import API from "@/api/api_user";
import util from "@/common/util.js";
import request_mixin from "@/mixins/request-mixin.js";
import {
  trainNumberColumn,
  RiskPie,
  trainNumberRightColumn,
  facilityPie,
  carPie,
  dangerBar,
} from "./components";

import ETable from "./dialog/EnterprisesTable";
import TaskWarning from "./dialog/TaskWarning";
import Vuepdf2 from "./dialog/Vuepdf";
import CountFlop from "./dialog/number-grow";
import CarouselChart from "./dialog/Carousel-chart";
import per from "./dialog/per";
import Risk from "./dialog/Risk";
import bar from "../reports/components/bar.vue";
import CheckWeek from "./dialog/CheckWeek";
import JobInfo from "./dialog/JobInfo";
import Train3D from "./dialog/3dTrain";
import Car3D from "./dialog/3dCar";
import CarList from "./dialog/carList";
import FacilityList from "./dialog/facilityList";
import warehouseTable from "./dialog/warehouse";
import HiddenDanger from "./dialog/HiddenDanger";
import DepartmentTable from "./dialog/DepartmentTable";
import vueDanmaku from "vue-danmaku";

function zero(num) {
  return num < 10 ? "0" + num : num;
}
let loginUrl = util.getLoginUrl();
const sourceUrl =
  "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/bj_bus.json";

import Qs from "qs";
export default {
  name: "transit-board",
  components: {
    trainNumberColumn,
    RiskPie,
    trainNumberRightColumn,
    ETable,
    Vuepdf2,
    facilityPie,
    carPie,
    dangerBar,
    CountFlop,
    per,
    CarouselChart,
    bar,
    TaskWarning,
    Risk,
    CheckWeek,
    JobInfo,
    Train3D,
    warehouseTable,
    HiddenDanger,
    Car3D,
    CarList,
    FacilityList,
    DepartmentTable,
    vueDanmaku,
  },
  mixins: [request_mixin],
  data() {
    const that = this;
    return {
      showTrans: false,
      showBox: true,
      showDialog: false,
      tableStayle: {
        background: "rgba(13, 64, 105, 0.3)",
        height: "60px",
        color: "#fff",
        borderBottom: "1px solid #0f2a4b",
      },
      VideoShow: false,
      isData: "",
      isWarehouseSetId: "",
      trainShow: false,
      formData: {},
      TrainList: [],
      contentShow: false,
      width: "80%",
      UrlPdf: "",
      titleName: "选择企业",
      addShow: false,
      loading: false,
      timer: "",
      isShow: false,
      isZoom: -1,
      color: "blue",
      isColor: 8,
      currentWindow: {
        position: [0, 0],
        content: "",
        visible: false,
      },
      lineArr: [],
      lineArrlast: [],
      lineArrPre: [],
      visible: true,

      map: {},
      zoom: 14,
      events: {
        // init(o) {
        // 	o.plugin(['AMap.ControlBar'],
        // 		() => { // ControlBar插件，文档：https://lbs.amap.com/api/javascript-api/guide/abc/plugins
        // 			const ControlBar = new AMap.ControlBar({
        // 				position: {
        // 					top: '60px',
        // 					right: '25%',
        // 				}
        // 			})
        // 			o.addControl(ControlBar)
        // 		})
        // },
        click: (e) => {
          // const {
          // 	lng,
          // 	lat
          // } = e.lnglat
          // this.lng = lng
          // this.lat = lat
          e.target.stopPropagation();
        },
        zoomchange: (e) => {
          that.$nextTick(() => {
            that.mapSet.zoom = e;
          });
        },
      },
      gpsCarlist: [],
      gpsCount: 0,
      markers: [],
      windows: [],
      targetPosition: [],
      marker: "",
      polyline: "",
      mapSet: {
        center: [105.457985, 30.018409],
        pitch: 50, // 地图俯仰角度，有效范围 0 度- 83 度
        // zoom: 18,//原来的层级
        zoom: 5,
        rotation: 0,
        viewMode: "3D", //开启3D视图,默认为关闭
        buildingAnimation: true, //楼块出现是否带动画
        expandZoomRange: true,
        showBuildingBlock: false,
        mapStyle: "amap://styles/45311ae996a8bea0da10ad5151f72979",
        showLabel: false,
        zooms: [1, 20],
        // features: ["bg", "road", "building"], // 不显示地名
        features: ["bg", "road", "building", "point"], // 显示地名
      },

      locaSet: {
        sourceUrl:
          "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/bj_bus.json",

        layerStyle: {
          altitude: 0,
          lineWidth: 2,
          // 脉冲头颜色
          headColor: (_, feature) => {
            const headColors = [
              "#EFBB51",
              "#7F3CFF",
              "#4CC19B",
              "#0B5D74",
              "#E06AC4",
              "#223F9B",
              "#F15C1A",
              "#7A0FA6",
            ];
            return headColors[feature.properties.type - 1];
          },
          // 脉冲尾颜色
          trailColor: "rgba(128, 128, 128, 0.5)",
          // 脉冲长度，0.25 表示一段脉冲占整条路的 1/4
          interval: 0.25,
          // 脉冲线的速度，几秒钟跑完整段路
          duration: 5000,
        },
        visible: true,
      },
      polylineX: null,
      passedPolyline: null,
      isColor: 0,
      value: new Date(),
      updateTime: new Date(),
      userInfo: {},
      EnterpriseName: "",
      selectType: -1,
      isWarning: 0,
      dialogEwmShow: false,
      ewm: {},
      isArr: [],
      isEnterpriseName: "",
      carList: [],
      carNameList: [],
      loadingMap: false,
      isCheck: 0,
      DepartmentIdStr: "",
      WarehouseSetId: "",
      jsession: "",
      listForm: [],
      flvPlayers: [],
      config: {
        header: [],
        headerHeight: 30,
        data: [],
        index: false,
        rowNum: 12,
        columnWidth: [50],
        headerBGC: "rgba(37, 194, 210, 0.92)",
        evenRowBGC: "rgba(11, 137, 166, 0.17)",
        oddRowBGC: "rgba(52, 170, 206, 0.55)",
        align: ["center", "center", "center", "center", "center"],
        carousel: "page",
      },
      carType: "",
      getTimerCarPie: null,
      getTimerCarList: null,
      getTimerFacilityList: null,
      getTimerDepartmentList: null,

      danmus: [],
      danmakuOptions: {
        mode: "scroll", // 弹幕模式：滚动
        speed: 5, // 滚动速度，数值越大速度越快
        maxRow: 2, // 最大行数，只在滚动和垂直滚动模式下有效
        isRandom: true, // 是否随机速度
        isPaused: false, // 是否暂停
        // 其他配置项...
      },
      danmusVedio: '',
      showDanmus: true,
    };
  },
  filters: {
    //格式化时间
    dateFormat() {
      var date = new Date();
      var year = date.getFullYear();
      var month = zero(date.getMonth() + 1);
      var day = zero(date.getDate());
      var hours = zero(date.getHours());
      var minutes = zero(date.getMinutes());
      var seconds = zero(date.getSeconds());
      let week = date.getDay(); // 星期
      let weekArr = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      return (
        year +
        "年" +
        month +
        "月" +
        day +
        "日 " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds +
        " " +
        weekArr[week]
      );
    },
  },
  watch: {
    addShow() {
      if (this.addShow) {
        this.showDialog = true;
        this.showTrans = false
      } else {
        this.showTrans = true

      }
    },
    VideoShow() {
      if (this.VideoShow) {
        this.showTrans = false
      } else {
        this.showTrans = true

      }
    },
  },
  created() {
    this.userInfo = Qs.parse(window.localStorage.getItem("userinfo"));
    // this.EnterpriseName = this.userInfo.Enterprise.EnterpriseName;
    // this.EnterpriseId = Qs.parse(
    //   window.localStorage.getItem("userinfo")
    // ).EnterpriseId;
    this.EnterpriseName = '华恒物流(集团)';
    this.EnterpriseId = ''
  },
  mounted() {
    this.$nextTick(() => {
      this.timer = setTimeout(() => {
        this.isShow = true;
      }, 500);
    });

    this.timerDate = setInterval(() => {
      this.value = new Date();
    }, 1000);

    // this.isInit()
    // this.ceshi()
    // setInterval( ()=>{
    //       this.power(360);
    // },5000);

    this.GetVideo();
    this.GetEnterpriseData(this.EnterpriseId);
    this.GetPreMeetingSignLeaders()
    this.GetCarList(this.EnterpriseId);
    this.$nextTick(() => {
      this.timer = setTimeout(() => {
        this.showTrans = true;
      }, 1000);
    });
    window.addEventListener("resize", () => {
      this.chart.resize();
    });
  },

  destroyed() {
    clearTimeout(this.timer);
    clearTimeout(this.timerDate);
  },
  //实例销毁之前清除定时器
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.timerDate) {
      clearInterval(this.timerDate);
    }
  },
  methods: {
    changeShowBox() {
      this.showBox = true;
      this.showTrans = !this.showTrans;
      if (!this.showTrans) {
        setTimeout(() => {
          this.showBox = false;
        }, 100);
      }
    },
    end() {
      console.log(this.$refs.danmaku);
    },
    rgb() {//rgb颜色随机
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
    },
    GetPreMeetingSignLeaders() {
      this.Post("/GetPreMeetingSignLeadersDaPing").then((res) => {
        if (res.status == 2000) {
          let danmus = []
          res.data.list.forEach((item) => {
            if (item.WarehouseName != null) {
              // item.color = this.rgb()
              danmus.push(item)

            }
          });
          this.danmus = danmus
          console.log(this.danmus, "this.danmus");

        }
      });
    },
    onDanmuClick(item, type) {
      console.log(item, "item");
      this.Post("/GetPreMeetingSignLeadersVideoByPreId", { PreMeetingSignLeaderId: item.PreMeetingSignLeaderId }).then((res) => {
        if (res.status == 2000) {
          this.showDanmus = false;
          res.data.PreMeetingSignFiles.forEach((item) => {
            if (item.Url.indexOf(".mp4") > -1) {
              this.danmusVedio = item.Url;
            }
          });

        }
        else {
          this.$message.error("获取视频失败！");
        }
      });


    },
    handleDanmuVideoEnd() {
      this.showDanmus = true;
    },


    // 获取日立登录token
    GetVideo() {
      this.Get("/HHThirdLogin").then((res) => {
        if (res.status == 2000) {
          let objData = JSON.parse(res.data);
          this.jsession = objData.jsession;
        }
      });
    },
    VideoClose() {
      this.destroyVideos();
      this.VideoShow = false;
    },
    GetHHVideo(item) {
      this.destroyVideos();
      this.$nextTick(() => {
        let params = {
          jsession: this.jsession,
          // vehiIdno: "粤ADH666",
          vehiIdno: item,
        };
        this.listForm = [];
        this.Get("/HHThirdGetDeviceByVehicle", params).then((res) => {
          if (res.status == 2000) {
            let objData = JSON.parse(JSON.parse(JSON.stringify(res.data)));
            if (objData.result != 0) {
              this.$message.error(`未找到对应的车辆视频！`);
              // this.CarSuccess(this.currentWindow)
            } else {
              if (objData.devices && objData.devices.length > 0) {
                objData.devices.map((item) => {
                  if (item.type == 0) {
                    this.$message.error(`当前车辆视频不存在！`);
                  }
                  Object.entries(item.channel).forEach((data, index) => {
                    if (item.type == 1) {
                      this.GetHHVideoPlay(item.did, index);
                    }
                  });
                });
              } else {
                this.$message.error(`未找到对应的车辆视频！`);
              }
            }
          }
        });
      });
    },
    GetHHStarus(item) {
      let params = {
        jsession: this.jsession,
        vehiIdno: item,
      };
      this.Post("/HHThirdGetDeviceStatus", params).then((res) => {
        if (res.status == 2000) {
          let objData = JSON.parse(JSON.parse(JSON.stringify(res.data)));
          if (objData.result != 0) {
            this.$message.error(`未找到对应的车辆信息！`);
          } else {
            if (objData.status && objData.status.length > 0) {
              if (objData.status[0].ol == 1) {
                this.GetHHVideo(item);
              } else {
                this.$message.error(`当前车辆不在线,无法查看视频！`);
              }
            }
          }
        }
      });
    },
    GetHHVideoPlay(id, key) {
      let params = {
        jsession: this.jsession,
        DevIDNO: id,
        Channel: key,
        AVType: 1,
        Stream: 1,
      };
      this.Get("/HHThirdHTTP_FLV", params).then((res) => {
        this.VideoShow = true;
        if (res.status == 2000) {
          let objData = JSON.parse(JSON.stringify(res.data));
          this.listForm.push({
            src: objData,
          });
          this.$nextTick(() => {
            this.startPlay();
          });
        }
        this.loading = false;
      });
    },
    startPlay() {
      this.listForm.forEach((item, index) => {
        const videoElement = document.getElementById("video" + index);
        const flvPlayer = flvjs.createPlayer({
          type: "flv",
          isLive: true,
          hasAudio: false,
          url: item.src,
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
        this.$set(this.flvPlayers, index, flvPlayer);
      });
    },
    destroyVideos() {
      this.flvPlayers.forEach((flvPlayer) => {
        flvPlayer.pause();
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.destroy();
      });
      this.flvPlayers = [];
    },
    reloadVideos() {
      this.destroyVideos();
      this.startPlay();
    },
    dateFormatTrain(examSecond) {
      let result = parseInt(examSecond);
      let h =
        Math.floor(result / 3600) < 10
          ? "0" + Math.floor(result / 3600)
          : Math.floor(result / 3600);
      let m =
        Math.floor((result / 60) % 60) < 10
          ? "0" + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60);
      let s =
        Math.floor(result % 60) < 10
          ? "0" + Math.floor(result % 60)
          : Math.floor(result % 60);
      let res = "";
      if (h !== "00") res += `${h}时`;
      if (m !== "00") res += `${m}分`;
      res += `${s}秒`;
      return res;
    },

    async GetEnterpriseData(data) {
      let params = {
        EnterpriseId: data,
        type: 1,
      };
      let res = await this.Post("/GetHHEnterpriseDashBord", params);
      if (res.status == 2000) {
        // 车辆

        res.data.VehicleTypeList = res.data.VehicleTypeList.map(
          (item, index) => {
            return {
              name: item.VehicleTypeName,
              value: item.VehicleCount,
              label: {
                color: "#4A80E5",
              },
            };
          }
        );

        // 仓库
        // res.data.EquipmentWarehourseList = res.data.EquipmentWarehourseList.map(
        //   (item, index) => {
        //     console.log(item.WarehouseName, "WarehouseName");

        //     return {
        //       name: item.WarehouseName,
        //       value: item.EquipmentManageCount,
        //       id: item.WarehouseSetId,
        //     };
        //   }
        // );

        // 教育培训
        res.data.TrainUserMonthList = res.data.TrainUserMonthList.map(
          (item) => item.Count
        );

        //风险统计
        res.data.RiskControlList = res.data.RiskControlList.map(
          (item, index) => {
            return {
              name: item.RiskLevelName,
              value: item.RiskCount,
              label: {
                color:
                  item.RiskLevelCode == "0002501"
                    ? "#27E3FF"
                    : item.RiskLevelCode == "0002502"
                      ? "#F7FA70"
                      : item.RiskLevelCode == "0002503"
                        ? "#FFB12A"
                        : item.RiskLevelCode == "0002504"
                          ? "#EF2B67"
                          : "",
              },
            };
          }
        );

        // 隐患统计
        // res.data.PotentialTypeAndStatusList =

        let PTASList = res.data.PotentialTypeAndStatusList;
        console.log(PTASList, "PTASList");
        PTASList.splice(4, 1);
        let ptasNames = [];
        let ptasDatas = [];
        PTASList.map((item, index) => {
          ptasNames.push(item.Name);
        });
        PTASList[0].Count.forEach((element, index) => {
          //12
          let arr = [];
          for (let i = 0; i < PTASList.length; i++) {
            //5
            if (i == 0) {
              arr.push(PTASList[0].Count[index] + PTASList[1].Count[index]);
            } else if (i > 1) {
              arr.push(PTASList[i].Count[index]);
            }
          }
          arr.unshift(index + 1 + "月");
          ptasDatas.push(arr);
        });
        ptasNames[0] = "月份";
        ptasNames[1] = "合计";
        this.config.header = ptasNames;
        this.config.data = ptasDatas;
        this.config = _.cloneDeep(this.config);

        // 今日任务预警
        if (res.data.WarnInfoByToday) {
          res.data.TaskWarning = [
            {
              id: 1,
              name: "教育培训",
              num: res.data.WarnInfoByToday.TrainUserNoneCount || 0,
            },
            // {
            //   id: 2,
            //   name: "安全例会",
            //   num:
            //     res.data.WarnInfoByToday.SafetyMeetingPersonnelNoneCount || 0,
            // },
            {
              id: 3,
              name: "安全检查",
              num: res.data.WarnInfoByToday.InspectionRecordNoneCount || 0,
            },
            {
              id: 4,
              name: "隐患整改",
              num: res.data.WarnInfoByToday.PotentialNoneCount || 0,
            },
            {
              id: 5,
              name: "班前会任务",
              num: res.data.WarnInfoByToday.PreMeetingSignNoneCount || 0,
            },
            {
              id: 6,
              name: "事件处理",
              num: res.data.WarnInfoByToday.EventReportsNoneCount || 0,
            },
            // {
            //   id: 7,
            //   name: "设备保养",
            //   num: res.data.WarnInfoByToday.MaintenanceRecordNoneCount || 0,
            // },
            {
              id: 8,
              name: "设备点检",
              num: res.data.WarnInfoByToday.SpotCheckRecordNoneCount || 0,
            },
          ];
        }
        this.formData = res.data;
      }
    },
    onCarDetail() {
      // this.GetHHVideo(this.currentWindow.car)
      this.GetHHStarus(this.currentWindow.car);
    },

    onVehiclData(item) {
      if (item.VehicleCount && item.VehicleCount > 0) {
        this.DepartmentIdStr = item.DepartmentIdStr;
        this.carType = item.DepartmentName;
        this.getTimerCarList = new Date().getTime();
        this.onCheckInfo("车辆", "58%", "V", "", item.VehicleCount);
      } else {
        this.$message.error("当前部门没有车辆信息");
      }
    },
    onFacilityData(item) {
      if (item.WarehouseName && item.EquipmentManageCount > 0) {
        this.WarehouseSetId = item.WarehouseSetId;
        this.getTimerFacilityList = new Date().getTime();
        this.onCheckInfo("设备设施", "70%", "F", "", item.WarehouseSetId);
      } else {
        this.$message.error("当前仓库没有设备设施信息");
      }
    },
    getEnterpriseId(arr) {
      let list = [];
      if (arr && arr.length > 0) {
        arr.forEach((item) => {
          if (item.Vehicles && item.Vehicles.length > 0) {
            list.push({
              isTitle: true,
              LicensePlateNumber:
                this.isEnterpriseName + "(" + item.label + ")",
              children: item.Vehicles,
            });
          }
          if (item.children && !!item.children.length) {
            list.push(...this.getEnterpriseId(item.children));
          }
        });
        return list;
      }
    },
    async GetCarList(data) {
      let res = await this.Post("/GetHHEnterpriseVehicleDashBord", {
        EnterpriseId: data,
      });
      this.carNameList = [];
      if (res.status == 2000) {
        if (res.data && res.data.length > 0) {
          let arr = [];
          for (let i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].LicensePlateNumber);
          }
          this.carNameList = res.data;
          console.log(arr, "arr");

          //设置调用请求次数
          let count = 0;
          if (arr.length % 50 == 0) {
            count = arr.length / 50;
          } else {
            count = Math.floor(arr.length / 50 + 1);
          }
          this.gpsCount = count;

          for (let i = 1; i <= count; i++) {
            if (i == count) {
              this.GetCarLocation(arr.slice(50 * (i - 1), 50 * i + 1));
            } else {
              this.GetCarLocation(arr.slice(50 * (i - 1), 50 * i));
            }
          }
          // this.GetCarLocation(arr);
        }
      }
    },

    GetCarLocation(arr) {
      const loading = this.$loading({
        lock: true,
        text: "数据加载中，请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, .3)",
      });
      this.markers = [];
      // this.Get(
      //   "https://gps.gzhhl.com.cn/api/last-positions/truck?truckIds=" + arr
      this.Get("/GetGpsPositionLast?truckIds=" + arr).then((res) => {
        let that = this;

        if (res) {
          if (res && res.length > 0) {
            let carList = [];
            for (let i = 0; i < res.length; i++) {
              for (let j = 0; j < this.carNameList.length; j++) {
                if (res[i].truckId == this.carNameList[j].LicensePlateNumber) {
                  res[i].VehicleId = this.carNameList[j].VehicleId;
                  carList.push(res[i]);
                }
              }
            }
            console.log(carList, "carList");

            this.isInit(carList);
            loading.close();
          }
          loading.close();
        } else {
          this.$message.error("车辆定位接口获取失败");
          loading.close();
        }
        loading.close();
      });
    },
    dialogEwmClose() {
      this.dialogEwmShow = false;
    },
    close() {
      if (this.selectType == "R") {
        this.$refs.RiskForm.isShowFlase();
      }
      if (this.selectType == "J") {
        this.$refs.Job.isShowFlase();
      }

      if (this.selectType == "M") {
        this.$refs.train.isShowFlase();
      }

      // if (this.selectType == "V") {
      //   this.$refs.Car.isShowFlase();
      // }

      this.$nextTick(() => {
        this.addShow = false;
      });
    },
    onDangerSuccess(config) {
      console.log(config, "dangerSuccess");

      this.isData = config;
      this.onCheckInfo("隐患列表", "70%", "Danger", "", 1);
    },
    FacititySuccess(data) {
      this.isWarehouseSetId = data.WarehouseSetId;
      if (data.value && data.value > 0) {
        this.onCheckInfo("仓库", "70%", "WA", "", data.value);
      } else {
        this.$message.error("当前无数据");
      }
    },
    pieSuccess(data) {
      this.selectType = "R";
      this.titleName = "风险统计";
      this.width = "98%";
      this.addShow = true;
      this.$nextTick(() => {
        this.$refs.RiskForm.show();
      });
    },
    CarSuccess(data) {
      const Carloading = this.$loading({
        lock: true,
        text: "车辆数据生成中，请稍等...",
        spinner: "el-icon-loading",
        color: "#fff",
        background: "rgba(0, 0, 0, .3)",
      });
      this.Get("/GetHHVehiclePDFDashBord?VehicleId=" + data.VehicleId).then(
        (res) => {
          if (res.status == 2000) {
            this.UrlPdf = res.data.key;
            this.$nextTick(() => {
              this.contentShow = true;
            });
          } else {
            this.$message.error("获取PDF失败，请稍后再试");
          }
          Carloading.close();
        }
      );
    },
    facitySuccess(data) {
      const Carloading = this.$loading({
        lock: true,
        text: "设备设施数据生成中，请稍等...",
        spinner: "el-icon-loading",
        color: "#fff",
        background: "rgba(0, 0, 0, .3)",
      });
      this.Get(
        "/GetHHEquipmentPDFDashBord?equipmentManageId=" + data.EquipmentManageId
      ).then((res) => {
        if (res.status == 2000) {
          this.UrlPdf = res.data.key;
          this.$nextTick(() => {
            this.contentShow = true;
          });
        } else {
          this.$message.error("获取PDF失败，请稍后再试");
        }
        Carloading.close();
      });
    },

    TrainSuccess(data) {
      this.trainShow = true;
      let params = {
        page: 1,
        rows: 9999,
        TrainTaskId: data.TrainTaskId,
      };
      this.Post("/GetTrainCurriculums2", params).then((res) => {
        if (res.status == 2000) {
          this.TrainList = res.data.list;
        } else {
          this.$message(res.message);
        }
      });
    },
    GetPositionCenter() {
      let min = 0;
      let max = this.lineArr.length - 1;
      let random = Math.random() * (max - min + 1) + min;
      let randomNumber = Math.floor(random);
      this.mapSet.center = this.lineArr[randomNumber];
      this.currentWindow = this.windows[randomNumber];
      this.currentWindow.visible = true;


      return;
      // this.mapSet.center = [this.lineArr[randomNumber]
    },
    RiskSuccess(val) {
      this.$nextTick(() => {
        this.ewm = val;
        this.dialogEwmShow = true;
      });
    },
    onCheckInfo(title, width, type, data, value) {
      this.selectType = type;
      this.titleName = title;
      this.width = width;
      this.isCheck = data;
      if (value && value > 0) {
        this.addShow = true;
        // if (type == "V") {
        //   this.$nextTick(() => {
        //     this.$refs.Car.show();
        //   });
        // }
      } else {
        this.$message.error("当前选项没有数据");
      }
    },
    onSelectPersonnelPower(title, width, type, data) {
      this.selectType = type;
      this.titleName = title;
      this.width = width;
      this.IsEntryThisYear = data;
      this.getTimerDepartmentList = new Date().getTime();
      if (this.$_has("QYLBList")) {
        this.addShow = true;

        // this.$nextTick(() => {
        // 	this.$refs.per.show(this.EnterpriseId, data)
        // })
      } else {
        this.$message.error("当前登录人没有企业列表权限,请联系管理员添加");
      }
    },
    onSelectTrain(title, width, type) {
      this.selectType = type;
      this.titleName = title;
      this.width = width;
      if (
        this.formData.OperationStandardTrainUserCount &&
        this.formData.OperationStandardTrainUserCount > 0
      ) {
        this.addShow = true;
        this.$nextTick(() => {
          this.$refs.train.show();
        });
      } else {
        this.$message.error("当前月份没有培训");
      }
    },
    onSelectPersonnel(title, width, type) {
      this.selectType = type;
      this.titleName = title;
      this.width = width;
      if (type == "E") {
        if (this.$_has("QYLBList")) {
          this.addShow = true;
        } else {
          this.$message.error("当前登录人没有企业列表权限,请联系管理员添加");
        }
      }
      if (type == "J") {
        if (
          this.formData.OperationStandardCount &&
          this.formData.OperationStandardCount > 0
        ) {
          this.addShow = true;
          this.$nextTick(() => {
            this.$refs.Job.show();
          });
        } else {
          this.$message.error("当前企业未添加作业标准书");
        }
      }
    },
    onTaskWarning(item, width, type) {
      if (item.num > 0) {
        this.selectType = type;
        this.addShow = true;
        this.titleName = item.name;
        this.width = width;
        this.isWarning = item.id;
      } else {
        this.$message.warning("该任务无数据");
      }
    },

    power(n) {
      this.config.number[0] = Math.floor(Math.random() * n + 1);
      this.config = {
        ...this.config,
      }; //对象解构，更新props
    },
    EnterprisesNameOption(val) {
      this.titleName = "选择企业";
      this.EnterpriseName = val.EnterpriseName;
      console.log(val, "val");

      this.getTimerCarPie = new Date().getTime();
      this.EnterpriseId = val.EnterpriseId;
      this.resetDialog();
      this.GetEnterpriseData(val.EnterpriseId);
      this.GetCarList(val.EnterpriseId);
    },
    resetDialog() {
      this.addShow = false;
    },
    loginOut() {
      this.$confirm("确认退出吗？", "提示").then(() => {
        API.logout()
          .then((res) => {
            window.localStorage.removeItem("userinfo");
            window.localStorage.removeItem("ttoken");
            window.localStorage.removeItem("enterpriseId");
            window.localStorage.removeItem("menus");
            this.$router.go(loginUrl); //用go刷新
          })
          .catch((err) => {
            this.$message.error({
              showClose: true,
              message: err.message,
              duration: 2000,
            });
          });
      });
    },
    update() {
      // this.$emit('update:loading', true)
      setTimeout(() => {
        this.updateTime = new Date();
        this.$emit("update:loading", false);
      }, 1000);
    },
    onIsColor(index) {
      this.isColor = index;
      return;
      if (index == 2) {
        location.href = "/";
      }
    },
    onClickChange(index, item) {
      this.isColor = index;
      this.color = item.color;
    },
    animateToLocationAndScale(newLonLat, newZoom) {
      let amap = this.$refs.amap.$amap;
      this.mapSet.center = newLonLat;
      setTimeout(() => {
        amap.animateToLocation(newLonLat, { duration: 500 });
        setTimeout(() => {
          amap.animateToLevel(newZoom);
        }, 500);
      }, 1000);
    },
    animateCamera(data, index) {
      this.mapSet.center = data;

      return;
      this.mapSet.zoom = 5;
      setTimeout(() => {
        this.mapSet.zoom = 8;
        this.mapSet.pitch = 30;
        rotation(90);
      }, 1500);
      setTimeout(() => {
        rotation(360);
        this.mapSet.zoom = 10;
        this.mapSet.pitch = 50;
      }, 3000);
      setTimeout(() => {
        rotation(270);
        this.mapSet.zoom = 12;
        this.mapSet.pitch = 40;
      }, 4500);
      setTimeout(() => {
        rotation(540);
        this.mapSet.zoom = 15;
        this.mapSet.pitch = 50;
      }, 6000);
      setTimeout(() => {
        rotation(720);
        this.mapSet.zoom = 18;
        this.mapSet.pitch = 60;
      }, 7500);
      setTimeout(() => {
        rotation(720);
        this.mapSet.zoom = 20;
        this.mapSet.pitch = 70;
        // this.getmap()
      }, 9000);
      let n = 0;
      let amap = this.$refs.amap.$amap;
      const rotation = (k) => {
        if (n >= k) {
          return;
        }
        n += 5;
        amap.setRotation(n);
        requestAnimationFrame(rotation.bind(null, k));
      };
    },
    clearMap() {
      console.log("clearMap");

      let amap = this.$refs.amap.$amap;
      if (this.polylineX) {
        this.polylineX.setMap(null);
        amap.remove(this.polylineX);
      }
      if (this.passedPolyline) {
        this.passedPolyline.setMap(null);
      }
      if (this.marker) {
        this.marker.setMap(null);
        this.marker = null;
      }
    },
    getmap() {
      this.clearMap();
      console.log("getmap");

      this.lineArrlast = [];
      this.lineArrPre = [];
      this.lineArr = [
        "37.8733379449,112.55877766927",
        "37.8732877604,112.55876600477",
        "37.8733064779,112.5587516276",
        "37.8732354058,112.55877929688",
        "37.8731488715,112.55866102431",
        "37.8730938043,112.55855604384",
        "37.8729125977,112.55849093967",
        "37.872827691,112.55837158203",
        "37.8727848307,112.55822238498",
        "37.8727718099,112.55802517361",
        "37.8728314887,112.55778184679",
        "37.8729033746,112.55748616536",
        "37.8728721788,112.5572781033",
        "37.8728428819,112.55718641493",
        "37.8728192817,112.55690456814",
        "37.872827691,112.55672688802",
        "37.8728881836,112.55657172309",
        "37.8728849284,112.55644504123",
        "37.8727517361,112.55618109809",
        "37.8724210612,112.55612792969",
        "37.8722357856,112.55611328125",
        "37.8721343316,112.55603135851",
        "37.8721443685,112.5558710395",
        "37.8721072049,112.5559375",
        "37.8720486111,112.55637315538",
        "37.8722252062,112.55630886502",
        "37.8722734918,112.5563031684",
        "37.8730498589,112.55625108507",
      ];
      let self = this;
      let latlonarr, pointList;
      if (this.lineArr.length > 0) {
        for (let j = 0; j < this.lineArr.length; j++) {
          latlonarr = this.lineArr;
          if (latlonarr.length > 0) {
            if (j < this.lineArr.length - 1) {
              this.lineArrPre = [];
              for (let i = 0; i < latlonarr.length; i++) {
                pointList = latlonarr[i].split(",");
                if (pointList.length > 0) {
                  this.lineArrPre.push(
                    new AMap.LngLat(pointList[1], pointList[0])
                  );
                }
              }
              this.polylineX = new AMap.Polyline({
                map: this.$refs.amap.$amap,
                path: this.lineArrPre,
                showDir: true,
                strokeColor: "#3366cc", //线颜色
                strokeWeight: 6, //线宽
              });
            } else {
              //最后一条轨迹绘制移动轨迹
              for (let i = 0; i < latlonarr.length; i++) {
                pointList = latlonarr[i].split(",");
                if (pointList.length > 0) {
                  this.lineArrlast.push(
                    new AMap.LngLat(pointList[1], pointList[0])
                  );
                }
              }
              this.polylineX = new AMap.Polyline({
                map: this.$refs.amap.$amap,
                path: this.lineArrlast,
                showDir: true,
                strokeColor: "yellow", //线颜色
                strokeWeight: 6, //线宽
              });
              // if (this.lineArrlast.length > 0) {
              //   this.marker = new AMap.Marker({
              //     map: this.$refs.amap.$amap,
              //     position: [this.lineArrlast[0].lng, this.lineArrlast[0].lat],
              //     icon: "https://webapi.amap.com/images/car.png",
              //     offset: new AMap.Pixel(-26, -13),
              //     autoRotation: true,
              //     angle: -90,
              //   });
              // }
              self.passedPolyline = new AMap.Polyline({
                map: this.$refs.amap.$amap,
                strokeColor: "#AF5", //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 6, //线宽
              });

              this.marker.on("moving", function (e) {
                self.passedPolyline.setPath(e.passedPath);
              });
              this.marker.moveAlong(this.lineArrlast, 30000);
            }
          }
        }
      }
    },
    getMapStyle() {
      // this.$refs.amap.$amap.setZoomAndCenter(10, [116.404, 39.915]);
      // let boundaryStyle = {
      //   fill: "#ff0000", // 红色填充
      //   stroke: "#000", // 黑色边框
      // };
      // this.$refs.amap.$amap.addBoundary(
      //   "中国边界",
      //   boundaryData,
      //   boundaryStyle
      // );
      //2、创建国家简易行政区图层
      var distCountry = new AMap.DistrictLayer.Country({
        zIndex: 10, //设置图层层级
        zooms: [2, 15], //设置图层显示范围
        SOC: "CHN", //设置显示国家
        depth: 2, //设置数据显示层级，0：显示国家面，1：显示省级，当国家为中国时设置depth为2的可以显示市一级
      });

      //3、设置行政区图层样式
      distCountry.setStyles({
        "stroke-width": 2, //描边线宽
        fill: function (data) {
          //设置区域填充颜色，可根据回调信息返回区域信息设置不同填充色
          //回调返回区域信息数据，字段包括 SOC(国家代码)、NAME_ENG(英文名称)、NAME_CHN(中文名称)等
          //国家代码名称说明参考 https://a.amap.com/jsapi_demos/static/demo-center/js/soc-list.json
          return "#ffffffe7";
        },
      });

      //4、将简易行政区图层添加到地图
      this.$refs.amap.add(distCountry);
    },
    isInit(data) {
      this.currentWindow.visible = false;
      const markers = [];
      const windows = [];
      const label = [];
      const isArr = [];
      const that = this;

      // this.getMapStyle();
      data.map((item, index) => {
        // console.log(item.direction)
        let rondomSeconds = Math.floor(Math.random() * 5 + 1);
        let img = ''
        if (item.onlineType == 1 && item.hvn == 1) {
          img = require("@/assets/images/adas/online2.png")
        } else {
          img = require("@/assets/images/adas/carIcon.png")
        }
        markers.push({
          position: [item.longitude, item.latitude],
          markerImg: `<img class="play_drop" style='width:20px;height:20px-webkit-animation: bounce ${rondomSeconds}s ease-in 0s 1 ; animation: bounce ${rondomSeconds}s ease-in 0s 1 ;' src="${img}" ></img>`,
          label: {
            content: item.truckId,
            offset: [-5, 50],
          },
          address: item.address,
          VehicleId: item.VehicleId,
          events: {
            click: (e) => {
              that.windows.forEach((data) => {
                data.visible = false;
              });
              that.currentWindow = that.windows[index];
              that.targetPosition = that.windows[index].position;
              that.$nextTick(() => {
                that.currentWindow.visible = true;

                if (that.isZoom == index) {
                  // that.getmap();
                  return;
                } else {
                  that.clearMap();
                }
                that.isZoom = index;
                // that.animateToLocationAndScale(that.windows[index].position, 5);
                that.animateCamera(that.windows[index].position, index);
              });
            },
          },
        });
        isArr.push([item.longitude, item.latitude]);
        windows.push({
          position: [item.longitude, item.latitude],
          isCustom: true,
          offset: [15, -25],
          showShadow: false,
          visible: false, // 初始是否显示
          address: item.address,
          car: item.truckId,
          VehicleId: item.VehicleId,
        });
      });
      // if (this.lineArr.length > 0) {
      //   this.lineArr = this.lineArr.concat(isArr);
      //   this.markers = this.markers.concat(markers);
      //   this.windows = this.windows.concat(windows);
      // } else {
      this.lineArr = isArr;
      this.markers = markers;
      this.windows = windows;
      console.log(this.markers, "this.markers");

      // 创建一个地图标点聚合对象
      // new AMap.MarkerClusterer(that.$refs.amap.$amap, that.markers, {
      //   gridSize: 80, // 聚合的像素大小
      //   maxZoom: 1, // 最大聚合级别
      // });
      // }

      this.timerDateCar = setInterval(() => {
        // this.value = new Date();
        // this.GetPositionCenter();
      }, 60000);
    },
  },
};
</script>
<style scoped lang="less">
@import "./assets/table.less";

.scrollbar {
  /deep/ .el-scrollbar__wrap {
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
  }
}

.dv-full-screen-container {
  margin: 0;
  padding: 0;
}

.bg-page {
  position: relative;
  z-index: 2002;
  background-image: url(../data-board/imges/bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.map-box {
  width: 100%;
  height: 100%;
  position: relative;
}

.all-amap {
  top: 0px;
  position: absolute;
  width: 100%;
  bottom: 0;
  z-index: 1;
}

/deep/ .amap-info-content {
  border-radius: 17px;
  background: #c6950cb2;
  color: #fff700;
  font-size: 12px;
  padding: 10px !important;
  overflow: hidden !important;
  box-shadow: 9px 9px 15px #000000c9, -9px -9px 15px #dbc938;
}

/deep/ .bottom-center .amap-info-sharp {
  bottom: 0;
  left: 50%;
  margin-left: -8px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #3385ff;
}

/deep/ .amap-info-close {
  display: none;
}

.title-switch {
  pointer-events: auto;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 0 5%;
  text-align: center;
  position: absolute;
  z-index: 1000;
  height: fit-content;
  top: 0;

  a {
    display: inline-block;
    font-size: 18px;
    color: #98b3e1;
    margin-right: 3%;
  }

  div:nth-child(1) {
    line-height: 80px;
    font-size: 20px;
    color: #fff;
  }

  .loginOut {
    text-align: center;
    color: #fff;
    cursor: pointer;
    line-height: 80px;
    font-size: 20px;
  }

  .enterprise-name {
    cursor: pointer;
    padding-right: 9%;
    font-size: 2rem;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #ffffff;
    line-height: 50px;
    background-image: linear-gradient(to right,
        rgb(134, 239, 172),
        rgb(59, 130, 246),
        rgb(147, 51, 234));
    /*设置线性渐变*/
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 10px 7px 5px #f3fdff3b;
    background-clip: text;
    pointer-events: all;
  }
}

.title-switch:hover {
  .enterprise-name {
    // background-image: linear-gradient(
    //   to right,
    //   rgb(134, 239, 172),
    //   rgb(103, 109, 120),
    //   rgb(147, 51, 234)
    // );
    // background: -webkit-linear-gradient(
    //     right,
    //     rgb(134, 239, 172),
    //     rgb(59, 130, 246),
    //     rgb(147, 51, 234)
    //   )
    //   0 0 no-repeat;
    /*设置线性渐变*/
  }
}

.select-box-left,
.select-box-right,
.select-box-center {
  pointer-events: auto;
  opacity: 1;
  position: fixed;
  padding-bottom: 1.096296296296296%;
  opacity: 0.8;
  width: calc(100% - 75%);
  height: calc(100% - 80px);
  z-index: 1000;
  border-radius: 6px;
  color: #000;
  font-size: 16px;
  box-sizing: border-box;

  .dv-border-box-12,
  .dv-border-box-1 {
    transition: all 0.3s;
    background-color: #282828d6;
    border-radius: 20px;
  }

  .dv-border-box-12:hover,
  .dv-border-box-1:hover {
    transform: scale(0.98);
    border-radius: 20px;
  }

  .top-box:hover {
    box-shadow: 0px 0px 30px 1px#af40ff;
    background-image: linear-gradient(163deg, #af40ff, #5b42f3 50%, #00ddeb);

    .title {
      background-image: linear-gradient(to right, #cba7f2);
    }
  }

  .top-box {
    margin: 3% 0;
    border-radius: 20px;
    transition: all 0.3s;

    .title {
      font-size: 1.5rem;
      font-family: YouSheBiaoTiHei;
      font-weight: 600;
      color: #14baff;
      background-image: linear-gradient(to right,
          rgb(134, 239, 172),
          rgb(59, 130, 246),
          rgb(147, 51, 234));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-top: 10px;
      margin-bottom: 2%;
      text-shadow: 7px 2px 2px #f3fdff3b;
      letter-spacing: 10px;
      padding: 0 4%;
    }

    height: calc(100% - 67%);
  }

  .round-box {
    display: inline-block;
    width: 11px;
    height: 11px;
    border: 3px solid #7cfaff;
    background: linear-gradient(90deg,
        rgba(3, 0, 0, 0.56),
        rgba(255, 255, 255, 0.56));
    border-radius: 50%;
  }

  // .glide-line {
  //   width: 100%;
  //   height: 1px;
  //   // background: #27FFFC;
  //   background: linear-gradient(to right, #fff0, #0cffff, #1a1a1a00);
  //   opacity: 0.7;
  // }

  .personnel-box {
    box-sizing: border-box;
    height: calc(100% - 91%);
    display: flex;
    text-align: center;
    font-size: 28px;

    .num-box {
      // font-size: 45px;
      font-weight: bold;
    }

    div {
      cursor: pointer;
    }

    em {
      font-style: normal;
      font-size: 16px;
      color: #e9f0f3 !important;
    }

    p {
      color: #a6cbdd;
      font-size: 16px;
      padding-left: 10px;
    }
  }

  .safe-box {
    height: calc(100% - 88%) !important;
    justify-content: space-between;
    line-height: 30px;

    .num-box {
      font-size: 1.8rem;
    }

    p {
      font-size: 1.3rem;
    }
  }

  .zy-box {
    height: 10%;
    padding: 1% auto;
    justify-content: flex-start !important;
  }

  .car-box,
  .zy-box {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    justify-items: center;
    text-align: center;

    .num-box {
      font-size: 1.2rem;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #a6cbdd;
      word-break: keep-all;
    }

    img {
      height: 100%;
    }

    div {
      cursor: pointer;
    }

    p {
      margin-top: 5px;
      font-family: Bahnschrift;
      font-weight: 400;
      color: #37f29a;
      font-size: 2.2rem;

      em {
        font-size: 16px;
        font-style: normal;
      }
    }
  }
}

.car-box {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 20px;
  padding-left: 0 !important;
}

.select-box-left {
  top: 80px;
  padding-left: 1.4%;
  background-image: linear-gradient(to right,
      #000f15,
      #021820,
      #02212d,
      #1a1a1a00);
}

.select-box-right {
  top: 80px;
  right: 0%;
  padding-left: 0.796296296296296%;
  padding-right: 1.096296296296296%;
  background-image: linear-gradient(to left,
      #000f15,
      #021820,
      #02212d,
      #1a1a1a00);
}

.select-box-center {
  height: calc(100% - 73%);
  width: calc(100% - 50%);
  left: 25.05%;
  bottom: 1% !important;
  padding-bottom: 2%;
  padding: 0 10px;
  border-bottom: 1px solid #27fffc;

  .danger-center-box {
    height: 88%;
  }
}

/deep/.el-table__header {
  background: none !important;
}

/deep/.el-table__body {
  background: none !important;
}

/deep/.el-dialog__header {
  background: rgba(107, 122, 135, 0) !important;
  border-radius: 0 !important;
  border: none !important;

}


/deep/.el-dialog__title {
  color: #fff !important;
}

/deep/.el-dialog__close {
  color: #fff !important;
}

/deep/.el-dialog__body {
  padding: 0 !important;
  background: rgba(13, 64, 105, 0) !important;
}

/deep/.el-dialog {
  background: none !important;


  .el-dialog__headerbtn {
    font-size: 25px !important;
    padding: 0.2% 0.3%;
    border-radius: 6px;
    border: 2px solid #0fffff;
  }

  .el-dialog__headerbtn:hover {
    box-shadow: 0px 0px 30px 1px#0fffff;
    scale: 1.2;
  }
}

.dialog-box {
  padding: 10px;
  background: rgba(13, 64, 105, 0) !important;
  height: 100%;
}

/deep/.dialog-pdf-box {
  /deep/.dialog-box {
    background: rgba(13, 64, 105, 0) !important;
  }

}



// 高度
.facility-height {
  height: calc(100% - 84%) !important;
}

.car-height {
  height: calc(100% - 60%) !important;
}

.zy-box {
  margin-top: 3%;
}

.risk-height {
  height: calc(100% - 71.15%) !important;
}

.danger-box {
  height: calc(100% - 56.3%) !important;
}

.jy-box {
  height: calc(100% - 70.3%) !important;
}

.type-box {
  display: flex;
  justify-content: space-between;
  padding-right: 20px;

  .switch-box {
    margin-top: 1.1%;

    span {
      font-size: 16px;
      display: inline-block;
      padding: 5px 10px;
      background: #fff;
      border-radius: 3px;
      cursor: pointer;
      margin-left: 5px;
    }
  }
}

.box {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to top,
      #000f15,
      #000f1591,
      #000f1554,
      #000f1554,
      #000f15);
}

.center-box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 5%;
  margin: none !important;

  .box-content {
    width: 26%;
    padding: 1% 0;
    cursor: pointer;

    .title-box {
      margin-left: 10%;
      font-size: 1.5rem;
      color: #fff;
      margin-bottom: 5px;
    }

    .num {
      text-align: center;
      font-size: 2.2rem;
      font-weight: bold;
    }

    .status {
      color: #a6cbdd;
    }
  }
}

// 风险告知卡
.risk-table {
  width: 100%;
  border: 1px solid #666;
  border-collapse: collapse;
  margin-bottom: 20px;
  color: #fff;
  background: rgba(13, 64, 105, 0.5) !important;

  tr {
    width: 100%;

    td {
      width: 25%;
      border: 1px solid #666;
      text-align: center;
      padding: 10px;
    }
  }
}

//仓库
.el-carousel {
  line-height: 0.5rem;
}

/deep/ .el-carousel__item {
  position: absolute;
  top: -5% !important;

  .carousel-item {
    position: absolute;
    transform: translate(50%, 20%);
  }

  img {
    width: 43%;
  }

  h3 {
    color: #fff285;
    margin-top: 0.5rem;
    font-size: 1.1rem;
    opacity: 0.75;
  }
}

/deep/ .el-carousel__item .el-carousel__mask {
  background-color: #99a9bf00;
}

/deep/ .el-carousel__item i {
  font-size: 2rem;
  color: #fff285;
  padding-top: 0.5rem;
}

.el-carousel__arrow i {
  color: #f6f4f4;
  font-size: 26px;
}

/deep/ .dv-scroll-board {
  .header {
    font-weight: bolder;
    border-radius: 5px;
  }

  .row-item {
    .ceil:hover {
      // background: rgba(4, 173, 255, 0.92) !important;
      color: #cba7f2;
      font-size: 20px;
    }
  }
}

.banner-text {
  overflow-y: hidden;
  white-space: nowrap;
  height: 100px; // 设置一个固定的滚动区域高度
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease -100%;
}

/deep/.dv-scroll-board .rows .ceil {
  padding: 0 !important;
}

@media (min-width: 768px) and (max-width: 1400px) {


  .select-box-left,
  .select-box-right,
  .select-box-center {
    .top-box {
      margin: 2% 0;
      font-size: 1rem;

      .title {
        font-size: 1.1rem;
        padding: 0 4%;
      }
    }




    .personnel-box {
      box-sizing: border-box;
      height: calc(100% - 88%);
    }

    .safe-box {
      height: calc(100% - 88%) !important;

      .num-box {
        font-size: 1.7rem;
      }

      p {
        font-size: 0.9rem !important;
      }
    }

    .zy-box {
      height: 11%;
    }

    .car-box,
    .zy-box {
      .num-box {
        font-size: 0.9rem;
      }

      p {
        font-size: 1.8rem;
      }

    }


  }

  .center-box {
    .box-content {
      .title-box {
        font-size: 1rem !important;
      }

      .num {
        font-size: 1.5rem !important;
      }

      .status {
        font-size: 0.8rem !important;
      }
    }
  }

  .title-switch {
    .enterprise-name {
      font-size: 1.8rem;
    }
  }



  .el-carousel__item {
    img {
      width: 23%;
    }

    h3 {
      font-size: 0.8rem;
    }
  }

  .danmu-item {
    font-size: 0.9rem !important;
  }

  .title-switch .enterprise-name {
    font-size: 1.5rem;
  }

  /deep/.el-dialog {
    transform: scale(0.8);
  }

  .scrollbar {
    /deep/ .el-scrollbar__wrap {
      height: 100%;
    }
  }

}
</style>

<style>
.amap-marker-label {
  border-radius: 2px;
  /* border: 1px solid #e6e6e6db;
  background-color: #4c4cf3;
  color: white; */
  border: 2px solid #535151db;
  background-color: #fbd82f;
  color: #212121;
  padding: 2px;
}

/* .play_drop {
  -webkit-animation: bounce 3s ease-in 0s 1;
  animation: bounce 3s ease-in 0s 1;
  will-change: transform;
} */
</style>
