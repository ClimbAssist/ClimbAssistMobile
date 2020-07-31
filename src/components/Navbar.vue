<template>
  <div>
    <v-flex>
      <v-toolbar-title v-if="sidebar === 'frameV'">{{
        cragName
      }}</v-toolbar-title>
      <v-toolbar-title v-else-if="sidebar === 'areaV'">{{
        areaName
      }}</v-toolbar-title>
      <v-toolbar-title v-else>Climb Assist</v-toolbar-title>
    </v-flex>
  </div>
</template>

<script>
export default {
  name: 'navbar',
  data() {
    return {
      length: 20,
    };
  },
  computed: {
    crag() {
      return this.$store.state.filter.cragState.name;
    },
    area() {
      return this.$store.state.filter.areaState.name;
    },
    sidebar() {
      return this.$store.state.sidebar.sidebar;
    },
    cragName() {
      if (this.crag) {
        var cragName =
          this.crag.length > this.length
            ? this.crag.substring(0, this.length - 3) + '...'
            : this.crag;
        return cragName;
      }
    },
    areaName() {
      if (this.area) {
        var areaName =
          this.area.length > this.length
            ? this.area.substring(0, this.length - 3) + '...'
            : this.area;
        return areaName;
      }
    },
  },
};
</script>
