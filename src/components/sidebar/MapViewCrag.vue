<template>
  <v-list two-line>
    <div v-for="(area, ai) in filteredRoutes.areas" :key="ai">
      <div v-for="(subArea, subi) in area.filteredSubAreas" :key="subi">
        <v-list-tile v-if="subi === 0" color="primary">
          <v-list-tile-content>
            <v-list-tile-title>{{
              filteredRoutes.areas[ai].name
            }}</v-list-tile-title>
            <v-list-tile-sub-title
              ><span v-if="area.trad">trad {{ area.trad }}</span>
              <span v-if="area.sport"> sport {{ area.sport }}</span>
              <span v-if="area.boulder">
                boulder {{ area.boulder }}</span
              ></v-list-tile-sub-title
            >
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="filteredRoutes.subAreas[subi].length > 1"
          color="primary"
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ subArea.name }}</v-list-tile-title>
            <v-list-tile-sub-title
              ><span v-if="subArea.trad">trad {{ subArea.trad }}</span>
              <span v-if="subArea.sport"> sport {{ subArea.sport }}</span>
              <span v-if="subArea.boulder">
                boulder {{ subArea.boulder }}</span
              ></v-list-tile-sub-title
            >
          </v-list-tile-content>
        </v-list-tile>
        <div v-for="(crag, index) in subArea.filteredCrags" :key="index">
          <v-list-tile :to="{
            name: 'area-frame',
            params: {
              countryKey: crag.countryKey,
              stateKey: crag.stateKey,
              areaKey: crag.areaKey,
              subAreaKey: crag.subAreaKey,
              cragKey: crag.cragKey,
              area: area.slug,
              frame: crag.slug
            }
          }">
            <v-list-tile-content>
              <v-list-tile-title>{{ crag.name }}</v-list-tile-title>
              <v-list-tile-sub-title
                ><span v-if="crag.trad">trad {{ crag.trad }}</span>
                <span v-if="crag.sport"> sport {{ crag.sport }}</span>
                <span v-if="crag.boulder">
                  boulder {{ crag.boulder }}</span
                ></v-list-tile-sub-title
              >
            </v-list-tile-content>
          </v-list-tile>
        </div>
      </div>
    </div>
  </v-list>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "mapcragV",
  computed: {
    ...mapGetters({
      filteredRoutes: "filter/filteredRoutes"
    }),
    dataSet() {
      return this.$store.state.filter.dataSet;
    }
  },
  watch: {
    dataSet:  {
      handler() {
        this.$forceUpdate();
      }
    }
  }
};
</script>
