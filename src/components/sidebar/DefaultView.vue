<template>
  <v-list two-line v-if="filterText">
    <div v-for="(area, ai) in filteredRoutes.areas" :key="ai">
      <div v-for="(subArea, subi) in area.filteredSubAreas" :key="subi">
        <div v-for="(crag, index) in subArea.filteredCrags" :key="index">
          <v-list-tile
            :to="'/' + area.slug"
            v-if="index === 0"
            class="primary"
            color="white"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{
                filteredRoutes.areas[ai].name
              }}</v-list-tile-title>
              <v-list-tile-sub-title class="grey--text text--lighten-2"
                ><span v-if="area.trad">trad {{ area.trad }}</span>
                <span v-if="area.sport"> sport {{ area.sport }}</span>
                <span v-if="area.boulder">
                  boulder {{ area.boulder }}</span
                ></v-list-tile-sub-title
              >
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile :to="'/' + area.slug + '/' + crag.slug">
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
  name: "defaultV",
  computed: {
    filterText() {
      return this.$store.state.filter.filter.filterText;
    },
    ...mapGetters({
      filteredRoutes: "filteredRoutes"
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
