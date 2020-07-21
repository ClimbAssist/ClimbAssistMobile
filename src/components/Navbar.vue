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
      return this.$store.state.filter.cragState;
    },
    area() {
      return this.$store.state.filter.areaState;
    },
    sidebar() {
      return this.$store.state.sidebar.sidebar;
    },
    cragName() {
      var cragName =
        this.crag.name.length > this.length
          ? this.crag.name.substring(0, this.length - 3) + '...'
          : this.crag.name;
      return cragName;
    },
    areaName() {
      var areaName =
        this.crag.name.length > this.length
          ? this.area.name.substring(0, this.length - 3) + '...'
          : this.area.name;
      return areaName;
    },
  },
};
</script>
