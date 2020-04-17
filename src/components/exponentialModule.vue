
<template>
  <div class="exponential-module">
    <div class="attribute" v-for="(item,index) in listData" :key="index">
      <!-- FIXME:取消色条 -->
      <!-- <div
        :class="{'nav-color-line':true,'line-blue':(item.id=='ZS1'),'line-green':(item.id=='ZS2'),'line-yellow':(item.id=='ZS4'),'line-red':(item.id=='ZS3')}"
      ></div>-->
      <div class="attribute-title" :class="{isSelected:currentFirstLevel === item.id}">
        <p class="attribute-name">
          <a
            class="white"
            @click="linkage(item.time,item.alertValue,item.explainJudge,item.alertJudge);showActiveFirstId(item.id);handleBarStreet(item.id)"
          >网格{{item.name === "动力指数" ? "效能指数":item.name==="行为指数"?"活动指数":item.name}}</a>
          <!-- 提示消息 -->
          <Poptip word-wrap width="300" :transfer="true">
            <div
              slot="title"
            >网格{{item.name === "动力指数" ? "效能指数":item.name==="行为指数"?"活动指数":item.name}}</div>
            <Icon type="ios-alert" size="15" class="help-icon"></Icon>
            <!-- 评价指标总览 -->
            <div slot="content">
              <div class="color-progress-warp">
                <div
                  class="color-progress"
                  v-for="(itemColor,index) in colorList(item.time[oneDaySpanMax].value,item.alertValue,item.criticalValue1,item.criticalValue2,item.criticalValue3,item.alertJudge,item.mode,item.meaning,item.explainJudge)"
                  :key="index"
                  :style="{background:itemColor.color}"
                >
                  <div
                    class="color-progress-point"
                    v-if="item.time[oneDaySpanMax].value !== 1 &&itemColor.showPoint=='true'"
                  ></div>
                  <span class="color-progress-txt">{{itemColor.txt}}</span>
                  <span class="color-progress-valueSet">{{itemColor.valueSet}}</span>
                </div>
              </div>
            </div>
            <!-- 评价说明 -->
            <div slot="content">
              <div
                class="poptop-content"
              >{{poptipContent(item.mode,item.meaning,item.explainJudge)}}</div>
            </div>
          </Poptip>
        </p>
        <!-- 指标属性 -->
        <p
          class="attribute-trend"
          :style="criticalColor(item.time[oneDaySpanMax].value,item.criticalValue1,item.criticalValue2,item.criticalValue3,item.explainJudge,item.alertJudge,item.alertValue)"
        >
          {{item.time[oneDaySpanMax].value === 1 ? "一" : Number(item.time[oneDaySpanMax].value).toFixed(2)}}
          <span
            :class="{'trend_arrow':(item.time[oneDaySpanMax].value!==1),'trend_arrow_red':(oneDaySpanMax < 1? false:item.time[oneDaySpanMax].value*(1.1) <item.time[oneDaySpanMax-1].value),'trend_arrow_blue':oneDaySpanMax < 1? false:(item.time[oneDaySpanMax].value > item.time[oneDaySpanMax-1].value),'trend_arrow_yellow':oneDaySpanMax < 1? false:(item.time[oneDaySpanMax].value<item.time[oneDaySpanMax-1].value && (item.time[oneDaySpanMax].value)*1.1 >= item.time[oneDaySpanMax-1].value)}"
          ></span>
        </p>
        <p class="attribute-more">
          <a @click="more(item.id,item,$event,item.children)">{{txt}}</a>
        </p>
      </div>
      <div class="attribute-content">
        <div
          class="cons"
          v-for="(itemOne,index) in item.children"
          :key="itemOne.id"
          v-show="index<show_num"
        >
          <p class="att-title" :class="{isSelected:currentSecondLevel === itemOne.id}">
            <!-- 二级指标属性 -->
            <span class="name">
              <a
                class="white"
                @click="linkage(itemOne.time,itemOne.alertValue,itemOne.explainJudge,itemOne.alertJudge);showActiveSecondId(itemOne.id);handleBarStreet(itemOne.id)"
              >{{itemOne.name}}</a>
              <!-- 评价提示信息 -->
              <Poptip word-wrap width="300" :transfer="true">
                <div slot="title">{{itemOne.name}}</div>
                <Icon type="ios-alert" size="15" class="help-icon"></Icon>
                <!-- 评价指标总览 -->
                <div slot="content">
                  <div class="color-progress-warp">
                    <div
                      class="color-progress"
                      v-for="(itemColor,index) in colorList(itemOne.time[oneDaySpanMax].value,itemOne.alertValue,itemOne.criticalValue1,itemOne.criticalValue2,itemOne.criticalValue3,itemOne.alertJudge,itemOne.mode,itemOne.meaning,itemOne.explainJudge)"
                      :key="index"
                      :style="{background:itemColor.color}"
                    >
                      <!-- <div
                        class="color-progress-point"
                        :style="{left:itemColor.left>94?'94%':itemColor.left+'%'}"
                      ></div>-->
                      <div
                        class="color-progress-point"
                        v-if="itemOne.time[oneDaySpanMax].value !== 1 && itemColor.showPoint=='true'"
                      ></div>
                      <span class="color-progress-txt">{{itemColor.txt}}</span>
                      <span class="color-progress-valueSet">{{itemColor.valueSet}}</span>
                    </div>
                  </div>
                </div>
                <!-- 评价说明 -->
                <div slot="content">
                  <div
                    class="poptop-content"
                  >{{poptipContent(item.mode,item.meaning,item.explainJudge)}}</div>
                </div>
              </Poptip>
              <span
                class="trend"
                :style="criticalColor(itemOne.time[oneDaySpanMax].value,itemOne.criticalValue1,itemOne.criticalValue2,itemOne.criticalValue3,itemOne.explainJudge,itemOne.alertJudge,itemOne.alertValue)"
              >{{itemOne.time[oneDaySpanMax].value === 1 ? "一" : Number(itemOne.time[oneDaySpanMax].value).toFixed(2)}}</span>
            </span>
            <!-- 指标箭头 -->
            <span
              :class="{'trend_arrow':(itemOne.time[oneDaySpanMax].value!==1),'trend_arrow_red':(oneDaySpanMax < 1? false:itemOne.time[oneDaySpanMax].value*(1.1) <itemOne.time[oneDaySpanMax-1].value),'trend_arrow_blue':(oneDaySpanMax < 1? false:itemOne.time[oneDaySpanMax].value > itemOne.time[oneDaySpanMax-1].value),'trend_arrow_yellow':(oneDaySpanMax < 1? false:itemOne.time[oneDaySpanMax].value<itemOne.time[oneDaySpanMax-1].value && (itemOne.time[oneDaySpanMax].value)*1.1 >= itemOne.time[oneDaySpanMax-1].value)}"
            ></span>
          </p>
          <!-- 三级指标 具体指标 -->
          <div
            v-for="(itemTow,index) in itemOne.children"
            :key="itemTow.id"
            class="att-text-warp clearfix"
          >
            <div class="att-text" :class="{isSelected:currenThridLevel === itemTow.id}">
              <span class="left">{{String(index + 1) + "."}}</span>
              <span class="left">
                <a
                  class="white"
                  @click="linkage(itemTow.time,itemTow.alertValue,itemTow.explainJudge,itemTow.alertJudge);showActiveThridId(itemTow.id);handleBarStreet(itemTow.id)"
                >{{itemTow.name}}</a>
                <!-- 评价指标说明 -->
                <Poptip word-wrap width="300" :transfer="true">
                  <div slot="title">{{itemTow.name}}</div>
                  <Icon type="ios-alert" size="15" class="help-icon"></Icon>
                  <!-- 评价指标总览 -->
                  <div slot="content">
                    <div class="color-progress-warp">
                      <div
                        class="color-progress"
                        v-for="(itemColor,index) in colorList(itemTow.time[oneDaySpanMax].value,itemTow.alertValue,itemTow.criticalValue1,itemTow.criticalValue2,itemTow.criticalValue3,itemTow.alertJudge,itemTow.mode,itemTow.meaning,itemTow.explainJudge)"
                        :key="index"
                        :style="{background:itemColor.color}"
                      >
                        <!-- <div
                          class="color-progress-point"
                          :style="{left:itemColor.left>94?'94%':itemColor.left+'%'}"
                        ></div>-->
                        <div
                          class="color-progress-point"
                          v-if="itemTow.time[oneDaySpanMax].value !== 1 && itemColor.showPoint=='true'"
                        ></div>
                        <span class="color-progress-txt">{{itemColor.txt}}</span>
                        <span class="color-progress-valueSet">{{itemColor.valueSet}}</span>
                      </div>
                    </div>
                  </div>
                  <!-- 评价说明 -->
                  <div slot="content">
                    <div
                      class="poptop-content"
                    >{{poptipContent(item.mode,item.meaning,item.explainJudge)}}</div>
                  </div>
                </Poptip>
              </span>
              <!-- FIXME:红点取消 -->
              <!-- <span
                class="red_point"
                v-show="itemTow.alertValue!=1 && itemTow.alertJudge==='high'? itemTow.alertValue < itemTow.time[oneDaySpanMax].value:itemTow.alertValue > itemTow.time[oneDaySpanMax].value"
              ></span>-->
              <!-- <Icon class="red_map" @click="handleMapRender(itemTow)" type="md-globe" size="15" v-show="itemTow.alertValue!=1 && itemTow.alertJudge==='high'? itemTow.alertValue < itemTow.time[oneDaySpanMax].value:itemTow.alertValue > itemTow.time[oneDaySpanMax].value"></Icon> -->
              <Icon class="red_map" @click="handleMapRender(itemTow)" type="md-globe" size="15"></Icon>
              <span
                class="right"
                :style="criticalColor(itemTow.time[oneDaySpanMax].value,itemTow.criticalValue1,itemTow.criticalValue2,itemTow.criticalValue3,itemTow.explainJudge,itemTow.alertJudge,itemTow.alertValue)"
              >{{itemTow.time[oneDaySpanMax].value === 1 ? "一" : Number(itemTow.time[oneDaySpanMax].value).toFixed(2)}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ExponentialModule",
  props: ["listData", "state", "oneDaySpanMax"],
  data() {
    return {
      show_num: 5, // 要显示指标的数量
      n: 0,
      txt: "收起",
      currentSecondLevel: "", //二级指数控制是否选中
      currenThridLevel: "", //三级指数控制当前是否选中
      currentFirstLevel: "", //一级指数
      highNumber: [], // 高
      higherNumber: [], // 较高
      lowerNumber: [], // 较低
      lowNumber: [], // 低
      alertNumber: [],
      evaluationNumber: []
    };
  },
  created() {},
  beforeMount() {},
  mounted() {},
  computed: {
    // 属性名字分级显示颜色
    criticalColor() {
      return function(
        value,
        critical1,
        critical2,
        critical3,
        explainJudge,
        alertJudge,
        alertValue
      ) {
        if (alertJudge === "high" && value > alertValue) {
          return {
            color: "#f71b07"
          };
        } else if (alertJudge === "low" && value < alertValue) {
          return {
            color: "#f71b07"
          };
        }
        // 正向评价越高越好
        if (explainJudge === "forward" && value != 1) {
          // 高
          if (value > critical3) {
            return {
              color: "#2a7804"
            };
            // 较高
          } else if (value > critical2 && value < critical3) {
            return {
              color: "#047878"
            };
          } else if (value > critical1 && value < critical2) {
            return {
              color: "#f7d307"
            };
          } else if (value < critical1) {
            return {
              color: "#f7a307"
            };
          }
          // 负向评价越低越好
        } else if (explainJudge === "negative" && value != 1) {
          // 高
          if (value > critical3) {
            return {
              color: "#f7a307"
            };
            // 较高
          } else if (value > critical2 && value < critical3) {
            return {
              color: "#f7d307"
            };
          } else if (value > critical1 && value < critical2) {
            return {
              color: "#047878"
            };
          } else if (value < critical1) {
            return {
              color: "#2a7804"
            };
          }
        } else {
          return {
            color: "#fff"
          };
        }
      };
    },
    // 评价弹窗内容
    poptipContent() {
      return function(mode, meaning, explainJudge) {
        if (explainJudge === "forward") {
          explainJudge = "正向评价，越高越好";
          return `指数含义:${meaning};\n计算方式:${mode};\n评价基准:${explainJudge};`;
        } else if (explainJudge === "negative") {
          explainJudge = "负向评价,越低越好";
          return `指数含义:${meaning};\n计算方式:${mode};\n评价基准:${explainJudge};`;
        }
      };
    },
    colorList() {
      return function(
        value,
        alertValue,
        c1,
        c2,
        c3,
        judge,
        mode,
        meaning,
        explainJudge
      ) {
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
      };
    }
  },
  watch: {},
  methods: {
    // 点击显示更多与隐藏
    more(id, item, e, itemVisible) {
      // itemVisible 为当前显示的指标数据与类型
      // 控制visible可见性的ture or false
      // 如果要显示的数据个数已经多于当前的显示个数
      item.visible = !item.visible;
      if (itemVisible.length > this.show_num) {
        e.target.innerHTML = item.visible ? "显示全部" : "收起";
        this.show_num = itemVisible.length;
      } else if (itemVisible.length == this.show_num) {
        e.target.innerHTML = item.visible ? "显示全部" : "收起";
        this.show_num = 3;
      } else {
        this.$Message.info("当前已是全部内容");
      }
    },
    // 子组件向父组件传递数据
    linkage(timeData, alertValue, explainJudge, alertJudge) {
      this.$emit("linkage", timeData, alertValue, explainJudge, alertJudge);
    },
    /**
     * @description: 显示各个指标在柱状图的街道数据的排名
     * @param {indexId} :当前的id值
     */
    handleBarStreet(indexId) {
      this.$emit("showBarStreet", indexId);
    },
    // FIXME: 代码冗余,需要优化,将清楚的方法 单独抽离
    // 显示高亮 三级指数
    showActiveThridId(currenThridId) {
      // state 0为左边 1为右边
      if (this.state == 1) {
        this.$store.state.rightExponentail.currenThridLevel = currenThridId;
        this.$store.state.leftExponentail.currenThridLevel = "";
        this.$store.state.leftExponentail.currentSecondLevel = "";
      } else {
        this.$store.state.leftExponentail.currenThridLevel = currenThridId;
        this.$store.state.rightExponentail.currenThridLevel = "";
        this.$store.state.rightExponentail.currentSecondLevel = "";
      }
      this.currentSecondLevel = "";
      this.currentFirstLevel = "";
      this.$store.state.indicatorIndex = "四";
    },
    // 显示高亮 二级指数
    showActiveSecondId(currentSecondId) {
      if (this.state == 1) {
        this.$store.state.rightExponentail.currentSecondLevel = currentSecondId;
        this.$store.state.leftExponentail.currentSecondLevel = "";
        this.$store.state.leftExponentail.currenThridLevel = "";
      } else {
        this.$store.state.leftExponentail.currentSecondLevel = currentSecondId;
        this.$store.state.rightExponentail.currentSecondLevel = "";
        this.$store.state.rightExponentail.currenThridLevel = "";
      }
      this.currenThridLevel = "";
      this.currentFirstLevel = "";
      this.$store.state.indicatorIndex = "三";
    },
    showActiveFirstId(currentFirstId) {
      if (this.state == 1) {
        this.$store.state.rightExponentail.currentFirstLevel = currentFirstId;
        this.$store.state.leftExponentail.currentFirstLevel = "";
        this.$store.state.leftExponentail.currentSecondLevel = "";
        this.$store.state.leftExponentail.currenThridLevel = "";
      } else {
        this.$store.state.leftExponentail.currentFirstLevel = currentFirstId;
        this.$store.state.rightExponentail.currentFirstLevel = "";
        this.$store.state.rightExponentail.currentSecondLevel = "";
        this.$store.state.rightExponentail.currenThridLevel = "";
      }
      this.currentSecondLevel = "";
      this.currenThridLevel = "";
      this.$store.state.indicatorIndex = "二";
    },

    /**
     * @description: 显示预警指标在各个行政级别的数据渲染
     * @param {indexItem}：当前正在点击的预警指标
     */
    handleMapRender(indexItem) {
      this.$emit("showMapModal", { status: true, data: indexItem });
    }
  }
};
</script>
<style lang="scss" scoped>
.exponential-module {
  width: 100%;
  height: 100%;
  .attribute {
    overflow: hidden;
    opacity: 0.9;

    margin-bottom: 1rem;
    .white {
      color: #fff;
    }
    // 导航线
    .nav-color-line {
      width: 100%;
      height: 0.25rem;
      opacity: 0.8;
    }
    .line-yellow {
      background-color: #e6ad04;
    }
    .line-red {
      background-color: #f53e31;
    }
    .line-blue {
      background-color: #2eafd3;
    }
    .line-green {
      background-color: #28c428;
    }
    .help-icon {
      cursor: pointer;
      visibility: hidden;
      &:hover {
        color: turquoise;
      }
    }

    .attribute-title {
      width: 100%;
      height: 1.5rem;
      background: rgba(16, 41, 67, 0.8);
      border: 1px solid rgba(147, 147, 147, 0.8);
      border-radius: 8px 8px 0px 0px;
      display: flex;
      align-items: center;
      .attribute-name {
        font-size: 13px;
        flex: 1;
        color: #fff;
        margin-left: 0.3rem;
        font-weight: bold;
        &:hover .help-icon {
          visibility: visible;
        }
      }
      .attribute-trend {
        font-size: 13px;
        flex: 0;
        text-align: center;
        font-weight: bold;
        display: flex;
      }
      .attribute-more {
        font-size: 12px;
        flex: 1;
        color: #28a8e0;
        text-align: right;
        margin-right: 0.5rem;
        text-decoration: underline;
        font-weight: bold;
      }
    }
    .isSelected {
      box-shadow: 0px 0px 8px 0px #2f7cbb;
      opacity: 0.9;
    }
    .attribute-content {
      background: rgba(16, 41, 67, 0.6);
      border: 1px solid rgba(147, 147, 147, 0.6);
      border-top: none;
      border-radius: 0px 0px 8px 8px;
      display: flex;
      // justify-content: space-between;
      justify-items: center;
      flex-wrap: wrap;
      &:after {
        content: "";
        display: block;
        clear: both;
      }
      .cons {
        width: 32%;
        display: flex;
        flex-direction: column;
        justify-items: space-between;
        flex-wrap: wrap;
        margin: 0rem 0.2rem;
        .att-text-warp {
          &:after {
            content: "";
            display: block;
            height: 0;
            clear: both;
          }
          .att-text {
            position: relative;
            width: 95%;
            height: 1.6rem;
            flex-wrap: nowrap;
            line-height: 1.6rem;
            vertical-align: middle;
            font-size: 0.94rem;
            margin-top: 0.5rem;
            margin-left: 0.3rem;
            &:hover .help-icon {
              visibility: visible;
            }
            // .left {
            //   float: left;
            // }
            .right {
              // float: right;
              position: absolute;
              right: 5%;
            }

            .red_point {
              width: 5px;
              height: 5px;
              display: inline-block;
              border: 3px solid #ff0000;
              background: #ff0000;
              border-radius: 50%;
              vertical-align: center;
            }
            .red_map {
              cursor: pointer;
            }
            .red_map:hover {
              color: turquoise;
            }
          }
        }
        .att-title {
          width: 95%;
          height: 1.5rem;
          line-height: 1.5rem;
          vertical-align: middle;
          margin-top: 0.5rem;
          background: rgba(42, 64, 85, 1);
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: start;
          &:hover .help-icon {
            visibility: visible;
          }
          .name {
            // font-size: 12px;
            margin-left: 0.5rem;
            font-weight: bolder;
            color: #eee;
            .trend {
              color: #f3ff11;
              margin: 5px;
              font-weight: 600;
            }
          }
          .trends {
            float: right;
            margin-right: 1.6rem;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.ivu-message-notice-content {
  background: #0d162d !important;
  span {
    color: #fff;
  }
}
.ivu-poptip-popper {
  z-index: 9999;
}
.ivu-poptip-inner {
  background: rgba(238, 238, 238, 1);
  border-radius: 5px;
}
.poptop-content {
  line-height: 23px;
  color: #000;
}
.color-progress-warp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  position: relative;
  height: 50px;
  .color-progress-point {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: rgba(255, 255, 255, 1);
    border: 2px solid rgba(111, 175, 255, 1);
    border-radius: 50%;
    position: relative;
    bottom: 12%;
    left: 50%;
  }
  .color-progress {
    flex: 1;
    font-size: 12px;
    height: 10px;
    &:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      .color-progress-txt {
        left: 0;
      }
    }
    &:last-child {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      .color-progress-txt {
        right: 0;
      }
    }
    // &:after {
    //   display: inline-block;
    //   width: 16px;
    //   height: 16px;
    //   background: rgba(255, 255, 255, 1);
    //   border: 2px solid rgba(111, 175, 255, 1);
    //   border-radius: 50%;
    //   position: relative;
    //   bottom: 2px;
    //   left: 25px;
    //   content: "";
    // }

    .color-progress-txt {
      position: absolute;
      bottom: 60%;
    }
    .color-progress-valueSet {
      position: absolute;
      bottom: 0%;
    }
  }
}
</style>
