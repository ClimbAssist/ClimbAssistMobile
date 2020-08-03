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
    <v-card>
      <v-card-title>
        Contact Us
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="form">
          <v-select
            label="Topic"
            v-model="subject"
            :items="subjectList"
            :rules="[rules.required('Select a Topic')]"
          />
          <v-textarea
            name="input-7-4"
            label="Message"
            v-model="body"
            :rules="[rules.required('Enter a message')]"
            auto-grow
          ></v-textarea>
          <v-layout wrap justify-end class="my-2">
            <v-btn
              color="primary"
              :disabled="!form"
              class="ml-2"
              @click="sendEmail()"
            >
              Send
            </v-btn>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'contact',
  data: () => ({
    subject: undefined,
    subjectList: [
      'General Inquery',
      'App Issue',
      'Account Issue',
      'Volunteer Dev',
      'Volunteer Content',
      'Volunteer Photos',
    ],
    body: undefined,
    form: false,
    rules: {
      required: (msg) => (v) => !!v || msg,
    },
  }),
  computed: {
    email() {
      return this.$store.state.user.email;
    },
  },
  methods: {
    sendEmail() {
      let mail = {
        replyToEmail: this.email,
        subject: 'contact from app - [' + this.subject + ']',
        emailBody: this.body,
      };
      cordova.plugin.http.post(
        'https://climbassist.com/v1/contact',
        mail,
        {},
        (response) => {
          //success
          this.$store.commit('updateType', 'success');
          this.$store.commit('updateTimeout', 10000);
          this.$store.commit('updateMessage', 'Message Sent');
          this.$store.commit('updateSnackbar', true);
          this.$store.commit('updateLink', undefined);
          this.$store.commit('updateLinkMessage', undefined);
          this.$router.push('/');
        },
        (response) => {
          let error = JSON.parse(response.error).error;
          console.log(response);
          this.$store.commit('updateType', 'error');
          this.$store.commit('updateTimeout', 10000);
          this.$store.commit(
            'updateMessage',
            'Unable to send message ' + error.message
          );
          this.$store.commit('updateSnackbar', true);
          this.$store.commit('updateLink', undefined);
          this.$store.commit('updateLinkMessage', undefined);
        }
      );
    },
  },
};
</script>
