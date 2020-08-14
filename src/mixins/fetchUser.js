import { fetchData } from './fetchData.js';
export const fetchUser = {
  mixins: [fetchData],
  methods: {
    getUser(retries = 3) {
      const userData = cordova.plugin.http.get(
        'https://www.climbassist.com/v1/user',
        {},
        {},
        (response) => {
          //success
          let user = JSON.parse(response.data).data;
          user.date = new Date();
          this.$store.commit('updateFromServer', true);
          this.$store.commit('updateUsername', user.username);
          this.$store.commit('updateEmail', user.email);
          this.$store.commit('updateUser', user);
          this.updateLocalLogin(user);
          if (!this.$store.state.filter.dataSet) {
            this.getData();
          }
        },
        (response) => {
          //fail user not loggged in
          console.log(response);
          if (response.status === -3) {
            console.log('check local login');
            this.checkLocalLogin();
            this.$store.commit(
              'updateLoadError',
              "Unable to connect to the internet. We'll try again when you have service."
            );
          } else if (retries > 0) {
            this.getUser(retries - 1);
          } else {
            // go to login
            console.log('open login dialog');
            this.$store.commit('updateDialogOpen', true);
            this.$store.commit('updateDialogComponent', 'login');
          }
        }
      );
    },
    updateLocalLogin(user) {
      window.requestFileSystem(window.PERSISTENT, 10 * 1024 * 1024, (fs) => {
        console.log('file system open: ' + fs.name);
        console.log(fs.root);
        fs.root.getFile(
          'localUser.json',
          { create: true, exclusive: false },
          (fileEntry) => {
            console.log(fileEntry);
            fileEntry.createWriter((fileWriter) => {
              fileWriter.write(user);
              fileWriter.onwriteend = () => {
                console.log('Successful file write...');
              };

              fileWriter.onerror = function(e) {
                console.log('Failed file write: ' + e.toString());
              };
            });
          },
          (error) => {
            console.log(error);
          }
        );
      });
    },
    checkLocalLogin() {
      window.requestFileSystem(window.PERSISTENT, 10 * 1024 * 1024, (fs) => {
        console.log('file system open: ' + fs.name);
        console.log(fs.root);
        fs.root.getFile(
          'localUser.json',
          { create: false },
          (fileEntry) => {
            console.log(fileEntry);
            fileEntry.file(
              (file) => {
                // Using Date objects
                let now = Date.now();
                let elapsed = now - file.lastModified;
                console.log('current time:' + now);
                console.log('last modfied:' + file.lastModified);
                let days = elapsed / (1000 * 60 * 60 * 24);
                console.log("it's been" + days + 'days');
                let month = 30 * 1000 * 60 * 60 * 24;
                if (elapsed > month) {
                  //it's been so long! time to login
                  this.$store.commit('updateDialogOpen', true);
                  this.$store.commit(
                    'updateDialogText',
                    "it's been so long! Connect to internet and login to continue"
                  );
                } else {
                  let reader = new FileReader();
                  reader.readAsText(file);
                  reader.onloadend = (result) => {
                    console.log('Successful file read: ' + result);
                    let user = JSON.parse(result.target._result);
                    this.$store.commit('updateFromServer', false);
                    this.$store.commit('updateUsername', user.username);
                    this.$store.commit('updateEmail', user.email);
                  };
                }
              },
              (error) => {
                console.log('error reading file');
                console.log(error);
              }
            );
          },
          (error) => {
            console.log('error getting file');
            console.log(error);
            this.$store.commit('updateDialogOpen', true);
            this.$store.commit(
              'updateDialogText',
              'You must login to use this app for the first time please connect to internet and login'
            );
          }
        );
      });
    },
  },
};
