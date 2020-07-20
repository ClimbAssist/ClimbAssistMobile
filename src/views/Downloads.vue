<template>
  <v-container justify-start align-content-start>
    <div v-for="(entry, i) in entries" :key="i">
      <router-link
        :to="{
          name: 'frame',
          params: {
            frame: entry.name,
          },
        }"
      >
        {{ entry.name }}</router-link
      >
      <v-btn>Delete</v-btn>
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
      entries: undefined,
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
            var directoryReader = dirEntry.createReader();

            // Get a list of all the entries in the directory
            directoryReader.readEntries(
              (entries) => {
                console.log(entries);
                this.entries = entries;
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
