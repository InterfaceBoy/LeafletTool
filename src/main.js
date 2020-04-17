import Vue from "vue";
import axios from "axios";
import IEcharts from "vue-echarts-v3";
import iView from "iview";
import "iview/dist/styles/iview.css";
import { loadScript } from "esri-loader";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueWordCloud from "vuewordcloud";
import "leaflet/dist/leaflet.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "./assets/global.css";
// 引入swiper
import VueAwesomeSwiper from "vue-awesome-swiper";
// require styles
import "swiper/dist/css/swiper.css";
// 引入iconfont
import "./assets/iconfont/iconfont.css";
Vue.use(VueAwesomeSwiper);

Vue.component(VueWordCloud.name, VueWordCloud);

Vue.config.productionTip = false;
Vue.use(iView);

Object.defineProperty(Vue.prototype, "$http", {
  value: axios
});

const options = {
  url: "https://js.arcgis.com/4.10/"
};
loadScript(options);

new Vue({
  router,
  store,
  IEcharts,
  render: h => h(App)
}).$mount("#app");

export default function notifyMe(msg, options) {
  if (!("Notification" in window)) {
    console.log("浏览器不支持消息提醒!");
  } else if (Notification.permisstion === "granted") {
    return new Notification(msg, options);
  } else if (Notification.permisstion !== "denied") {
    Notification.requestPermission(permisstion => {
      if (permisstion === "granted") {
        return new Notification(msg, options);
      }
      return null;
    });
  }
  return null;
}
