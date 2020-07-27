<template>
  <keep-alive>
    <component :is="frameTabs" />
  </keep-alive>
</template>

<script>
import Model from '../components/crag/Model.vue';
import MapCrag from '../components/crag/CragMap.vue';
import Info from '../components/crag/Info.vue';
import * as fs from 'fs';
export default {
  data() {
    return {};
  },
  watch: {
    filter: {
      handler() {
        this.$store.commit('updateActiveRoute', null);
      },
      deep: true,
    },
  },
  computed: {
    frameTabs() {
      return this.$store.state.frame.frameTabs;
    },
    filter() {
      return this.$store.state.filter.filter;
    },
  },
  methods: {
    getData() {
      window.requestFileSystem(
        window.PERSISTENT,
        10 * 1024 * 1024,
        (fs) => {
          fs.root.getFile(
            'crags/' +
              this.$route.params.frame +
              '/' +
              this.$route.params.frame +
              '.json',
            { create: false },
            (fileEntry) => {
              this.$store.commit('setDownloaded', true);
            },
            (error) => {
              console.log('error at get file');
              console.log(error);
              //failed to find local json file, get crag from server
              this.$store.commit('setDownloaded', false);
            }
          );
        },
        (error) => {
          console.log('error at request file system');
          console.log(error);
        }
      );
      if (
        this.$store.state.filter.cragState &&
        this.$store.state.filter.cragState.cragId === this.$route.params.frame
      ) {
        //crag is currently loaded
        return;
      } else {
        //check crags loaded in current session
        for (let i in this.$store.state.filter.loadedCrags) {
          if (
            this.$store.state.filter.loadedCrags[i].cragId ===
            this.$route.params.frame
          ) {
            this.$store.commit(
              'updateCrag',
              this.$store.state.filter.loadedCrags[i]
            );
            return;
          }
        }
        //check for locally saved file
        window.requestFileSystem(
          window.PERSISTENT,
          10 * 1024 * 1024,
          (fs) => {
            fs.root.getFile(
              'crags/' +
                this.$route.params.frame +
                '/' +
                this.$route.params.frame +
                '.json',
              { create: false },
              (fileEntry) => {
                fileEntry.file(
                  (file) => {
                    console.log('in read file function');
                    var reader = new FileReader();
                    reader.readAsText(file);
                    reader.onloadend = (result) => {
                      console.log('Successful file read: ' + result);
                      let crag = JSON.parse(result.target._result);
                      this.$store.commit('updateCrag', crag);
                      this.$store.commit('updateLoadedCrags', crag);
                      this.$store.commit('setDownloaded', true);
                    };
                  },
                  (error) => {
                    console.log('error reading file');
                    console.log(error);
                    //failed to read local json file, get crag from server
                    this.fetchData();
                  }
                );
              },
              (error) => {
                console.log('error at get file');
                console.log(error);
                //failed to find local json file, get crag from server
                this.fetchData();
              }
            );
          },
          (error) => {
            console.log('error at request file system');
            console.log(error);
          }
        );
      }
    },
    fetchData() {
      this.$store.commit('setDownloaded', false);
      //fetch data from server
      cordova.plugin.http.get(
        'https://www.climbassist.com/v1/crags/' +
          this.$route.params.frame +
          '?depth=4',
        {},
        {},
        (response) => {
          //success
          let crag = JSON.parse(response.data).data;
          this.organizeCrag(crag);
        },
        (response) => {
          //fail
          console.log(response);
        }
      );
    },
    organizeCrag(crag) {
      if (!crag.walls) {
        crag.walls = [];
      }

      for (let wi in crag.walls) {
        if (!crag.walls[wi].routes) {
          crag.walls[wi].routes = [];
        }
        for (let ri in crag.walls[wi].routes) {
          crag.walls[wi].routes[ri].points = [];
          crag.walls[wi].routes[ri].distance = 0;
          if (!crag.walls[wi].routes[ri].pitches) {
            crag.walls[wi].routes[ri].pitches = [];
          }
          for (let pi in crag.walls[wi].routes[ri].pitches) {
            if (crag.walls[wi].routes[ri].pitches[pi].distance) {
              crag.walls[wi].routes[ri].distance +=
                crag.walls[wi].routes[ri].pitches[pi].distance;
            }
            if (!crag.walls[wi].routes[ri].pitches[pi].points) {
              crag.walls[wi].routes[ri].pitches[pi].points = [];
            }
            crag.walls[wi].routes[ri].points = crag.walls[wi].routes[
              ri
            ].points.concat(crag.walls[wi].routes[ri].pitches[pi].points);
          }
        }
      }
      if (this.$route.params.countryKey) {
        crag.area = {
          name: this.$store.state.filter.countries[
            this.$route.params.countryKey
          ].regions[this.$route.params.regionKey].areas[
            this.$route.params.areaKey
          ].name,
          areaId: this.$store.state.filter.countries[
            this.$route.params.countryKey
          ].regions[this.$route.params.regionKey].areas[
            this.$route.params.areaKey
          ].areaId,
        };
        this.$store.commit('updateCrag', crag);
        this.$store.commit('updateLoadedCrags', crag);
      } else {
        cordova.plugin.http.get(
          'https://www.climbassist.com/v1/sub-areas/' + crag.subAreaId,
          {},
          {},
          (response) => {
            //success
            let subArea = JSON.parse(response.data).data;
            cordova.plugin.http.get(
              'https://www.climbassist.com/v1/areas/' + subArea.areaId,
              {},
              {},
              (response) => {
                //success
                crag.area = JSON.parse(response.data).data;
                this.$store.commit('updateCrag', crag);
                this.$store.commit('updateLoadedCrags', crag);
              },
              (response) => {
                //error
                console.log(error);
              }
            );
          },
          (response) => {
            //error
            console.log(error);
          }
        );
      }
    },
  },
  components: {
    model: Model,
    mapcrag: MapCrag,
    info: Info,
  },
  created() {
    this.$store.commit('updateFilterText', '');
    this.$store.commit('cragView', 'info');
  },
  mounted() {
    this.getData();
    this.$store.commit('updateSidebar', 'frameV');
  },
  destroyed() {
    this.$store.commit('updateSidebar', 'defaultV');
    this.$store.commit('cragView', null);
    this.$store.commit('updateActiveRoute', null);
    this.$store.commit('setDownloaded', false);
  },
};
</script>

<style scoped>
.addnav {
  padding-top: 60px;
  margin-bottom: 60px;
}
</style>
