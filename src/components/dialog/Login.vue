<template>
  <section id="login">
    <v-container>
      <v-card>
        <v-card-text class="pa-5">
          <v-img src="@/assets/logo.png" class="mb-3 mx-auto" width="80" />
          <h3 class="text-xs-center">Sign in to Climb Assist</h3>
          <v-layout justify-center>
            <v-flex md8 sm12>
              <v-form @keyup.enter="submit()">
                <v-text-field
                  v-model="email"
                  autofocus
                  label="Username or Email"
                  name="email"
                />
                <v-text-field
                  v-model="password"
                  :append-icon="show ? 'fa-eye' : 'fa-eye-slash'"
                  :type="show ? 'text' : 'password'"
                  class="mb-3"
                  label="Password"
                  name="password"
                  @click:append="show = !show"
                />
              </v-form>
              <v-layout wrap justify-center>
                <v-flex md6 lg4>
                  <v-dialog v-model="forgotDialog" width="500">
                    <template v-slot:activator="{ on }">
                      <v-btn block small color="primary" text dark v-on="on">
                        Forgot Password?
                      </v-btn>
                    </template>

                    <v-card>
                      <v-card-title
                        class="headline primary white--text"
                        primary-title
                      >
                        Password Reset Email
                      </v-card-title>
                      <v-card-text>
                        <v-form @keyup.enter="submit">
                          <v-text-field
                            v-model="email"
                            autofocus
                            label="Username or Email"
                            name="email"
                          />
                        </v-form>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions>
                        <v-btn text @click="forgotDialog = false">
                          Cancel
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="primary"
                          text
                          @click="(forgotDialog = false), sendPassReset()"
                        >
                          Send
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-flex>
                <v-flex md12 lg4>
                  <v-btn
                    :disabled="!email || !password"
                    :loading="isLoading"
                    class="text-capitalize"
                    color="primary"
                    depressed
                    block
                    @click="submit"
                  >
                    Submit
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
  </section>
</template>

<script>
import { fetchUser } from '../../mixins/fetchUser.js';
export default {
  name: 'login',
  data: () => ({
    show: false,
    email: '',
    password: '',
    isLoading: false,
    forgotDialog: false,
  }),
  computed: {},
  mixins: [fetchUser],
  methods: {
    async sendPassReset() {
      let obj;
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
        obj = {
          email: this.email,
        };
      } else {
        obj = {
          username: this.email,
        };
      }
      await cordova.plugin.http.post(
        'https://www.climbassist.com/v1/user/send-password-reset-email',
        obj,
        {},
        (response) => {
          //get user fetchUser.js mixin
          this.$store.commit(
            'updateDialogText',
            'Password reset email has been sent, check your email to reset your password.'
          );
        },
        (response) => {
          //post failed
          if (response.status === 404) {
            this.$store.commit('updateDialogText', 'User does not exist');
          } else {
            this.$store.commit('updateDialogText', response.error.message);
          }
        }
      );
    },
    async submit() {
      this.isLoading = true;
      let obj;
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
        obj = {
          email: this.email,
          password: this.password,
        };
      } else {
        obj = {
          username: this.email,
          password: this.password,
        };
      }
      await cordova.plugin.http.post(
        'https://www.climbassist.com/v1/user/sign-in',
        obj,
        {},
        (response) => {
          //success get user fetchUser.js mixin
          this.getUser();
          this.$store.commit('updateDialogOpen', false);
        },
        (response) => {
          console.log(response);
          //post failed
          if (response.status === 404) {
            this.$store.commit('updateDialogText', 'User does not exist');
          } else if (response.status === 401) {
            this.$store.commit(
              'updateDialogText',
              'Username and Password do not match'
            );
          } else {
            this.$store.commit(
              'updateDialogText',
              'Invalid Username or Password'
            );
          }
        }
      );
      this.isLoading = false;
    },
  },
};
</script>
