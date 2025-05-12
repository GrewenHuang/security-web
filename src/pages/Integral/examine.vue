<template>
  <page-layout
    :loading="loading"
    :pages="pages"
    @current-change="handlePageChange"
  >
    <div slot="operation" class="f-b-c">
      <div class="input-content">
        <el-select placeholder="年份" v-model="filters.Year" @change="onChange">
          <el-option
            v-for="(item, index) in ageList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-cascader
          v-model="filters.SearchDepartmentId"
          filterable
          clearable
          :options="DepartmentPositionUser"
          @change="handleCascaderChange"
          placeholder="部门"
          :show-all-levels="false"
          style="width: 100%"
          :props="{
            value: 'value',
            label: 'label',
            children: 'children',
            checkStrictly: true
          }"
        >
        </el-cascader>
        <el-button type="primary" @click="handlePageChange(1)">查询</el-button>
      </div>
      <div class="f--c">
        <el-button
          @click="downloadmbs(1710, 17101, { Year: filters.Year })"
          v-if="$_has('KHKHBtnExport')"
          >导出</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="add()"
          v-if="$_has('KHKHBtnAdd')"
          >新增</el-button
        >
      </div>
    </div>
    <!-- <div slot="operation1"> -->
    <div class="box-title">
      <div class="name">
        <span>{{ filters.Year }}</span
        >年项目KPI考核
      </div>
      <div class="name-gz">
        <span
          v-for="(item, index) in scoreList"
          :key="index"
          :style="{ background: item.bg }"
          >{{ item.name }}</span
        >
      </div>
    </div>
    <!-- 优化后的 -->
    <div>
      <div>
        <el-table :data="tableData" style="width: 100%;overflow-x: scroll;" border max-height="440" :header-cell-style="{background:'#f8f8f8',color:'#181b3b'}">
          <el-table-column prop="DepartmentName" label="部门" ></el-table-column>
          <el-table-column prop="Project" label="考核项目" ></el-table-column>
          <!-- <el-table-column prop="Project" label="考核项目" ></el-table-column> -->
          <el-table-column prop="JanuaryScore"  label="一月">
            <template slot-scope="scope">
              <div @click="setScore(scope, 'JanuaryScore')" class="textM">
                <div v-if="isSelectShow(scope, 'JanuaryScore')">
                  <el-input
                    type="number"
                    :max="maxValue"
                    :min="minValue"
           
                    :id="
                      scope.row.DepartmentName +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'JanuaryScore'
                    "
                    v-model="scope.row.JanuaryScore"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else>
                  <div
                    v-if="scope.row.JanuaryScore"
                    :class="
                      scope.row.JanuaryScore >= 90
                        ? 'oneClass'
                        : scope.row.JanuaryScore >= 80
                        ? 'twoClass'
                        : 'threeClass'
                    "
                  >
                    {{ scope.row.JanuaryScore }}
                  </div>
                  <div v-else>-</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="JanuaryIncentive" label="奖惩" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'JanuaryIncentive')"  class="textM">
                <div v-if="isSelectShow(scope, 'JanuaryIncentive')">
                  <el-input
                  type="number"
                  
                    :id="
                      scope.row.DepartmentName +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'JanuaryIncentive'
                    "
                
                    v-model="scope.row.JanuaryIncentive"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else>
                  {{
                    scope.row.JanuaryIncentive
                      ? scope.row.JanuaryIncentive+'元'
                      : "-"
                  }}
                  
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="FebruaryScore" label="二月" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'FebruaryScore')"  class="textM">
                <div v-if="isSelectShow(scope, 'FebruaryScore')">
                  <el-input
                       type="number"
                    :max="maxValue"
                    :min="minValue"
           
                    :id="
                      scope.row.DepartmentName +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'FebruaryScore'
                    "
                    v-model="scope.row.FebruaryScore"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  <div
                    v-if="scope.row.FebruaryScore"
                    :class="
                      scope.row.FebruaryScore >= 90
                        ? 'oneClass'
                        : scope.row.FebruaryScore >= 80
                        ? 'twoClass'
                        : 'threeClass'
                    "
                  >
                    {{ scope.row.FebruaryScore }}
                  </div>
                  <div v-else>-</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="FebruaryIncentive" label="奖惩" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'FebruaryIncentive')"  class="textM">
                <div v-if="isSelectShow(scope, 'FebruaryIncentive')">
                  <el-input
                    :id="
                      scope.row.DepartmentName +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'FebruaryIncentive'
                    "
                    v-model="scope.row.FebruaryIncentive"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  {{
                    scope.row.FebruaryIncentive
                      ? scope.row.FebruaryIncentive+'元'
                      : "-"
                  }}
                              
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="MarchScore" label="三月" class="textM">
            <template slot-scope="scope">
              <div @click="setScore(scope, 'MarchScore')"  class="textM">
                <div v-if="isSelectShow(scope, 'MarchScore')">
                  <el-input
                       type="number"
                    :max="maxValue"
                    :min="minValue"
           
                    :id="
                      scope.row.DepartmentName +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'MarchScore'
                    "
                    v-model="scope.row.MarchScore"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  <div
                    v-if="scope.row.MarchScore"
                    :class="
                      scope.row.MarchScore >= 90
                        ? 'oneClass'
                        : scope.row.MarchScore >= 80
                        ? 'twoClass'
                        : 'threeClass'
                    "
                  >
                    {{ scope.row.MarchScore }}
                  </div>
                  <div v-else>-</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="MarchIncentive" label="奖惩" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'MarchScore')"  class="textM">
                <div v-if="isSelectShow(scope, 'MarchScore')">
                  <el-input
                    :id="
                      scope.row.MarchIncentive +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'MarchIncentive'
                    "
                    v-model="scope.row.MarchIncentive"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  {{
                    scope.row.MarchIncentive ? scope.row.MarchIncentive+'元' : "-"
                  }}
                  
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="AprilScore" label="四月">
            <template slot-scope="scope" >
              <div @click="setScore(scope, 'AprilScore')"  class="textM">
                <div v-if="isSelectShow(scope, 'AprilScore')">
                  <el-input
                       type="number"
                    :max="maxValue"
                    :min="minValue"
           
                    :id="
                      scope.row.AprilScore +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'AprilScore'
                    "
                    v-model="scope.row.AprilScore"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  <div
                    v-if="scope.row.AprilScore"
                    :class="
                      scope.row.AprilScore >= 90
                        ? 'oneClass'
                        : scope.row.AprilScore >= 80
                        ? 'twoClass'
                        : 'threeClass'
                    "
                  >
                    {{ scope.row.AprilScore }}
                  </div>
                  <div v-else>-</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="AprilIncentive" label="奖惩" class="textM" >
            <template slot-scope="scope" >
              <div @click="setScore(scope, 'AprilIncentive')"  class="textM">
                <div v-if="isSelectShow(scope, 'AprilIncentive')">
                  <el-input
                    :id="
                      scope.row.AprilIncentive +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'AprilIncentive'
                    "
                    v-model="scope.row.AprilIncentive"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  {{
                    scope.row.AprilIncentive ? scope.row.AprilIncentive+'元' : "-"
                  }}
                              
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="MayScore" label="五月" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'MayScore')"  class="textM">
                <div v-if="isSelectShow(scope, 'MayScore')">
                  <el-input
                       type="number"
                    :max="maxValue"
                    :min="minValue"
           
                    :id="
                      scope.row.MayScore +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'MayScore'
                    "
                    v-model="scope.row.MayScore"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  <div
                    v-if="scope.row.MayScore"
                    :class="
                      scope.row.MayScore >= 90
                        ? 'oneClass'
                        : scope.row.MayScore >= 80
                        ? 'twoClass'
                        : 'threeClass'
                    "
                  >
                    {{ scope.row.MayScore }}
                  </div>
                  <div v-else  class="textM">-</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="MayIncentive" label="奖惩" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'MayIncentive')"  class="textM">
                <div v-if="isSelectShow(scope, 'MayIncentive')">
                  <el-input
                  
                    :id="
                      scope.row.MayIncentive +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'MayIncentive'
                    "
                    v-model="scope.row.MayIncentive"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  {{ scope.row.MayIncentive ? scope.row.MayIncentive+'元' : "-" }}           
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="JuneScore" label="六月" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'JuneScore')"  class="textM">
                <div v-if="isSelectShow(scope, 'JuneScore')">
                  <el-input
                       type="number"
                    :max="maxValue"
                    :min="minValue"
           
                    :id="
                      scope.row.JuneScore +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'JuneScore'
                    "
                    v-model="scope.row.JuneScore"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else>
                  <div
                    v-if="scope.row.JuneScore"
                    :class="
                      scope.row.JuneScore >= 90
                        ? 'oneClass'
                        : scope.row.JuneScore >= 80
                        ? 'twoClass'
                        : 'threeClass'
                    "
                  >
                    {{ scope.row.JuneScore }}
                  </div>
                  <div v-else  class="textM">-</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="JuneIncentive" label="奖惩" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'JuneIncentive')"  class="textM">
                <div v-if="isSelectShow(scope, 'JuneIncentive')">
                  <el-input
                    :id="
                      scope.row.JuneIncentive +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'JuneIncentive'
                    "
                    v-model="scope.row.JuneIncentive"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  {{ scope.row.JuneIncentive ? scope.row.JuneIncentive+'元' : "-" }}
                           
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="JulyScore" label="七月" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'JulyScore')"  class="textM">
                <div v-if="isSelectShow(scope, 'JulyScore')">
                  <el-input
                       type="number"
                    :max="maxValue"
                    :min="minValue"
           
                    :id="
                      scope.row.JulyScore +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'JulyScore'
                    "
                    v-model="scope.row.JulyScore"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else>
                  <div
                    v-if="scope.row.JulyScore"
                    :class="
                      scope.row.JulyScore >= 90
                        ? 'oneClass'
                        : scope.row.JulyScore >= 80
                        ? 'twoClass'
                        : 'threeClass'
                    "
                  >
                    {{ scope.row.JulyScore }}
                  </div>
                  <div v-else  class="textM">-</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="JulyIncentive" label="奖惩"  >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'JulyIncentive')"  class="textM">
                <div v-if="isSelectShow(scope, 'JulyIncentive')">
                  <el-input
                    :id="
                      scope.row.JulyIncentive +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'JulyIncentive'
                    "
                    v-model="scope.row.JulyIncentive"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  {{ scope.row.JulyIncentive ? scope.row.JulyIncentive+'元' : "-" }}
                            
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="AugustScore" label="八月" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'AugustScore')"  class="textM">
                <div v-if="isSelectShow(scope, 'AugustScore')">
                  <el-input
                       type="number"
                    :max="maxValue"
                    :min="minValue"
           
                    :id="
                      scope.row.AugustScore +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'AugustScore'
                    "
                    v-model="scope.row.AugustScore"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else>
                  <div
                    v-if="scope.row.AugustScore"
                    :class="
                      scope.row.AugustScore >= 90
                        ? 'oneClass'
                        : scope.row.AugustScore >= 80
                        ? 'twoClass'
                        : 'threeClass'
                    "
                  >
                    {{ scope.row.AugustScore }}
                  </div>
                  <div v-else  class="textM">-</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="AugustIncentive" label="奖惩" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'AugustIncentive')"  class="textM">
                <div v-if="isSelectShow(scope, 'AugustIncentive')">
                  <el-input
                    :id="
                      scope.row.AugustIncentive +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'AugustIncentive'
                    "
                    v-model="scope.row.AugustIncentive"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  {{
                    scope.row.AugustIncentive ? scope.row.AugustIncentive+'元' : "-"
                  }}
                       
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="SeptemberScore" label="九月" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'SeptemberScore')"  class="textM">
                <div v-if="isSelectShow(scope, 'SeptemberScore')">
                  <el-input
                       type="number"
                    :max="maxValue"
                    :min="minValue"
           
                    :id="
                      scope.row.SeptemberScore +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'SeptemberScore'
                    "
                    v-model="scope.row.SeptemberScore"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else>
                  <div
                    v-if="scope.row.SeptemberScore"
                    :class="
                      scope.row.SeptemberScore >= 90
                        ? 'oneClass'
                        : scope.row.SeptemberScore >= 80
                        ? 'twoClass'
                        : 'threeClass'
                    "
                  >
                    {{ scope.row.SeptemberScore }}
                  </div>
                  <div v-else  class="textM">-</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="SeptemberIncentive" label="奖惩" class="textM">
            <template slot-scope="scope">
              <div @click="setScore(scope, 'SeptemberIncentive')"  class="textM">
                <div v-if="isSelectShow(scope, 'SeptemberIncentive')">
                  <el-input
                    :id="
                      scope.row.SeptemberIncentive +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'SeptemberIncentive'
                    "
                    v-model="scope.row.SeptemberIncentive"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  {{
                    scope.row.SeptemberIncentive
                      ? scope.row.SeptemberIncentive+'元'
                      : "-"
                  }}
                            
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="OctoberScore" label="十月" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'OctoberScore')"  class="textM">
                <div v-if="isSelectShow(scope, 'OctoberScore')">
                  <el-input
                       type="number"
                    :max="maxValue"
                    :min="minValue"
           
                    :id="
                      scope.row.OctoberScore +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'OctoberScore'
                    "
                    v-model="scope.row.OctoberScore"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else>
                  <div
                    v-if="scope.row.OctoberScore"
                    :class="
                      scope.row.OctoberScore >= 90
                        ? 'oneClass'
                        : scope.row.OctoberScore >= 80
                        ? 'twoClass'
                        : 'threeClass'
                    "
                  >
                    {{ scope.row.OctoberScore }}
                  </div>
                  <div v-else  class="textM">-</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="OctoberIncentive" label="奖惩" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'OctoberIncentive')"  class="textM">
                <div v-if="isSelectShow(scope, 'OctoberIncentive')">
                  <el-input
                    :id="
                      scope.row.OctoberIncentive +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'OctoberIncentive'
                    "
                    v-model="scope.row.OctoberIncentive"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  {{
                    scope.row.OctoberIncentive
                      ? scope.row.OctoberIncentive+'元'
                      : "-"
                  }}
                       
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="NovemberScore" label="十一月" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'NovemberScore')"  class="textM">
                <div v-if="isSelectShow(scope, 'NovemberScore')">
                  <el-input
                       type="number"
                    :max="maxValue"
                    :min="minValue"
           
                    :id="
                      scope.row.NovemberScore +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'NovemberScore'
                    "
                    v-model="scope.row.NovemberScore"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else>
                  <div
                    v-if="scope.row.NovemberScore"
                    :class="
                      scope.row.NovemberScore >= 90
                        ? 'oneClass'
                        : scope.row.NovemberScore >= 80
                        ? 'twoClass'
                        : 'threeClass'
                    "
                  >
                    {{ scope.row.NovemberScore }}
                  </div>
                  <div v-else  class="textM">-</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="NovemberIncentive" label="奖惩" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'NovemberIncentive')"  class="textM">
                <div v-if="isSelectShow(scope, 'NovemberIncentive')">
                  <el-input
                    :id="
                      scope.row.NovemberIncentive +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'NovemberIncentive'
                    "
                    v-model="scope.row.NovemberIncentive"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  {{
                    scope.row.NovemberIncentive
                      ? scope.row.NovemberIncentive+'元'
                      : "-"
                  }}
                            
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="DecemberScore" label="十二月" class="textM" >
            <template slot-scope="scope">
              <div @click="setScore(scope, 'DecemberScore')"  class="textM">
                <div v-if="isSelectShow(scope, 'DecemberScore')">
                  <el-input
                       type="number"
                    :max="maxValue"
                    :min="minValue"
           
                    :id="
                      scope.row.DecemberScore +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'DecemberScore'
                    "
                    v-model="scope.row.DecemberScore"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else >
                  <div
                    v-if="scope.row.DecemberScore"
                    :class="
                      scope.row.DecemberScore >= 90
                        ? 'oneClass'
                        : scope.row.DecemberScore >= 80
                        ? 'twoClass'
                        : 'threeClass'
                    "
                  >
                    {{ scope.row.DecemberScore }}
                  </div>
                  <div v-else  class="textM">-</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="DecemberIncentive"  label="奖惩" class="textM"
            ><template slot-scope="scope">
              <div @click="setScore(scope, 'DecemberIncentive')"  class="textM">
                <div v-if="isSelectShow(scope, 'DecemberIncentive')">
                  <el-input
                    :id="
                      scope.row.DecemberIncentive +
                        '-' +
                        scope.row.Project +
                        '-' +
                        'DecemberIncentive'
                    "
                    v-model="scope.row.DecemberIncentive"
                    @blur="saveScore(scope)"
                  ></el-input>
                </div>
                <div v-else  class="textM">
                  {{
                    scope.row.DecemberIncentive
                      ? scope.row.DecemberIncentive+'元'
                      : "-"
                  }}
                        
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="AverageScore" label="本年平均分" ></el-table-column>
          <el-table-column prop="LastAverageScore" label="上年平均分" ></el-table-column>
          <el-table-column   label="对比" >
            <template slot-scope="scope">
               <div  class="textM" v-if="scope.row.AverageScore && scope.row.LastAverageScore"  :style="{
                    color:
                      scope.row.UpOrDown == 1
                        ? '#1DBFAC'
                        : scope.row.UpOrDown == 0
                        ? '#ED7043'
                        : scope.row.UpOrDown == -1
                        ? '#FF4040'
                        : ''
                  }">

                  {{  }}
                   {{
                    scope.row.UpOrDown == 1
                      ? "上升"
                      : scope.row.UpOrDown == 0
                      ? "相等"
                      : scope.row.UpOrDown == -1
                      ? "下降"
                      : ""
                  }}
               </div>
               <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column

            label="操作"
         >
            <template slot-scope="scope">

              <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- </div> -->

    <el-dialog
      v-dialog-drag
      :title="addTitle ? '新增' : '编辑'"
      :visible.sync="dislogShow"
      @close="close()"
      class="info"
      width="40%"
      top="8vh"
      v-loading="loading"
      element-loading-text="数据加载中"
    >
      <el-scrollbar class="scrollbar" ref="scrollbar">
        <el-form ref="form" label-position="top" :model="info" :rules="rules">
          <el-form-item label="企业" prop="EnterpriseId">
            <select-enterpirse
              clearable
              placeholder="企业"
              collapseTags
              v-model="info.EnterpriseId"
              @clear="info.DepartmentId = ''"
            ></select-enterpirse>
          </el-form-item>
          <el-form-item label="部门" prop="DepartmentId">
            <cascader-department
              placeholder="部门"
              clearable
              v-model="info.DepartmentId"
              :enterpriseId="info.EnterpriseId"
              :disabled="!info.EnterpriseId ? true : false"
            ></cascader-department>
            <!-- <select-department placeholder="部门" clearable clearable v-model="info.DepartmentList" :enterpriseId="info.EnterpriseIds" :disabled="!info.EnterpriseIds ? true : false"></select-department> -->
          </el-form-item>
          <el-form-item label="考核项目" prop="Project">
            <el-input placeholder="请输入" v-model="info.Project"></el-input>
          </el-form-item>
          <el-form-item
            label="安全等级"
            prop="SecurityLevel"
            ref="SecurityLevel"
          >
            <select-level
              v-model="info.SecurityLevel"
              :multiple="false"
              :value="info.SecurityLevel"
            ></select-level>
          </el-form-item>
          <el-form-item label="考核报告">
            <customUploadDrag
              @onUpload="handleUpload"
              :Data="info.Files"
              :showFileList="false"
              :acceptList="[
                'png',
                'jpg',
                'jpeg',
                'doc',
                'docx',
                'xls',
                'xlsx',
                'pdf'
              ]"
            >
              <div class="f-c-c">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处或<em>点击上传</em>
                </div>
              </div>
            </customUploadDrag>
            <div class="f--c" style="color: #959595;margin-left: 15px;">
              <span>支持png、jpg、pdf、doc、docx、xls等文件</span>
            </div>
            <div
              class="file-list"
              v-for="(item, index) in info.Files"
              :key="index"
            >
              <div class="file-item" @click="$openFile(item.url)">
                <div class="file f-b-c">
                  <div class="f">
                    <img
                      style="width:30px;height:30px;margin-right: 13px;"
                      :src="
                        $fileIcons[
                          item.name.substring(item.name.lastIndexOf('.') + 1)
                        ]
                      "
                    />
                    <div class="text">
                      <div style="color:#44566C;font-size:12px;line-height: 1;">
                        {{ item.name }}
                      </div>
                      <div
                        style="color:#A8B0B6;font-size:12px;line-height: 1;margin-top: 2px;"
                      >
                        {{ item.size | formatSize }}
                      </div>
                    </div>
                  </div>
                  <div>
                    <i
                      class="el-icon-error cursor-p"
                      @click="removeFile(index)"
                    ></i>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="close()">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="save()"
          slot="reference"
          >提交</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      v-dialog-drag
      title="考核"
      :visible.sync="dislogShowKh"
      @close="close()"
      class="info"
      width="600px"
      top="8vh"
      v-loading="loading"
      element-loading-text="数据加载中"
    >
      <el-form
        ref="formKH"
        label-position="top"
        :model="infoSet"
        :rules="rules"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="企业">
              <el-input v-model="infoSet.EnterpriseName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 20px">
            <el-form-item label="部门">
              <el-input v-model="infoSet.DepartmentName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="考核项目">
              <el-input v-model="infoSet.Project" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-left: 20px">
            <el-form-item label="考核月份">
              <el-input v-model="infoSet.Month" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="考核分数" prop="Score">
              <el-input-number
                v-model="infoSet.Score"
                :min="1"
                style="width: 100%;"
                :disabled="isDisabled"
                :max="200"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="奖惩" prop="Incentive">
              <el-input-number
                v-model="infoSet.Incentive"
                :disabled="!isDisabled"
                style="width: 100%;"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <template v-if="infoSet.CustomerAssessmentDetailId > 0">
            <el-col :span="10" style="margin-left: 20px">
              <el-form-item label="考核人">
                <el-input
                  v-model="infoSet.AssessmentUserName"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="考核时间">
                <el-input
                  v-model="infoSet.AssessmentTimeDesc"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="close()">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="saveKpi()"
          slot="reference"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </page-layout>
</template>

<script>
import request_mixins from "@/mixins/request-mixin";
import Import_export from "@/mixins/Import_export.js";
import RULECONFIG from "@/common/ruleConfig";
import customUploadDrag from "@/components/common/custom-upload-drag.vue";
// import { ConstNode } from "three/webgpu";
const defaultInfo = {
  EnterpriseId: "",
  DepartmentId: "",
  SecurityLevel: "1",
  Project: "",
  Year: "",
  ScoreJson: [],
  Files: []
};
export default {
  components: {
    customUploadDrag
  },
  mixins: [request_mixins, Import_export],
  data() {
    return {
      maxValue:100,
      minValue:0.01,
      isPropty: "",
      tableData: [],
      addTitle: true,
      selectScore: {
        id: "",
        index: ""
      }, // 赋值分数时所需要的下标
      loading: false,
      dislogShow: false,
      dislogShowKh: false, // 考核弹窗
      submitLoading: false, // 按钮loading
      ageList: [],
      pages: {
        rows: 10,
        page: 1,
        total: 0
      },
      yearDate: "",
      list: [],
      info: Object.assign({}, defaultInfo),
      rules: {
        EnterpriseId: RULECONFIG.Select("企业"),
        DepartmentId: RULECONFIG.Select("部门"),
        Project: RULECONFIG.Text("考核项目"),
        SecurityLevel: RULECONFIG.Select("安全等级"),
        Score: RULECONFIG.Text("分数")
      },
      scoreList: [
        {
          id: 1,
          name: "优 X >= 90",
          bg: "#1DBFAC"
        },
        {
          id: 2,
          name: "良 90 > X >=80",
          bg: "#ED7043"
        },
        {
          id: 3,
          name: "差 X < 80",
          bg: "#FF4040"
        }
      ],
      filters: {
        Year: "",
        SearchDepartmentId: ""
      },
      infoSet: {},
      isDisabled: false,
      isArr: 0,
      MonthList: [],
      isYear: 0,
      fileList: [],
      DepartmentPositionUser: []
    };
  },
  computed: {
    filteredItems() {
      let list = this.MonthList.filter(item => item.Month <= this.isYear);
      console.log("过滤", list);
      return this.MonthList.filter(item => item.Month <= this.isYear);
    }
  },
  created() {
    this.getYearList();
    this.getMonth();
    this.handlePageChange(1);
    this.Get("/GetDepartmentTree").then(res => {
      //部门
      if (res.status == 2000) {
        this.DepartmentPositionUser = res.data;
        if (
          this.DepartmentPositionUser &&
          this.DepartmentPositionUser.length > 0
        ) {
          this.removeEmptyChildrenDepartment(this.DepartmentPositionUser);
        }
      }
    });
  },
  methods: {
  
    // 样式
    getClass(scorce) {},
    // 转换格式
    submitFormat(type) {
      let obj = {
        Month: "",
        MonthDese: ""
      };
      switch (type) {
        case "JanuaryScore":
          obj.Month = "1";
          obj.MonthDese = "1月";
          break;
        case "JanuaryIncentive":
          obj.Month = "1";
          obj.MonthDese = "1月";
          break;
        case "FebruaryScore":
          obj.Month = "2";
          obj.MonthDese = "2月";
          break;
        case "FebruaryIncentive":
          obj.Month = "2";
          obj.MonthDese = "2月";
          break;
        case "MarchScore":
          obj.Month = "3";
          obj.MonthDese = "3月";
          break;
        case "MarchIncentive":
          obj.Month = "3";
          obj.MonthDese = "3月";
          break;
        case "AprilScore":
          obj.Month = "4";
          obj.MonthDese = "4月";
          break;
        case "AprilIncentive":
          obj.Month = "4";
          obj.MonthDese = "4月";
          break;
        case "MayScore":
          obj.Month = "5";
          obj.MonthDese = "5月";
          break;
        case "MayIncentive":
          obj.Month = "5";
          obj.MonthDese = "5月";
          break;
        case "JuneScore":
          obj.Month = "6";
          obj.MonthDese = "6月";
          break;
        case "JuneIncentive":
          obj.Month = "6";
          obj.MonthDese = "6月";
          break;
        case "JulyScore":
          obj.Month = "7";
          obj.MonthDese = "7月";
          break;
        case "JulyIncentive":
          obj.Month = "7";
          obj.MonthDese = "7月";
          break;
        case "AugustScore":
          obj.Month = "8";
          obj.MonthDese = "8月";
          break;
        case "AugustIncentive":
          obj.Month = "8";
          obj.MonthDese = "8月";
          break;

        case "SeptemberScore":
          obj.Month = "9";
          obj.MonthDese = "9月";
          break;
        case "SeptemberIncentive":
          obj.Month = "9";
          obj.MonthDese = "9月";
          break;
        case "OctoberScore":
          obj.Month = "10";
          obj.MonthDese = "10月";
          break;
        case "OctoberIncentive":
          obj.Month = "10";
          obj.MonthDese = "10月";
          break;
        case "NovemberScore":
          obj.Month = "11";
          obj.MonthDese = "11月";
          break;
        case "NovemberIncentive":
          obj.Month = "11";
          obj.MonthDese = "11月";
          break;
        case "DecemberScore":
          obj.Month = "12";
          obj.MonthDese = "12月";
          break;
        case "DecemberIncentive":
          obj.Month = "12";
          obj.MonthDese = "12月";
          break;
        default:
          console.log("错误");
      }
      return obj;
    },
    // 设置显示隐藏
    isSelectShow(scope, type) {
      if (type == this.isPropty && scope.row.flag == true) {
        return true;
      } else {
        return false;
      }
    },
    // 设置分数
    saveScore(row) {
      console.log(row,'dddddddddddddd')
      if(row.column.label !== '奖惩'){
      
      row.row[row.column.property] = Number(row.row[row.column.property]).toFixed(2)
        // row.row[row.column.property] = row.row[row.column.property].toFixed(2)
      }
      this.tableData[row.$index].flag = false;


      this.saveKpi(this.tableData[row.$index]);
    },
    setScore(row, type) {
      this.isPropty = row.column.property;
      this.tableData[row.$index].flag = true;
      this.tableData.forEach((item, index) => {
        if (index != row.$index) {
          item.flag = false;
        }
      });
    },
    getlie(data) {
      let obj = {
        January: "1月",
        February: "2月",
        March: "3月",
        April: "4月",
        May: "5月",
        June: "6月",
        July: "7月",
        August: "8月",
        September: "9月",
        October: "10月",
        November: "11月",
        December: "12月"
      };
      let obj1 = {
        "1月": "January",
        "2月": "February",
        "3月": "March",
        "4月": "April",
        "5月": "May",
        "6月": "June",
        "7月": "July",
        "8月": "August",
        "9月": "September",
        "10月": "October",
        "11月": "November",
        "12月": "December"
      };
      let list = [];

      data.forEach(fathItem => {
        let falist = JSON.parse(JSON.stringify(fathItem));
        if (falist.ScoreJsonList && falist.ScoreJsonList.length > 0) {
          falist.ScoreJsonList.forEach(childrenItem => {
            let key1 = `${obj1[childrenItem.MonthDesc]}Score`;
            let key2 = `${obj1[childrenItem.MonthDesc]}Incentive`;
            if (!falist[key1]) {
              falist[key1] = childrenItem.Score;
            }
            if (!falist[key2]) {
              falist[key2] = childrenItem.Incentive;
            }
          });
        }
        falist.flag = false;
        list.push(falist);
      });
      this.tableData = list;
    },
    removeEmptyChildrenDepartment(data) {
      data.forEach(item => {
        if (item.children && item.children.length === 0) {
          delete item.children;
        } else if (item.children && item.children.length > 0) {
          this.removeEmptyChildrenDepartment(item.children);
        }
      });
    },
    handleCascaderChange(value) {
      if (value.length > 0) {
        const lastId = value[value.length - 1];
        this.filters.SearchDepartmentId = lastId;
        // 在这里可以对最后一级的 ID 进行你需要的操作
      }
    },
    formatDecimal(value, decimals) {
      return value.toFixed(2);
    },
    forMot(data) {
      let list = [];
      if (data && data.length > 0) {
        data.forEach(item => {
          let obj = { ...item };
          let obj1 = {
            ...item
          };
          list.push(obj);
          list.push(obj1);
        });
      }
      // ata.filter(item => item.Month <= this.isYear)
      return list.filter(item => item.Month <= this.isYear);
    },
    sum(data) {
      let filteredArr = data.filter(item => item.Score >= 0);
      this.isArr = filteredArr.length;
      // 返回本年平均分
      return filteredArr.reduce((sum, item) => sum + item.Score, 0);
    },

    getYearList() {
      // 获取年份数组，根据当前年份往前推9年，加上本年为10年的数组
      let num = new Date(); // 获取当前年
      let start = num.getFullYear() - 9; // 当前年近五年
      let endYear = num.getFullYear();
      this.yearDate = endYear;
      this.filters.Year = endYear;
      let yearList = [];
      for (var i = start; i <= endYear; i++) {
        let obj = {
          value: i.toString(),
          label: i
        };
        yearList.push(obj);
      }
      this.ageList = yearList;
    },
    onChange() {
      this.getMonth();
      this.getList();
    },
    close() {
      // 关闭新增弹窗 || 考核弹窗
      this.dislogShow = false;
      this.dislogShowKh = false;
      this.$nextTick(() => {
        this.reset();
      });
    },
    reset() {
      this.submitLoading = false;
      this.info = Object.assign({}, defaultInfo);
    },
    add() {
      // 新增时弹窗
      this.dislogShow = true;
      this.addTitle = true;
      this.info = {
        EnterpriseId: "",
        DepartmentId: "",
        SecurityLevel: "1",
        Project: "",
        Year: this.yearDate,
        // ScoreJson: []
        Files: []
      };
    },
    onEdit(data) {
      this.dislogShow = true;
      this.addTitle = false;
      data.SecurityLevel = data.SecurityLevel.toString();
      this.info = data;
    },
    handleUpload(e) {
      e.forEach(item => {
        this.$set(item, "name", item.name);
        this.$set(item, "VideoUrl", item.url);
        this.$set(item, "Size", item.size);
        this.$set(item, "Ext", item.ext);
        this.$set(item, "CoverUrl", item.coverUrl);
        this.$set(item, "Lengths", item.lengths);
        this.$set(item, "TotalSeconds", item.lengths);
        // let hms = secondsToHms(parseInt(item.Lengths || 0))
        // this.$set(item, 'hms', hms);
      });
      this.info.Files = e;
    },
    removeFile(index) {
      this.info.Files.splice(index, 1);
    },
    resetArr() {
      let arr = [];
      for (var i = 1; i <= 12; i++) {
        let obj = {
          Month: i,
          MonthDesc: i + "月",
          Score: 0
        };
        let obj2 = {
          Month: i,
          rewardDesc: "奖惩",
          Incentive: 0
        };
        arr.push(obj);
        arr.push(obj2);
      }
      this.MonthList = arr;
    },
    getMonth() {
      let currentDate = new Date();
      let currentYear = currentDate.getFullYear();
      let currentMonth = currentDate.getMonth() + 1;
      if (this.filters.Year != currentYear) {
        this.isYear = 12;
      } else {
        this.isYear = currentMonth;
      }
      this.resetArr();
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            ...this.info
          };
          params.Year = this.filters.Year;
          params.SecurityLevel = parseInt(params.SecurityLevel);
          // params.ScoreJson = JSON.stringify(this.MonthList)
          // params.ScoreJsonList = this.MonthList
          this.loading = true;
          this.Post("/SaveCustomerAssessment", params).then(result => {
            if (!result || !result.status) {
              this.$message({
                message: "请求异常",
                type: "error"
              });
              return;
            }
            if (result.status == 2000) {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.dislogShow = false;
              this.getList();
            } else {
              this.$message({
                message: result.message,
                type: "error"
              });
            }
            this.loading = false;
          });
        }
      });
    },
    saveKpi(data) {
      let data2 = JSON.parse(JSON.stringify(data));
      let json = JSON.parse(JSON.stringify(data.ScoreJsonList));

      let obj1 = {
        "1月": "January",
        "2月": "February",
        "3月": "March",
        "4月": "April",
        "5月": "May",
        "6月": "June",
        "7月": "July",
        "8月": "August",
        "9月": "September",
        "10月": "October",
        "11月": "November",
        "12月": "December"
      };

      json.forEach(item => {
        console.log(obj1[item.MonthDesc]);
        let key = `${obj1[item.MonthDesc]}Score`;
        let key2 = `${obj1[item.MonthDesc]}Incentive`;
        console.log(key);
        item.Score = data[key];
        item.Incentive = data[key2];
      });
      data2.Month = this.submitFormat(this.isPropty).Month;
      data2.MonthDese = this.submitFormat(this.isPropty).MonthDese;
      data2.ScoreJsonList = json;
      data2.ScoreJson = JSON.stringify(json);
      data2.Year = this.filters.Year;
      this.loading = true;
      this.Post("/SaveCustomerAssessmentDetail", data2).then(result => {
        if (!result || !result.status) {
          this.$message({
            message: "请求异常",
            type: "error"
          });
          return;
        }
        if (result.status == 2000) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.getList();
        } else {
          this.$message({
            message: result.message,
            type: "error"
          });
        }
        this.loading = false;
      });
    },
    onSelectScore(item, data, index, id, isAdd, flag) {
      if (index < 0) {
        index = 0;
      }
      if (this.$_has("KHKHBtnEdit")) {
        if (flag) {
          this.isDisabled = true;
        } else {
          this.isDisabled = false;
        }
        this.dislogShowKh = true;

        this.infoSet = {
          ...data,
          ...item,
          index: item.Month - 1,
          id,
          isAdd,
          Year: this.filters.Year,
          ScoreJsonList: [],
          ScoreJson: ""
        };
        console.log(this.infoSet, "this.infoSet");
      } else {
        this.$message.error("您的账号没有编辑权限，请联系管理员添加!");
      }
    },
    handlePageChange(val) {
      this.pages.page = val;
      this.getList();
    },
    async getList() {
      let params = {
        ...this.pages,
        ...this.filters
      };
      this.loading = true;
      try {
        let res = await this.Post("/GetCustomerAssessments", params);
        if (res.status === 2000) {
          this.list = res.data.list;
          let list = JSON.parse(JSON.stringify(res.data.list));
          this.getlie(list);
          this.pages.total = res.data.count;
        }
      } catch (error) {
        console.error(error);
      }
      this.loading = false;
    },
    show(item) {
      let el = this.$refs["info" + item.CertificateType];
      if (el) {
        el.show(item, item.CertificateType, item.CertificateClassification);
      }
    }
  }
};
</script>

<style scoped lang="less">
.kpi-box {
  position: relative;
}

.box-title {
  display: flex;
  // border: 1px solid black;
  padding: 10px 0;
  background: #fff;

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

  /deep/.el-select > .el-input {
    border-bottom: 2px solid #000;
  }

  /deep/.el-input__suffix {
    display: none !important;
  }

  .name {
    width: 50%;
    font-size: 18px;
    font-weight: bold;
    text-align: right;
    color: #000;
  }

  .name-gz {
    width: 50%;
    display: flex;
    justify-content: flex-end;

    span {
      display: inline-block;
      color: #fff;
      padding: 0 8px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      font-size: 14px;
      // border-radius: 3px;
      margin-right: 10px;
    }
  }
}

.box-table {
  margin-top: 5px;

  .no-data {
    position: absolute;
    min-height: 60px;
    width: 100%;
    text-align: center;
    line-height: 60px;
    color: #909399;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      background-color: #ebeef5;
      z-index: 1;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      background-color: #ebeef5;
      z-index: 1;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
    }

    tr {
      border-top: 1px solid #eee;
    }

    .t-t {
      background: rgb(248, 248, 248);
      color: rgb(24, 27, 59);
      // border-radius: 10px;
      position: sticky;
      top: 0;
      z-index: 1;

      th {
        padding: 10px;
        text-align: center;
      }
    }


    .t-t-s {
      td {
        text-align: center;
      }

      span {
        padding: 5px;
        border-radius: 2px;
      }

      &:hover {
        background-color: rgba(245, 247, 250);
      }
    }

    .t-t-t {
      cursor: pointer;

      span {
        display: inline-block;
        width: 54px;
        text-align: center;
        // border-radius: 3px;
      }
    }
  }
}
/deep/.el-button {
  padding: 11px 20px;
}
.oneClass {
  background: #1dbfac;
}
.twoClass {
  background: #ed7043;
}
.threeClass {
  background: #ff4040;
}
.textM {
  text-align: center;
}
.has-gutter{
    background: rgb(248, 248, 248) !important;
    color: rgb(24, 27, 59) !important;
}
</style>
