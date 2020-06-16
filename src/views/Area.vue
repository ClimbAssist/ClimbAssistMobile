<template>
  <keep-alive>
    <component :is="areaTabs" />
  </keep-alive>
</template>

<script>
import AreaInfo from "../components/area/AreaInfo.vue";
import MapArea from "../components/area/AreaMap.vue";
export default {
  data() {
    return {
    };
  },
  computed: {
    areaTabs() {
      return this.$store.state.area.areaTabs;
    },
  },
  methods: {
  },
  components: {
    maparea: MapArea,
    info: AreaInfo
  },
  created() {
    this.$store.commit("updateFilterText", "");
    this.$store.commit("areaView", "info");
    this.$store.commit(
      "updateArea",
      this.$store.state.filter.countries[this.$route.params.countryKey].regions[this.$route.params.regionKey]
        .areas[this.$route.params.areaKey]
    );
  },
  mounted() {
    this.$store.commit("updateSidebar", "areaV");
  },
  destroyed() {
    this.$store.commit("updateSidebar", "defaultV");
    this.$store.commit("updateMapBounds", undefined);
  }
};
</script>

<style scoped>
.trad-style {
  color: #ff3300;
}
.sport-style {
  color: #0066ff;
}
.boulder-style {
  color: #33cc66;
}
</style>
