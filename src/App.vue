<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" fixed app clipped>
      <v-list>
        <v-list-item v-if="username" to="/user" router>
          <v-list-item-action>
            <v-icon>fa-user</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ username }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else to="/user/login" router>
          <v-list-item-action>
            <v-icon>fa-user</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isAdministrator" to="/editor" router>
          <v-list-item-action>
            <v-icon>fa-edit</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>editor</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <hr />
      <div>
        <v-text-field
          @input="setTimer()"
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="fa-search"
          label="Search"
          v-model="filterTextSet"
        ></v-text-field>
        <component :is="sidebar" />
      </div>
    </v-navigation-drawer>
    <v-app-bar
      color="primary"
      dark
      fixed
      app
      clipped-left
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <img style="max-width:50px" src="@/assets/ClimbAssist_Logo_img.png" />
      <v-flex hidden-sm-and-down shrink>
        <v-toolbar-title>Climb Assist</v-toolbar-title>
      </v-flex>
      <v-spacer />
      <navbar />
      <v-spacer />
      <v-bottom-sheet v-if="!editor" inset v-model="showSheet">

        <v-btn slot="activator" light @click="showSheet = !showSheet">
          <v-badge
          color="red"
          bottom
          right
        >
            <template v-slot:badge>
              <span v-if="resetButton">!</span>
            </template>
            <v-icon color="primary">fa-sliders-h</v-icon>
          </v-badge>
        </v-btn>

        <v-container class="sheet-front">
          <v-layout wrap>
            <v-flex xs12 sm2>
              <v-card-text>
                <h3>Type:</h3>
              </v-card-text>
            </v-flex>
            <v-flex>
              <v-checkbox :label="`Bouldering`" v-model="filterTemp.boulder" />
            </v-flex>
            <v-flex>
              <v-checkbox :label="`Sport`" v-model="filterTemp.sport" />
            </v-flex>
            <v-flex>
              <v-checkbox :label="`Trad`" v-model="filterTemp.trad" />
            </v-flex>
          </v-layout>
          <v-layout v-if="filterTemp.boulder" wrap>
            <v-flex xs6 sm2>
              <v-card-text>
                <h3>UIAA Grade:</h3>
              </v-card-text>
            </v-flex>
            <v-flex xs3 sm2>
              <v-card-text>
                <v-text-field
                  prefix="V"
                  v-model="filterTemp.uiaa_grade[0]"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                  style="width: 50px"
                ></v-text-field>
              </v-card-text>
            </v-flex>
            <v-flex xs12 sm6 order-xs3 order-sm2>
              <v-range-slider
                v-model="filterTemp.uiaa_grade"
                :max="16"
                :min="0"
                :step="1"
              />
            </v-flex>
            <v-flex xs3 sm2 order-xs2 order-sm3>
              <v-card-text>
                <v-text-field
                  v-model="filterTemp.uiaa_grade[1]"
                  prefix="V"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                  style="width: 50px"
                />
              </v-card-text>
            </v-flex>
          </v-layout>
          <v-layout v-if="filterTemp.sport || filterTemp.trad" wrap>
            <v-flex xs12 sm2>
              <v-card-text>
                <h3>YDS Grade:</h3>
              </v-card-text>
            </v-flex>
            <v-flex xs6 sm2>
              <v-card-text>
                <v-text-field
                  prefix="5."
                  v-model="filterTemp.yds_grade[0]"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                  style="width: 60px"
                ></v-text-field>
              </v-card-text>
            </v-flex>
            <v-flex xs12 sm6 order-xs3 order-sm2>
              <v-range-slider
                v-model="filterTemp.yds_grade"
                :max="16"
                :min="1"
                :step="1"
              />
            </v-flex>
            <v-flex xs6 sm2 order-xs2 order-sm3>
              <v-card-text>
                <v-text-field
                  v-model="filterTemp.yds_grade[1]"
                  prefix="5."
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                  style="width: 60px"
                />
              </v-card-text>
            </v-flex>
          </v-layout>
          <v-layout justify-end row>
            <v-btn v-show="resetButton" @click="resetFilter()">reset</v-btn>
            <v-btn v-show="submitButton" @click="setFilter()" color="primary"
              >submit</v-btn
            >
          </v-layout>
        </v-container>
      </v-bottom-sheet>
    </v-app-bar>
    <v-content d-inline>
      <snackbar />
      <router-view />
    </v-content>
    <bottomNav />
  </v-app>
</template>
<script>
import DefaultView from "./components/sidebar/DefaultView.vue";
import AreaView from "./components/sidebar/AreaView.vue";
import FrameView from "./components/sidebar/FrameView.vue";
import MapViewArea from "./components/sidebar/MapViewArea.vue";
import MapViewCrag from "./components/sidebar/MapViewCrag.vue";
import EditorCragView from "./components/sidebar/EditorCragView.vue";
import EditorRouteView from "./components/sidebar/EditorRouteView.vue";
import Navbar from "./components/Navbar.vue";
import BottomNavbar from "./components/BottomNavbar.vue";
import Snackbar from "./components/Snackbar.vue";
import { mapGetters } from "vuex";
import { sampleData } from "./mixins/sampleData.js";
import { fetch } from "./mixins/fetchData.js";
export default {
  name: "App",
  data: () => ({
    drawer: null,
    items: [
      {
        icon: "fa-home",
        title: "home",
        to: "/"
      },
      {
        icon: "fa-list",
        title: "list",
        to: "/list"
      },
      {
        icon: "fa-map",
        title: "map",
        to: "/map"
      },
      {
        icon: "fa-folder",
        title: "file",
        to: "/file-test"
      }
    ],
    showSheet: false,
    frameTabs: "info",
    filterTextSet: "",
    filterTemp: {
      uiaa_grade: [0, 16],
      yds_grade: [1, 16],
      boulder: true,
      sport: true,
      trad: true
    }
  }),
  mixins: [sampleData, fetch],
  computed: {
    isAdministrator() {
      return this.$store.state.user.isAdministrator;
    },
    username() {
      return this.$store.state.user.username;
    },
    filterText() {
      return this.$store.state.filter.filter.filterText;
    },
    filter() {
      return this.$store.state.filter.filter;
    },
    sidebar() {
      return this.$store.state.sidebar.sidebar;
    },
    editor() {
      if (this.$route.path.match(/editor/)) {
        return true;
      } else {
        return false;
      }
    },
    ...mapGetters({
      filteredRoutes: "filteredRoutes"
    }),
    resetButton() {
      if (
        this.filter.uiaa_grade[0] !== 0 ||
        this.filter.uiaa_grade[1] !== 16 ||
        this.filter.yds_grade[0] !== 1 ||
        this.filter.yds_grade[1] !== 16 ||
        !this.filter.boulder ||
        !this.filter.sport ||
        !this.filter.trad
      ) {
        return true;
      } else {
        return false;
      }
    },
    submitButton() {
      if (
        this.filter.uiaa_grade[0] === this.filterTemp.uiaa_grade[0] &&
        this.filter.uiaa_grade[1] === this.filterTemp.uiaa_grade[1] &&
        this.filter.yds_grade[0] === this.filterTemp.yds_grade[0] &&
        this.filter.yds_grade[1] === this.filterTemp.yds_grade[1] &&
        this.filter.boulder === this.filterTemp.boulder &&
        this.filter.sport === this.filterTemp.sport &&
        this.filter.trad === this.filterTemp.trad
      ) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    setAgreement() {
      this.$store.commit(
        "updateMessage",
        "By using this site you agree to the"
      );
      this.$store.commit("updateType", "dark");
      this.$store.commit("updateTimeout", 10000);
      this.$store.commit("updateSnackbar", true);
      this.$store.commit("updateLink", "/terms");
      this.$store.commit("updateLinkMessage", "terms and conditions");
    },
    setTimer() {
      setTimeout(() => {
        this.$store.commit("updateFilterText", this.filterTextSet);
      }, 500);
    },
    setFilter() {
      this.$store.commit("updateFilter", this.filterTemp);
      this.showSheet = false;
    },
    resetFilter() {
      this.filterTemp = {
        uiaa_grade: [0, 16],
        yds_grade: [1, 16],
        boulder: true,
        sport: true,
        trad: true
      };
      this.$store.commit("updateFilter", this.filterTemp);
      this.showSheet = false;
    },
    string_to_slug(str) {
      str = str.replace(/^\s+|\s+$/g, ""); // trim
      str = str.toLowerCase();

      // remove accents, swap ñ for n, etc
      const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
      const to = "aaaaeeeeiiiioooouuuunc------";
      for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
      }

      str = str
        .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
        .replace(/\s+/g, "-") // collapse whitespace and replace by -
        .replace(/-+/g, "-"); // collapse dashes

      return str;
    },
    async getUser() {
      const userData = await cordova.plugin.http.get("https://www.climbassist.com/v1/user", {}, {}, 
      (response)=> {
        //success
        let user = JSON.parse(response.data).data
        this.$store.commit("updateUsername", user.username);
        this.$store.commit("updateEmail", user.email);
        this.$store.commit(
          "updateIsAdministrator",
          userData.data.isAdministrator
        );
      },
      (response)=> {
        //fail user not loggged in
        console.log(response);
      });
    }
  },
  components: {
    defaultV: DefaultView,
    areaV: AreaView,
    frameV: FrameView,
    mapareaV: MapViewArea,
    mapcragV: MapViewCrag,
    editorcragV: EditorCragView,
    editorrouteV: EditorRouteView,
    navbar: Navbar,
    bottomNav: BottomNavbar,
    snackbar: Snackbar
  },
  created() {
    // this.getUser();
    this.fetchData();
  },
  mounted() {
    // this.setAgreement();

    // local testing
    // for (let i in this.countries) {
    //   this.$store.commit("updateRoutes", this.countries[i]);
    // }
    // this.$store.commit("dataSet", true);
    // this.$store.commit(
    //   "updateLoadedCrags",
    //   this.countries[0].regions[0].areas[0].subAreas[0].crags[1]
    // );
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#menu-options {
  padding-left: 5px;
}
</style>

<style scoped>
.sheet-front {
  background-color: white;
}
.selected-route {
  color: green;
}
</style>
