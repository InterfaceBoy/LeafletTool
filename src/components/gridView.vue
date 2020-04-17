<template>
  <div class="basisGrid">
    <!-- 浮动层 -->
    <div class="floating-layer">
      <!-- 时间 -->
      <div class="currentDate">
        <span class="timer-icon"></span>
        <span>{{currentDayDate}}</span>
      </div>
      <div class="basis-content">
        <!-- 地图 -->
        <div id="mapArcgis" class="mapArcgis">
          <bottomMap
            :gridType="gridType"
            :gridsAlert="gridsAlert"
            :propsConfig="propsConfig"
            :indicatorsShow="indicatorsShow"
          ></bottomMap>
        </div>
        <!-- 左侧 -->
        <div class="bc-left-left">
          <div class="indicators-list">
            <div class="index-title">空间单元画像综合排名</div>
            <div class="index-content" v-for="(item,index) in indexRankingData" :key="index">
              <div class="content" :class="{'isEqBackground':index%2==0}">
                <div class="content-left">
                  <!-- 排名 -->
                  <span class="ranking-number">{{index+1}}</span>
                  <!-- 具体指数 -->
                  <span class="name">{{item[0]}}</span>
                </div>
                <div class="content-right">
                  <!-- 指数值 -->
                  <span class="trends">{{Number(item[1]).toFixed(2)}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧内容 -->
        <div class="bc-left-right">
          <!-- 网格显示 初始化 -->
          <div class="parameter">
            <!-- 基础网格总数量 -->
            <parameterText
              :streetData="streetData"
              :streetNumer="Number(this.$store.state.streetNumber)"
              :explainJudge="explainJudge"
              :averageValue="Number(averageValue)"
              :indexValue="Number(indexValue)"
              :minValue="Number(minValue)"
              :maxValue="Number(maxValue)"
              :criticalValue1="Number(criticalValue1)"
              :criticalValue2="Number(criticalValue2)"
              :criticalValue3="Number(criticalValue3)"
            />

            <radarValue :data="firstLevelIndex" :loading="loading" :date="currentDayDate"/>
            <pieValue :propsConfig="propsConfig" :loading="loading" :date="currentDayDate"/>
          </div>
          <!-- 网格显示 -->
        </div>
        <!-- 折线图和柱状图 -->
        <div class="broken-line" v-show="indicatorsShow">
          <div class="line-title">
            <!-- <span
              class="title-left"
              :class="{isSelected:isShowChart}"
              @click="isShowChart = true"
            >社区综合排名</span>&nbsp;-->
            <span class="title-left">{{ currentIndexName + '变化趋势'}}</span>

            <div class="dateSelector">
              <div class="selector">
                <div class="slider">
                  <Slider
                    v-show="false"
                    v-model="daySpan"
                    :max="dayCount"
                    @on-input="queryIndexValueByDate"
                    :tip-format="format"
                  ></Slider>
                </div>
              </div>
            </div>
            <span class="title-right">
              <Icon type="md-alert"/>
            </span>
          </div>
          <!-- 政柱状图 -->
          <div class="line-echarts">
            <!-- <IEcharts
              :option="bar"
              :resizable="true"
              @click="showCommunityPage"
              v-show="isShowChart"
            ></IEcharts>-->
            <IEcharts :option="line" :resizable="true" @click="showDayData"></IEcharts>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import headerNavigation from "@/components/headerNavigation.vue";
import IEcharts from "vue-echarts-v3";
import moment from "moment";
import parameterText from "@/components/parameterText.vue";
import indexJudge from "@/components/indexJudge.vue";
import indexRanking from "@/components/indexRanking.vue";
import gridJudgeRanking from "@/components/gridJudgeRanking.vue";
import gridsAlert from "@/components/gridsAlert.vue";
import gridsJudgeAlert from "@/components/gridsJudgeAlert.vue";
import bottomMap from "@/components/bottomMap.vue";
import EventBus from "../utils/EventBus.js";
import radarValue from "@/components/radarValue.vue";
import pieValue from "@/components/pieValue.vue";

export default {
  name: "BasisGrid",
  props: {
    gridType: {
      type: String,
      required: true
    }
  },
  components: {
    IEcharts,
    parameterText,
    gridsAlert,
    bottomMap,
    indexJudge,
    indexRanking,
    gridJudgeRanking,
    gridsJudgeAlert,
    headerNavigation,
    radarValue,
    pieValue
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      beginDate: "", // 开始时间
      endDate: "", // 结束时间
      dayCount: 0, // 总天数
      currentDate: "",
      showOverview: true,
      isShowChart: true, // 折线图和柱状图的切换
      showGridview: false,
      indexValues: [], // 主页的数据  网格id对应数值--
      allDistrictValue: "", // 街道的全区综合值
      lineDataX: [], // 折线图坐标X
      lineDataY: [], // 折线图坐标Y
      firstLevelIndex: [], // 第一层属性 --指数属性--动力等
      secondLevelIndex: [], // 第二层属性
      currentIndexName: "属性指数", // 当前页面显示指数的名称
      currentIndexId: "ZS", // 当前页面显示指数的id
      currentGridId: 1101010, // 当前网格的id
      currentGridName: "", // 当前网格的名字
      currentFirstLevel: "", // 第一层属性值的下标
      currentSecondLevel: "", // 第二层属性值的下标
      currenThridLevel: "",
      indicatorsShow: false,
      gridsAlert: [], // 网格的数据,名称和值
      loading: true,
      lineAlertValue: "", // 折线图预警线的值
      averageValue: "", // 每个属性对应的平均值Y轴的值
      indexValue: "", // 每个属性当前的值
      criticalValue1: "", // 每个属性的临界值1
      criticalValue2: "", // 每个属性的临界值2
      criticalValue3: "", // 每个属性的临界值3
      explainJudge: "", // 临界值正向评价和负向评价
      minValue: "", // 每个属性的最小值
      maxValue: "", // 每个属性的最大值
      indexRankingData: [], // 柱状图需要的街道排名数据
      gridJudgeRankingData: [], // 初始化(进入街道页面)柱状图需要的排名数据
      streetData: [], // 文字组件需要的数据,用于进入街道页面的等级判断个数
      isEchartsShow: false // 是否渲染雷达图
    };
  },
  computed: {
    daySpan: {
      get: function() {
        return [0, this.dayCount];
      },
      set: function() {
        return [0, this.dayCount];
      }
    },
    // 折线图
    line() {
      let color = "";
      if (this.explainJudge === "forward") {
        color = "#04ff92 ";
      } else {
        color = "#efdb02";
      }
      var pieces = [{ gt: 0, lt: 1 }];
      if (this.alertJudge === "low") {
        pieces = [{ gte: 0, lte: Number(this.lineAlertValue), color: "red" }];
      } else if (this.alertJudge === "high") {
        pieces = [{ gte: Number(this.lineAlertValue), lt: 100, color: "red" }];
      } else {
        pieces = [{ gte: 0, lte: 1 }];
      }
      let option = {
        visualMap: {
          show: false,
          pieces: pieces,
          outOfRange: {
            color: color
          }
        },
        tooltip: {
          trigger: "axis"
        },

        grid: {
          left: "4%",
          right: "9%",
          // top: "150",
          bottom: "10",
          x: "2%",
          y: "5%",
          x2: "2%",
          y2: "15%",
          containLabel: true
        },

        xAxis: {
          type: "category",
          data: this.lineDataX,
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#fff"
            }
          },
          scale: true
        },
        dataZoom: [
          {
            type: "slider", //图表下方的伸缩条
            show: false, //是否显示
            realtime: true, //
            start: 0, //伸缩条开始位置（1-100），可以随时更改
            end: 100 //伸缩条结束位置（1-100），可以随时更改
          },
          {
            type: "inside", //鼠标滚轮
            realtime: true
          }
        ],
        series: [
          {
            type: "line",
            showSymbol: true,
            data: this.lineDataY,
            itemStyle: {
              normal: {
                /* eslint-disable */
                color: params => {
                  if (this.explainJudge === "forward") {
                    return "#D24A53";
                  } else {
                    return "#FFD6A0";
                  }
                },
                lineStyle: {
                  // color: color
                }
              }
            },
            markLine: {
              symbol: "none",
              silent: true,
              precision: 2,
              itemStyle: {
                normal: {
                  textStyle: {
                    color: "#F92E2A"
                  }
                }
              },
              data: [
                {
                  type: "average",
                  name: "平均值",
                  lineStyle: {
                    color: "#3FFCFD"
                  },
                  label: {
                    show: true,
                    position: "end",
                    // formatter: `{b}:{c}`
                    formatter: function(a) {
                      return `${a.name}:${a.value}`;
                    }
                  }
                },
                {
                  name: "预警线",
                  yAxis: this.lineAlertValue,
                  lineStyle: {
                    color: "#F92E2A"
                  },
                  label: {
                    show: true,
                    position: "end",
                    formatter: `{b}:{c}`
                  }
                }
              ]
            }
          }
        ]
      };
      return option;
    },
    // 目前系统的时间
    currentDayDate() {
      return this.formatTime(this.currentDate);
    },
    propsConfig() {
      return {
        criticalValue1: this.criticalValue1,
        criticalValue2: this.criticalValue2,
        criticalValue3: this.criticalValue3,
        indexValue: this.indexValue,
        streetsData: this.streetsData,
        alertValue: this.lineAlertValue,
        alertJudge: this.alertJudge,
        explainJudge: this.explainJudge,
        indexRankingData: this.indexRankingData
      };
    }
  },
  created() {
    this.queryAllIndexValue().then(() => {
      this.queryTrendDataOfTimeSpan("ZS");
      this.loading = false;
    });
    this.getGridsAlert();
    this.queryDataSpan();
    EventBus.$on("showGridDetail", this.showIndexDetail);
  },
  mounted() {
    // 从柱状图跳转过来的处理
    if (this.$route.params.nextStreet) {
      this.$store.state.currentMenuId = 2;
      this.showIndexDetail(this.$route.params.nextStreet);
    }
  },
  methods: {
    // 格式化时间
    formatTime(time) {
      time = time.toString();
      time =
        time.slice(0, 4) +
        "年" +
        time.slice(4, 6) +
        "月" +
        time.slice(6, 8) +
        "日";
      return time;
    },
    // 时间滑动 提示tip
    format(val) {
      return (
        "当前时间: " +
        moment(this.beginDate)
          .add(val, "days")
          .format("YYYY-MM-DD")
      );
    },
    // 获取指标数据的时间范围
    async queryDataSpan() {
      const dataSpanConfig = `${this.baseUrl}/static/dataspan.json`;
      const result = await this.$http.get(dataSpanConfig);
      if (result && result.data) {
        this.beginDate = result.data.beginDate;
        this.endDate = result.data.endDate;
        const beginDate = moment(this.beginDate);
        const endDate = moment(this.endDate);
        this.dayCount = endDate.diff(beginDate, "days");
      }
    },
    // 通过时间滑块查询主页数据
    queryIndexValueByDate(value) {
      // 增加时间 天数
      const date = moment(this.endDate).add(value, "days");
      this.currentDate = date.format("YYYY-MM-DD").replace(/-/g, "");
      this.queryAllIndexValue();
      return value;
    },

    // 点击地图网格显示网格的指数数据
    showIndexDetail(msg) {
      this.currentGridId = msg.gridId;
      this.currentGridName = msg.gridName;
      if (this.currentFirstLevel === "") {
        this.currentFirstLevel = 0;
      } else {
        this.currentFirstLevel = this.currentFirstLevel;
      }
      this.queryAllIndexValue().then(() => {
        this.indicatorsShow = true;
        this.loading = false;
        this.showGridview = true;
        this.showOverview = false;
        this.queryTrendDataOfTimeSpan(this.currentIndexId);
        this.queryAlerts();
      });
    },
    // 获取指数  网格一 网格二  网格三
    getGridsAlert() {
      this.$http(`${this.baseUrl}/static/gridsAlerts.json`).then(result => {
        for (let grids of result.data) {
          grids[0] = "网格" + this.rn(1, 10);
          grids[1] = this.rn(0, 15);
        }
        if (result.data) this.gridsAlert = result.data;
      });
    },
    async queryAllIndexValue() {
      const gridId = this.currentGridId;
      // 指标体系
      const indexSystemUrl = `${this.baseUrl}/static/signsIndex.json`;
      const indexValueUrl = `${this.baseUrl}/static/indexvalue.json`;
      const indexAlertValueUrl = `${this.baseUrl}/static/indexAlertValue.json`;
      let indexes = await this.$http.get(indexSystemUrl);
      const indexValues = await this.$http.get(indexValueUrl);
      const indexAlertValue = await this.$http.get(indexAlertValueUrl);

      if (
        indexValues.status === 200 &&
        indexes.status === 200 &&
        indexAlertValue.status === 200
      ) {
        let oneDayIndex = [];
        this.indexValues = indexValues.data;
        this.indexAlertValue = indexAlertValue.data;
        const date = this.currentDate.replace(/-/g, "");
        indexValues.data.forEach(indexItem => {
          // 如果时间日期和当前日期一样
          if (indexItem.date.toString() === date) {
            oneDayIndex.push(indexItem);
          }
        });
        // 首页指标数据
        const allIndexes = indexes.data;
        allIndexes.push({ name: "全区", id: "ZS", children: [] });
        // 指标预警以及临界值
        const allIndexesAlertValue = indexAlertValue.data;
        oneDayIndex.forEach(item => {
          // 全区综合值 进入街道页面初始化
          if (item.indexId === "ZS") {
            this.allDistrictValue = item;
          }
          for (let index = 0; index < allIndexes.length; index++) {
            const firstLevelItem = allIndexes[index];
            if (firstLevelItem.id === item.indexId) {
              // 每天对应的值
              firstLevelItem.value = item[gridId];
              // 预警值以及临界值以及预警显示条件
              for (let i = 0; i < allIndexesAlertValue.length; i++) {
                if (firstLevelItem.id === allIndexesAlertValue[i].id) {
                  // 预警值
                  firstLevelItem.alertValue =
                    allIndexesAlertValue[i].alertValue;
                  firstLevelItem.alertJudge =
                    // 预警显示条件
                    allIndexesAlertValue[i].alertJudge;
                  // 临界值1
                  firstLevelItem.criticalValue1 =
                    allIndexesAlertValue[i].criticalValue1;
                  // 临界值2
                  firstLevelItem.criticalValue2 =
                    allIndexesAlertValue[i].criticalValue2;
                  // 临界值3
                  firstLevelItem.criticalValue3 =
                    allIndexesAlertValue[i].criticalValue3;
                  // 临界值判断条件
                  firstLevelItem.explainJudge =
                    allIndexesAlertValue[i].explainJudge;
                  // 最大值
                  firstLevelItem.maxValue = allIndexesAlertValue[i].maxValue;
                  // 最小值
                  firstLevelItem.minValue = allIndexesAlertValue[i].minValue;
                }
              }
              break;
            } else {
              if (item.indexId.indexOf(firstLevelItem.id) != -1) {
                for (
                  let secondIndex = 0;
                  secondIndex < firstLevelItem.children.length;
                  secondIndex++
                ) {
                  const secondLevelIndex = firstLevelItem.children[secondIndex];
                  if (secondLevelIndex.id === item.indexId) {
                    secondLevelIndex.value = item[gridId];

                    // 预警值以及临界值以及预警显示条件
                    for (let i = 0; i < allIndexesAlertValue.length; i++) {
                      if (secondLevelIndex.id === allIndexesAlertValue[i].id) {
                        // 预警值
                        secondLevelIndex.alertValue =
                          allIndexesAlertValue[i].alertValue;
                        secondLevelIndex.alertJudge =
                          // 预警显示条件
                          allIndexesAlertValue[i].alertJudge;
                        // 临界值1
                        secondLevelIndex.criticalValue1 =
                          allIndexesAlertValue[i].criticalValue1;
                        // 临界值2
                        secondLevelIndex.criticalValue2 =
                          allIndexesAlertValue[i].criticalValue2;
                        // 临界值3
                        secondLevelIndex.criticalValue3 =
                          allIndexesAlertValue[i].criticalValue3;
                        // 临界值判断条件
                        secondLevelIndex.explainJudge =
                          allIndexesAlertValue[i].explainJudge;
                        // 最大值
                        secondLevelIndex.maxValue =
                          allIndexesAlertValue[i].maxValue;
                        // 最小值
                        secondLevelIndex.minValue =
                          allIndexesAlertValue[i].minValue;
                      }
                    }
                    break;
                  } else {
                    for (
                      let thirdIndex = 0;
                      thirdIndex < secondLevelIndex.children.length;
                      thirdIndex++
                    ) {
                      const thirdLevelIndex =
                        secondLevelIndex.children[thirdIndex];
                      if (thirdLevelIndex.id === item.indexId) {
                        thirdLevelIndex.value = item[gridId];
                        for (let i = 0; i < allIndexesAlertValue.length; i++) {
                          if (
                            thirdLevelIndex.id === allIndexesAlertValue[i].id
                          ) {
                            // 预警值
                            thirdLevelIndex.alertValue =
                              allIndexesAlertValue[i].alertValue;
                            thirdLevelIndex.alertJudge =
                              // 预警显示条件
                              allIndexesAlertValue[i].alertJudge;
                            // 临界值1
                            thirdLevelIndex.criticalValue1 =
                              allIndexesAlertValue[i].criticalValue1;
                            // 临界值2
                            thirdLevelIndex.criticalValue2 =
                              allIndexesAlertValue[i].criticalValue2;
                            // 临界值3
                            thirdLevelIndex.criticalValue3 =
                              allIndexesAlertValue[i].criticalValue3;
                            // 临界值判断条件
                            thirdLevelIndex.explainJudge =
                              allIndexesAlertValue[i].explainJudge;
                            // 最大值
                            thirdLevelIndex.maxValue =
                              allIndexesAlertValue[i].maxValue;
                            // 最小值
                            thirdLevelIndex.minValue =
                              allIndexesAlertValue[i].minValue;
                          }
                        }
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        });
        // 第一层指数属性
        this.firstLevelIndex = allIndexes;
        this.isEchartsShow = true;
        // 第二层指数
        // eslint-disable-next-line
        this.secondLevelIndex = this.firstLevelIndex[
          this.currentFirstLevel === "" ? 0 : this.currentFirstLevel
        ].children;
      }
    },
    // echarts事件 根据时间的变化而数据变化
    showDayData(instance) {
      // 当前点击的时间
      let dayDate = instance.name;
      this.currentDate = dayDate;
      this.$store.state.barInfo = {};
      this.queryAllIndexValue();
      this.queryTrendDataOfTimeSpan(this.indexId);

      EventBus.$emit("clearLayerStyle");
    },
    // 获取指标综合评价
    queryJudge() {},
    // 获取指标综合排名
    queryOrder() {},
    // 获取指标综合预警
    queryAlerts() {},
    // 获取一年时间内的数据变化情况 获取折线图的x,y
    queryTrendDataOfTimeSpan(indexId) {
      const xData = [];
      const yData = [];
      this.indexId = indexId;
      this.indexValues.forEach(indexValueItem => {
        if (indexValueItem.indexId === indexId) {
          xData.push(indexValueItem.date);
          yData.push(indexValueItem[this.currentGridId]);
        }
        if (
          indexValueItem.indexId === indexId &&
          this.currentDate == indexValueItem.date
        ) {
          // 当天街道的数据
          this.streetsData = indexValueItem;
          // 字段显示的值
          this.indexValue = indexValueItem[this.currentGridId];
          let indexRanking = this.computeValue(indexValueItem);
          // this.indexRankingData = indexRanking.slice(0, 5);
          this.indexRankingData = indexRanking;
        }
      });
      const allIndexesAlertValue = this.indexAlertValue;
      for (let i = 0; i < allIndexesAlertValue.length; i++) {
        if (indexId === allIndexesAlertValue[i].id) {
          // 值
          // 临界值1
          this.criticalValue1 = allIndexesAlertValue[i].criticalValue1;
          // 临界值2
          this.criticalValue2 = allIndexesAlertValue[i].criticalValue2;
          // 临界值3
          this.criticalValue3 = allIndexesAlertValue[i].criticalValue3;
          this.explainJudge = allIndexesAlertValue[i].explainJudge;
          // 最大值
          this.maxValue = allIndexesAlertValue[i].maxValue;
          // 最小值
          this.minValue = allIndexesAlertValue[i].minValue;
        }
      }
      this.lineDataX = xData;
      this.lineDataY = yData;
      // 计算平均值
      let averageValue = Number(
        ((eval(this.lineDataY.join("+")) / this.lineDataY.length) * 100) / 100
      ).toFixed(2);
      this.averageValue = averageValue;
    },
    //返回指定范围随机数
    rn(min, max) {
      let n = parseInt(Math.random() * (max - min) + min);
      return n;
    },
    // 计算进入街道页面的街道排名
    computeValue(indexValueItem) {
      const streetName = [];
      const streetValue = [];
      const checkChinese = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
      for (let key in indexValueItem) {
        streetName.push(this.$store.state.streetNameCode[key]);
        streetValue.push(indexValueItem[key]);
      }
      let rankingData = streetName.map((key, index) => {
        return [key, streetValue[index]];
      });
      // 计算排名
      let mapped = rankingData.map(function(ar, i) {
        return { value: ar[1], index: i }; //输出一个object对象，value为排序的数字的值，index为数字所在的数组在一维数组中的索引值
      });
      mapped.sort(function(a, b) {
        return b.value - a.value;
      });
      // 将三个undefined转换为对应的字段
      let result = mapped.map(function(key) {
        if (typeof rankingData[key.index][0] == "undefined") {
          if (rankingData[key.index][1].toString().indexOf("ZS") != -1) {
            rankingData[key.index][0] = "indexId";
          } else if (
            rankingData[key.index][1].toString().indexOf(".") == -1 &&
            rankingData[key.index][1].length == 8
          ) {
            rankingData[key.index][0] = "date";
          } else {
            rankingData[key.index][0] = "1101010";
          }
        }
        return rankingData[key.index];
      });
      // 计算排名保留
      let indexRanking = [];
      result.map(key => {
        if (checkChinese.test(key[0])) {
          indexRanking.push(key);
        }
      });
      return indexRanking;
    }
  },
  watch: {
    // eslint-disable-next-line
    $route(to, from) {
      this.indicatorsShow = false;
      this.showOverview = true;
      this.showGridview = false;
      this.fristLevelIndex = "";
      this.currentFirstLevel = "";
      this.$store.state.barInfo = {};
      EventBus.$emit("clearLayerStyle");
      // 如果是街道页面
      // if (this.gridType === "street") {
      //   this.currentFirstLevel = 0;
      //   const defaultStreet = { gridId: 110101010, gridName: "和平里街道" };
      //   this.showIndexDetail(defaultStreet);
      // }
    },
    // 进入街道全区的所以数据显示
    allDistrictValue(val, oldVal) {
      if (this.gridType === "street") {
        if (val["indexId"] !== oldVal["indexId"]) {
          this.streetsData = this.allDistrictValue;
          this.indexValue = this.streetsData[1101010];
          let gridJudgeRanking = this.computeValue(this.allDistrictValue);
          // 计算平均值
          let streetData = [];
          streetData = gridJudgeRanking.map(item => {
            return item[1];
          });
          let averageValue = Number(
            ((eval(streetData.join("+")) / streetData.length) * 100) / 100
          ).toFixed(2);
          this.averageValue = averageValue;
          this.streetData = gridJudgeRanking;
          this.gridJudgeRankingData = gridJudgeRanking;
          this.maxValue = this.firstLevelIndex[4].maxValue;
          this.minValue = this.firstLevelIndex[4].minValue;
          this.lineAlertValue = this.firstLevelIndex[4].alertValue;
          this.alertJudge = this.firstLevelIndex[4].alertJudge;
          this.criticalValue1 = this.firstLevelIndex[4].criticalValue1;
          this.criticalValue2 = this.firstLevelIndex[4].criticalValue2;
          this.criticalValue3 = this.firstLevelIndex[4].criticalValue3;
          this.explainJudge = this.firstLevelIndex[4].explainJudge;
          this.indicatorsShow = true;
        }
      } else if (this.gridType === "community") {
        if (val["indexId"] !== oldVal["indexId"]) {
          console.log("社区");
        }
      } else if (this.gridType === "grid") {
        if (val["indexId"] !== oldVal["indexId"]) {
          console.log("基础网格");
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.basisGrid {
  width: 100%;
  height: calc(100vh - 3.6rem);
  padding-top: 0.1rem;
  .mapArcgis {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 11;
  }
  .floating-layer {
    width: 100%;
    height: 100%;
    position: relative;
    .currentDate {
      position: absolute;
      z-index: 1002;
      display: flex;
      align-content: center;
      font-size: 12px;
      font-weight: bolder;
      color: #000;
      font-weight: bold;
      justify-content: center;
      left: 15%;
      top: 2%;
      span {
        margin-left: 0.4rem;
      }
      .timer-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        // background: url("../assets/img/status/timer.png") no-repeat center;
        background-size: contain;
      }
    }
    .basis-content {
      width: 100%;
      height: 100%;

      .dateSelector {
        position: absolute;
        z-index: 22;
        width: 100%;
        // left: 0%;
        // bottom: 0rem;
        top: 1rem;
        z-index: 99;
        .selector {
          display: flex;
          width: 100%;
          line-height: 3rem;
          padding: 0 2rem;
          .beginDate {
            width: 10rem;
          }
          .endDate {
            width: 10rem;
            line-height: 3rem;
            margin-left: 1rem;
          }
          .slider {
            width: 100%;
          }
        }
      }
      &:after {
        content: "";
        display: block;
        clear: both;
      }
      .bc-left-right {
        overflow: auto;
        position: relative;
        height: 100%;
        width: 18rem;
        float: right;
        z-index: 100;
        background: rgba(71, 90, 109, 1);
        opacity: 0.8;
        .search {
          margin: 0.5rem 0.5rem;
        }
        .parameter {
          background: rgba(71, 90, 109, 0.75);
          margin: 0rem 0.3rem;
          margin-top: 0.5rem;
          // overflow-y: scroll;
          // overflow-x: scroll;
          overflow: auto;
          .index {
            width: 100%;
            margin-bottom: 1rem;
            .index-top {
              height: 2rem;
              line-height: 2rem;
              vertical-align: middle;
              background: #3a404e;
              .left {
                padding-left: 0.5rem;
              }
              .right {
                float: right;
                margin-right: 1rem;
              }
            }
            .index-content {
              font-size: 14px;
              padding: 1rem;
              background: #242c3b;
              span {
                font-size: 16px;
                font-weight: 600;
                color: #ffc000;
                margin: 0 0.2rem;
              }
            }
          }
        }
      }
      .bc-left-left {
        overflow: auto;
        position: relative;
        height: 100%;
        width: 18rem;
        float: left;
        z-index: 100;
        background: rgba(71, 90, 109, 1);
        opacity: 0.8;
        .indicators-list {
          height: 100%;
          width: 18rem;
          background: rgba(16, 41, 67, 0.9);
          float: left;
          opacity: 0.9;
          overflow: scroll;
          -webkit-overflow-scrolling: touch;
          .index-title {
            height: 3rem;
            width: 100%;
            cursor: pointer;
            display: flex;
            font-size: 14px;
            justify-content: center;
            align-items: center;
          }
          .index-content {
            width: 100%;
            padding-bottom: 0.5rem;
            margin: 0.5rem 0;
            // padding-right: 10rem;
            // margin: 0 0.5rem 0.5rem;
            // background: rgba(16, 41, 67, 1);
            .isEqBackground {
              background: #102943 !important;
            }
            .content {
              padding: 0.3rem 0.5rem;
              background: rgba(62, 83, 101, 0.9);
              border-radius: 5px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              &:after {
                content: "";
                display: block;
                clear: both;
                visibility: hidden;
              }

              .content-left {
                flex-grow: 1;
                display: flex;
                align-items: center;
                // justify-content: space-between;
                justify-items: center;
                cursor: pointer;
                .ranking-number {
                  width: 18px;
                  height: 18px;
                  background: rgba(124, 181, 225, 1);
                  border-radius: 5px;
                  text-align: center;
                  line-height: 18px;
                }
                .trends {
                  margin-left: 0.5rem;
                  color: #ffc000;
                }
                .name {
                  text-align: center;
                  vertical-align: middle;
                  font-weight: bold;
                  margin-left: 0.5rem;
                }
              }
              .content-right {
                // flex-grow: 1;
                // font-size: 16px;
                color: #ffff;
                text-align: right;
                margin-right: 0.5rem;
                // margin-top: -0.3rem;
              }
            }
            .isSelectedSecond {
              box-shadow: 0px 0px 5px 2px #236ca6;
            }
            .system {
              width: 90%;
              margin: 0.5rem 0.5rem;
              padding: 0.3rem 0.5rem;
              background-color: rgba(62, 83, 101, 0.3);
              &:after {
                content: "";
                display: block;
                clear: both;
              }
              .content-left {
                cursor: pointer;
                float: left;
                margin-right: 0.2rem;
              }
              .content-right {
                float: right;
                margin-right: 0.5rem;
              }
            }
          }
        }
      }
    }
  }
  .broken-line {
    height: 10rem;
    width: calc(100vw - 36rem);
    position: absolute;
    left: 50%;
    bottom: 12%;
    -webkit-transform: translate(-50%, 0%);
    -moz-transform: translate(-50%, 0%);
    transform: translate(-50%, 0%);
    float: left;
    z-index: 90;
    .isSelected {
      color: #28a8e0;
    }
    .line-title {
      height: 2rem;
      line-height: 2rem;
      vertical-align: middle;
      margin-bottom: 1rem;
      background: rgba(16, 41, 67, 0.8);
      border: 1px solid rgba(147, 147, 147, 0.8);
      border-radius: 8px 8px 0px 0px;
      margin: 0 0.5rem;
      .title-left {
        cursor: pointer;
        margin-left: 1rem;
        font-size: 1rem;
      }
      .title-nowtime {
        margin-left: 2rem;
      }
      .title-right {
        float: right;
        margin-right: 1rem;
      }
    }
    .line-echarts {
      height: 14rem;
      margin: 0 0.5rem;
      background: rgba(16, 41, 67, 0.8);
      border: 1px solid rgba(147, 147, 147, 0.8);
      border-top: none;
    }
  }
}
</style>
<style lang="scss">
.basisGrid {
  .ivu-input {
    background: rgba(16, 41, 67, 0.75);
    border: 1px solid rgba(147, 147, 147, 0.75);
  }
  .slider {
    .ivu-slider {
      .ivu-slider-wrap {
        width: 100%;
        height: 4px;
        margin: 16px 0;
        background-color: #e2f0ff;
        border-radius: 3px;
        vertical-align: middle;
        position: relative;
        cursor: pointer;
      }
      // 拖动覆盖进度条
      .ivu-slider-bar {
        height: 4px;
        background: linear-gradient(to right, #82ace8, #55c0ee);
        border-radius: 3px;
        position: absolute;
      }
      // 拖动按钮
      .ivu-slider-button-wrap {
        width: 18px;
        height: 18px;
        text-align: center;
        background-color: transparent;
        position: absolute;
        top: -5px;
        transform: translateX(-50%);
        .ivu-slider-button {
          width: 12px;
          height: 12px;
          border: 4px solid #83ade9;
          border-radius: 50%;
          background-color: #fff;
          transition: all 0.2s linear;
          outline: 0;
        }
      }
    }
  }
}
</style>
