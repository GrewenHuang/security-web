<template>
    <div class="full-screen-edit" :style="customStyles" v-if="dislogShow" v-loading="loading">
        <el-scrollbar class="scrollbar" ref="scrollbar">
            <div id="euipment-detail">
                <div class="card">
                    <div class="card-header f-b-c">
                        <div class="title">基本信息</div>
                        <div>
                            <div class="collapse-btn" :class="{open: collapses.some(index => index == 'basic')}" @click="collapseChange('basic')">{{ collapses.some(index => index == 'basic') ? '收起' : '展开'}}</div>
                        </div>
                    </div>
                    <div class="card-body" v-show="collapses.some(index => index == 'basic')">
                        <div class="form-3-col form-item">
                            <div class="f--c">
                                <div class="label">设备名称：</div>
                                <div>{{ info.EquipmentTypeName + '-' + info.EquipmentName }}</div>
                            </div>
                            <div class="f--c">
                                <div class="label">规格型号：</div>
                                <div>{{ info.Specification }}</div>
                            </div>
                        </div>
                        <div class="form-3-col form-item">
                            <div class="f--c">
                                <div class="label">主要性能参数：</div>
                                <div>{{ info.MainParameter }}</div>
                            </div>
                            <div class="f--c">
                                <div class="label">出产厂家：</div>
                                <div>{{ info.Manufacturer }}</div>
                            </div>
                        </div>
                        <div class="form-3-col form-item">
                            <div class="f--c">
                                <div class="label">出厂日期：</div>
                                <div>{{ info.FactoryDateDesc }}</div>
                            </div>
                            <div class="f--c">
                                <div class="label">出厂编码：</div>
                                <div>{{ info.FactoryNo }}</div>
                            </div>
                        </div>
                        <div class="form-3-col form-item">
                            <div class="f--c">
                                <div class="label">自编码：</div>
                                <div>{{ info.OwnCode }}</div>
                            </div>
                            <div class="f--c">
                                <div class="label">来源：</div>
                                <div>{{ info.SupplySourceDesc }}</div>
                            </div>
                        </div>
                        <div class="form-3-col form-item">
							<div class="f--c">
							    <div class="label">仓库：</div>
							    <div>{{ info.WarehouseName }}</div>
							</div>
                            <div class="f--c">
                                <div class="label">使用位置：</div>
                                <div>{{ info.UseLocation }}</div>
                            </div>
                        </div>
                        <div class="form-3-col form-item">
							<div class="f--c">
							    <div class="label">进场日期：</div>
							    <div>{{ info.EntryDateDesc }}</div>
							</div>
                            <div class="f--c">
                                <div class="label">撤场日期：</div>
                                <div>{{ info.DepartureDateDesc }}</div>
                            </div>
                            <!-- <div class="f--c">
                                <div class="label">使用部门：</div>
                                <div>{{ info.DepartmentName }}</div>
                            </div> -->
                        </div>
                        <div class="form-3-col form-item">
                            <div class="f--c">
                                <div class="label">负责人：</div>
                                <div>{{ info.ResponsibleUserName }}</div>
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
                                    style="width: 90px;height: 90px;"
                                    v-for="(item, index) in info.EquipmentPhotos"
                                    :key="index"
                                    :src="item.url"
                                    :preview-src-list="info.EquipmentPhotos.map(item=>item.url)"
                                ></el-image>
                            </div>
                        </div>
                        <div class="form-item">
                            <div class="label">设备附件：</div>
                            <file-list v-model="info.EquipmentFiles" style="margin-top: 10px;" disabled></file-list>
                        </div>
                    </div>
                </div>
                <div class="card" v-for="(o, index) in certList" :key="index">
                    <div class="card-header f-b-c">
                        <div class="title">{{o.label}}信息</div>
                        <div>
                            <div class="collapse-btn" :class="{open: collapses.includes(o.label)}" @click="collapseChange(o.label)">{{ collapses.includes(o.label) ? '收起' : '展开'}}</div>
                        </div>
                    </div>
                    <div class="card-body" v-show="collapses.includes(o.label)">
                        <el-collapse
                            v-model="childCollapseActive"
                        >
                            <el-collapse-item
                                v-for="(item) in o.list"
                                :key="item.CertificateId"
                                :name="item.CertificateId"
                            >
                                <div slot="title" class="f-b-c f1">
                                    <span>{{ item.CertificateName }}</span>
                                    <div class="f--c operation">
                                        <div class="switch" :class="{open: childCollapseActive.includes(item.CertificateId)}">
                                            {{ childCollapseActive.includes(item.CertificateId) ? '收起' : '展开' }}
                                        </div>
                                    </div>
                                </div>
                                    <template v-for="(filed, index) in item.CertificateFileds">
                                        
                                        <div class="form-3-col form-item" :key="index" v-if="index % 2 == 0">
                                            <div class="f--c">
                                                <div class="label">{{ filed.FiledName }}：</div>
                                                <div>{{ filed.FiledValue }}</div>
                                            </div>
                                            <div class="f--c" v-if="item.CertificateFileds[index + 1]">
                                                <div class="label">{{ item.CertificateFileds[index + 1].FiledName }}：</div>
                                                <div>{{ item.CertificateFileds[index + 1].FiledValue | valueFormat}}</div>
                                            </div>
                                        </div>
                                    </template>
                                    <div class="f--c form-item">
                                        <div class="label">照片：</div>
                                        <div>
                                            <el-image
                                                style="width: 90px;height: 90px;"
                                                v-for="(img, imgIndex) in item.CertificateManagePhotos"
                                                :key="imgIndex"
                                                :src="img.url"
                                                :preview-src-list="item.CertificateManagePhotos.map(img=>img.url)"
                                            ></el-image>
                                        </div>
                                    </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header f-b-c">
                        <div class="title">保养计划</div>
                        <div>
                            <div class="collapse-btn" :class="{open: collapses.some(index => index == 1)}" @click="collapseChange(1)">{{ collapses.some(index => index == 1) ? '收起' : '展开'}}</div>
                        </div>
                    </div>
                    <div class="card-body" v-show="collapses.some(index => index == 1)">
                        <el-table
                            border
                            :data="info.MaintenancePlans"
                            :header-cell-style="$tableStyle"
                            :span-method="__handlerMergeSpan"
                        >
                            <el-table-column
                                label="保养名称"
                                min-width="180"
                                align="center"
                                prop="Name"
                            ></el-table-column>
                            <el-table-column
                                label="保养部位"
                                min-width="180"
                                align="center"
                                prop="Position"
                            ></el-table-column>
                            <el-table-column
                                label="保养项目"
                                min-width="200"
                                align="center"
                                prop="Item"
                            ></el-table-column>
                            <el-table-column
                                label="保养内容"
                                min-width="200"
                                align="center"
                                prop="Content"
                            ></el-table-column>
                            <el-table-column
                                label="保养项目周期"
                                min-width="120"
                                align="center"
                                prop="PeriodDesc"
                            ></el-table-column>
                            <el-table-column
                                label="下次保养日期"
                                min-width="120"
                                align="center"
                                prop="NextMaintenanceDateDesc"
                            ></el-table-column>
                            <el-table-column
                                label="保养周期（天）"
                                min-width="120"
                                align="center"
                                prop="MaintainPeriod"
                            ></el-table-column>
                            <el-table-column
                                label="提前预警天数"
                                min-width="120"
                                align="center"
                                prop="ReminderDay"
                            ></el-table-column>
                            <el-table-column
                                label="保养负责人"
                                min-width="120"
                                align="center"
                                prop="UserName"
                            ></el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header f-b-c">
                        <div class="title">点检计划</div>
                        <div>
                            <div class="collapse-btn" :class="{open: collapses.some(index => index == 2)}" @click="collapseChange(2)">{{ collapses.some(index => index == 2) ? '收起' : '展开'}}</div>
                        </div>
                    </div>
                    <div class="card-body" v-show="collapses.some(index => index == 2)">
                        <el-table
                            border
                            :data="info.SpotCheckPlans"
                            :header-cell-style="$tableStyle"
                            :span-method="__handlerMergeSpan"
                        >
                            <el-table-column
                                label="点检部位"
                                min-width="240"
                                align="center"
                                prop="Position"
                            >
                                <template slot-scope="{ row }">{{ row.Position }}</template>
                            </el-table-column>
                            <el-table-column
                                label="点检标准"
                                min-width="350"
                                align="center"
                                prop="Standard"
                            ></el-table-column>
                            <el-table-column
                                label="点检周期"
                                min-width="180"
                                align="center"
                                prop="PeriodDesc"
                            ></el-table-column>
                            <el-table-column
                                label="点检人"
                                min-width="180"
                                align="center"
                                prop="UserName"
                            ></el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header f-b-c">
                        <div class="title">保养记录</div>
                        <div>
                            <div class="collapse-btn" :class="{open: collapses.some(index => index == 3)}" @click="collapseChange(3)">{{ collapses.some(index => index == 3) ? '收起' : '展开'}}</div>
                        </div>
                    </div>
                    <div class="card-body" v-show="collapses.some(index => index == 3)">
                        <el-table
                            :data="pages1.list"
                            :header-cell-style="$tableStyle"
                        >
                            <el-table-column
                                label="设备类型"
                                align="center"
                                width="140"
                                prop="EquipmentTypeName"
                            >
                            </el-table-column>
                            <el-table-column
                                label="设备名称"
                                align="center"
                                min-width="200"
                                show-overflow-tooltip
                                prop="EquipmentName"
                            >
                            </el-table-column>
                            <el-table-column
                                label="自编号"
                                align="center"
                                width="140"
                                prop="OwnCode"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="位置"
                                align="center"
                                width="100"
                                prop="UseLocation"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <!-- <el-table-column
                                label="使用部门"
                                align="center"
                                width="140"
                                prop="DepartmentName"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column> -->
                            <el-table-column
                                label="负责人"
                                align="center"
                                width="130"
                                prop="ResponsibleUserName"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="保养计划名称"
                                align="center"
                                min-width="200"
                                show-overflow-tooltip
                                prop="PlanName"
                            >
                            </el-table-column>
                            <el-table-column
                                label="保养计划日期"
                                align="center"
                                width="120"
                                prop="PlanDateDesc"
                            >
                            </el-table-column>
                            <el-table-column
                                label="保养日期"
                                align="center"
                                width="120"
                                prop="RecordDateDesc"
                            >
                            </el-table-column>
                            <el-table-column
                                label="保养结果"
                                align="center"
                                width="100"
                                prop="Result"
                                :formatter="formatterResult"
                            >
                            </el-table-column>
                            <el-table-column
                                label="保养人"
                                align="center"
                                width="100"
                                prop="UserName"
                            >
                            </el-table-column>
                            <el-table-column
                                label="保养状态"
                                align="center"
                                width="110"
                                fixed="right"
                            >
                                <template slot-scope="{ row }">
                                    <whether :yes="row.Status == 1" :class="{warning: row.SupplyStatus == 3, gray: row.SupplyStatus == 4}" :text="maintenanceStatusObj[row.Status]"/>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                align="center"
                                width="80"
                                fixed="right"
                            >
                                <template slot-scope="{ row }">
                                    <div class="table-operation">
                                        <!-- 查看需要根据保养状态显示，已保养才有查看 -->
                                        <el-button type="text" @click="previewInfo(row, 'maintenance')" v-if="/1|3/.test(row.Status)">查看</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="f-b-c">
                            <div></div>
                            <el-pagination layout="total, prev, pager, next"
                                background
                                @current-change="handleCurrentChange($event, 1)"
                                :page-size="pages1.rows"
                                :total="pages1.total"
                                :current-page="pages1.page"
                                class="customPagination">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header f-b-c">
                        <div class="title">点检记录</div>
                        <div>
                            <div class="collapse-btn" :class="{open: collapses.some(index => index == 4)}" @click="collapseChange(4)">{{ collapses.some(index => index == 4) ? '收起' : '展开'}}</div>
                        </div>
                    </div>
                    <div class="card-body" v-show="collapses.some(index => index == 4)">
                        <el-table
                            :data="pages2.list"
                            :header-cell-style="$tableStyle"
                        >
                            <el-table-column
                                label="序号"
                                type="index"
                                align="center"
                                width="50"
                            >
                            </el-table-column>
                            <el-table-column
                                label="设备类型"
                                align="center"
                                width="140"
                                prop="EquipmentTypeName"
                            >
                            </el-table-column>
                            <el-table-column
                                label="设备名称"
                                align="center"
                                min-width="200"
                                show-overflow-tooltip
                                prop="EquipmentName"
                            >
                            </el-table-column>
                            <el-table-column
                                label="自编号"
                                align="center"
                                width="140"
                                prop="OwnCode"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="位置"
                                align="center"
                                width="100"
                                prop="UseLocation"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <!-- <el-table-column
                                label="使用部门"
                                align="center"
                                width="140"
                                prop="DepartmentName"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column> -->
                            <el-table-column
                                label="负责人"
                                align="center"
                                width="130"
                                prop="ResponsibleUserName"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="点检周期"
                                align="center"
                                min-width="200"
                                show-overflow-tooltip
                                prop="PeriodDesc"
                            >
                            </el-table-column>
                               <el-table-column
                                label="点检有效期"
                                align="center"
                                width="180"
                       
                            >
                            <!--          prop="RecordDateDesc"
                                :formatter="formatterDefaultValue" -->
                            <template slot-scope="scope">
                                 {{getData(scope.row)}}
                            </template>
                            </el-table-column>
                            <el-table-column
                                label="点检日期"
                                align="center"
                                width="120"
                                prop="RecordDateDesc"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="点检结果"
                                align="center"
                                width="100"
                                prop="Result"
                                :formatter="formatterResult1"
                            >
                            </el-table-column>
                            <el-table-column
                                label="点检人"
                                align="center"
                                width="100"
                                prop="UserName"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="点检状态"
                                align="center"
                                width="110"
                                fixed="right"
                            >
                                <template slot-scope="{ row }">
                                    <whether :yes="row.Status == 1" :class="{warning: row.Status == 3, gray: row.Status == 4}" :text="spotCheckStatusObj[row.Status]"/>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                align="center"
                                width="80"
                                fixed="right"
                            >
                                <template slot-scope="{ row }">
                                    <div class="table-operation">
                                        <!-- 查看需要根据保养状态显示，已保养才有查看 -->
                                        <el-button type="text" @click="previewInfo(row, 'spotCheck')" v-if="row.Status == 1">查看</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="f-b-c">
                            <div></div>
                            <el-pagination layout="total, prev, pager, next"
                                background
                                @current-change="handleCurrentChange($event, 2)"
                                :page-size="pages2.rows"
                                :total="pages2.total"
                                :current-page="pages2.page"
                                class="customPagination">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header f-b-c">
                        <div class="title">维修记录</div>
                        <div>
                            <div class="collapse-btn" :class="{open: collapses.some(index => index == 5)}" @click="collapseChange(5)">{{ collapses.some(index => index == 5) ? '收起' : '展开'}}</div>
                        </div>
                    </div>
                    <div class="card-body" v-show="collapses.some(index => index == 5)">
                        <el-table
                            :data="pages3.list"
                            :header-cell-style="$tableStyle"
                        >
                            <el-table-column
                                label="序号"
                                type="index"
                                align="center"
                                width="50"
                            >
                            </el-table-column>
                            <el-table-column
                                label="自编号"
                                align="center"
                                width="140"
                                prop="OwnCode"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="设备类型"
                                align="center"
                                width="140"
                                prop="EquipmentTypeName"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="设备名称"
                                align="center"
                                min-width="200"
                                show-overflow-tooltip
                                prop="EquipmentName"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="设备型号"
                                align="center"
                                width="140"
                                prop="OwnCode"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="异常情况描述"
                                align="center"
                                width="160"
                                prop="Describe"
                            >
                            </el-table-column>
                            <el-table-column
                                label="维修内容及处理结果"
                                align="center"
                                width="180"
                                prop="Remark"
                            >
                            </el-table-column>
                            <el-table-column
                                label="维修完成日期"
                                align="center"
                                min-width="120"
                                show-overflow-tooltip
                                prop="RepairDateDesc"
                            >
                            </el-table-column>
                            <el-table-column
                                label="维修负责人"
                                align="center"
                                width="130"
                                prop="UserName"
                            >
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                align="center"
                                width="80"
                                fixed="right"
                            >
                                <template slot-scope="{ row }">
                                    <div class="table-operation">
                                        <!-- 查看需要根据保养状态显示，已保养才有查看 -->
                                        <el-button type="text" @click="previewInfo(row, 'repair')">查看</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="f-b-c">
                            <div></div>
                            <el-pagination layout="total, prev, pager, next"
                                background
                                @current-change="handleCurrentChange($event, 3)"
                                :page-size="pages3.rows"
                                :total="pages3.total"
                                :current-page="pages3.page"
                                class="customPagination">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <div class="card" v-if="info.EquipmentTypeName == '特种设备'">
                    <div class="card-header f-b-c">
                        <div class="title">检验记录</div>
                        <div>
                            <div class="collapse-btn" :class="{open: collapses.some(index => index == 6)}" @click="collapseChange(6)">{{ collapses.some(index => index == 2) ? '收起' : '展开'}}</div>
                        </div>
                    </div>
                    <div class="card-body" v-show="collapses.some(index => index == 6)">
                        <el-table
                            :data="pages4.list"
                            :header-cell-style="$tableStyle"
                        >
                            <el-table-column
                                label="序号"
                                type="index"
                                align="center"
                                width="50"
                            >
                            </el-table-column>
                            <el-table-column
                                label="设备名称"
                                align="center"
                                min-width="200"
                                show-overflow-tooltip
                                prop="EquipmentName"
                            >
                            </el-table-column>
                            <el-table-column
                                label="规格型号"
                                align="center"
                                width="140"
                                prop="Specification"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="出厂编号"
                                align="center"
                                width="140"
                                prop="FactoryNo"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="自编号"
                                align="center"
                                width="140"
                                prop="OwnCode"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="使用位置"
                                align="center"
                                width="100"
                                prop="UseLocation"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <!-- <el-table-column
                                label="使用部门"
                                align="center"
                                width="140"
                                prop="DepartmentName"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column> -->
                            <el-table-column
                                label="负责人"
                                align="center"
                                width="130"
                                prop="ResponsibleUserName"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="最近检验日期"
                                align="center"
                                width="120"
                                prop="InspectDateDesc"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="最近检验结论"
                                align="center"
                                width="150"
                            >
                                <template slot-scope="{ row }">
                                    <whether :yes="row.Result == 1" :text="row.Result == 1 ? '合格' : '不合格'"/>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="下次检验日期"
                                align="center"
                                width="120"
                                prop="NextInspectDateDesc"
                                :formatter="formatterDefaultValue"
                            >
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                align="center"
                                width="80"
                                fixed="right"
                            >
                                <template slot-scope="{ row }">
                                    <div class="table-operation">
                                        <!-- 查看需要根据保养状态显示，已保养才有查看 -->
                                        <el-button type="text" @click="previewInfo(row, 'inspection')">查看</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="f-b-c">
                            <div></div>
                            <el-pagination layout="total, prev, pager, next"
                                background
                                @current-change="handleCurrentChange($event, 4)"
                                :page-size="pages4.rows"
                                :total="pages4.total"
                                :current-page="pages4.page"
                                class="customPagination">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </el-scrollbar>
        <div class="edit-footer">
            <el-button cancel @click="close">关闭</el-button>
            <el-button type="primary" :loading="submitLoading" @click="exportPDF('euipment-detail')">导出PDF</el-button>
        </div>
        <maintenanceRecordInfo ref="maintenance" />
        <spotCheckRecordInfo ref="spotCheck" />
        <repairRecordInfo ref="repair" />
        <inspectionRecordInfo ref="inspection" />
    </div>
</template>

<script>
import request_mixin from '@/mixins/request-mixin';
import fileList from '@/components/common/file-list.vue';
import mergeSpan from '@/mixins/merge-span-mixin';
import { Pdf } from '@/plugins/htmlToPdf.js';
import maintenanceRecordInfo from './maintenance-record/info';
import spotCheckRecordInfo from './spot-check-record/info';
import repairRecordInfo from './repair-record/info';
import inspectionRecordInfo from './inspection-record/info';
const defaultInfo = {
}
function _extends(obj){
   return JSON.parse(JSON.stringify(obj));
}
const certKeysName = {Certificates: '证件', Insures: '保险', Others: '其他'};
const defaultCollapses = ['basic', 1, 2, 3, 4, 5, 6, '证件', '保险', '其他'];
export default {
    components: {
        fileList,
        maintenanceRecordInfo,
        spotCheckRecordInfo,
        repairRecordInfo,
        inspectionRecordInfo,
    },
    mixins: [request_mixin, mergeSpan],
    props: {
        customStyles: {
            type: [Object, Array, String],
            default() {
                return []
            }
        }
    },
    data() {
        return {
            id: '',
            loading: false,
            dislogShow: false,
            submitLoading: false,
            info: _extends(defaultInfo),
            collapses: _extends(defaultCollapses),
            childCollapseActive: [],
            serviceInterval: [],
            inspectionCycle: [],
            list1: [],
            list2: [],
            list3: [],
            maintenanceStatusObj: {
                0: '未完成',
                1: '已完成',
                2: '逾期未完成',
                3: '逾期已完成',
            },
            spotCheckStatusObj: {
                0: '未点检',
                1: '已点检',
                2: '逾期未完成',
                3: '逾期已完成',
            },
            pages1: {
                list: [],
                rows: 10,
                page: 1,
                total: 0
            },
            pages2: {
                list: [],
                rows: 10,
                page: 1,
                total: 0
            },
            pages3: {
                list: [],
                rows: 10,
                page: 1,
                total: 0
            },
            pages4: {
                list: [],
                rows: 10,
                page: 1,
                total: 0
            },
        }
    },
    computed: {
        isEdit() {
            return !!this.id
        },
        title() {
            return this.isEdit ? '编辑' : '新增'
        },
        certList() {
            let list = Object.keys(certKeysName).map(key => {
                return {
                    label: certKeysName[key],
                    list: this.info[key] || []
                }
            }).filter(item => !!item.list.length);
            return list;
        },
    },
    filters: {
        valueFormat(str) {
			if (!str) return '';
			let list = str.split(',');
            if (list.length > 2) {
                return list[2] == 1 ? '长期' : list[0] ? list[0] + ' 至 ' + list[1] : '';
            } else {
                return str;
            }
        }
    },
    methods: {
        getData(row){
            let strData = this.getDataString(row.StartDate)
            let endData = this.getDataString(row.EndDate)
           let formStr = `${strData} 至 ${endData}`
           return formStr
        },
        getDataString(dateStr){
        let newDateStr = dateStr.slice(0, 10); 
        // 将字符串拆分为数组
        let parts = newDateStr.split('-'); 
        // 创建Date对象（这里创建Date对象主要是为了后续格式化展示，实际可不创建）
        let date = new Date(parts[0], parts[1] - 1, parts[2]); 
        // 格式化成年月日格式展示
        let formattedDate = `${parts[0]}-${parts[1]}-${parts[2]}`; 
        return formattedDate
        },
        async show(item) {
            this.dislogShow = true;
            await this.getServiceInterval();
            await this.getInspectionCycle();
            if (item) {
                this.loading = true;
                this.id = item.EquipmentManageId;
                try {
                    let res = await this.Get(`/GetEquipmentManage?equipmentManageId=${item.EquipmentManageId}`)
                    if (res.status == 2000) {
                        this.__generateSpanData({levelKeys: {1: 'Name', 2: 'Position'},rowspanByColIndexs: {1: '0|5|6|7|8|9', 2: '1'}, levelLength: 3, list: res.data.MaintenancePlans});
                        this.__generateSpanData({levelKeys: {1: 'Position', 2: 'Standard'},rowspanByColIndexs: {1: '0|3', 2: '1'}, levelLength: 3, list: res.data.SpotCheckPlans});
                        this.info = Object.assign(_extends(defaultInfo), res.data);
                        [...(this.info.Certificates || []), ...(this.info.Insures || []), ...(this.info.Others || [])].forEach(item => {
                            this.childCollapseActive.push(item.CertificateId);
                        })
                        this.setCerts(res.data.CertificateList || [], this.info);
                    } else {
                        this.$message.error('获取数据失败');
                        this.close();
                    }
                } catch (error) {
                   console.error(error);
                }
                let num = 4;
                if (this.info.EquipmentTypeName == '特种设备') {
                    num++;
                }
                for(let i = 1; i < num; i++) {
                    this.handleCurrentChange(1, i);
                }

                this.loading = false;
            }
            this.$nextTick(() => {
                this.$refs.scrollbar.wrap.scrollTop = 0;
            })
        },
        close() {
            this.dislogShow = false;
            this.submitLoading = false;
            this.id = '';
            this.info = _extends(defaultInfo);
            this.collapses = _extends(defaultCollapses);
            this.childCollapseActive = [];
            this.$emit('close');
        },
        collapseChange(n) {
            let index = this.collapses.indexOf(n);
            if (index == -1) {
                this.collapses.push(n)
            } else {
                this.collapses.splice(index, 1);
            }
        },
        async getServiceInterval() {
            let res = await this.Get('/GetMaintainPeriodCom');
            if (res.status == 2000) {
                this.serviceInterval = res.data;
            }
            return Promise.resolve();
        },
        async getInspectionCycle() {
            let res = await this.Get('/GetSpotCheckPeriodCom');
            if (res.status == 2000) {
                this.inspectionCycle = res.data;
            }
            return Promise.resolve();
        },
        //导出PDF
        exportPDF (id) {
            const loading = this.$loading({
                lock: true,
                text: '正在导出中，请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, .3)'
            });
            let collapses = this.collapses;
            this.collapses = ['basic', 1, 2, 3, 4, 5, 6];
            this.submitLoading = true;
            this.$nextTick(() => {
                Pdf.downPdf(id, this.info.EquipmentName).then(res => {
                    setTimeout(() => {
                        this.submitLoading = false;
                        this.collapses = collapses;
                        loading.close();
                    }, 1000);
                });
            })
        },
        previewInfo(row, key){
            this.$refs[key].show(row);
        },
        handleCurrentChange(val, num) {
            const urls = {
                1: '/GetMaintenanceRecordList',
                2: '/GetSpotCheckRecordList',
                3: '/GetRepairRecordList',
                4: '/GetInspectRecordList',
            }
            let pages = this['pages' + num];
            let url = urls[num];
            pages.page = val;
            this.getList(pages, url);
        },
        async getList(pages, url){
            let  params = {
                ...pages,
                equipmentManageId: this.id
            }
            let res = await this.Post(url, params);
            if (res.status == 2000) {
                pages.list = res.data.list;
                pages.total = res.data.count;
            }
        },
        formatterDefaultValue(row, column, cellValue, index) {
            return cellValue || '-'
        },
        formatterResult(row, column, cellValue, index) {
            let obj = ['未保养', '正常', '异常', '异常当场解决'];
            return obj[cellValue];
        },
        formatterResult1(row, column, cellValue, index) {
            let obj = ['未点检', '正常', '异常', '异常当场解决'];
            return obj[cellValue];
        },
        setCerts(list, info) {
            list.forEach(item => {
                this.childCollapseActive.push(item.CertificateId);
                Object.keys(certKeysName).forEach((key, index) => {
                    if (!info[key]) {
                        this.$set(info, key, []);
                    }
                    if (item.CertificateClassification == (index + 1)) {
                        let o = info[key].find(o => o.CertificateId == item.CertificateId);
                        if (!o) {
                            info[key].push(item);
                        }
                    }
                });
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.full-screen-edit{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    background: #F4F5F7;
    .el-form{
        height: 100%;
    }
    /deep/ .el-form-item{
        margin-bottom: 25px;
        .el-form-item__label{
            padding-bottom: 9px;
            line-height: 20px;
        }
    }
    .el-date-editor,
    .el-select{
        width: 100%;
    }
    .form-3-col{
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
    .split-line{
        &::before{
            content: '';
            display: block;
            margin: 0 -25px 25px;
            height: 10px;
            background: #f2f2f2;
        }
    }
    .card{
        border-radius: 10px;
        padding: 20px 25px;
        background: #fff;
        &:not(:last-child) {
            margin-bottom: 10px;
        }
        .card-header{
            border-radius: 4px;
            padding: 14px 15px;
            background: #F5F6FA;
            .collapse-btn{
                display: flex;
                align-items: center;
                cursor: pointer;
                user-select:  none;
                color: $--color-primary;
                &::before{
                    content: '';
                    border: 8px solid transparent;
                    border-top: 0;
                    border-right-width: 6px;
                    border-left-width: 6px;
                    border-bottom-color: $--color-primary;
                    border-radius: 2px;
                    margin-right: 7px;
                    transition: all .3s linear;
                }
                &.open{
                    &::before{
                        transform: rotateX(180deg);
                    }
                }
            }
        }
        .card-body{
            padding: 3px 0 10px;
        }
        .content{
            padding: 20px 0;
        }
        .title{
            display: flex;
            align-items: center;
            font-size: 16px;;
            font-weight: 600;
            &::before{
                content:'';
                border-radius: 2px;
                margin-right: 8px;
                width: 5px;
                height: 16px;
                background: $--color-primary;
            }
        }
        /deep/ .el-table--border{
            border-radius: 10px;
            .el-table__header-wrapper{
                border-radius: 10px 10px 0 0;
            }
        }
    }
    .scrollbar{
        height: calc(100% - 90px);
        /deep/ .el-scrollbar__wrap{
            height: 100%;
        }
    }
    .edit-footer{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        border-radius: 10px;
        margin-top: 10px;
        padding: 0 32px;
        height: 80px;
        background: #fff;
        .el-button{
            width: 110px;
        }
        [cancel]{
            border-color: #F5F6FA;
            background: #F5F6FA;
        }
    }
    .input-combination{
        display: flex;
        width: 100%;
        .el-input{
            flex: 1;
            width: calc(100% - 20px);
        }
        .input-operation{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 5px;
            padding: 2px 0 3px;
            .add,
            .remove{
                border-radius: 100%;
                width: 15px;
                height: 15px;
                cursor: pointer;
            }
            .add{
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                background: $--color-primary;
                &::before,
                &::after{
                    content: '';
                    position: absolute;
                    width: 60%;
                    height: 1px;
                    background: #fff;
                }
                &::after{
                    transform: rotate(90deg);
                }
            }
            .remove{
                display: flex;
                justify-content: center;
                align-items: center;
                background: #D5D5D5;
                &::before{
                    content: '';
                    width: 60%;
                    height: 1px;
                    background: #fff;
                }
            }
        }
    }
    
    /deep/ .el-collapse{
        margin-top: 28px;
        border: 0;
        .el-collapse-item{
            border: 1px solid #DCDFE6;
            border-radius: 6px;
            margin-bottom: 20px;
            overflow: hidden;
            &.is-active{
                .el-collapse-item__header{
                    border-bottom: 1px solid #DCDFE6;
                }
            }
            .el-input.is-disabled .el-input__inner,
            .el-textarea.is-disabled .el-textarea__inner{
                color: #84888f;
                background: #f7f8f9;
            }
            .el-collapse-item__header{
                border: 1px solid transparent;
                padding: 14px 20px;
                background: #F5F6FA;
                line-height: inherit;
                .operation{
                    color: $primary-color;
                    .switch{
                        display: flex;
                        align-items: center;
                        &::before{
                            content: '';
                            border: 8.25px solid $primary-color;
                            border-bottom: 0;
                            border-right: 6px solid transparent;
                            border-left: 6px solid transparent;
                            margin-right: 6px;
                            width: 0;
                            height: 0;
                            transform-origin: center;
                            transform: rotateX(0);
                            transition: all .2s linear;
                        }
                        &.open{
                            &::before{
                                transform: rotateX(180deg);
                            }
                        }
                    }
                    >div:last-child{
                        margin-left: 22px;
                    }
                }
            }
            .el-collapse-item__arrow{
                display: none;
            }
            .el-collapse-item__wrap{
                border: none;
            }
            .el-collapse-item__content{
                padding: 20px;
            }
        }
    }
}
</style>
