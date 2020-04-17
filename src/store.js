import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentMenuId: 1, // 头部导航的id
    currentDate: "", // 当前时间
    leftExponentail: "", // Home中的指标属性组件 左
    rightExponentail: "",
    indicatorIndex: "一", // 指标指数
    GridsAlertText: "", // 网格预警
    streetName: [], //街道名称
    streesName: [],
    onDaySpan: 0, // 全区数据显示对应的天数
    streetNameCode: "", // 街道名字和代号对应的对象
    streetNumber: "", // 街道个数
    barInfo: {}, // 柱状图点击的信息对象
    allStreetNameCode: {} // 街道对应的id和名称
  },
  mutations: {},
  actions: {},
  getters: {
    getCurrentDate(state) {
      let [year, month, day] = new Date().toLocaleDateString().split("/");
      state.currentDate = `${year}年${month}月${day}日`;
      return state.currentDate;
    }
  }
});
