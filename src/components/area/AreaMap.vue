<template>
  <div id="map" />
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      access:
        'pk.eyJ1IjoiY2xpbWJhc3Npc3QiLCJhIjoiY2pmMDZ1ejBvMGpxZDJ3cWpiZ2w3c2w4NiJ9.Xwqm5bhXRQU-LrC2keGw3g',
      cragThreshold: 11,
      zoom: null,
      cragZoom: true,
      currentRoutes: null,
      areaInfo: null,
      pin: require('@/assets/map_icon.png'),
      subAreaNames: [],
    };
  },
  watch: {
    filter: {
      handler() {
        if (this.map.getLayer('crags')) {
          this.map.removeLayer('crags');
          this.map.removeSource('crags');
        }
        setTimeout(() => {
          this.addLayers();
        }, 100);
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters({
      area: 'area',
    }),
    filter() {
      return this.$store.state.filter.filter;
    },
    cragPins() {
      var pins = [];
      for (let subkey in this.area.filteredSubAreas) {
        for (let ckey in this.area.filteredSubAreas[subkey].filteredCrags) {
          let pin = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [
                this.area.filteredSubAreas[subkey].filteredCrags[ckey].location
                  .longitude,
                this.area.filteredSubAreas[subkey].filteredCrags[ckey].location
                  .latitude,
              ],
            },
            properties: {
              title: this.area.filteredSubAreas[subkey].filteredCrags[ckey]
                .name,
              area: this.area.areaId,
              frame: this.area.filteredSubAreas[subkey].filteredCrags[ckey]
                .cragId,
              subAreaKey: this.area.filteredSubAreas[subkey].subAreaKey,
              cragKey: this.area.filteredSubAreas[subkey].filteredCrags[ckey]
                .cragKey,
              trad: this.area.filteredSubAreas[subkey].filteredCrags[ckey].trad,
              sport: this.area.filteredSubAreas[subkey].filteredCrags[ckey]
                .sport,
              boulder: this.area.filteredSubAreas[subkey].filteredCrags[ckey]
                .boulder,
            },
          };
          pins.push(pin);
        }
      }
      return pins;
    },
    subAreaFills() {
      let fills = [];
      let offset = 0.003;
      for (let subkey in this.area.area.subAreas) {
        if (this.area.area.subAreas[subkey].crags.length > 1) {
          let minLatitude = this.area.area.subAreas[subkey].crags[0].location
            .latitude;
          let minLongitude = this.area.area.subAreas[subkey].crags[0].location
            .longitude;
          let maxLatitude = this.area.area.subAreas[subkey].crags[0].location
            .latitude;
          let maxLongitude = this.area.area.subAreas[subkey].crags[0].location
            .longitude;
          for (let ckey in this.area.area.subAreas[subkey].crags) {
            if (
              this.area.area.subAreas[subkey].crags[ckey].location.latitude <
              minLatitude
            ) {
              minLatitude = this.area.area.subAreas[subkey].crags[ckey].location
                .latitude;
            }
            if (
              this.area.area.subAreas[subkey].crags[ckey].location.latitude >
              maxLatitude
            ) {
              maxLatitude = this.area.area.subAreas[subkey].crags[ckey].location
                .latitude;
            }
            if (
              this.area.area.subAreas[subkey].crags[ckey].location.longitude <
              minLongitude
            ) {
              minLongitude = this.area.area.subAreas[subkey].crags[ckey]
                .location.longitude;
            }
            if (
              this.area.area.subAreas[subkey].crags[ckey].location.longitude >
              maxLongitude
            ) {
              maxLongitude = this.area.area.subAreas[subkey].crags[ckey]
                .location.longitude;
            }
          }
          minLongitude -= offset;
          maxLongitude += offset;
          minLatitude -= offset;
          maxLatitude += offset;
          let titleLoc = [
            minLongitude + (maxLongitude - minLongitude) / 2,
            maxLatitude,
          ];
          let title = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: titleLoc,
            },
            properties: {
              title: this.area.area.subAreas[subkey].name,
            },
          };
          let fill = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [minLongitude, minLatitude],
                  [minLongitude, maxLatitude],
                  [maxLongitude, maxLatitude],
                  [maxLongitude, minLatitude],
                  [minLongitude, minLatitude],
                ],
              ],
            },
          };
          this.subAreaNames.push(title);
          fills.push(fill);
        }
      }
      return fills;
    },
  },
  methods: {
    addLayers() {
      this.map.addLayer({
        id: 'crags',
        type: 'symbol',
        minzoom: this.cragThreshold,
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.cragPins,
          },
        },
        layout: {
          'icon-image': 'pin',
          'icon-allow-overlap': true,
          'icon-size': 0.7,
          'text-field': '{title}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.6],
          'text-anchor': 'top',
        },
      });
    },
    addSubAreaLayers() {
      this.map.addLayer({
        id: 'subAreas',
        type: 'fill',
        minzoom: this.cragThreshold,
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.subAreaFills,
          },
        },
        paint: {
          'fill-color': '#449947',
          'fill-opacity': 0.4,
        },
      });
      this.map.addLayer({
        id: 'subAreaNames',
        type: 'symbol',
        minzoom: this.cragThreshold,
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.subAreaNames,
          },
        },
        layout: {
          'text-field': '{title}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, -0.6],
          'text-anchor': 'bottom',
        },
      });
    },
    createMap() {
      const mapboxgl = require('mapbox-gl');
      mapboxgl.accessToken =
        'pk.eyJ1IjoiY2xpbWJhc3Npc3QiLCJhIjoiY2pmMDZ1ejBvMGpxZDJ3cWpiZ2w3c2w4NiJ9.Xwqm5bhXRQU-LrC2keGw3g';
      // init the map
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [
          this.area.area.location.longitude,
          this.area.area.location.latitude,
        ],
        zoom: 13,
        minZoom: 11,
      });
      this.mapLoaded(this.map, mapboxgl);
    },
    mapLoaded(map, mapboxgl) {
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();
      map.on('style.load', () => {
        let popup = new mapboxgl.Popup({
          closeButton: false,
        });
        map.loadImage(this.pin, (error, image) => {
          if (error) throw error;
          map.addImage('pin', image);
          // add crags
          this.addLayers();
          this.addSubAreaLayers();
        });
        map.on('click', 'crags', (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['crags'],
          });
          if (!features.length) {
            return;
          }

          const feature = features[0];
          this.$router.push({
            name: 'area-frame',
            params: {
              subAreaKey: feature.properties.subAreaKey,
              cragKey: feature.properties.cragKey,
              area: feature.properties.area,
              frame: feature.properties.frame,
            },
          });
        });

        // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
        map.on('mousemove', 'crags', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['crags'],
          });
          if (!features.length) {
            return;
          }
          const feature = features[0];
          // Populate the popup and set its coordinates
          // based on the feature found.
          popup
            .setLngLat(feature.geometry.coordinates)
            .setText(
              ' trad (' +
                feature.properties.trad +
                ')' +
                ' sport (' +
                feature.properties.sport +
                ')' +
                ' boulder (' +
                feature.properties.boulder +
                ')'
            )
            .addTo(map);
        });

        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'crags', (e) => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });
      });
    },
  },
  mounted() {
    this.createMap();
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
#info {
  position: absolute;
  bottom: 0px;
}
</style>
<style>
.mapboxgl-canvas {
  left: 0;
}
</style>
