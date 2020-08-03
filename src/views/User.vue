<template>
  <v-container>
    <v-card>
      <v-container>
        <h2>{{ username }}</h2>
        <v-layout class="ma-4" row justify-center>
          {{ email }}
        </v-layout>
        <v-divider />
        <v-container>
          <v-layout class="ma-4" row justify-center>
            <router-link to="/terms-and-conditions">
              terms and conditions
            </router-link>
          </v-layout>
          <v-layout class="ma-4" row justify-center>
            <router-link to="/contact">
              contact us
            </router-link>
          </v-layout>
        </v-container>
        <v-divider />
        <v-layout class="ma-4" row justify-end>
          <v-btn @click="logout()">logout</v-btn>
        </v-layout>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({}),
  middleware: 'loggedin',
  computed: {
    username() {
      return this.$store.state.user.username;
    },
    email() {
      return this.$store.state.user.email;
    },
  },
  methods: {
    async logout() {
      cordova.plugin.http.post(
        'https://www.climbassist.com/v1/user/sign-out',
        {},
        {},
        (response) => {
          //success
          this.$store.commit('updateFromServer', false);
          this.$store.commit('updateUsername', undefined);
          this.$store.commit('updateEmail', undefined);
          this.$store.commit('updateUser', undefined);
          this.$store.commit('updateDialogOpen', true);
          this.$router.push('/');
          this.$store.commit('updateDialogComponent', 'login');

          this.$store.commit('snackbar/updateType', 'success');
          this.$store.commit('snackbar/updateTimeout', 10000);
          this.$store.commit('snackbar/updateMessage', 'Logged Out');
          this.$store.commit('snackbar/updateSnackbar', true);
          this.$store.commit('snackbar/link', undefined);
          this.$store.commit('snackbar/linkMessage', undefined);
        },
        (response) => {
          //fail user not loggged in
          this.$store.commit('updateUserError', response);
          console.log(response);
          this.$store.commit('updateType', 'error');
          this.$store.commit('updateTimeout', 10000);
          this.$store.commit('updateMessage', err.message);
          this.$store.commit('updateSnackbar', true);
          this.$store.commit('link', undefined);
          this.$store.commit('linkMessage', undefined);
        }
      );
    },
  },
};
</script>
