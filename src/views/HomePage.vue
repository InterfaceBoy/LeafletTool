<template>
  <div id="homePage" class="swiper-slide">
    <!-- swiper -->
    <!-- <swiper :options="swiperOption"> -->
    <!-- <swiper-slide class="swiper-slide"> -->
    <div class="frosted-glass"></div>
    <div class="title">东城区网格诊断与监测预警系统</div>
    <div class="text">
      <p class="subtitle">城市网格诊断</p>
      <p>基于多源数据，构建多维指标体系，
        <br>刻画复杂多元的城市网格系统，直观、精细、全面地表征城市的运行状态并加以评估，
        <br>借以探索城市发展规律，发现城市日常运行和未来发展中所存在的问题，辅助日常管理，支撑发展决策，
        <br>进而推进智慧城市管理和民生智慧服务
      </p>
    </div>
    <div class="text-title">
      <p>
        <span class="rect-text tz">网格体征</span>
      </p>
      <p>
        <span class="rect-text sx">网格属性</span>
      </p>
      <p>
        <span class="rect-text xx">网格效能</span>
      </p>
      <p>
        <span class="rect-text fx">网格风险</span>
      </p>
      <p>
        <span class="rect-text hd">网格活动</span>
      </p>
    </div>
    <router-link to="/Home" tag="div" style="z-index:999">
      <!-- <div class="loginBtn" data-swiper-parallax="-400" @click="loginSystem()"> -->
      <div class="loginBtn">
        <img src="../assets/img/status/go-btn.png">
      </div>
    </router-link>
    <!-- </swiper-slide> -->
    <!-- <div class="swiper-pagination swiper-pagination-white" slot="pagination"></div> -->
    <!--<div class="swiper-button-prev swiper-button-white" slot="button-prev"></div>-->
    <!--<div class="swiper-button-next swiper-button-white" slot="button-next"></div>-->
    <!-- </swiper> -->
  </div>
</template>
<script>
export default {
  name: "homePage",
  data() {
    return {
      swiperOption: {
        notNextTick: true,
        //循环
        loop: true,
        //设定初始化时slide的索引
        initialSlide: 0,
        //自动播放
        autoplay: true,
        parallax: true,
        // autoplay: {
        //     delay: 3000,
        //     stopOnLastSlide: false,
        //     disableOnInteraction: true,
        // },
        // 设置轮播
        effect: "fade",
        //滑动速度
        speed: 800,
        //滑动方向
        direction: "horizontal",
        //小手掌抓取滑动
        // grabCursor : true,
        //滑动之后回调函数
        on: {
          slideChangeTransitionEnd: function() {
            // console.log(this.activeIndex);//切换结束时，告诉我现在是第几个slide
          }
        },
        //左右点击
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
        //分页器设置
      },
      swiperSlides: [1, 2, 3, 4]
    };
  },
  mounted: function() {},
  methods: {
    loginSystem: function() {
      this.$router.push({
        name: "Home"
      });
    }
  }
};
</script>
<style scoped>
#homePage {
  position: absolute;
  width: 100vw;
  /* height: calc(100vh - 3.6rem); */
  height: 100vh;
  min-width: 1200px;
  min-height: 500px;
  text-align: center;
  top: 0;
  right: 0;
  background: url("../assets/img/status/bg03.png") no-repeat;
  background-size: 100% 100%;
  color: #fff;
}
.swiper-slide {
  /* background: url("../assets/img/status/bg03.png") no-repeat; */
  /* background: url("../assets/img/status/index.svg") no-repeat; */
  /* background-size: 100%, 100%; */
  font-size: 18px;
  color: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: transparent !important;
  justify-content: space-around !important;
  z-index: 100;
}
/*.swiper-slide .frosted-glass{*/
/*width: 100%;*/
/*height: 100%;*/
/*background: inherit;*/
/*-webkit-filter: blur(5px);*/
/*-moz-filter: blur(5px);*/
/*-ms-filter: blur(5px);*/
/*-o-filter: blur(5px);*/
/*filter: blur(5px);*/
/*}*/
.swiper-slide .title {
  margin-top: 14vh;
  margin-left: 6vw;
  text-align: left;
  font-size: 4rem;
  font-weight: 400;
  font-family: "Microsoft YaHei";
  z-index: 100000;
}
.swiper-slide .subtitle {
  margin-top: 6.5vh;
  font-size: 23px;
  font-weight: bold;
  font-family: "Microsoft YaHei";
}
.swiper-slide .text {
  margin-left: 6vw;
  margin-top: 12vh;
  text-align: left;
  font-size: 18px;
  font-weight: 300;
  font-family: "Microsoft YaHei";
}
.swiper-slide .loginBtn {
  width: 300px;
  margin-top: 18vh;
  margin-left: 6vw;
  cursor: pointer;
}
.swiper-slide .loginBtn img {
  width: 100%;
}
.swiper-slide .loginBtn img:hover {
  transform: scale(1.1, 1.1);
}
.text-title {
  width: 50%;
  position: absolute;
  height: 100vh;
  right: 0;
  top: 0%;
}
.text-title .rect-text {
  border: 1px dotted #fff;
  font-size: 12px;
  position: absolute;
  padding: 3px;
}
.text-title .rect-text.tz {
  top: 7%;
  right: 45%;
}
.text-title .rect-text.sx {
  top: 20%;
}
.text-title .rect-text.xx {
  top: 28%;
  right: 60%;
}
.text-title .rect-text.fx {
  top: 50%;
  left: 1;
}
.text-title .rect-text.hd {
  top: 70%;
  left: 10%;
}
</style>
