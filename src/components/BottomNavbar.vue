<template>
  <div>
    <v-bottom-navigation
      v-if="sidebar === 'frameV'"
      class="hidden-md-and-up"
      app
      v-model="frameTabs"
      :value="true"
      color="white"
    >
      <v-btn color="green" text value="model">
        <span>Model</span>
        <v-icon>fa-cube</v-icon>
      </v-btn>

      <v-btn color="green" text value="info">
        <span>Info</span>
        <v-icon>fa-info</v-icon>
      </v-btn>

      <v-btn color="green" text value="mapcrag">
        <span>map</span>
        <v-icon>fa-map</v-icon>
      </v-btn>
      <!-- <v-icon @click="download()">fa-download</v-icon> -->
    </v-bottom-navigation>
    <v-bottom-navigation
      v-if="sidebar === 'areaV'"
      app
      v-model="areaTabs"
      :value="true"
      color="white"
    >
      <v-btn color="green" text value="info">
        <span>Info</span>
        <v-icon>fa-info</v-icon>
      </v-btn>

      <v-btn color="green" text value="maparea">
        <span>map</span>
        <v-icon>fa-map</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'bottomNav',
  computed: {
    frameTabs: {
      get() {
        return this.$store.state.frame.frameTabs;
      },
      set(value) {
        this.$store.commit('cragView', value);
      },
    },
    areaTabs: {
      get() {
        return this.$store.state.area.areaTabs;
      },
      set(value) {
        this.$store.commit('areaView', value);
      },
    },
    sidebar() {
      return this.$store.state.sidebar.sidebar;
    },
  },
  methods: {
    download() {
      console.log('in download func');
    },
  },
};
</script>
