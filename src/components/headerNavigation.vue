<template>
  <div class="headerNavigation">
    <div class="header">
      <div class="h-center">
        <nav>
          <ul>
            <li
              v-for="(item,index) in menus"
              :key="index"
              :class="{isSelected: getCurrentMenuId === item.id}"
              @click="routerHeader(item.id)"
            >{{item.name}}</li>
          </ul>
        </nav>
      </div>
      <div class="h-left">
        <!-- <Icon type="ios-leaf-outline" color="#fff" size="20" class="title-icon"/> -->
        <span class="h-title">东城区网格诊断与监控预警系统</span>
      </div>

      <div class="h-right">
        <Icon type="ios-contact" color="#5B9BD5" size="26"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "headerNavigation",
  props: {
    // tab标签显示文本
    id: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      menus: [
        { id: 1, name: "全区" },
        { id: 2, name: "街道" },
        { id: 3, name: "社区" },
        { id: 4, name: "基础网格" }
      ],
      currentMenuId: 1
    };
  },
  created() {
    this.$store.state.currentMenuId = 1;
  },
  computed: {
    getCurrentMenuId() {
      return this.$store.state.currentMenuId;
    }
  },
  watch: {},
  methods: {
    routerHeader(val) {
      // this.currentMenuId = val;
      this.$store.state.currentMenuId = val;
      switch (this.$store.state.currentMenuId) {
        case 1:
          this.$router.push({
            name: "Home"
          });
          break;
        case 2:
          this.$router.push({
            name: "BasicGrid",
            params: { gridType: "street" }
          });
          break;
        case 3:
          this.$router.push({
            name: "BasicGrid",
            params: { gridType: "community" }
          });
          break;
        case 4:
          this.$router.push({
            name: "BasicGrid",
            params: { gridType: "grid" }
          });
          break;
        default:
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.headerNavigation {
  height: 3.5rem;
  width: 100%;
  position: relative;
  background-color: rgba(13, 49, 85, 0.6);
  background: url("../assets/img/status/headerBg.png") no-repeat;
  background-size: 100% 100%;
  opacity: 0.9;
  .header {
    height: 100%;
    // margin: 0 1rem;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    .h-left {
      font-size: 16px;
      font-weight: bold;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 20%;
      // transform: translateY(-50%);

      .h-title {
        display: inline-block;
        // width: 523px;
        height: 34px;
        font-size: 2rem;
        font-family: BDZYJT--GB1-0 DFKai-SB;
        font-weight: normal;
        color: rgba(255, 255, 255, 1);
        line-height: 2rem;
      }
      .title-icon {
        font-weight: bold;
      }
    }
    .h-center {
      nav > ul {
        &:after {
          display: block;
          clear: both;
          content: "";
          visibility: hidden;
          height: 0;
        }
        li {
          color: #fff;
          font-weight: 800;
          width: 5rem;
          text-align: center;
          background-color: #0d295b;
          opacity: 0.9;
          opacity: 0.5;
          padding: 0.5rem;
          margin: 0 1.5rem;
          border-radius: 2px;
          float: left;
          cursor: pointer;
          &:hover {
            color: #0e396f;
            background-color: #5b9bd5;
            opacity: 0.9;
          }
        }
        .isSelected {
          color: #0e396f;
          background-color: #5b9bd5;
          opacity: 0.9;
        }
      }
    }
    .h-right {
      flex: 1;
      text-align: right;
      font-size: 24px;
    }
  }
}
</style>
