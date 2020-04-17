<template>
  <div
    ref="map"
    class="map"
  >

  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import EventBus from "../utils/EventBus.js";

export default {
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      map: null,
      indexLayer: null
    };
  },
  beforeMount() {
    loadModules([
      "esri/Map",
      "esri/views/SceneView",
      "esri/layers/FeatureLayer"
    ]).then(([Map, SceneView, FeatureLayer]) => {
      const map = new Map({
        basemap: null,
        ground: {
          surfaceColor: "#011129"
        }
      }); // 地图不显示底图
      const that = this;
      addFeatureLayer(this.getLayerData());

      const view = new SceneView({
        map: map,
        container: this.$refs.map,
        camera: {
          tilt: 60,
          position: {
            x: 116.40129788520804,
            y: 39.74462465925591,
            z: 10000
          }
        },
        ui: {
          components: []
        }
      });
      view.on("click", event => {
        view.hitTest(event).then(response => {
          if (response.results.length) {
            const graphic = response.results.filter(result => {
              return result.graphic.layer === that.indexLayer;
            })[0].graphic;
            const attributes = graphic.attributes;
            const gridId = attributes.ObjectId;
            const gridName = attributes.name;
            EventBus.$emit("showGridDetail", {
              gridId: gridId,
              gridName: gridName
            });
          }
        });
      });
      function addFeatureLayer(data) {
        data.then(json => {
          const fields = [
            {
              name: "ObjectID",
              alias: "ObjectID",
              type: "oid"
            },
            {
              name: "gridName",
              alias: "gridName",
              type: "string"
            }
          ];
          const renderer = {
            type: "simple",
            symbol: {
              type: "simple-fill",
              color: [0, 255, 255, 0.2],
              outline: {
                color: [0, 255, 255, 0.2],
                width: 1
              }
            }
          };
          const layer = new FeatureLayer({
            source: json,
            fields: fields,
            objectIdField: "ObjectID",
            renderer: renderer
          });
          that.indexLayer = layer;
          map.add(layer);
        });
      }
    });
  },
  methods: {
    // 获取北京全域底图json
    async getBaseLayerData() {
      const url = `${this.baseUrl}/static/beijing.json`;
      const result = await this.$http.get(url);
      const geojson = result.data;
      return geojson.features.map(feature => {
        return {
          geometry: {
            type: "polygon", // autocasts as new Polygon()
            rings: feature.geometry.coordinates
          },
          attibutes: {
            ObjectID: feature.id
          }
        };
      });
    },
    // 获取东城区的图层
    async getLayerData() {
      let mapUrl = "";
      switch (this.gridType) {
        case "street":
          mapUrl = `${this.baseUrl}/static/streets.json`;
          break;
        case "community":
          mapUrl = `${this.baseUrl}/static/grid.json`;
          break;
        case "grid":
          mapUrl = `${this.baseUrl}/static/grid.json`;
          break;
        default:
          mapUrl = `${this.baseUrl}/static/streets.json`;
          break;
      }

      const result = await this.$http.get(mapUrl);
      const geojson = result.data;
      return geojson.features.map(feature => {
        return {
          geometry: {
            type: "polygon", // autocasts as new Polygon()
            rings: feature.geometry.coordinates
          },
          attibutes: {
            ObjectID: feature.properties.jdcode,
            gridName: feature.properties.jdname
          }
        };
      });
    }
  }
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
