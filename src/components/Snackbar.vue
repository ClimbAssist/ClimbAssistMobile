<template>
  <v-snackbar v-model="snackbar" top :timeout="timeout" :color="type">
    {{ message }} &nbsp;
    <nuxt-link v-if="link" :to="link">{{ linkMessage }}</nuxt-link>
    <v-btn text @click="snackbar = false">
      OK
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'snackbar',
  computed: {
    snackbar: {
      get() {
        return this.$store.state.snackbar.snackbar;
      },
      set(value) {
        this.$store.commit('updateSnackbar', value);
        this.$store.commit('updateLink', undefined);
        this.$store.commit('updateLinkMessage', undefined);
      },
    },
    timeout() {
      return this.$store.state.snackbar.timeout;
    },
    message() {
      return this.$store.state.snackbar.message;
    },
    type() {
      return this.$store.state.snackbar.type;
    },
    link() {
      return this.$store.state.snackbar.link;
    },
    linkMessage() {
      return this.$store.state.snackbar.linkMessage;
    },
  },
  watch: {
    snackbar: {
      handler() {
        if (this.snackbar) {
          setTimeout(() => {
            this.$store.commit('updateSnackbar', false);
          }, this.timeout);
        }
      },
    },
  },
};
</script>
