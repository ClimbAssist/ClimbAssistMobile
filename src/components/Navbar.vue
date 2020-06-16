<template>
  <div>
    <v-flex>
      <v-toolbar-title v-if="sidebar === 'frameV'">{{
        crag.name
      }}</v-toolbar-title>
      <v-toolbar-title v-else-if="sidebar === 'areaV'">{{
        area.name
      }}</v-toolbar-title>
      <v-toolbar-title v-else>Climb Assist</v-toolbar-title>
    </v-flex>
  </div>
</template>

<script>
export default {
  name: "navbar",
  computed: {
    crag() {
      return this.$store.state.filter.cragState;
    },
    area() {
      return this.$store.state.filter.areaState;
    },
    sidebar() {
      return this.$store.state.sidebar.sidebar;
    }
  }
};
</script>
