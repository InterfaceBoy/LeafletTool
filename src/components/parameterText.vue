<template>
  <div class="parameterText">
    <div class="index">
      <div class="index-top">
        <span class="left">基础网格综合评价</span>
        <span class="right">+</span>
      </div>
      <div class="index-content">{{judgeDesc}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "parameterText",
  props: {
    streetData: {
      type: Array
    },
    streetNumer: {
      type: Number,
      required: true
    },
    averageValue: {
      type: Number,
      require: true
    },
    explainJudge: {
      type: String
    },
    indexValue: {
      type: Number,
      required: true
    },
    criticalValue1: {
      type: Number
    },
    criticalValue2: {
      type: Number
    },
    criticalValue3: {
      type: Number
    },
    minValue: {
      type: Number,
      required: true
    },
    maxValue: {
      type: Number,
      require: true
    }
  },
  computed: {
    judgeDesc() {
      return `全区共有${this.streetNumer}个街道.各区的综合指数的平均值为${
        this.averageValue
      }，历史最高值为${this.maxValue}，最低值为${
        this.minValue
      }。该指数共分为四个等级（健康、良好、一般、可能存在风险），${
        this.judgeNumber
      }`;
    },
    judgeNumber() {
      // 高
      const high = [];
      // 较高
      const higher = [];
      // 较低
      const lower = [];
      // 低
      const low = [];
      if (this.explainJudge === "forward") {
        this.streetData.map(item => {
          if (Number(item[1]) < this.criticalValue1) {
            low.push(item[1]);
          } else if (
            Number(item[1]) > this.criticalValue1 &&
            Number(item[1]) < this.criticalValue2
          ) {
            lower.push(item[1]);
          } else if (
            Number(item[1]) > this.criticalValue2 &&
            Number(item[1]) < this.criticalValue3
          ) {
            higher.push(item[1]);
          } else if (Number(item[1]) > this.criticalValue3) {
            high.push(item[1]);
          }
          return `其中其中健康是${high.length}个，良好是${
            higher.length
          }个，一般是${lower.length}个，可能存在风险是${low.length}个`;
        });
      } else if (this.explainJudge === "negative") {
        this.streetData.map(item => {
          if (Number(item[1]) < this.criticalValue1) {
            high.push(item[1]);
          } else if (
            Number(item[1]) > this.criticalValue1 &&
            Number(item[1]) < this.criticalValue2
          ) {
            higher.push(item[1]);
          } else if (
            Number(item[1]) > this.criticalValue2 &&
            Number(item[1]) < this.criticalValue3
          ) {
            lower.push(item[1]);
          } else if (Number(item[1]) > this.criticalValue3) {
            low.push(item[1]);
          }
        });
      }
      return `其中其中健康是${low.length}个，良好是${lower.length}个，一般是${
        higher.length
      }个，可能存在风险是${high.length}个`;
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.parameterText {
  // max-height: 13rem;
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

      border-radius: 8px 8px 0px 0px;

      .left {
        padding-left: 0.5rem;
      }
      .right {
        float: right;
        margin-right: 1rem;
      }
    }
    .index-content {
      font-size: 13px;
      padding: 0.8rem;
      // height: 14rem;
      // overflow-y: auto;
      background: rgba(16, 41, 67, 1);
      border: 1px solid rgba(147, 147, 147, 0.8);
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
