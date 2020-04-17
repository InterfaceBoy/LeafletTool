<template>
  <div class="wordCloud">
    <div class="container">
      <div class="index-top">
        <span class="left">{{ alertsTitle }}</span>
        <span class="right">+</span>
      </div>
      <div class="index-content">
        <vue-word-cloud
          :words="alertStreet"
          :color="([, weight]) => weight > 10 ? '#FF0000' : weight > 5 ? '#FFFF00' : '#2759C4'"
          font-family="Roboto"
        >
          <template slot-scope="{text, weight, word}">
            <div :title="weight" style="cursor: pointer;" @click="onWordClick(text)">{{ text }}</div>
          </template>
        </vue-word-cloud>
      </div>
    </div>
  </div>
</template>

<script>
import VueWordCloud from "vuewordcloud";
import EventBus from "../utils/EventBus.js";
export default {
  name: "wordCloud",
  components: {
    [VueWordCloud.name]: VueWordCloud
  },
  data() {
    return {
      alertValue: "", // 预警值
      alertJudge: "", // 预警条件
      indexValue: "", // 当前的值
      streetsData: [], // 当前街道的值
      alertStreet: []
    };
  },
  props: {
    propsConfig: {
      type: Object
    },
    alertsTitle: {
      type: String,
      required: true
    },
    grids: {
      type: Array,
      required: true
    }
  },
  watch: {
    propsConfig() {
      this.alertValue = this.propsConfig.alertValue;
      this.alertJudge = this.propsConfig.alertJudge;
      this.indexValue = this.propsConfig.indexValue;
      this.streetsData = this.propsConfig.streetsData;
      const alertStreet = [];
      for (let key in this.streetsData) {
        if (
          this.alertValue < this.streetsData[key] &&
          this.alertJudge === "high"
        ) {
          if (typeof this.$store.state.allStreetNameCode[key] != "undefined") {
            alertStreet.push(this.$store.state.allStreetNameCode[key]);
          }
        } else if (
          this.alertValue > this.streetsData[key] &&
          this.alertJudge === "low"
        ) {
          if (typeof this.$store.state.allStreetNameCode[key] != "undefined") {
            alertStreet.push(this.$store.state.allStreetNameCode[key]);
          }
        }
      }
      this.alertStreet = alertStreet;
    }
  },
  created() {},
  methods: {
    onWordClick(text) {
      // this.$store.state.GridsAlertText = text.replace(/[^0-9]/gi, "");
      this.$store.state.GridsAlertText = text;
      EventBus.$emit("clearLayerStyle");
    },
    rn(min, max) {
      var n = parseInt(Math.random() * (max - min) + min);
      return n;
    }
  }
};
</script>

<style scoped lang="scss">
.wordCloud {
  .container {
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
      height: calc(100vh - 37.5rem);
      font-size: 14px;
      padding: 1rem;
      background: #242c3b;
    }
  }
}
</style>
