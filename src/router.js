import Vue from "vue";
import Router from "vue-router";
import Index from "./views/Index.vue";
// 启动界面
import HomePage from "./views/HomePage.vue";
//首页
import Home from "./views/Home.vue";
//基础网格basis
import BasicGrid from "./views/BasicGrid.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "HomePage",
      // redirect: "HomePage",
      component: HomePage
    },
    {
      path: "/Home",
      name: "Home",
      component: Index
    },
    {
      path: "/HomeSub",
      name: "HomeSub",
      component: Home
    },
    {
      path: "/BasicGrid/:gridType",
      name: "BasicGrid",
      component: BasicGrid,
      props: true
    }
  ]
});
