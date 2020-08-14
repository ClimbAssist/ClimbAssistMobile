<template>
  <v-container justify-start v-if="user && readComplete && deleteComplete">
    <div v-for="(crag, i) in crags" :key="i" class="d-flex flex-row pa-4">
      <span class="align-self-start">
        <router-link
          :to="{
            name: 'frame',
            params: {
              frame: crag.route,
            },
          }"
        >
          {{ crag.name }}</router-link
        >
      </span>
      <span class="align-self-end">
        {{ (crag.size / 1000000).toFixed(1) }} mb
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="red lighten-2"
              dark
              v-bind="attrs"
              v-on="on"
              @click="deleting = i"
            >
              fa-trash
            </v-icon>
          </template>

          <v-card>
            <v-card-title class="headline red lighten-2">
              Delete Files
            </v-card-title>

            <v-card-text>
              Delete crag files stored on your device?
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="deleteFiles(i)">
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </span>
    </div>
  </v-container>
</template>

<script>
import * as fs from 'fs';
export default {
  name: 'downloads',
  data() {
    return {
      crags: [],
      dialog: false,
      jsonDeleted: false,
      modelDeleted: false,
      directoryDeleted: false,
      dirLength: undefined,
      loadedJsons: [],
      deleting: undefined,
    };
  },
  computed: {
    user() {
      return this.$store.state.user.username;
    },
    deleteComplete() {
      if (
        this.jsonDeleted &&
        this.modelDeleted &&
        this.directoryDeleted &&
        this.deleting !== undefined
      ) {
        console.log('everything deleted');
        this.jsonDeleted = false;
        this.modelDeleted = false;
        this.directoryDeleted = false;
        this.deleting = undefined;
        this.dialog = false;
        this.getDirectory();
        return true;
      } else if (
        this.jsonDeleted &&
        this.modelDeleted &&
        this.deleting !== undefined
      ) {
        console.log('delete directory call');
        this.deleteDirectory();
        return false;
      } else {
        console.log('no match in deleteComplete');
        return true;
      }
    },
    readComplete() {
      if (this.dirLength) {
        if (this.dirLength === this.loadedJsons.length) {
          this.crags.sort(function(a, b) {
            var nameA = a.name.toLowerCase(),
              nameB = b.name.toLowerCase();
            if (nameA < nameB)
              //sort string ascending
              return -1;
            if (nameA > nameB) return 1;
            return 0; //default return value (no sorting)
          });
          this.dirLength = undefined;
          this.loadedJsons = [];
          return true;
        } else {
          return false;
        }
      }
    },
  },
  methods: {
    getDirectory() {
      this.crags = [];
      window.requestFileSystem(window.PERSISTENT, 100 * 1024 * 1024, (fs) => {
        fs.root.getDirectory(
          'crags',
          { create: true },
          (dirEntry) => {
            this.dirEntry = dirEntry;
            // Get a directory reader
            let directoryReader = dirEntry.createReader();

            // Get a list of all the entries in the directory
            directoryReader.readEntries(
              (entries) => {
                this.dirLength = entries.length;
                console.log('entries');
                console.log(entries);
                for (let i in entries) {
                  let crag = {
                    name: undefined,
                    route: entries[i].name,
                    size: 0,
                  };
                  //get the name from json file
                  fs.root.getFile(
                    'crags/' + crag.route + '/' + crag.route + '.json',
                    { create: false },
                    (fileEntry) => {
                      fileEntry.file(
                        (file) => {
                          console.log('in read file function');
                          var reader = new FileReader();
                          reader.readAsText(file);
                          reader.onloadend = (result) => {
                            console.log('Successful file read: ' + result);
                            let json = JSON.parse(result.target._result);
                            crag.name = json.name;
                            this.loadedJsons.push(true);
                          };
                        },
                        (error) => {
                          this.loadedJsons.push(false);
                          console.log('error reading json file');
                          console.log(error);
                        }
                      );
                    },
                    (error) => {
                      this.loadedJsons.push(false);
                      console.log('error getting json file');
                      console.log(error);
                    }
                  );
                  // get file sizes
                  let entryReader = entries[i].createReader();
                  entryReader.readEntries(
                    (files) => {
                      for (let fi in files) {
                        files[fi].file((file) => {
                          crag.size += file.size;
                        });
                      }
                    },
                    (error) => {
                      console.log('error reading files in crag foleder');
                      console.log(error);
                    }
                  );
                  this.crags.push(crag);
                  console.log(this.crags);
                }
              },
              (error) => {
                console.log('error reading entries in crags');
                console.log(error);
              }
            );
          },
          (error) => {
            console.log('error getting crags directory');
            console.log(error);
          }
        );
      });
    },
    deleteFiles() {
      let i = this.deleting;
      console.log(i);
      // this.deleting = i;
      window.requestFileSystem(
        window.PERSISTENT,
        10 * 1024 * 1024,
        (fs) => {
          console.log(this.crags);
          fs.root.getFile(
            'crags/' +
              this.crags[i].route +
              '/' +
              this.crags[i].route +
              '.json',
            { create: false },
            (fileEntry) => {
              fileEntry.remove(
                (file) => {
                  this.jsonDeleted = true;
                  console.log('json removed');
                },
                (error) => {
                  console.log('error removing json');
                  console.log(error);
                }
              );
            },
            (error) => {
              console.log('error at get json');
              console.log(error);
              if (error.code === 1) {
                this.jsonDeleted = true;
              }
            }
          );
          fs.root.getFile(
            'crags/' + this.crags[i].route + '/' + this.crags[i].route + '.glb',
            { create: false },
            (fileEntry) => {
              fileEntry.remove(
                (file) => {
                  this.modelDeleted = true;
                  console.log('glb removed');
                },
                (error) => {
                  console.log('error removing glb');
                  console.log(error);
                }
              );
            },
            (error) => {
              console.log('error at get glb');
              console.log(error);
              if (error.code === 1) {
                this.modelDeleted = true;
              }
            }
          );
        },
        (error) => {
          console.log('error at request file system');
          console.log(error);
        }
      );
    },
    deleteDirectory() {
      window.requestFileSystem(window.PERSISTENT, 10 * 1024 * 1024, (fs) => {
        fs.root.getDirectory(
          'crags/' + this.crags[this.deleting].route,
          { create: false },
          (dirEntry) => {
            dirEntry.remove(
              (directory) => {
                this.directoryDeleted = true;
                console.log('directory removed');
              },
              (error) => {
                console.log('error removing directory');
                console.log(error);
              }
            );
          },
          (error) => {
            console.log('error at get directory');
            console.log(error);
          }
        );
      });
    },
  },
  mounted() {
    this.getDirectory();
  },
};
</script>
<style></style>
