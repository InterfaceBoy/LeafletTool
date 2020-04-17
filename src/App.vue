<template>
  <div id="app">
    <div class="container">
      <headerNavigation v-if="headerIsShow"/>
      <router-view/>
    </div>
  </div>
</template> 
<script>
import headerNavigation from "@/components/headerNavigation.vue";

export default {
  name: "app",
  data() {
    return {
      headerIsShow: true
    };
  },
  components: {
    headerNavigation
  },
  watch: {
    $route() {
      if (this.$route.name === "Portal") {
        this.headerIsShow = false;
      } else {
        this.headerIsShow = true;
      }
    }
  },
  created() {
    if (this.$route.name === "Portal") {
      this.headerIsShow = false;
    }
  }
};
</script>

<style lang="scss">
@import url("https://js.arcgis.com/4.10/esri/css/main.css");
#app {
  font-family: "PingFang SC", "Microsoft YaHei";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ffffff;
  width: 100%;
  height: 100vh;
  min-width: 1200px;
  min-height: 500px;
  overflow: auto;
  background-color: #112945;
  .container {
    width: 100%;
    height: 100%;
  }
}

/* 重写滚动条样式 */
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/

::-webkit-scrollbar {
  width: 5px;
  height: 0px;
  background-color: transparent;
}

/*定义滚动条轨道 内阴影+圆角*/

::-webkit-scrollbar-track {
  width: 0;
  border-radius: 0;
  background-color: transparent;
}

/*定义滑块 内阴影+圆角*/

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  width: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #e7ecf2;
}

/*滑块效果*/

::-webkit-scrollbar-thumb:hover {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.4);
}
</style>
