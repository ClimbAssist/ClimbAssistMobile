<template>
  <v-container>
    <v-container>
      <v-img :src="crag.crag.imageLocation" aspect-ratio="2" contain lazy>
        <v-layout
          slot="placeholder"
          fill-height
          align-center
          justify-center
          ma-0
        >
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-layout>
      </v-img>
    </v-container>
    <v-container>
      <v-layout row>
        <v-flex xs12 sm2 offset-sm1>
          <v-card-text>
            <h3 class="text-xs-right">Description:</h3>
          </v-card-text>
        </v-flex>
        <v-flex xs12 s8>
          <v-card-text>
            <p class="text-xs-left">{{ crag.crag.description }}</p>
          </v-card-text>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm2 offset-sm1>
          <v-card-text>
            <h3 class="text-xs-right">Routes:</h3>
          </v-card-text>
        </v-flex>
        <v-flex xs4 offset-sm1>
          <v-card-text v-if="crag.trad">
            <p class="text-xs-left">
              {{ crag.trad }} <span class="trad-style">Trad</span>
            </p>
          </v-card-text>
        </v-flex>
        <v-flex xs4>
          <v-card-text v-if="crag.sport">
            <p class="text-xs-left">
              {{ crag.sport }} <span class="sport-style">Sport</span>
            </p>
          </v-card-text>
        </v-flex>
        <v-flex xs4>
          <v-card-text v-if="crag.boulder">
            <p class="text-xs-left">
              {{ crag.boulder }} <span class="boulder-style">Boulder</span>
            </p>
          </v-card-text>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <!-- <v-flex sm12 md6>
              <canvas id="typeChart" />
            </v-flex> -->
        <v-flex sm10 xs12>
          <canvas id="gradeChartRope" :height="ropeShow" />
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <!-- <v-flex sm12 md6>
              <canvas id="typeChart" />
            </v-flex> -->
        <v-flex sm10 xs12>
          <canvas id="gradeChartBoulder" :height="boulderShow" />
        </v-flex>
      </v-layout>
      <!-- {{ panel }} -->
      <!-- wall card -->
      <div v-for="(wall, i) in crag.walls" :key="i">
        <v-toolbar color="primary" dark>
          <v-toolbar-title
            >{{ wall.name }} - {{ wall.routes.length }} Routes</v-toolbar-title
          >
        </v-toolbar>
        <v-expansion-panels readonly v-model="panel[i]" accordion>
          <v-expansion-panel v-for="(route, ri) in wall.routes" :key="ri">
            <!-- @click="checkRoute(i, ri), (routeFromPage = true)" -->
            <v-expansion-panel-header
              :id="wall.routes[ri].routeId"
              @click="checkRoute(i, ri), (routeFromPage = true)"
            >
              {{ route.name }} 5.{{ route.grade
              }}{{ route.gradeModifier }} &nbsp;
              <span :class="getClass(route.style)">{{ route.style }}</span>
              <span v-if="route.pitches.length > 1">
                &nbsp;({{ route.pitches.length }})</span
              >
            </v-expansion-panel-header>
            <v-expansion-panel-content xs12 sm10 offset-sm1 mb-5>
              <v-card>
                <v-container>
                  <v-layout row>
                    <v-img
                      :src="route.mainImageLocation"
                      aspect-ratio=""
                      contain
                    >
                      <v-layout
                        slot="placeholder"
                        fill-height
                        align-center
                        justify-center
                        ma-0
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-layout>
                    </v-img>
                  </v-layout>
                  <v-layout wrap>
                    <v-flex xs12 sm3>
                      <v-card-text>
                        <h3 class="text-xs-center text-sm-right">
                          Protection
                        </h3>
                      </v-card-text>
                    </v-flex>
                    <v-flex xs12 sm9>
                      <v-card-text>
                        <p class="text-xs-center text-sm-left">
                          {{ route.protection }}
                        </p>
                      </v-card-text>
                    </v-flex>
                  </v-layout>
                  <v-layout wrap v-if="route.pitches.length > 1">
                    <v-flex xs12 sm3>
                      <v-card-text>
                        <h3 class="text-xs-center text-sm-right">
                          Description
                        </h3>
                      </v-card-text>
                    </v-flex>
                    <v-flex xs12 sm9>
                      <v-card-text>
                        <p class="text-xs-center text-sm-left">
                          {{ route.description }}
                        </p>
                      </v-card-text>
                    </v-flex>
                  </v-layout>
                  <v-layout v-for="(pitch, pi) in route.pitches" :key="pi" wrap>
                    <v-layout wrap>
                      <v-flex v-if="route.pitches.length === 1" xs12 sm3>
                        <v-card-text>
                          <h3 class="text-xs-center text-sm-right">
                            Description
                          </h3>
                        </v-card-text>
                      </v-flex>
                      <v-flex v-if="route.pitches.length > 1" xs12 sm3>
                        <v-card-text>
                          <h3 class="text-xs-center text-sm-right">
                            Pitch {{ pi + 1 }}:
                          </h3>
                        </v-card-text>
                      </v-flex>

                      <v-flex xs12 sm9>
                        <v-card-text>
                          <p class="text-xs-center text-sm-left">
                            {{ pitch.description }}
                          </p>
                        </v-card-text>
                      </v-flex>
                    </v-layout>
                  </v-layout>

                  <v-layout row>
                    <v-expansion-panel v-if="route.photos">
                      <v-expansion-panel-content>
                        <div slot="header">Photos</div>
                        <v-carousel :cycle="false">
                          <v-carousel-item
                            v-for="(photo, phi) in route.photos"
                            :key="phi"
                            :src="photo.src"
                            contain
                            lazy
                          ></v-carousel-item>
                        </v-carousel>
                        <!-- <v-container grid-list-sm fluid>
                            <v-layout row wrap>
                              <v-flex
                                v-for="(photo, phi) in route.photos"
                                :key="phi"
                                xs2
                                d-flex
                              >
                                <v-card flat tile class="d-flex">
                                  <v-img
                                    :src="photo.src"
                                    aspect-ratio="1"
                                    contain
                                  >
                                    <v-layout
                                      slot="placeholder"
                                      fill-height
                                      align-center
                                      justify-center
                                      ma-0
                                    >
                                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                    </v-layout>
                                  </v-img>
                                </v-card>
                              </v-flex>
                            </v-layout>
                          </v-container> -->
                      </v-expansion-panel-content>
                      <v-expansion-panel-content
                        v-for="(comment, ci) in route.comments"
                        :key="ci"
                      >
                        <div slot="header">Comments</div>
                        <v-card>
                          <v-layout wrap>
                            <v-flex xs12 sm3>
                              <v-card-text
                                ><h3 class="text-xs-center text-sm-right">
                                  {{ comment.user }}
                                </h3></v-card-text
                              >
                            </v-flex>
                            <v-flex xs12 sm9>
                              <v-card-text>
                                <p class="text-xs-center text-sm-left">
                                  {{ comment.comment }}
                                </p></v-card-text
                              >
                            </v-flex>
                          </v-layout>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-layout>
                </v-container>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-container>
  </v-container>
</template>

<script>
import Chart from "chart.js";
import { mapGetters } from "vuex";
export default {
  name: "cragInfo",
  data() {
    return {
      routeFromPage: false,
      tradStyle: "trad-style",
      sportStyle: "sport-style",
      boulderStyle: "boulder-style",
      infoActive: true,
      apiData: null,
      apiDataJS: null,
      apiWalls: null,
      apiRoutes: []
      // routeCheck: null
    };
  },
  computed: {
    ...mapGetters({
      crag: "crag"
    }),
    boulderShow() {
      if (this.ropeTotals != null) {
        return 100;
      } else {
        return 0;
      }
    },
    ropeShow() {
      if (this.gradeTotals.total != null) {
        return 100;
      } else {
        return 0;
      }
    },
    activeRoute() {
      return this.$store.state.frame.activeRoute;
    },
    sampleCrag() {
      return this.$store.state.filter.currentCrag;
    },
    panel() {
      let panel = [];
      if (this.activeRoute) {
        for (let key in this.crag.walls) {
          if (key == this.activeRoute.wall) {
            panel.push(this.activeRoute.route);
          } else {
            panel.push(null);
          }
        }
      }
      return panel;
    },
    gradeTotals() {
      let gradeTotals = {
        trad: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        sport: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        boulder: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      };
      for (let wkey in this.crag.walls) {
        for (let rkey in this.crag.walls[wkey].routes) {
          if (this.crag.walls[wkey].routes[rkey].style === "trad") {
            gradeTotals.trad[this.crag.walls[wkey].routes[rkey].grade]++;
            gradeTotals.total[this.crag.walls[wkey].routes[rkey].grade]++;
          } else if (this.crag.walls[wkey].routes[rkey].style === "sport") {
            gradeTotals.sport[this.crag.walls[wkey].routes[rkey].grade]++;
            gradeTotals.total[this.crag.walls[wkey].routes[rkey].grade]++;
          } else {
            gradeTotals.boulder[this.crag.walls[wkey].routes[rkey].grade]++;
          }
        }
      }
      for (let gkey in gradeTotals.total) {
        if (gradeTotals.total[gkey] === 0) {
          delete gradeTotals.total[gkey];
        }
        if (gradeTotals.boulder[gkey] === 0) {
          delete gradeTotals.boulder[gkey];
        }
      }
      for (let i in gradeTotals.trad) {
        if (gradeTotals.total[i] == null) {
          delete gradeTotals.trad[i];
          delete gradeTotals.sport[i];
        }
      }
      return gradeTotals;
    }
  },
  methods: {
    checkRoute(wall, route) {
      const routeCheck = { wall: wall, route: route };
      if (
        this.activeRoute &&
        routeCheck.wall === this.activeRoute.wall &&
        routeCheck.route === this.activeRoute.route
      ) {
        this.$store.commit("updateActiveRoute", null);
      } else {
        this.$store.commit("updateActiveRoute", routeCheck);
      }

      this.routeFromPage = false;
    },
    getClass(style) {
      if (style === "trad") {
        return this.tradStyle;
      }
      if (style === "sport") {
        return this.sportStyle;
      }
      if (style === "boulder") {
        return this.boulderStyle;
      }
    },
    scrollRoute() {
      if (this.activeRoute) {
        var elmnt = document.getElementById(
          this.crag.walls[this.activeRoute.wall].routes[this.activeRoute.route]
            .routeId
        );
        elmnt.scrollIntoView(true);
        window.scrollBy(0, -90); // Adjust scrolling with a negative value here
      }
    },
    setCharts() {
      let ctx = document.getElementById("gradeChartRope");
      let labels = [];
      for (let i in this.gradeTotals.total) {
        labels.push("5." + i);
      }
      let filteredTrad = this.gradeTotals.trad.filter(function(el) {
        return el != null;
      });
      let filteredSport = this.gradeTotals.sport.filter(function(el) {
        return el != null;
      });
      let boulderLabels = [];
      for (let i in this.gradeTotals.boulder) {
        boulderLabels.push("V" + i);
      }
      let filteredBoulder = this.gradeTotals.boulder.filter(function(el) {
        return el != null;
      });
      this.gradeChartRope = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Trad Routes",
              data: filteredTrad,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1
            },
            {
              label: "Sport Routes",
              data: filteredSport,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                gridLines: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  display: false,
                  beginAtZero: true
                }
              }
            ],
            xAxes: [
              {
                gridLines: {
                  display: false,
                  drawBorder: false,
                  beginAtZero: false
                }
              }
            ]
          },
          legend: {
            display: false
          }
        }
      });

      ctx = document.getElementById("gradeChartBoulder");

      this.gradeChartBoulder = new Chart(ctx, {
        type: "bar",
        data: {
          labels: boulderLabels,
          datasets: [
            {
              label: "Bouldering Routes",
              data: filteredBoulder,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                gridLines: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  display: false,
                  beginAtZero: true
                }
              }
            ],
            xAxes: [
              {
                gridLines: {
                  display: false,
                  drawBorder: false,
                  beginAtZero: false
                }
              }
            ]
          },
          legend: {
            display: false
          }
        }
      });
      // ctx = document.getElementById("typeChart");
      // let types = [this.crag.trad, this.crag.sport, this.crag.boulder]
      // this.typeChart = new Chart(ctx, {
      //   type: "pie",
      //   data: {
      //     labels: ['Trad', 'Sport', 'Boulder'],
      //     datasets: [
      //       {
      //         label: "Route Type",
      //         data: types,
      //         backgroundColor: [
      //           "rgba(255, 99, 132, 0.2)",
      //           "rgba(54, 162, 235, 0.2)",
      //           "rgba(255, 206, 86, 0.2)",
      //           "rgba(75, 192, 192, 0.2)",
      //           "rgba(153, 102, 255, 0.2)",
      //           "rgba(255, 159, 64, 0.2)"
      //         ],
      //         borderColor: [
      //           "rgba(255, 99, 132, 1)",
      //           "rgba(54, 162, 235, 1)",
      //           "rgba(255, 206, 86, 1)",
      //           "rgba(75, 192, 192, 1)",
      //           "rgba(153, 102, 255, 1)",
      //           "rgba(255, 159, 64, 1)"
      //         ],
      //         borderWidth: 1
      //       }
      //     ]
      //   },
      //   options: {
      //     scales: {
      //       yAxes: [
      //         {
      //           gridLines: {
      //             display: false,
      //             drawBorder: false
      //           },
      //           ticks: {
      //             display: false
      //           }
      //         }
      //       ],
      //       xAxes: [
      //         {
      //           gridLines: {
      //             display: false,
      //             drawBorder: false
      //           },
      //           ticks: {
      //             display: false
      //           }
      //         }
      //       ]
      //     }
      //   }
      // });
    }
  },
  watch: {
    activeRoute: {
      handler() {
        if (this.activeRoute && this.infoActive && !this.routeFromPage) {
          var elmnt = document.getElementById(
            this.crag.walls[this.activeRoute.wall].routes[
              this.activeRoute.route
            ].routeId
          );
          setTimeout(function() {
            elmnt.scrollIntoView(true);
            window.scrollBy(0, -90); // Adjust scrolling with a negative value here
          }, 200);
        }
        this.routeFromPage = false;
      }
    },
    gradeTotals: {
      handler() {
        console.log(this.gradeTotals);
        let filteredTrad = this.gradeTotals.trad.filter(function(el) {
          return el != null;
        });
        let filteredSport = this.gradeTotals.sport.filter(function(el) {
          return el != null;
        });
        let labels = [];
        for (let i in this.gradeTotals.total) {
          labels.push("5." + i);
        }
        this.gradeChartRope.data.datasets[0].data = filteredTrad;
        this.gradeChartRope.data.datasets[1].data = filteredSport;
        this.gradeChartRope.data.labels = labels;
        this.gradeChartRope.update();

        let boulderLabels = [];
        for (let i in this.gradeTotals.boulder) {
          boulderLabels.push("V" + i);
        }

        let filteredBoulder = this.gradeTotals.boulder.filter(function(el) {
          return el != null;
        });
        this.gradeChartBoulder.data.datasets[0].data = filteredBoulder;
        this.gradeChartBoulder.data.labels = boulderLabels;
        this.gradeChartBoulder.update();

        // this.typeChart.data.datasets[0].data = [this.crag.trad, this.crag.sport, this.crag.boulder]
        // this.typeChart.update()
      }
    }
    // routeCheck: {
    //   handler() {
    //     if (
    //       this.activeRoute &&
    //       this.routeCheck.wall === this.activeRoute.wall &&
    //       this.routeCheck.route === this.activeRoute.route
    //     ) {
    //       this.$emit("activeRouteUpdate", null);
    //     } else {
    //       this.$emit("activeRouteUpdate", this.routeCheck);
    //     }
    //   }
    // }
  },
  mounted() {
    this.setCharts();
  },
  activated() {
    this.scrollRoute();
    this.infoActive = true;
  },
  deactivated() {
    this.infoActive = false;
  }
};
</script>

<style scoped>
.grade-numbers {
  padding-right: 10px;
}
.trad-style {
  color: #ff3300;
}
.sport-style {
  color: #0066ff;
}
.boulder-style {
  color: #33cc66;
}
</style>
