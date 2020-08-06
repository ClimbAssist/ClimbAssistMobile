<template>
  <div>
    <v-bottom-navigation
      v-if="sidebar === 'frameV'"
      app
      v-model="frameTabs"
      :value="true"
      color="white"
    >
      <v-btn color="green" text value="model">
        <span>Model</span>
        <v-icon>fa-cube</v-icon>
      </v-btn>

      <v-btn color="green" text value="info">
        <span>Info</span>
        <v-icon>fa-info</v-icon>
      </v-btn>

      <v-btn color="green" text value="mapcrag">
        <span>map</span>
        <v-icon>fa-map</v-icon>
      </v-btn>
      <div>
        <v-icon v-if="!downloading && !downloaded" @click="downloadFiles()"
          >fa-download</v-icon
        >
        <v-icon v-else-if="downloading">fa-spinner</v-icon>
        <!-- <v-progress-circular indeterminate v-if="downloading" /> -->
        <v-icon v-else color="success">fa-check-circle</v-icon>
      </div>
    </v-bottom-navigation>

    <v-bottom-navigation
      v-if="sidebar === 'areaV'"
      app
      v-model="areaTabs"
      :value="true"
      color="white"
    >
      <v-btn color="green" text value="info">
        <span>Info</span>
        <v-icon>fa-info</v-icon>
      </v-btn>

      <v-btn color="green" text value="maparea">
        <span>map</span>
        <v-icon>fa-map</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import * as fs from 'fs';
export default {
  name: 'bottomNav',
  data() {
    return {
      routeFromPage: false,
      tradStyle: 'trad-style',
      sportStyle: 'sport-style',
      boulderStyle: 'boulder-style',
      infoActive: true,
      apiData: null,
      apiDataJS: null,
      apiWalls: null,
      apiRoutes: [],
      downloadInit: false,
      jsonWriteEnd: true,
      glbWriteEnd: true,
      ropeShow: 0,
      boulderShow: 0,
      // routeCheck: null
    };
  },
  computed: {
    ...mapGetters({
      crag: 'crag',
    }),
    downloaded() {
      return this.$store.state.frame.downloaded;
    },
    downloading() {
      if (this.glbWriteEnd && this.jsonWriteEnd && this.downloadInit) {
        this.downloadInit = false;
        this.$store.commit('setDownloaded', true);
        return false;
      } else if (this.glbWriteEnd && this.jsonWriteEnd) {
        return false;
      } else {
        return true;
      }
    },
    frameTabs: {
      get() {
        return this.$store.state.frame.frameTabs;
      },
      set(value) {
        this.$store.commit('cragView', value);
      },
    },
    areaTabs: {
      get() {
        return this.$store.state.area.areaTabs;
      },
      set(value) {
        this.$store.commit('areaView', value);
      },
    },
    sidebar() {
      return this.$store.state.sidebar.sidebar;
    },
  },
  methods: {
    downloadFiles() {
      this.glbwriteEnd = false;
      this.jsonWriteEnd = false;
      this.downloadInit = true;
      window.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, (fs) => {
        console.log('file system open: ' + fs.name);
        console.log(fs.root);
        fs.root.getDirectory(
          'crags',
          { create: true },
          (cragEntry) => {
            console.log(cragEntry);
            fs.root.getDirectory(
              'crags/' + this.$route.params.frame,
              { create: true },
              (dirEntry) => {
                fs.root.getFile(
                  'crags/' +
                    this.$route.params.frame +
                    '/' +
                    this.$route.params.frame +
                    '.json',
                  { create: true, exclusive: false },
                  (fileEntry) => {
                    console.log(
                      'fileEntry is file?' + fileEntry.isFile.toString()
                    );
                    console.log(fileEntry);
                    this.writeJsonFile(fileEntry);
                  },
                  (error) => {
                    console.log(error);
                  }
                );
                fs.root.getFile(
                  'crags/' +
                    this.$route.params.frame +
                    '/' +
                    this.$route.params.frame +
                    '.glb',
                  { create: true, exclusive: false },
                  (fileEntry) => {
                    console.log(
                      'fileEntry is file?' + fileEntry.isFile.toString()
                    );
                    console.log(fileEntry);
                    this.downloadFile(fileEntry);
                  },
                  (error) => {
                    console.log(error);
                  }
                );
                console.log(dirEntry);
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
    writeJsonFile(fileEntry) {
      console.log('in write file');
      fileEntry.createWriter((fileWriter) => {
        fileWriter.write(this.crag.crag);
        fileWriter.onwriteend = () => {
          console.log('Successful file write...');
          this.jsonWriteEnd = true;
        };

        fileWriter.onerror = function(e) {
          console.log('Failed file write: ' + e.toString());
        };
      });
    },
    async downloadFile(fileEntry) {
      try {
        console.log('downloading model');
        let blob = await axios({
          method: 'get',
          url: this.crag.crag.model.modelLocation,
          responseType: 'blob',
        });
        console.log('file downloaded');
        this.writeGlbFile(fileEntry, blob);
      } catch (error) {
        console.log(error);
      }
    },
    writeGlbFile(fileEntry, dataObj) {
      console.log('in write file');
      fileEntry.createWriter((fileWriter) => {
        fileWriter.write(dataObj.data);
        fileWriter.onwriteend = () => {
          console.log('Successful file write...');
          this.glbWriteEnd = true;
        };
        fileWriter.onerror = function(e) {
          console.log('Failed file write: ' + e.toString());
        };
      });
    },
  },
};
</script>
