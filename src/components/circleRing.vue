<template>
  <div>
    <div class="images">
      <!-- <i-Circle :percent="Number(percent*100)" stroke-color="#3DC5C4" :size="150"> -->
      <IEcharts :option="gauge" :resizable="true" :notMerge="true"></IEcharts>
      <!-- <span class="demo-circle-inner">{{percent}}</span> -->
      <span
        class="trend_arrow_position"
        :class="{'trend_arrow':(prevPercentValue!==1),'trend_arrow_red':(percent*(1.1) <=prevPercentValue),'trend_arrow_blue':(percent >= prevPercentValue),'trend_arrow_yellow':(percent < prevPercentValue && percent*1.1 >= prevPercentValue)}"
      ></span>
      <!-- 评价提示信息 -->
      <Poptip word-wrap width="300" :transfer="true" class="poptip">
        <div slot="title">网格运行指数</div>
        <Icon type="ios-alert" size="15" class="help-icon"></Icon>
        <!-- 评价指标总览 -->
        <div slot="content">
          <div class="color-progress-warp">
            <div
              class="color-progress"
              v-for="(itemColor,index) in colorList"
              :key="index"
              :style="{background:itemColor.color}"
            >
              <!-- <div
                        class="color-progress-point"
                        :style="{left:itemColor.left>94?'94%':itemColor.left+'%'}"
              ></div>-->
              <div class="color-progress-point" v-if="itemColor.showPoint=='true'"></div>
              <span class="color-progress-txt">{{itemColor.txt}}</span>
              <span class="color-progress-valueSet">{{itemColor.valueSet}}</span>
            </div>
          </div>
        </div>
        <!-- 评价说明 -->
        <div slot="content" style="color:#000">{{poptipContent}}</div>
      </Poptip>
      <!-- </i-Circle> -->
      <!-- 引入canvas标签 画八分之一圆 -->
      <!-- <div>
        <canvas id="myCanvas_circle_eighth" width="50px" height="50px">您的浏览器不支持canvas标签,请升级!</canvas>
      </div>-->
    </div>
  </div>
</template>
<script>
import IEcharts from "vue-echarts-v3";
export default {
  props: [
    "percent",
    "prevPercentValue",
    "allDistrictAlert",
    "allDistrictExpain",
    "explainIsShow"
  ],
  components: {
    IEcharts
  },
  computed: {
    poptipContent() {
      let explainJudge = this.allDistrictAlert.explainJudge;
      let meaning = this.allDistrictExpain.meaning;
      let mode = this.allDistrictExpain.mode;
      if (explainJudge === "forward") {
        explainJudge = "正向评价，越高越好";
        return `指数含义:${meaning};\n计算方式:${mode};\n评价基准:${explainJudge};`;
      } else if (explainJudge === "negative") {
        explainJudge = "负向评价,越低越好";
        return `指数含义:${meaning};\n计算方式:${mode};\n评价基准:${explainJudge};`;
      }
    },
    colorList() {
      let value = this.percent;
      let alertValue = this.allDistrictAlert.alertValue;
      let judge = this.allDistrictAlert.alertJudge;
      let c1 = this.allDistrictAlert.criticalValue1;
      let c2 = this.allDistrictAlert.criticalValue2;
      let c3 = this.allDistrictAlert.criticalValue3;
      let explainJudge = this.allDistrictAlert.explainJudge;
      // let meaning = this.allDistrictExpain.meaning;
      // let mode = this.allDistrictExpain.mode;
      if (explainJudge === "forward") {
        explainJudge = "正向评价，越高越好";
        return [
          {
            txt: "预警",
            color: "#f71b07",
            showPoint: `${
              judge === "high" ? value > alertValue : value < alertValue
            }`,
            valueSet: ``,
            left: `${(value / c3) * 70}`
          },
          {
            txt: "存在风险",
            color: "#f7a307",
            valueSet: `0`,
            showPoint: `${
              value >= 0 && value <= c1
                ? judge === "high"
                  ? value < alertValue
                  : value > alertValue
                : false
            }`,
            left: `${(value / c3) * 70}`
          },
          {
            txt: "一般",
            color: "#f7d307",
            valueSet: `${c1}`,
            showPoint: `${value > c1 && value <= c2}`,
            left: `${(value / c3) * 70}`
          },
          {
            txt: "良好",
            color: "#047878",
            valueSet: `${c2}`,
            showPoint: `${value > c2 && value <= c3}`,
            left: `${(value / c3) * 70}`
          },
          {
            txt: "健康",
            color: "#2a7804",
            showPoint: `${value > c3}`,
            valueSet: `${c3} +∞`,
            left: `${(value / c3) * 70}`
          }
        ];
      } else if (explainJudge === "negative") {
        explainJudge = "负向评价,越低越好";
        return [
          {
            txt: "健康",
            color: "#2a7804",
            valueSet: `0`,
            showPoint: `${value >= 0 && value <= c1}`,
            left: `${(value / c3) * 70}`
          },
          {
            txt: "良好",
            color: "#047878",
            valueSet: `${c1}`,
            showPoint: `${value > c1 && value <= c2}`,
            left: `${(value / c3) * 70}`
          },
          {
            txt: "一般",
            color: "#f7d307",
            valueSet: `${c2}`,
            showPoint: `${value > c2 && value <= c3}`,
            left: `${(value / c3) * 70}`
          },
          {
            txt: "存在风险",
            color: "#f7a307",
            valueSet: `${c3} +∞`,
            showPoint: `${
              value > c3
                ? judge === "high"
                  ? value < alertValue
                  : value > alertValue
                : false
            }`,
            left: `${(value / c3) * 70}`
          },
          {
            txt: "预警",
            color: "#f71b07",
            showPoint: `${
              judge === "high" ? value > alertValue : value < alertValue
            }`,
            valueSet: ``,
            left: `${(value / c3) * 70}`
          }
        ];
      }
    },
    gauge() {
      let data = this.percent;
      var goodColor = "#2a7804";
      var notgoodColor = "#047878";
      var generalColor = "#f7d307";
      var riskColor = "#f7a307";
      var alertColor = "#f71b07";
      var color = [[]];
      if (
        this.allDistrictAlert.explainJudge === "forward" &&
        this.allDistrictAlert.alertJudge === "low"
      ) {
        color = [
          [this.allDistrictAlert.alertValue, alertColor],
          [this.allDistrictAlert.criticalValue1, riskColor],
          [this.allDistrictAlert.criticalValue2, generalColor],
          [this.allDistrictAlert.criticalValue3, notgoodColor],
          [1, goodColor]
        ];
      } else if (this.allDistrictAlert.explainJudge === "negative") {
        color = [
          [this.allDistrictAlert.alertValue, alertColor],
          [this.allDistrictAlert.criticalValue1, goodColor],
          [this.allDistrictAlert.criticalValue2, notgoodColor],
          [this.allDistrictAlert.criticalValue3, generalColor],
          [1, riskColor]
        ];
      }
      let option = {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
          show: false,
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        grid: {
          containLabel: true
        },
        series: [
          {
            radius: "100%", //仪表大小
            name: "全区综合评价",
            type: "gauge",
            axisLine: {
              show: true,
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: color,
                width: 7 //表盘宽度
              }
            },
            // 分割线设置
            splitLine: {
              length: 12
            },
            // 指针样式
            itemStyle: {
              borderType: "dotted"
            },
            detail: {
              fontSize: 20,
              fontFamily: "Microsoft YaHei",
              formatter: "{value}"
            },
            data: [{ value: data }],
            max: 1
          }
        ]
      };
      return option;
    }
  },
  created() {},
  mounted() {
    // this.circle_eighth();
  },
  methods: {
    // circle_eighth() {
    //   // 获取Canvas对象(画布)
    //   let canvas = document.getElementById("myCanvas_circle_eighth");
    //   if (canvas.getContext) {
    //     let ctx = canvas.getContext("2d");
    //     ctx.beginPath();
    //     ctx.lineWidth = 3;
    //     ctx.fillStyle = "#3dc4c4";
    //     ctx.moveTo(10, 0);
    //     ctx.lineTo(40, 0);
    //     ctx.arcTo(10, 0, 40, 0, 30);
    //     ctx.closePath();
    //     ctx.moveTo(25, 30);
    //     ctx.lineTo(40, 0);
    //     ctx.lineTo(10, 0);
    //     ctx.fill();
    //   }
    // }
  }
};
</script>
<style lang="scss" scoped>
.trend_arrow_position {
  position: absolute;
  z-index: 99;
  bottom: 28%;
  right: 37%;
}
.images {
  position: relative;
  width: 20rem;
  height: 200px;
  position: relative;
  margin: 2rem auto;
  text-align: center;
  span:last-child {
    transform: translate(0.2rem, -0.6rem);
    position: absolute;
  }
}
.poptip {
  position: absolute;
  bottom: 24%;
  right: 26%;
  .help-icon {
    margin-right: 0.6rem;
    margin-top: 0.5rem;
    float: right;
    cursor: pointer;
    &:hover {
      color: turquoise;
    }
  }
}
.demo-circle-inner {
  font-size: 28px;
  color: #3dc5c4;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
#myCanvas_circle_eighth {
  transform: translateY(-0.6rem);
}
</style>
