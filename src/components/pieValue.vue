<template>
  <div class="shapeEcharts">
    <div class="index">
      <div class="index-top">
        <span class="left">{{rankingTitle}}</span>
        <span class="right">+</span>
      </div>
      <div class="index-content">
        <IEcharts ref="echarts" :option="pie" :loading="loading" :resizable="true" @click="showMap"></IEcharts>
      </div>
    </div>
  </div>
</template>

<script>
import IEcharts from "vue-echarts-v3";
import EventBus from "../utils/EventBus.js";

export default {
  name: "indexRanking",
  data() {
    return {
      alertValue: "",
      alertJudge: "",
      criticalValue1: "",
      criticalValue2: "",
      criticalValue3: "",
      explainJudge: "",
      indexValue: "",
      goodColor: "#2a7804",
      notGoodColor: "#047878",
      generalColor: "#f7d307",
      riskColor: "#f7a307",
      indexRankingData: []
    };
  },
  components: {
    IEcharts
  },
  props: {
    propsConfig: {
      type: Object
    },
    date: {
      type: String
    },
    loading: {
      type: Boolean
    }
  },
  watch: {
    propsConfig() {
      this.alertValue = this.propsConfig.alertValue;
      this.alertJudge = this.propsConfig.alertJudge;
      this.criticalValue1 = this.propsConfig.criticalValue1;
      this.criticalValue2 = this.propsConfig.criticalValue2;
      this.criticalValue3 = this.propsConfig.criticalValue3;
      this.explainJudge = this.propsConfig.explainJudge;
      this.indexValue = this.propsConfig.indexValue;
      this.indexRankingData = this.propsConfig.indexRankingData;
    }
  },
  beforeMount() {
    EventBus.$on("showMapByshape", this.showMap);
  },
  methods: {
    showMap(instance) {
      this.$store.state.barInfo = {
        barName: instance.name,
        barColor: instance.color,
        barData: instance.data
      };
      EventBus.$emit("clearLayerStyle");
    }
  },
  computed: {
    rankingTitle() {
      return `网格等级评价`;
    },
    // 饼图
    pie() {
      let lengdData = [];
      let data = [];
      let _this = this;
      if (this.indexRankingData.length > 0) {
        data = this.indexRankingData.map(item => {
          lengdData.push(item[0]);
          return { value: item[1], name: item[0] };
        });
      }
      let option = {
        // title: {
        //   text: "南丁格尔玫瑰图",
        //   subtext: "纯属虚构",
        //   x: "center"
        // },
        tooltip: {
          trigger: "item",
          position: function(pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = { top: 60 };
            obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
            return obj;
          },
          formatter: "{b}<br/>{c} ({d}%)",
          textStyle: {},
          confine: true,
          enterable: false //鼠标是否可以移动到tooltip区域内
        },
        legend: {
          show: false,
          x: "center",
          y: "bottom",
          data: lengdData
        },
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ["pie", "funnel"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: [
          {
            name: "",
            type: "pie",
            radius: "100%",
            // center: ["25%", "50%"],
            roseType: "radius",
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              },
              normal: {
                color: function(params) {
                  let gridValue = params.value;
                  if (
                    _this.explainJudge === "forward" ||
                    _this.propsConfig.explainJudge === "forward"
                  ) {
                    if (gridValue < _this.propsConfig.criticalValue1) {
                      return _this.riskColor;
                    } else if (
                      gridValue > _this.propsConfig.criticalValue1 &&
                      gridValue < _this.propsConfig.criticalValue2
                    ) {
                      return _this.generalColor;
                    } else if (
                      gridValue > _this.propsConfig.criticalValue2 &&
                      gridValue < _this.propsConfig.criticalValue3
                    ) {
                      return _this.notGoodColor;
                    } else if (gridValue > _this.propsConfig.criticalValue3) {
                      return _this.goodColor;
                    }
                  } else if (
                    _this.explainJudge === "negative" ||
                    _this.propsConfig.explainJudge === "negative"
                  ) {
                    if (gridValue < _this.propsConfig.criticalValue1) {
                      return _this.goodColor;
                    } else if (
                      gridValue > _this.propsConfig.criticalValue1 &&
                      gridValue < _this.propsConfig.criticalValue2
                    ) {
                      return _this.notGoodColor;
                    } else if (
                      gridValue > _this.propsConfig.criticalValue2 &&
                      gridValue < _this.propsConfig.criticalValue3
                    ) {
                      return _this.generalColor;
                    } else if (gridValue > _this.propsConfig.criticalValue3) {
                      return _this.riskColor;
                    }
                  }
                }
              }
            },
            lableLine: {
              length: 1,
              length2: 1,
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            data: data
          }
        ]
      };
      return option;
    }
  }
};
</script>

<style scoped lang="scss">
.shapeEcharts {
  margin-top: 0.5rem;
  .index {
    width: 100%;
    margin-bottom: 1rem;
    .index-top {
      height: 2rem;
      line-height: 2rem;
      vertical-align: middle;
      background: rgba(16, 41, 67, 0.75);
      border: 1px solid rgba(147, 147, 147, 0.75);
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
      height: 16rem;
      // height: 40%;
      min-height: 40%;
      padding: 1rem;
      background: rgba(16, 41, 67, 0.8);
      border: 1px solid rgba(147, 147, 147, 0.8);
      border-top: none;
      border-radius: 0px 0px 8px 8px;
      span {
        font-size: 16px;
        font-weight: 600;
        color: #ffc000;
        margin: 0 0.2rem;
      }
    }
  }
}
</style>
