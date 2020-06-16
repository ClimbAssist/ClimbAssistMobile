<template>
  <v-container>
    <v-layout row justify-center>
      <v-flex>
        <v-img
          :src="require('@/assets/logo.png')"
          class="mb-3 mx-auto"
          width="150"
        />
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <h2>
        3D Climbing Topos and Guides
      </h2>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "home",
  data: () => ({
    drawer: null
  }),
  props: {
    source: String
  },
  methods: {}
};
</script>
