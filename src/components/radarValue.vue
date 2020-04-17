<template>
  <div class="shapeEcharts">
    <div class="index">
      <div class="index-top">
        <span class="left">{{rankingTitle}}</span>
        <span class="right">+</span>
      </div>
      <div class="index-content">
        <IEcharts ref="echarts" :option="radar" :loading="loading" :resizable="true"></IEcharts>
      </div>
    </div>
  </div>
</template>

<script>
import IEcharts from "vue-echarts-v3";
import EventBus from "../utils/EventBus.js";

export default {
  name: "indexRanking",
  components: {
    IEcharts
  },
  props: {
    data: {
      type: Array
    },
    date: {
      type: String
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      attributeData: [],
      indicatorData: [{ name: "全区", value: 1 }],
      xdata: []
    };
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
  watch: {
    data() {
      this.attributeData = this.data;
      this.xdata = [];
      this.indicatorData = this.attributeData.map(item => {
        this.xdata.push(item.value);
        return { name: item.name, max: Number(item.value) };
      });
    }
  },
  computed: {
    rankingTitle() {
      return `网格维度评价`;
    },
    // 雷达图
    radar() {
      let option = {
        title: {
          // text: "雷达图",
          textStyle: {
            color: "rgba(221,221,221,1)", //标题颜色
            fontSize: 14,
            lineHeight: 20
          },
          // 标题的位置，此时放在图的底边
          left: "center",
          top: "bottom"
        },
        // 图表的位置
        grid: [
          {
            bottom: "1%",
            top: "50%",
            right: "25%",
            containLabel: true
          }
        ],
        tooltip: {
          //雷达图的tooltip不会超出div，也可以设置position属性，position定位的tooltip 不会随着鼠标移动而位置变化，不友好
          confine: true,
          enterable: false //鼠标是否可以移动到tooltip区域内
        },
        radar: {
          radius: "80%",
          shape: "circle",
          splitNumber: 3, // 雷达图圈数设置,
          center: ["50%", "53%"], // 图的位置
          name: {
            textStyle: {
              color: "#fff",
              fontSize: 8,
              formatter: function(value, indicator) {
                //用回调函数，第一个参数是指示器名称，第二个参数是指示器配置项
                return "【" + value + "】";
              },
              padding: [1, 1]
            }
          },
          nameGap: 1,
          // 设置雷达图中间射线的颜色
          axisLine: {
            lineStyle: {
              color: "rgba(131,141,158,.1)"
            }
          },
          indicator: this.indicatorData,
          //雷达图背景的颜色，在这儿随便设置了一个颜色，完全不透明度为0，就实现了透明背景
          splitArea: {
            show: false,
            areaStyle: {
              color: "rgba(255,0,0,0)" // 图表背景的颜色
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "rgba(131,141,158,.8)" // 设置网格的颜色
            }
          }
        },
        series: [
          {
            // name: "雷达图", // tooltip中的标题
            type: "radar", //表示是雷达图
            symbol: "circle", // 拐点的样式，还可以取值'rect','angle'等
            symbolSize: 6, // 拐点的大小

            areaStyle: {
              normal: {
                width: 1,
                opacity: 0.2
              }
            },
            data: [
              {
                value: this.xdata,
                name: this.date,
                // 设置区域边框和区域的颜色
                itemStyle: {
                  normal: {
                    color: "rgba(0,255,255,.8)",
                    textStyle: {
                      fontSize: 12
                    },
                    lineStyle: {
                      color: "#00FFFF"
                    }
                  }
                },
                //在拐点处显示数值
                label: {
                  normal: {
                    show: true,
                    fontSize: 8,
                    // position: "left",
                    distance: 5,
                    textStyle: {
                      color: "#00FFFF"
                    },
                    formatter: params => {
                      return Number(params.value).toFixed(2);
                    }
                  }
                }
              }
            ]
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
      height: 14rem;
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
