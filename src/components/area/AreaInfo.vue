<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm2 offset-sm1>
        <v-card-text>
          <h3 class="text-xs-right">Description:</h3>
        </v-card-text>
      </v-flex>
      <v-flex xs12 s8>
        <v-card-text>
          <p class="text-xs-left">
            {{ area.area.description }}
          </p>
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
        <v-card-text v-if="area.trad">
          <p class="text-xs-left">
            {{ area.trad }} <span class="trad-style">Trad</span>
          </p>
        </v-card-text>
      </v-flex>
      <v-flex xs4>
        <v-card-text v-if="area.sport">
          <p class="text-xs-left">
            {{ area.sport }} <span class="sport-style">Sport</span>
          </p>
        </v-card-text>
      </v-flex>
      <v-flex xs4>
        <v-card-text v-if="area.boulder">
          <p class="text-xs-left">
            {{ area.boulder }} <span class="boulder-style">Boulder</span>
          </p>
        </v-card-text>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-flex sm10 xs12>
        <canvas id="gradeChartRope" height="50" />
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-flex sm10 xs12>
        <canvas id="gradeChartBoulder" height="0" />
      </v-flex>
    </v-layout>
    <v-container>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{ area.name }}</v-toolbar-title>
        </v-toolbar>
        <v-expansion-panels v-if="area.filteredSubAreas.length > 1">
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ subArea.name }} - {{ subArea.trad }} trad
              {{ subArea.sport }} sport {{ subArea.boulder }} boulder
            </v-expansion-panel-header>
            <v-expansion-panel-content
              v-for="(subArea, subi) in area.filteredSubAreas"
              :key="subi"
            >
              <v-layout
                pa-4
                row
                v-for="(crag, ci) in subArea.filteredCrags"
                :key="ci"
              >
                <router-link
                  :to="{
                    name: 'frame',
                    params: {
                      subAreaKey: subArea.subAreaKey,
                      cragKey: crag.cragKey,
                      area: area.slug,
                      frame: crag.slug,
                    },
                  }"
                  >{{ crag.name }} - {{ crag.trad }} trad {{ crag.sport }} sport
                  {{ crag.boulder }} boulder</router-link
                >
              </v-layout>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-layout class="pa-2" wrap v-else>
          <v-flex
            xs12
            v-for="(crag, i) in area.filteredSubAreas[0].filteredCrags"
            :key="i"
          >
            <router-link
              :to="{
                name: 'frame',
                params: {
                  subAreaKey: 0,
                  cragKey: crag.cragKey,
                  area: area.slug,
                  frame: crag.slug,
                },
              }"
              >{{ crag.name }} - {{ crag.trad }} trad {{ crag.sport }} sport
              {{ crag.boulder }} boulder</router-link
            >
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import Chart from 'chart.js';
export default {
  data() {
    return {};
  },
  watch: {
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
          labels.push('5.' + i);
        }
        this.gradeChartRope.data.datasets[0].data = filteredTrad;
        this.gradeChartRope.data.datasets[1].data = filteredSport;
        this.gradeChartRope.data.labels = labels;
        this.gradeChartRope.update();

        let boulderLabels = [];
        for (let i in this.gradeTotals.boulder) {
          boulderLabels.push('V' + i);
        }

        let filteredBoulder = this.gradeTotals.boulder.filter(function(el) {
          return el != null;
        });
        this.gradeChartBoulder.data.datasets[0].data = filteredBoulder;
        this.gradeChartBoulder.data.labels = boulderLabels;
        this.gradeChartBoulder.update();

        // this.typeChart.data.datasets[0].data = [this.crag.trad, this.crag.sport, this.crag.boulder]
        // this.typeChart.update()
      },
    },
  },
  computed: {
    ...mapGetters({
      area: 'area',
    }),
    filter() {
      return this.$store.state.filter.filter;
    },
    gradeTotals() {
      let gradeTotals = {
        trad: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        sport: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        boulder: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      };
      for (let skey in this.area.filteredSubAreas) {
        for (let ckey in this.area.filteredSubAreas[skey].filteredCrags) {
          for (let wkey in this.area.filteredSubAreas[skey].filteredCrags[ckey]
            .walls) {
            for (let rkey in this.area.filteredSubAreas[skey].filteredCrags[
              ckey
            ].walls[wkey].routes) {
              if (
                this.area.filteredSubAreas[skey].filteredCrags[ckey].walls[wkey]
                  .routes[rkey].style === 'trad'
              ) {
                gradeTotals.trad[
                  this.area.filteredSubAreas[skey].filteredCrags[ckey].walls[
                    wkey
                  ].routes[rkey].grade
                ]++;
                gradeTotals.total[
                  this.area.filteredSubAreas[skey].filteredCrags[ckey].walls[
                    wkey
                  ].routes[rkey].grade
                ]++;
              } else if (
                this.area.filteredSubAreas[skey].filteredCrags[ckey].walls[wkey]
                  .routes[rkey].style === 'sport'
              ) {
                gradeTotals.sport[
                  this.area.filteredSubAreas[skey].filteredCrags[ckey].walls[
                    wkey
                  ].routes[rkey].grade
                ]++;
                gradeTotals.total[
                  this.area.filteredSubAreas[skey].filteredCrags[ckey].walls[
                    wkey
                  ].routes[rkey].grade
                ]++;
              } else {
                gradeTotals.boulder[
                  this.area.filteredSubAreas[skey].filteredCrags[ckey].walls[
                    wkey
                  ].routes[rkey].grade
                ]++;
              }
            }
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
    },
    boulderShow() {
      for (let i in gradeTotals.boulder) {
        if (this.gradeTotals.boulder[i]) {
          return 100;
        }
      }
      return 0;
    },
    ropeShow() {
      for (let i in gradeTotals.boulder) {
        if (this.gradeTotals.boulder[i]) {
          return 100;
        }
      }
      return 0;
    },
  },
  methods: {
    setCharts() {
      let ctx = document.getElementById('gradeChartRope');
      let labels = [];
      for (let i in this.gradeTotals.total) {
        labels.push('5.' + i);
      }
      let filteredTrad = this.gradeTotals.trad.filter(function(el) {
        return el != null;
      });
      let filteredSport = this.gradeTotals.sport.filter(function(el) {
        return el != null;
      });
      let boulderLabels = [];
      for (let i in this.gradeTotals.boulder) {
        boulderLabels.push('V' + i);
      }
      let filteredBoulder = this.gradeTotals.boulder.filter(function(el) {
        return el != null;
      });
      this.gradeChartRope = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Trad Routes',
              data: filteredTrad,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              label: 'Sport Routes',
              data: filteredSport,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
                ticks: {
                  display: false,
                  beginAtZero: true,
                },
              },
            ],
            xAxes: [
              {
                gridLines: {
                  display: false,
                  drawBorder: false,
                  beginAtZero: false,
                },
              },
            ],
          },
          legend: {
            display: false,
          },
        },
      });

      ctx = document.getElementById('gradeChartBoulder');

      this.gradeChartBoulder = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: boulderLabels,
          datasets: [
            {
              label: 'Bouldering Routes',
              data: filteredBoulder,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
                ticks: {
                  display: false,
                  beginAtZero: true,
                },
              },
            ],
            xAxes: [
              {
                gridLines: {
                  display: false,
                  drawBorder: false,
                  beginAtZero: false,
                },
              },
            ],
          },
          legend: {
            display: false,
          },
        },
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
    },
  },
  mounted() {
    this.setCharts();
  },
};
</script>

<style scoped>
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
