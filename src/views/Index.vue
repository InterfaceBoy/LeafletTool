<template>
  <div class="carousel-warp">
    <Carousel :autoplay-speed="speed" dots="none">
      <!-- 1 -->
      <CarouselItem>
        <Portal/>
      </CarouselItem>
      <!-- 2 -->
      <CarouselItem>
        <Home/>
      </CarouselItem>
      <!-- 3 -->
      <CarouselItem>
        <!-- <div class="map-modal"> -->
        <!-- <div class="map-container"> -->
        <!-- <div class="container-header">
              <div
                class="tab-item"
                v-for="(tabItem, index) in mapTabList"
                :key="index"
                :class="{'tab-active':clickedTabItem === tabItem}"
                @click="handleMapTab(tabItem)"
              >{{tabItem}}</div>
        </div>-->
        <div>
          <gridView :gridType="gridType" v-if="isShowgridView"/>
          <!-- </div> -->
          <!-- </div> -->
        </div>
      </CarouselItem>
    </Carousel>
  </div>
  <!--  /* eslint-disable */ -->
</template>
<script>
import Home from "./Home";
import bottomMap from "@/components/bottomMap.vue";
import Portal from "@/components/Portal.vue";
import BasicGrid from "./BasicGrid";
import gridView from "@/components/gridView.vue";
export default {
  data() {
    return {
      speed: 10000,
      mapTabList: ["街道", "社区", "基础网格"],
      clickedTabItem: "街道", // 当前被点击的tabItem,
      gridType: "street",
      gridsAlert: [], // 网格的数据,名称和值
      propsConfig: {},
      isShowgridView: false,
      streetsGeoJson: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.isShowgridView = true;
    });
  },
  methods: {
    handleMapTab(item) {
      this.clickedTabItem = item;
      switch (item) {
        case "街道":
          this.gridType = "street";
          break;
        case "社区":
          this.gridType = "community";
          break;
        case "基础网格":
          this.gridType = "grid";
          break;
        default:
      }
    }
  },
  components: {
    Home,
    Portal,
    bottomMap,
    BasicGrid,
    gridView
  }
};
</script>
<style lang="scss" scoped>
.carousel-warp {
  height: calc(100vh - 3.6rem);
  overflow: hidden;
  .map-modal {
    .close-icon {
      position: absolute;
      right: 1rem;
      top: 1rem;
      cursor: pointer;
    }
    .close-icon:hover {
      color: #3dc5c4;
    }
    .map-container {
      width: 100%;
      height: 100%;
      .container-header {
        width: 100%;
        height: 3rem;
        background: #012134;
        display: flex;
        justify-content: center;
        align-items: center;
        .tab-item {
          height: 2.2rem;
          line-height: 2.2rem;
          font-size: 14px;
          font-weight: 800;
          padding: 0 1.5rem;
          margin-right: 1rem;
          border-radius: 0.3rem;
          cursor: pointer;
          color: #fff;
        }
        .tab-active {
          background: #143b6b;
        }
      }
      .container-main {
        width: 100%;
        height: calc(100% - 3rem);
        background: RGBA(1, 28, 40, 0.8);
      }
    }
  }
}
</style>
