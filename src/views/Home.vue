<template>
  <div class="home">
    <!-- 浮动层 -->
    <!-- 浮动层 -->
    <div class="floating-layer">
      <!-- 中间内容 -->
      <!-- 指标总览 -->
      <div class="evaluation-nav">
        <span class="nav">指标总览</span>
        <p>
          <span class="color-good">健康</span>
        </p>
        <p>
          <span class="color-notgood">良好</span>
        </p>
        <p>
          <span class="color-general">一般</span>
        </p>
        <p>
          <span class="color-risk">可能存在风险</span>
        </p>
        <p>
          <span class="color-alert">预警</span>
        </p>
      </div>
      <div class="assess">
        <div class="assess-content">
          <div class="a-left">
            <ExponentialModule
              ref="leftExponentail"
              :listData="listLeftData"
              :state="0"
              :oneDaySpanMax="oneDaySpanMax"
              @showMapModal="handleMapModal"
              @showBarStreet="showBarStreet"
              @linkage="linkage"
            ></ExponentialModule>
          </div>
          <div class="a-center">
            <div class="time">
              <!-- <span class="timer-icon"></span> -->
              <span>{{currentDayDate}}</span>
            </div>
            <!-- 圆环组件 -->
            <CircleRing
              :percent="percentValue"
              :prevPercentValue="prevPercentValue"
              :allDistrictAlert="allDistrictAlert"
              :allDistrictExpain="allDistrictExpain"
              :explainIsShow="explainIsShow"
            ></CircleRing>
            <div class="number">
              <div
                class="number-text"
                @mouseover="explainIsShow=true"
                @click="linkage(allDistrictData,allDistrictAlert.alertValue,allDistrictAlert.explainJudge,allDistrictAlert.alertJudge);showActiveFrist();showBarStreet('ZS')"
              >网格运行指数</div>
            </div>
          </div>
          <div class="a-right">
            <ExponentialModule
              ref="rightExponentail"
              :listData="listRightData"
              :state="1"
              :oneDaySpanMax="oneDaySpanMax"
              @showMapModal="handleMapModal"
              @showBarStreet="showBarStreet"
              @linkage="linkage"
            ></ExponentialModule>
          </div>
        </div>
      </div>
      <!-- 折线图 -->
      <div class="broken-line">
        <div class="line-title">
          <span
            class="title-left"
            :class="{isSelected:isShowChart}"
            @click="isShowChart = true"
          >{{clickedTabItem}}综合排名</span>&nbsp;
          <span
            class="title-left"
            :class="{isSelected:!isShowChart}"
            @click="isShowChart = false"
          >全区综合评价值</span>
          <span class="title-right arrow-yellow-up">{{this.$store.state.indicatorIndex}}级指标</span>
        </div>
        <div class="line-echarts" v-show="isShowChart">
          <IEcharts :option="bar" :resizable="true" :notMerge="true" @click="showStreetPage"></IEcharts>
        </div>
        <div class="line-echarts" v-show="!isShowChart">
          <IEcharts :option="line" :resizable="true" :notMerge="true" @click="showDayData"></IEcharts>
        </div>
      </div>
    </div>
    <!-- 地图数据渲染层 -->
    <div class="map-modal" v-if="isShowMapModal">
      <Icon
        class="close-icon"
        type="md-close-circle"
        size="20"
        @click="handleMapModal({status:false, data:{}})"
      />
      <div class="map-container">
        <div class="container-header">
          <div
            class="tab-item"
            v-for="(tabItem, index) in mapTabList"
            :key="index"
            :class="{'tab-active':clickedTabItem === tabItem}"
            @click="handleMapTab(tabItem)"
          >{{tabItem}}</div>
        </div>
        <div class="container-main">
          <bottomMap
            ref="mapNode"
            :gridType="gridType"
            :gridsAlert="gridsAlert"
            :propsConfig="propsConfig"
          ></bottomMap>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headerNavigation from "@/components/headerNavigation.vue";
import IEcharts from "vue-echarts-v3";
import ExponentialModule from "@/components/exponentialModule.vue";
import CircleRing from "@/components/circleRing.vue";
import bottomMap from "@/components/bottomMap.vue";
import Portal from "@/components/Portal.vue";

// eslint-disable-next-line
import EventBus from "../utils/EventBus";

export default {
  name: "Home",
  components: {
    IEcharts,
    ExponentialModule,
    CircleRing,
    bottomMap,
    headerNavigation,
    Portal
  },
  data() {
    return {
      explainIsShow: true, // 是否显示全区指标说明按钮
      nowIndexId: "", //当前点击的id,用于柱状图事件切换数据
      baseUrl: process.env.BASE_URL,
      listLeftData: "",
      listRightData: "",
      timeData: [["2018-1-1", 0], ["2018-12-31", 350], 1], // 时间数据数组,三级联动和折线图
      allDistrictData: "", // 全区的所有时间指标数据
      allDistrictAlertValue: "", // 全区的预警值
      alertValue: 0.1, // 预警线的值
      dateList: "", // echartsX坐标的时间
      oneDaySpan: 0, // 时间对应的下标
      allEvluations: [
        // 所有指标数据,初始化
        {}
      ],
      prevPercentValue: "",
      oneDaySpanMax: 364, // 时间数组的长度
      isShowMapModal: false, // 是否显示地图渲染层
      mapTabList: ["街道", "社区", "基础网格"],
      clickedTabItem: "街道", // 当前被点击的tabItem,
      gridType: "street",
      gridsAlert: [], // 网格的数据,名称和值
      totalValueByDate: [], // 所有属性按时间分类的街道数据
      indexValueByDate: [], // 筛选后的属性按时间分类的指定时间的街道数据
      streetsGeoJson: {}, // 街道的geojson
      streetsData: {}, // 传递给地图的geojson
      indexAlertData: [], // 每个属性的专属值
      // 属性的临界值
      criticalValue1: "", // 临界值1
      criticalValue2: "", // 临界值2
      criticalValue3: "", // 临界值3
      explainJudge: "", // 临界值判断条件
      allDistrictAlert: {}, // 全区对应的预警值
      allDistrictExpain: {}, // 全区对应的说明
      isShowChart: true,
      streetRanking: [], //全区指数对应的街道排名
      alertJudge: "",
      MapModalParams: ""
    };
  },
  created() {
    // this.queryStreetsData();
    this.queryAllIndexAlertData();
    this.queryAllIndexValue().then(() => {
      this.queryAllIndexValueByDate();
    });
  },
  computed: {
    // 折线图
    line() {
      let color = "";
      if (this.explainJudge === "forward") {
        color = "#04ff92 ";
      } else {
        color = "#efdb02";
      }
      let pieces = [{ gt: 0, lt: 1 }];
      if (this.alertJudge === "low") {
        pieces = [{ gte: 0, lt: Number(this.alertValue), color: "red" }];
      } else if (this.alertJudge === "high") {
        pieces = [{ gte: Number(this.alertValue), lt: 100, color: "red" }];
      } else {
        pieces = [{ gt: 0, lt: 1 }];
      }
      let data = this.timeData;
      let dateList = data.map(function(item) {
        return item[0];
      });
      /* eslint-disable */
      this.dateList = dateList;
      let valueList = data.map(function(item) {
        return item[1];
      });
      let option = {
        // Make gradient line here
        visualMap: {
          show: false,
          pieces: pieces,
          outOfRange: {
            color: color
          }
        },

        title: [
          {
            top: "55%",
            left: "center",
            text: ""
          }
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          formatter: function(params) {
            const date = params[0].axisValue;
            const color = params[0].color;
            const data = params[0].data;
            const year = date.slice(0, 4);
            const month = date.slice(4, 6);
            const day = date.slice(6, 8);
            return `${year}年${month}月${day}日</br><span style="background:${color};border-radius:50%;width:10px;height:10px;display:inline-block"></span>&nbsp;${data}
          `;
          }
        },
        xAxis: [
          {
            type: "category",
            data: dateList,
            gridIndex: 1,
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff"
              }
            }
          }
        ],
        yAxis: [
          {
            splitLine: { show: false },
            gridIndex: 1,
            scale: true,
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff"
              }
            }
          }
        ],
        toolbox: {
          show: true,
          feature: {
            magicType: { type: ["line", "bar"] }
          },
          right: "3%"
        },
        grid: [
          {
            bottom: "10%",
            top: "1%",
            // right: "25%",
            containLabel: true
          },
          {
            x: "5%",
            y: "5%",
            x2: "7%",
            y2: "10%"
          },
          {
            height: "100%"
          }
        ],
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
            data: valueList,
            itemStyle: {
              normal: {
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
              precision: 2,
              silent: true,
              itemStyle: {
                normal: {}
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
                    formatter: `{b}:{c}`
                  }
                },
                {
                  name: "预警线",
                  yAxis: this.alertValue,
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
    // 全街道柱状图
    bar() {
      const data = this.streetRanking;
      let dataX = data.map(item => {
        return item[0];
      });
      let dataY = data.map(item => {
        return item[1];
      });
      let endPercent = 100;
      if (this.gridType === "street") {
        endPercent = 100;
      } else {
        endPercent = (30 / dataX.length) * 100;
      }
      let option = {
        // visualMap: [
        //   {
        //     show: false,
        //     type: "continuous",
        //     seriesIndex: 0,
        //     dimension: 0,
        //     min: 0,
        //     max: 10
        //   }
        // ],
        color: "#78B1DD",
        tooltip: {
          trigger: "axis"
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { type: ["line", "bar"] },
            onClick: function() {
              console.log(111);
            }
          },
          right: "3%"
        },
        dataZoom: [
          //给x轴设置滚动条
          {
            start: 0, //默认为0
            end: endPercent,
            type: "slider",
            show: false,
            handleSize: 0, //滑动条的 左右2个滑动条的大小
            backgroundColor: "#ddd", //两边未选中的滑动条区域的颜色
            showDataShadow: false, //是否显示数据阴影 默认auto
            showDetail: false //即拖拽时候是否显示详细数值信息 默认true
          },
          //下面这个属性是里面拖到
          {
            type: "inside",
            show: false,
            start: 0, //默认为1
            end: 100
          }
        ],
        grid: [
          {
            bottom: "10%",
            top: "10%",
            left: "4%",
            right: "2%"
          }
        ],
        xAxis: [
          {
            type: "category",
            triggerEvent: true,
            data: dataX,
            axisLine: {
              color: "#fff"
            },

            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff"
              },
              interval: 0
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            splitLine: { show: false },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff"
              }
            }
          }
        ],
        series: [
          {
            name: "街道",
            type: "bar",
            data: dataY
          }
        ]
      };
      return option;
    },
    // 圆环中心的值
    percentValue() {
      // 保证异步拿到数据后再渲染
      if (this.allEvluations.length > 1) {
        if (this.oneDaySpanMax >= 1) {
          this.prevPercentValue = this.allEvluations[0].timeData[
            this.oneDaySpanMax - 1
          ].value.toFixed(2);
        } else {
          this.prevPercentValue = 1;
        }
        return this.allEvluations[0].timeData[this.oneDaySpanMax].value.toFixed(
          2
        );
      }
    },
    // 目前系统的时间
    currentDayDate() {
      if (this.allEvluations.length > 1) {
        return this.formatTime(
          this.allEvluations[0].timeData[this.oneDaySpanMax].date
        );
      }
    },
    propsConfig() {
      return {
        criticalValue1: this.criticalValue1,
        criticalValue2: this.criticalValue2,
        criticalValue3: this.criticalValue3,
        alertValue: this.alertValue,
        alertJudge: this.alertJudge,
        explainJudge: this.explainJudge,
        indexValue: "",
        streetsData: this.indexValueByDate
      };
    }
  },
  mounted() {
    this.getGridsAlert();
  },
  methods: {
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
    // 获取街道的geojson
    // async queryStreetsData() {
    //   const streetsGeoUrl = `${this.baseUrl}/static/streets.json`;
    //   const res = await this.$http.get(streetsGeoUrl);
    //   this.streetsGeoJson = res.data;
    // },
    // 获取所有属性的专属特性-临界值
    async queryAllIndexAlertData() {
      const indexAlertDataUrl = `${this.baseUrl}/static/indexAlertValue.json`;
      const res = await this.$http.get(indexAlertDataUrl);
      this.indexAlertData = res.data;
    },
    // 获取所有指标对应每天的所有街道的数据
    async queryAllIndexValueByDate() {
      let indexValueUrl = "";
      if (this.gridType === "street") {
        indexValueUrl = `${this.baseUrl}/static/indexvalue.json`;
      } else if (this.gridType === "community") {
        indexValueUrl = `${this.baseUrl}/static/communityValue.json`;
      } else if (this.gridType === "grid") {
        indexValueUrl = `${this.baseUrl}/static/communityValue.json`;
      }
      const res = await this.$http.get(indexValueUrl);
      this.totalValueByDate = res.data;
      // 进入全区的初次街道排名
      const currentDate = this.allEvluations[0].timeData[this.oneDaySpanMax]
        .date;
      let streetDataByDate = this.totalValueByDate
        .filter(item => Number(item.date) === currentDate)
        .filter(item => item.indexId === "ZS")[0];
      // 计算街道排名
      this.streetRanking = this.computeValue(streetDataByDate);
    },
    async queryAllIndexValue() {
      const indexSystemUrl = `${this.baseUrl}/static/signsIndex.json`;
      // 全区指标值
      const indexEvaluation = `${this.baseUrl}/static/indexEvaluation.json`;
      // 全区预警判断条件以及临界值
      const districtAlertUrl = `${this.baseUrl}/static/districtAlertValue.json`;
      // 全区评价说明解释
      const districtExplainUrl = `${this.baseUrl}/static/districtExplain.json`;
      let indexes = await this.$http.get(indexSystemUrl);
      let evaluationData = await this.$http.get(indexEvaluation);
      let districtAlertData = await this.$http.get(districtAlertUrl);
      let districtExplainData = await this.$http.get(districtExplainUrl);
      const allIndexes = indexes.data;
      const allEvluations = evaluationData.data;
      const allIndexesAlertValue = districtAlertData.data;
      const districtExplainValue = districtExplainData.data;

      if (indexes.status === 200 && evaluationData.status === 200) {
        this.listLeftData = allIndexes.slice(0, 2).reverse();
        this.listRightData = allIndexes.slice(-2);
        // FIXME: 需要优化的地方 对系统时间的处理和全区最后一个值得处理
        // 全区圆环所需要的数据
        this.allDistrictData = allEvluations[0].timeData;
        this.allDistrictAlert = allIndexesAlertValue.filter(
          item => item.id === "ZS"
        )[0];
        this.allDistrictExpain = districtExplainValue.filter(
          item => item.id === "ZS"
        )[0];
        // 进入系统后折线图显示全区的值
        this.linkage(
          allEvluations[0].timeData,
          this.allDistrictAlert.alertValue,
          this.allDistrictAlert.explainJudge,
          this.allDistrictAlert.alertJudge
        );
        // 显示全区的街道排名
        // 将每个指标对应的值放到对应的指标

        allEvluations.forEach(item => {
          for (let index = 0; index < allIndexes.length; index++) {
            const firstLevelItem = allIndexes[index];
            if (firstLevelItem.id === item.id) {
              firstLevelItem.time = item.timeData;
              // firstLevelItem.alertValue = item.alertValue;
              // 添加判断是低于还是高于显示预警的判断
              // if (firstLevelItem.id == "ZS2" || firstLevelItem.id == "ZS3") {
              //   firstLevelItem.alertJudge = "low";
              // } else {
              //   firstLevelItem.alertJudge = "high";
              // }
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
                // 评价说明
                if (firstLevelItem.id === districtExplainValue[i].id) {
                  firstLevelItem.meaning = districtExplainValue[i].meaning;
                  firstLevelItem.mode = districtExplainValue[i].mode;
                }
              }
              break;
            } else {
              if (item.id.indexOf(firstLevelItem.id) != -1) {
                for (
                  let secondIndex = 0;
                  secondIndex < firstLevelItem.children.length;
                  secondIndex++
                ) {
                  const secondLevelIndex = firstLevelItem.children[secondIndex];
                  if (secondLevelIndex.id === item.id) {
                    secondLevelIndex.time = item.timeData;
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
                      if (secondLevelIndex.id === districtExplainValue[i].id) {
                        secondLevelIndex.meaning =
                          districtExplainValue[i].meaning;
                        secondLevelIndex.mode = districtExplainValue[i].mode;
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
                      if (thirdLevelIndex.id === item.id) {
                        thirdLevelIndex.time = item.timeData;
                        thirdLevelIndex.value = item.timeData[0].value;
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
                          if (
                            thirdLevelIndex.id === districtExplainValue[i].id
                          ) {
                            thirdLevelIndex.meaning =
                              districtExplainValue[i].meaning;
                            thirdLevelIndex.mode = districtExplainValue[i].mode;
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
        this.allEvluations = allEvluations;
      } else {
        this.$Message.error("数据请求失败");
      }
    },

    // echarts 根据时间的变化而数据变化
    showDayData(event) {
      // 当前点击的时间
      let dayDate = event.name;
      for (let i = 0; i < this.dateList.length; i++) {
        if (dayDate === this.dateList[i].toString()) {
          this.oneDaySpanMax = i;
        }
      }
    },
    // echarts 柱状图点击事件
    showStreetPage(instance) {
      let nextStreet = {};
      let nextStreetName = instance.name || instance.value;
      let nextStreetData = instance.data;
      for (let key in this.$store.state.allStreetNameCode) {
        if (nextStreetName === this.$store.state.allStreetNameCode[key]) {
          nextStreet.gridId = key;
          nextStreet.gridName = nextStreetName;
        }
      }
      if (this.gridType === "street") {
        this.$router.push({
          name: "BasicGrid",
          params: { gridType: "street", nextStreet }
        });
      } else if (this.gridType === "community") {
        this.$router.push({
          name: "BasicGrid",
          params: { gridType: "community", nextStreet }
        });
      } else if (this.gridType === "grid") {
        this.$router.push({
          name: "BasicGrid",
          params: { gridType: "grid", nextStreet }
        });
      }
    },
    // 是否显示地图modal
    handleMapModal(params) {
      this.MapModalParams = params;
      this.isShowMapModal = params.status;
      // this.gridType = "street";
      // this.clickedTabItem = "街道";
      if (params.status) {
        const currentDate = this.allEvluations[0].timeData[this.oneDaySpanMax]
          .date;
        const indexId = params.data.id;
        this.indexValueByDate = this.totalValueByDate
          .filter(item => Number(item.date) === currentDate)
          .filter(item => item.indexId === indexId)[0];
        // this.streetsGeoJson.features.forEach((geoItem, index) => {
        //   geoItem.properties.gridValue = mapData[geoItem.properties.jdcode];
        // });
        // 获取当前属性的临界值
        const indexAlertValue = this.indexAlertData.filter(
          item => item.id === indexId
        )[0];
        this.criticalValue1 = indexAlertValue.criticalValue1;
        this.criticalValue2 = indexAlertValue.criticalValue2;
        this.criticalValue3 = indexAlertValue.criticalValue3;
        this.alertValue = indexAlertValue.alertValue;
        this.alertJudge = indexAlertValue.alertJudge;
        this.explainJudge = indexAlertValue.explainJudge;
      }
    },
    // 显示折线图
    linkage(timeData, alertValue, explainJudge, alertJudge) {
      this.alertValue = alertValue;
      this.explainJudge = explainJudge;
      this.alertJudge = alertJudge;
      const timeArr = []; // 时间数组
      const timeValue = []; // 每个时间对应的数据
      timeData.map(function(item) {
        timeArr.push(item.date);
        timeValue.push(item.value);
      });
      // 转换为二维数组
      this.timeData = timeArr.map((key, value) => [key, timeValue[value]]);
    },
    // 显示柱状图
    showBarStreet(indexId) {
      this.nowIndexId = indexId;
      // 根据事件和id获取对应的街道的值
      const currentDate = this.allEvluations[0].timeData[this.oneDaySpanMax]
        .date;
      let streetDataByDate = this.totalValueByDate
        .filter(item => Number(item.date) === currentDate)
        .filter(item => item.indexId === indexId)[0];
      // 计算街道排名
      this.streetRanking = this.computeValue(streetDataByDate);
    },
    // 计算排名
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
    },
    // 显示一级指标高亮
    showActiveFrist() {
      this.$store.state.indicatorIndex = "一";
      // 清空当前界面上的高亮效果
      this.$store.state.leftExponentail.currentFirstLevel = "";
      this.$store.state.leftExponentail.currentSecondLevel = "";
      this.$store.state.leftExponentail.currenThridLevel = "";
      this.$store.state.rightExponentail.currentFirstLevel = "";
      this.$store.state.rightExponentail.currentSecondLevel = "";
      this.$store.state.rightExponentail.currenThridLevel = "";
    },
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
    //返回指定范围随机数
    rn(min, max) {
      var n = parseInt(Math.random() * (max - min) + min);
      return n;
    },
    handleMapTab(item) {
      this.clickedTabItem = item;
      switch (item) {
        case "街道":
          this.gridType = "street";
          break;
        case "社区":
          this.gridType = "community";
          break;
        case "基础网格":
          this.gridType = "grid";
          break;
        default:
      }
    }
  },
  mounted() {
    // 将组件保存到vuex中
    this.$store.state.leftExponentail = this.$refs.leftExponentail;
    this.$store.state.rightExponentail = this.$refs.rightExponentail;
  },
  watch: {
    oneDaySpanMax() {
      this.showBarStreet(this.nowIndexId);
    },
    gridType() {
      this.queryAllIndexValueByDate().then(() => {
        this.handleMapModal(this.MapModalParams);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
// 深度作用选择器,将父组件的样式渗透到子组件
#{"/deep/"} .trend_arrow {
  width: 10px;
  height: 10px;
  display: inline-block !important;
  background-size: contain;
  // transform: translateX(0.6rem);
}
#{"/deep/"} .trend_arrow_red {
  background: url("../assets/img/status/downred.svg") no-repeat center;
}
#{"/deep/"} .trend_arrow_blue {
  background: url("../assets/img/status/upblue.svg") no-repeat center;
}
#{"/deep/"} .trend_arrow_yellow {
  background: url("../assets/img/status/yellow.svg") no-repeat center;
}
.swiper-slide {
  height: 100vh;
  font-size: 18px;
  color: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: transparent !important;
  justify-content: space-around !important;
  background-size: 100% 100%;
  z-index: 100;
}
.arrow-yellow-up:after {
  content: "";
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 12px solid #ffff02;
  display: inline-block;
  transform: translateX(0.5rem);
}
.home {
  background: #384457 url("../assets/img/status/background.png") no-repeat;
  // background: #012134;
  background-size: 100% 100%;
  width: 100%;
  height: calc(100vh - 3.6rem);
  overflow: hidden;
  position: relative;
  .map-modal {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 23;
    background: rgba(0, 0, 0, 0.8);
    padding: 5rem;
    .close-icon {
      position: absolute;
      right: 1rem;
      top: 1rem;
      cursor: pointer;
    }
    .close-icon:hover {
      color: #3dc5c4;
    }
    .map-container {
      width: 100%;
      height: 100%;
      .container-header {
        width: 100%;
        height: 3rem;
        background: #012134;
        display: flex;
        justify-content: center;
        align-items: center;
        .tab-item {
          height: 2.2rem;
          line-height: 2.2rem;
          font-size: 14px;
          font-weight: 800;
          padding: 0 1.5rem;
          margin-right: 1rem;
          border-radius: 0.3rem;
          cursor: pointer;
        }
        .tab-active {
          background: #143b6b;
        }
      }
      .container-main {
        width: 100%;
        height: calc(100% - 3rem);
        background: RGBA(1, 28, 40, 0.8);
      }
    }
  }
  .floating-layer {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 22;
    .evaluation-nav {
      width: 40%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-around;
      justify-items: center;
      margin: 1rem;
      margin-bottom: 0;
      span {
        display: inline-block;
        text-align: center;
      }
      .nav {
        width: 79px;
        height: 20px;
        font-size: 16px;
        font-family: PingFang-SC-Bold;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
      }
      .color-good {
        width: 80px;
        height: 24px;
        line-height: 24px;
        background: #2a7804;
        border-radius: 12px;
      }
      .color-notgood {
        width: 80px;
        height: 24px;
        line-height: 24px;
        background: #047878;
        border-radius: 12px;
      }
      .color-general {
        width: 80px;
        height: 24px;
        line-height: 24px;
        background: #f7d307;
        border-radius: 12px;
      }
      .color-risk {
        width: 80px;
        height: 24px;
        line-height: 24px;
        background: #f7a307;
        border-radius: 12px;
      }
      .color-alert {
        width: 80px;
        height: 24px;
        line-height: 24px;
        background: #f71b07;
        border-radius: 12px;
      }
    }
    .assess {
      height: 30rem;
      width: 100%;
      overflow-x: hidden;
      overflow-y: scroll;
      .assess-content {
        margin: 1rem 3rem;
        display: flex;
        justify-content: space-between;
        justify-items: center;
        .a-left,
        .a-right {
          flex: 2.5;
        }
        .a-center {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: start;
          align-items: center;
          margin-top: 2.5rem;
          .time {
            text-align: center;
            display: flex;
            font-size: 8px;
            font-weight: bolder;
            color: #fff;
            position: absolute;
            bottom: 30%;
            span {
              margin-left: 0.4rem;
              font-size: 5px;
            }
            .timer-icon {
              display: inline-block;
              width: 20px;
              height: 20px;
              background: url("../assets/img/status/timer.png") no-repeat center;
              background-size: contain;
            }
          }
          .number {
            position: absolute;
            bottom: 10%;
            width: 40%;
            height: 2.5rem;
            background: #7cb5e1;
            border-radius: 5px;
            line-height: 2.5rem;
            vertical-align: middle;
            text-align: center;
            margin: 2rem auto;
            .number-text {
              font-weight: bold;
              cursor: pointer;
            }
          }
        }
      }
    }
    .broken-line {
      margin-top: -0.5rem;
      height: calc(100vh - 41.6rem);
      .isSelected {
        color: #28a8e0;
      }
      .line-title {
        height: 1.8rem;
        line-height: 1.8rem;
        vertical-align: middle;
        margin-bottom: 0.5rem;
        background: rgba(16, 41, 67, 0.75);
        border: 1px solid rgba(147, 147, 147, 0.75);
        border-radius: 8px 8px 0px 0px;
        cursor: pointer;
        margin: 0 3rem;
        .close-icon {
          cursor: pointer;
        }
        .close-icon:hover {
          color: #3dc5c4;
        }
        .title-left {
          margin-left: 1rem;
          font-size: 14px;
          &:hover {
            color: #28a8e0;
          }
        }
        .title-right {
          float: right;
          margin-right: 1rem;
          font-size: 14px;
        }
      }
      .line-echarts {
        height: calc(100vh - 38.2rem);
        margin: 0 3rem;
        background: rgba(16, 41, 67, 0.6);
        border: 1px solid rgba(147, 147, 147, 0.75);
        border-top: none;
      }
    }
  }
}
</style>
