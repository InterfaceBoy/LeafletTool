<template>
  <div class="shapeEcharts">
    <div class="index">
      <div class="index-top">
        <span class="left">{{rankingTitle}}</span>
        <span class="right">+</span>
      </div>
      <div class="index-content">
        <IEcharts
          ref="echarts"
          :option="shape"
          :loading="loading"
          :resizable="true"
          @click="showMap"
        ></IEcharts>
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
    indexName: {
      type: String,
      required: true
    },
    data: {
      type: Array
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    return {};
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
      return `${this.indexName}综合排名`;
    },
    // 条形图
    shape() {
      let dataX = this.data.map(function(item) {
        return item[0];
      });
      let dataY = this.data.map(function(item) {
        return item[1];
      });
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          // 设置位置
          position: function(pos, params, el, elRect, size) {
            var obj = { top: 10 };
            obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 16;
            return obj;
          }
        },
        grid: {
          left: "-10%",
          right: "0%",
          top: "13%",
          bottom: "-20%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: dataX,
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLabel: {
              interVal: 0,
              textStyle: {
                color: "#626262",
                fontSize: "10"
              },
              formatter: function(value) {
                let ret = ""; //拼接加\n返回的类目项
                let maxLength = 2; //每项显示文字个数
                let valLength = value.length; //X轴类目项的文字个数
                let rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                if (rowN > 1) {
                  //如果类目项的文字大于3,
                  for (let i = 0; i < rowN; i++) {
                    let temp = ""; //每次截取的字符串
                    let start = i * maxLength; //开始截取的位置
                    var end = start + maxLength; //结束截取的位置 //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + "\n";
                    ret += temp; //凭借最终的字符串
                  }
                  return ret;
                } else {
                  return value;
                }
              }
            },
            axisLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            show: false,
            type: "value"
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "30%",
            itemStyle: {
              normal: {
                barBorderRadius: 100,
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "color",
                    fontSize: 10,
                    fontWeight: "bold"
                  },
                  formatter: function(v) {
                    let showData = v.data;
                    // return parseInt(showData) === showData
                    //   ? parseInt(showData)
                    //   : parseInt(showData).toFixed(2);
                    return Number(showData).toFixed(2);
                  }
                },
                color: function(idx) {
                  var color = [
                    "#dc4e54",
                    "#db8258",
                    "#eda350",
                    "#a6a34b",
                    "#84aa6d",
                    "#84abab"
                  ];
                  return color[idx.dataIndex % color.length];
                }
              }
            },
            data: dataY
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
      height: 13rem;
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
</style>
