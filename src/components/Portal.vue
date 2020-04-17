<template>
  <div id="Portal">
    <div class="portal-images"></div>
    <div class="on-click"></div>
  </div>
</template>

<script>
export default {
  name: "Portal",
  data() {
    return {};
  },
  methods: {
    portal() {
      this.$router.push({
        name: "Home"
      });
    }
  }
};
</script>

<style lang="scss">
.portal-images {
  width: 100%;
  height: calc(100vh - 3.6rem);
  // min-height: 500px;
  background: url("../assets/img/status/WechatIMG81.png");
  position: relative;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 50%;

  // background-attachment: fixed;
}
.on-click {
  width: 16.5%;
  height: 7%;
  position: absolute;
  bottom: 9.7%;
  left: 43%;
  // cursor: pointer;
}
</style>
