<template>
  <v-container justify-start align-content-start  >
    <div class="text-xs-center" v-if="!dataSet">
      <p>loading</p>
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    <div v-for="(country, i) in filteredRoutes.countries" :key="i">
      <v-toolbar color="primary" dark>
        <v-toolbar-title
          >{{ country.name }}
          </v-toolbar-title
        >
      </v-toolbar>
      <v-card v-for="(region, si) in country.filteredRegions" :key="si">
        <v-card-title
          >{{ region.name }} </v-card-title
        >
        <v-container>
          <v-expansion-panels>
            <v-expansion-panel
              v-for="(area, ai) in region.filteredAreas"
              :key="ai"
            >
              <v-expansion-panel-header>
                <router-link
                  :to="{
                    name: 'area',
                    params: {
                      countryKey: area.countryKey,
                      regionKey: area.regionKey,
                      areaKey: area.areaKey,
                      area: area.areaId
                    }
                  }"
                  >{{ area.name }}
                </router-link>
                <span>-</span>
                <span style="color: red; white-space: nowrap;" v-if="area.trad !== 0">{{ area.trad }} trad</span>
                <span style="color: blue; white-space: nowrap;" v-if="area.sport !== 0">{{ area.sport }} sport</span>
                <span style="color: yellow; white-space: nowrap;" v-if="area.boulder !== 0">{{ area.boulder }} boulder</span>
                <v-chip outlined disabled color="primary" v-for="(subArea, subChip) in area.filteredSubAreas" v-if="subArea.name !== area.name" :key="subChip">{{subArea.name}}</v-chip>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div
                  v-for="(subArea, subi) in area.filteredSubAreas"
                  :key="subi"
                >
                  <div
                    class="primary white--text pa-2"
                    v-if="subArea.name !== area.name"
                  >
                    {{ subArea.name }}
                    <span>-</span>
                    <span style="color: red;" v-if="subArea.trad !== 0">{{ subArea.trad }} trad</span>
                    <span style="color: blue" v-if="subArea.sport !== 0">{{ subArea.sport }} sport</span>
                    <span style="color: yellow" v-if="subArea.boulder !== 0">{{ subArea.boulder }} boulder</span>
                  </div>
                  <div
                    class="pa-2"
                    v-for="(crag, ci) in subArea.filteredCrags"
                    :key="ci"
                  >
                    <router-link
                      :to="{
                        name: 'frame',
                        params: {
                          countryKey: crag.countryKey,
                          regionKey: crag.regionKey,
                          areaKey: crag.areaKey,
                          subAreaKey: crag.subAreaKey,
                          cragKey: crag.cragKey,
                          area: area.areaId,
                          frame: crag.cragId
                        }
                      }"
                      >
                      {{ crag.name }}
                    </router-link>
                    <span>-</span>
                    <span style="color: red; white-space: nowrap;" v-if="crag.trad !== 0">{{ crag.trad }} trad</span>
                    <span style="color: blue; white-space: nowrap;" v-if="crag.sport !== 0">{{ crag.sport }} sport</span>
                    <span style="color: yellow; white-space: nowrap;" v-if="crag.boulder !== 0">{{ crag.boulder }} boulder</span>
                    <v-chip outlined disabled color="primary" v-for="(wall, walli) in crag.walls" :key="walli" v-if="wall.name !==crag.name">{{wall.name}}</v-chip>
                  </div>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "list",
  data() {
    return {
      dataCommitted: 0
    };
  },
  computed: {
    ...mapGetters({
      filteredRoutes: "filteredRoutes"
    }),
    dataSet() {
      return this.$store.state.filter.dataSet;
    }
  }
};
</script>
<style>
</style>
