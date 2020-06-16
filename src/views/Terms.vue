<template>
  <v-app id="home">
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex text-xs-center>
            <p>Terms and Conditions</p>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "terms-and-conditions",
  data: () => ({
    drawer: null
  }),
  props: {
    source: String
  },
  methods: {}
};
</script>
