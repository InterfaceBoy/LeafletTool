<template>
  <div class="basemap" id="map">
    <!-- 正向评价 -->
    <div
      class="map-legend"
      :style="{bottom:showBottom,right:showRight}"
      v-show="explainJudge==='forward' || this.propsConfig.explainJudge==='forward'"
    >
      <h4>图列</h4>
      <div class="map-info">
        <span class="color-area" :style="{background:goodColor}"></span>
        <span class="fontColor">健康</span>
      </div>
      <div class="map-info">
        <span class="color-area" :style="{background:notGoodColor}"></span>
        <span class="fontColor">良好</span>
      </div>
      <div class="map-info">
        <span class="color-area" :style="{background:generalColor}"></span>
        <span class="fontColor">一般</span>
      </div>
      <div class="map-info">
        <span class="color-area" :style="{background:riskColor}"></span>
        <span class="fontColor">可能存在风险</span>
      </div>
      <div class="map-info">
        <span class="color-area" :style="{background:alertColor}"></span>
        <span class="fontColor">预警</span>
      </div>
    </div>
    <!-- 负向评价 -->
    <div
      class="map-legend"
      :style="{bottom:showBottom,right:showRight}"
      v-show="explainJudge==='negative' || this.propsConfig.explainJudge==='negative'"
    >
      <h4>图列</h4>
      <div class="map-info">
        <span class="color-area" :style="{background:alertColor}"></span>
        <span class="fontColor">预警</span>
      </div>
      <div class="map-info">
        <span class="color-area" :style="{background:riskColor}"></span>
        <span class="fontColor">可能存在风险</span>
      </div>
      <div class="map-info">
        <span class="color-area" :style="{background:generalColor}"></span>
        <span class="fontColor">一般</span>
      </div>
      <div class="map-info">
        <span class="color-area" :style="{background:notGoodColor}"></span>
        <span class="fontColor">良好</span>
      </div>
      <div class="map-info">
        <span class="color-area" :style="{background:goodColor}"></span>
        <span class="fontColor">健康</span>
      </div>
    </div>
    <!-- 回到地图中心 -->
    <div @click="goMapCenter()" :style="{bottom:showBottom,right:showRight}" class="goCenter-icon">
      <Icon type="ios-locate-outline" size="18" class="gomap-icon"/>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import EventBus from "../utils/EventBus.js";

export default {
  name: "bottomMap",
  props: {
    propsConfig: {
      type: Object
    },
    indicatorsShow: {
      type: Boolean,
      required: false
    },
    gridType: {
      type: String,
      required: true
    },
    gridsAlert: {
      type: Array,
      required: true
    },
    secondLayerGeo: {
      type: Object,
      required: false
    }
  },
  components: {},
  data() {
    return {
      goodColor: "#2a7804",
      notGoodColor: "#047878",
      generalColor: "#f7d307",
      riskColor: "#f7a307",
      alertColor: "#f71b07",
      baseUrl: process.env.BASE_URL,
      map: null,
      geojsonLayer: null,
      gridsNum: [],
      grids: "",
      streetName: [],
      criticalValue1: "", // 临界值1
      criticalValue2: "", // 临界值2
      criticalValue3: "", // 临界值3
      alertJudge: "", // 阈值判断条件
      explainJudge: "", // 临界值判断条件
      indexValue: "", // 当前的值
      streetsData: "", // 当前街道的值
      alertStreet: "", // 预警的街道
      alertLayers: []
    };
  },
  computed: {
    showBottom() {
      if (this.indicatorsShow) {
        return "36%";
      } else {
        return "10%";
      }
    },
    showRight() {
      if (this.indicatorsShow) {
        return "24%";
      } else {
        return "10%";
      }
    }
  },
  // 回到地图中心
  watch: {
    gridType() {
      this.addGridLayer();
    },
    propsConfig() {
      this.criticalValue1 = this.propsConfig.criticalValue1;
      this.criticalValue2 = this.propsConfig.criticalValue2;
      this.criticalValue3 = this.propsConfig.criticalValue3;
      this.alertJudge = this.propsConfig.alertJudge;
      this.alertValue = this.propsConfig.alertValue;
      this.explainJudge = this.propsConfig.explainJudge;
      this.indexValue = this.propsConfig.indexValue;
      this.streetsData = this.propsConfig.streetsData;
      let alertStreet = [];
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
      this.addGridLayer();
    }
  },

  beforeMount() {
    EventBus.$on("clearLayerStyle", this.clearStyle);
  },
  beforeDestroy() {
    // EventBus.$off("clearLayerStyle", this.clearStyle);
  },
  mounted() {
    this.initMap();
  },
  methods: {
    goMapCenter() {
      if (this.gridType === "community") {
        this.map.setView([39.918399, 116.408584], 11);
      } else {
        this.map.setView([39.918399, 116.408584], 11);
      }
    },
    initMap() {
      this.map = L.map("map", {
        zoomControl: false,
        attributionControl: false
      });
      this.$store.state.bottomMap = this.map;
      this.addGridLayer();
      this.addMapInfo(this.map);
      // 添加底图
      new L.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href=" ">OpenStreetMap</a > contributors'
      }).addTo(this.map);
      // new L.TileLayer(mapboxUrl, {
      //   attribution: "dist"
      // }).addTo(this.map);
    },
    addGridLayer() {
      let mapUrl = "";
      switch (this.gridType) {
        case "street":
          // mapUrl = `${this.baseUrl}/static/streets.json`;
          mapUrl = `${this.baseUrl}/static/spatialData/dc_jd.json`;
          this.setViewGrid();
          break;
        case "community":
          // mapUrl = `${this.baseUrl}/static/grid.json`;
          mapUrl = `${this.baseUrl}/static/spatialData/dc_sq.json`;
          this.setViewGrid();
          break;
        case "grid":
          // mapUrl = `${this.baseUrl}/static/grid.json`;
          mapUrl = `${this.baseUrl}/static/spatialData/dc_wg.json`;
          this.setViewGrid();
          break;
        default:
          // mapUrl = `${this.baseUrl}/static/grid.json`;
          mapUrl = `${this.baseUrl}/static/spatialData/dc_wg.json`;
          this.setViewGrid();
          break;
      }
      this.$http.get(mapUrl).then(result => {
        if (result.data && this.geojsonLayer != null) {
          this.map.removeLayer(this.geojsonLayer);
        }
        let n = 1;
        let streetNmae = [];
        let allStreetName = [];
        let allStreetNameCode = [];
        let streetCode = [];
        let streetNameCode = {};
        // 街道个数
        this.$store.state.streetNumber = result.data.features.length;
        // FIXME: 处理街道名称保存到vuex中为二维数组
        result.data.features.forEach(element => {
          allStreetName.push(element.properties.JDNAME);
          allStreetNameCode.push(element.properties.JDCODE);
          if (this.propsConfig.streetsData !== "") {
            if (typeof this.propsConfig.streetsData !== "undefined") {
              element.properties.gridValue = String(
                this.propsConfig.streetsData[element.properties.JDCODE]
              );
            }
          }
          streetNmae.push(element.properties.JDNAME);
          streetCode.push(element.properties.JDCODE);
          for (let i = 0; i < streetNmae.length; i++) {
            streetNameCode[streetCode[i]] = streetNmae[i];
          }
          // 将街道号和对应的名字对象存入vuex
          this.$store.state.streetNameCode = streetNameCode;

          element.properties.girdIndex = n++;
          this.streetName.push(element.properties.JDNAME);
        });
        let allStreetValue = this.transformObj(
          allStreetNameCode,
          allStreetName
        );
        this.$store.state.allStreetNameCode = allStreetValue;
        this.$store.state.streetName = this.streetName.map((key, value) => {
          return [key, value];
        });
        this.$store.state.streestName = this.streetName.map((key, value) => {
          return [key, value];
        });
        this.geojsonLayer = L.geoJSON(result.data, {
          style: this.style,
          onEachFeature: this.onEachFeature
        });
        this.geojsonLayer.addTo(this.map);
      });
    },
    // eslint-disable-next-line
    style(feature) {
      this.gridsNum = this.gridsAlert.map(item => {
        return item[0].replace(/[^0-9]/gi, "");
      });
      //  处理单击网格预警文字单击事件
      if (this.$store.state.GridsAlertText == feature.properties.JDNAME) {
        return {
          opacity: 1,
          color: "#0096A1",
          fillColor: "#0096A1",
          weight: 2,
          fillOpacity: 0.8
        };
      }
      // 柱状图点击
      if (this.$store.state.barInfo.barName == feature.properties.JDNAME) {
        return {
          opacity: 1,
          color: `${this.$store.state.barInfo.barColor}`,
          fillColor: `${this.$store.state.barInfo.barColor}`,
          weight: 2,
          fillOpacity: 0.8
        };
      }
      const gridValue = feature.properties.gridValue;
      // 预警
      if (this.alertJudge === "high" && gridValue > this.alertValue) {
        return {
          opacity: 1,
          color: this.alertColor,
          fillColor: this.alertColor,
          weight: 2,
          fillOpacity: 0.8
        };
      } else if (this.alertJudge === "low" && gridValue < this.alertValue) {
        return {
          opacity: 1,
          color: this.alertColor,
          fillColor: this.alertColor,
          weight: 2,
          fillOpacity: 0.8
        };
      }
      if (
        this.explainJudge === "forward" ||
        this.propsConfig.explainJudge === "forward"
      ) {
        if (gridValue < this.propsConfig.criticalValue1) {
          // 低
          return {
            opacity: 1,
            color: this.riskColor,
            fillColor: this.riskColor,
            weight: 2,
            fillOpacity: 0.8
          };
        } else if (
          gridValue > this.propsConfig.criticalValue1 &&
          gridValue < this.propsConfig.criticalValue2
        ) {
          // 较低
          return {
            opacity: 1,
            color: this.generalColor,
            fillColor: this.generalColor,
            weight: 2,
            fillOpacity: 0.8
          };
        } else if (
          gridValue > this.propsConfig.criticalValue2 &&
          gridValue < this.propsConfig.criticalValue3
          // 较高
        ) {
          return {
            opacity: 1,
            color: this.notGoodColor,
            fillColor: this.notGoodColor,
            weight: 2,
            fillOpacity: 0.8
          };
        } else if (gridValue > this.propsConfig.criticalValue3) {
          return {
            opacity: 1,
            color: this.goodColor,
            fillColor: this.goodColor,
            weight: 2,
            fillOpacity: 0.8
          };
        } else {
          return {
            opacity: 1,
            color: "#2a7804",
            fillColor: "#2a7804",
            dashArray: 3,
            fillOpacity: 0.5
          };
        }
      } else if (
        // 负向评价
        this.explainJudge === "negative" ||
        this.propsConfig.explainJudge === "negative"
      ) {
        if (gridValue < this.propsConfig.criticalValue1) {
          // 高
          return {
            opacity: 1,
            color: this.goodColor,
            fillColor: this.goodColor,
            weight: 2,
            fillOpacity: 0.8
          };
        } else if (
          // 较高
          gridValue > this.propsConfig.criticalValue1 &&
          gridValue < this.propsConfig.criticalValue2
        ) {
          return {
            opacity: 1,
            color: this.notGoodColor,
            fillColor: this.notGoodColor,
            weight: 2,
            fillOpacity: 0.8
          };
        } else if (
          // 较低
          gridValue > this.propsConfig.criticalValue2 &&
          gridValue < this.propsConfig.criticalValue3
        ) {
          return {
            opacity: 1,
            color: this.generalColor,
            fillColor: this.generalColor,
            weight: 2,
            fillOpacity: 0.8
          };
        } else if (gridValue > this.propsConfig.criticalValue3) {
          // 低
          return {
            opacity: 1,
            color: this.riskColor,
            fillColor: this.riskColor,
            weight: 2,
            fillOpacity: 0.8
          };
        } else {
          return {
            opacity: 1,
            color: "#FFEBD6",
            fillColor: "#FFEBD6",
            dashArray: 3,
            fillOpacity: 0.5
          };
        }
      }
    },
    // 两个数组转换为对象
    transformObj(list, values) {
      var result = {};
      for (var i = 0; i < list.length; i++) {
        if (values) {
          result[list[i]] = values[i];
        } else {
          result[list[i][0]] = list[i][1];
        }
      }
      return result;
    },
    // 加入图列显示
    addMapInfo(map) {
      let info = L.control();
      info.onAdd = function() {
        this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
        this.update();
        return this._div;
      };
      /* eslint-disable */
      info.update = function(props) {
        this._div.innerHTML = "";
      };
      info.addTo(map);
    },
    mouseoutClear() {
      this.geojsonLayer.getLayers().forEach(val => {
        this.geojsonLayer.resetStyle(val);
      });
      this.map.closePopup();
    },
    // 清除地图的样式
    clearStyle() {
      this.geojsonLayer.getLayers().forEach(val => {
        this.geojsonLayer.resetStyle(val);
      });
      if (this.alertLayers.length > 0) {
        for (let i = 0; i < this.alertLayers.length; i++) {
          this.map.removeLayer(this.alertLayers[i]);
        }
      }

      this.map.closePopup();
    },
    clearSecondStyle() {
      this.secondGeoLayer.getLayers().forEach(val => {
        this.secondGeoLayer.resetStyle(val);
      });
      this.map.closePopup();
    },
    onEachSecondFeature(feature, layer) {
      layer.on({
        mouseover: this.showGridDesc,
        mouseout: this.clearSecondStyle
      });
    },
    // 重新设置当前layer的样式
    resetStyle(e) {
      if (this.geojsonLayer) {
        this.geojsonLayer.resetStyle(e.target);
        this.map.closePopup();
      }
    },
    onEachFeature(feature, layer) {
      layer.on({
        mouseover: this.showGridDesc,
        mouseout: this.mouseoutClear,
        click: this.showGridIndexDetail
      });
      // let a = layer.getBounds().getCenter();
      // console.log(a);
      // 处理预警街道,添加marker FIXME:
      // if (this.alertStreet.length > 0) {
      //   this.alertStreet.forEach(item => {
      //     if (item === layer.feature.properties.JDNAME) {
      //       // geojson 坐标数组
      //       let alertlat = layer.getBounds().getCenter();
      //       let alertlatLang = [alertlat.lat, alertlat.lng];
      //       // 添加预警
      //       let myIcon = L.divIcon({
      //         html:
      //           "<div class='red_point_alert'><div class='dot'></div><div class='pulse'></div></div>"
      //         // className: "red_point_alert"
      //       });
      //       let marker = L.marker(alertlatLang, { icon: myIcon });
      //       this.alertLayers.push(marker);
      //       marker.addTo(this.map);
      //     }
      //   });
      // }
    },
    // 鼠标移动事件
    showGridDesc(e) {
      const layer = e.target;
      layer.setStyle({
        weight: 3,
        color: "#012134",
        opacity: 0.5,
        dashArray: 3,
        fillColor: `${e.target.options.color}`,
        fillOpacity: 1
      });
      let latlng = layer.getCenter();
      L.popup({ closeButton: false })
        .setLatLng(latlng)
        .setContent(
          `${layer.feature.properties["JDNAME"]} ${
            layer.feature.properties["gridValue"]
          } `
        )
        .openOn(this.map);
    },
    // 点击事件
    showGridIndexDetail(e) {
      const layer = e.target;
      this.geojsonLayer.resetStyle(this.geojsonLayer.getLayers()[0]);
      layer.setStyle({
        weight: 3,
        opacity: 0.5,
        dashArray: 3,
        fillColor: `${e.target.options.fillColor}`,
        fillOpacity: 0.5
      });
      const props = layer.feature.properties;
      let id = "";
      let name = "";
      switch (this.gridType) {
        case "street":
          id = props["JDCODE"];
          name = props["JDNAME"];
          break;
        case "community":
          id = props["JDCODE"];
          name = props["JDNAME"] || props["unit_name"];
          break;
        case "grid":
          id = props["JDCODE"];
          name = props["JDNAME"] || props["unit_name"];
          break;
        default:
          id = props["qucode"];
          name = props["JDNAME"] || props["unit_name"];
          break;
      }
      EventBus.$emit("showGridDetail", { gridId: id, gridName: name });
      // });
    },
    // 设置地图的中心
    setViewGrid() {
      this.map.setView([39.891909, 116.420366], 12);
    },
    // 叠加业务数据层
    addSecondLayer() {
      const secondGeoLayer = L.geoJSON(this.secondLayerGeo, {
        style: this.secondLayerStyle,
        onEachFeature: this.onEachSecondFeature
      });
      this.secondGeoLayer = secondGeoLayer;
      secondGeoLayer.addTo(this.map);
    },
    secondLayerStyle(feature) {
      if (feature.properties.gridValue > this.criticalValue2) {
        return {
          color: "#F81628",
          fillColor: "#F81628",
          weight: 2,
          fillOpacity: 1
        };
      } else if (feature.properties.gridValue > this.criticalValue2) {
        return {
          opacity: 1,
          color: "#FEFA50",
          fillColor: "#FEFA50",
          weight: 2,
          fillOpacity: 1
        };
      } else if (feature.properties.gridValue > this.criticalValue1) {
        return {
          opacity: 1,
          fillColor: "#1635F6",
          weight: 2,
          fillOpacity: 1
        };
      }
    },
    // 返回随机数
    rn(min, max) {
      var n = parseInt(Math.random() * (max - min) + min);
      return n;
    }
  }
};
</script>

<style scoped lang="scss">
.basemap {
  width: 100%;
  height: 100%;
}

.map-legend {
  position: absolute;
  text-align: center;
  bottom: 10%;
  right: 10%;
  background: rgba(47, 53, 64, 0.8);
  width: 80px;
  z-index: 1000;
  h4 {
    margin: 0 0 5px;
    color: #fff;
  }
  .map-info {
    display: flex;
    align-items: center;
    margin-top: 6px;
    margin-left: 5px;
    .color-area {
      width: 25px;
      height: 15px;
      display: inline-block;
      margin-right: 6px;
    }
    .fontColor {
      color: #fff;
    }
  }
}
.goCenter-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
  position: absolute;
  z-index: 1000;
  // background: url("../assets/img/status/mapCenter.png") no-repeat center;
  background-size: contain;
}
.gomap-icon {
  transform: translate(10px, 5px);
  color: #5195c5;
  &:hover {
    color: turquoise;
  }
}
</style>
<style>
.leaflet-div-icon {
  background: transparent !important;
  border: 1px solid transparent !important;
}
.red_point_alert {
  position: relative;
  width: 40px;
  height: 40px;
  z-index: 100 !important;
}
@keyframes warn {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  25% {
    transform: scale(0);
    opacity: 0.1;
  }
  30% {
    transform: scale(0.1);
    opacity: 0.1;
  }
  40% {
    transform: scale(0.3);
    opacity: 0.1;
  }

  50% {
    transform: scale(0.4);
    opacity: 0.3;
  }
  60% {
    transform: scale(0.5);
    opacity: 0.3;
  }

  75% {
    transform: scale(0.6);
    opacity: 0.5;
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* 保持大小不变的小圆圈  */
.dot {
  position: absolute;
  width: 6px;
  height: 6px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border: 2px solid red;
  border-radius: 20px;
  z-index: 2;
}

/* 产生动画（向外扩散变大）的圆圈  */
.pulse {
  position: absolute;
  width: 24px;
  height: 24px;
  top: 20%;
  left: 20%;
  transform: translate(-50%, -50%);
  border: 6px solid red;
  -webkit-border-radius: 30px;
  -moz-border-radius: 30px;
  border-radius: 30px;
  z-index: 1;
  opacity: 0;
  -webkit-animation: warn 2s ease-out;
  -moz-animation: warn 2s ease-out;
  animation: warn 2s ease-out;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}
</style>
