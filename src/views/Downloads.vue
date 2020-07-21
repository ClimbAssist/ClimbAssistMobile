<template>
  <v-container justify-start align-content-start>
    <div v-for="(crag, i) in crags" :key="i">
      <router-link
        class="align-start"
        :to="{
          name: 'frame',
          params: {
            frame: crag.route,
          },
        }"
      >
        {{ crag.name }}</router-link
      >
      <span class="align-end">
        {{ (crag.size / 1000000).toFixed(1) }} mb
        <v-icon dense @click="deleteDownloads(i)" color="red">fa-trash</v-icon>
      </span>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios';
import * as fs from 'fs';
export default {
  name: 'list',
  data() {
    return {
      dataCommitted: 0,
      crags: [],
    };
  },
  computed: {},
  methods: {
    getDirectory() {
      window.requestFileSystem(window.PERSISTENT, 100 * 1024 * 1024, (fs) => {
        let rootDirEntry = cordova.file.dataDirectory;
        this.path = cordova.file.dataDirectory;
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
                          };
                        },
                        (error) => {
                          console.log('error reading file');
                          console.log(error);
                        }
                      );
                    },
                    (error) => {
                      console.log('error at get file');
                      console.log(error);
                    }
                  );
                  // get file sizes
                  let entryReader = entries[i].createReader();
                  entryReader.readEntries((files) => {
                    for (let fi in files) {
                      files[fi].file((file) => {
                        crag.size += file.size;
                      });
                    }
                  });
                  this.crags.push(crag);
                }
              },
              (error) => {
                console.log(error);
              }
            );
          },
          (error) => {
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
