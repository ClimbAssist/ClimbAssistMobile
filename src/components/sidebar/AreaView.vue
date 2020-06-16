<template>
  <v-list two-line>
    <div v-for="(subArea, subkey) in area.filteredSubAreas" :key="subkey">
      <v-list-tile color="primary">
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
      <div v-for="(crag, ckey) in subArea.filteredCrags" :key="ckey">
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
  </v-list>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "areaV",
  computed: {
    ...mapGetters({
      area: "area"
    })
  }
};
</script>
