<template>
  <div id="pitchMap" class="map">

  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  data() {
    return {
      baseUrl: process.env.BASE_URL
    };
  },
  mounted() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoicGhveGlhbyIsImEiOiJjajUzbmdrdTQwc3pqMzNucjNkY3FjdjlkIn0.w1WTmKJiAX_CQRLocSffsg";
    const map = new mapboxgl.Map({
      container: "pitchMap",
      center: [31.145985, 121.441011], // starting position [lng, lat]
      zoom: 4,
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "#384457"
            }
          }
        ]
      },
      pitch: 45
    });
    map.on("load", function() {
      map.addLayer({
        id: "maine",
        type: "fill",
        source: {
          type: "geojson",
          data: `${this.baseUrl}/static/taxi_zone.json`
        },
        layout: {},
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.8
        }
      });
    });
  }
};
</script>

<style scoped lang="scss">
.map {
  width: 100%;
  height: 100%;
}
</style>
