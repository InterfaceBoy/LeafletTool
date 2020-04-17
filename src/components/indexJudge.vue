<template>
  <div class="parameterText">
    <div class="index">
      <div class="index-top">
        <span class="left">{{judgeTitle}}</span>
        <!-- <span class="right">+</span> -->
      </div>
      <div class="index-content">{{judgeDesc}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "parameterText",
  props: {
    indexName: {
      type: String,
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
    judgeTitle() {
      return `${this.indexName}综合评价`;
    },
    judgeDesc() {
      return `全区${this.indexName}的平均值为${
        this.averageValue
      }，历史最高值为${this.maxValue}，最低值为${
        this.minValue
      }。该指数共分为四个等级（健康、良好、一般、存在风险），其中该单元的值为${
        this.indexValue
      }，等级为:${this.judgeLevel}`;
    },
    judgeLevel() {
      let levelText = "";
      if (this.explainJudge === "forward") {
        if (this.indexValue < this.criticalValue1) {
          levelText = "存在风险";
        } else if (
          this.indexValue > this.criticalValue1 &&
          this.indexValue < this.criticalValue2
        ) {
          levelText = "一般";
        } else if (
          this.indexValue > this.criticalValue2 &&
          this.indexValue < this.criticalValue3
        ) {
          levelText = "良好";
        } else if (this.indexValue > this.criticalValue3) {
          levelText = "健康";
        }
      } else if (this.explainJudge === "negative") {
        if (this.indexValue < this.criticalValue1) {
          levelText = "健康";
        } else if (
          this.indexValue > this.criticalValue1 &&
          this.indexValue < this.criticalValue2
        ) {
          levelText = "良好";
        } else if (
          this.indexValue > this.criticalValue2 &&
          this.indexValue < this.criticalValue3
        ) {
          levelText = "一般";
        } else if (this.indexValue > this.criticalValue3) {
          levelText = "存在风险";
        }
      }
      return levelText;
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
      font-size: 14px;
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
