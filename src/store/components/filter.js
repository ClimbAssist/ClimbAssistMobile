const state = {
  filter: {
    filterText: '',
    uiaa_grade: [0, 16],
    yds_grade: [1, 16],
    boulder: true,
    sport: true,
    trad: true,
  },
  dataSet: false,
  mapBounds: undefined,
  countries: [],
  cragState: {
    name: undefined,
    cragId: undefined,
    subAreaId: undefined,
    imageLocation: undefined,
    description: undefined,
    location: undefined,
    model: undefined,
    walls: [],
  },
  areaState: {
    name: null,
    areaId: null,
    regionId: null,
    description: null,
    location: null,
    subAreas: [],
  },
  loadedCrags: [],
  loadError: undefined,
};

const getters = {
  filteredRoutes: (state) => {
    const filteredRoutes = {
      crags: [],
      subAreas: [],
      areas: [],
      regions: [],
      countries: [],
    };
    for (let tkey in state.countries) {
      const countryTotals = {
        name: state.countries[tkey].name,
        trad: 0,
        sport: 0,
        boulder: 0,
        filteredRegions: [],
      };
      for (let skey in state.countries[tkey].regions) {
        const regionTotals = {
          name: state.countries[tkey].regions[skey].name,
          trad: 0,
          sport: 0,
          boulder: 0,
          filteredAreas: [],
        };
        for (let akey in state.countries[tkey].regions[skey].areas) {
          const areaTotals = {
            name: state.countries[tkey].regions[skey].areas[akey].name,
            areaId: state.countries[tkey].regions[skey].areas[akey].areaId,
            area: state.countries[tkey].regions[skey].areas[akey],
            location: state.countries[tkey].regions[skey].areas[akey].location,
            areaKey: akey,
            countryKey: tkey,
            regionKey: skey,
            trad: 0,
            sport: 0,
            boulder: 0,
            filteredSubAreas: [],
          };
          for (let subkey in state.countries[tkey].regions[skey].areas[akey]
            .subAreas) {
            const subAreaTotals = {
              name:
                state.countries[tkey].regions[skey].areas[akey].subAreas[subkey]
                  .name,
              areaKey: akey,
              countryKey: tkey,
              regionKey: skey,
              subAreaKey: subkey,
              trad: 0,
              sport: 0,
              boulder: 0,
              filteredCrags: [],
            };
            for (let ckey in state.countries[tkey].regions[skey].areas[akey]
              .subAreas[subkey].crags) {
              const cragTotals = {
                name:
                  state.countries[tkey].regions[skey].areas[akey].subAreas[
                    subkey
                  ].crags[ckey].name,
                location:
                  state.countries[tkey].regions[skey].areas[akey].subAreas[
                    subkey
                  ].crags[ckey].location,
                area: state.countries[tkey].regions[skey].areas[akey].name,
                cragId:
                  state.countries[tkey].regions[skey].areas[akey].subAreas[
                    subkey
                  ].crags[ckey].cragId,
                cragKey: ckey,
                subAreaKey: subkey,
                areaKey: akey,
                countryKey: tkey,
                regionKey: skey,
                trad: 0,
                sport: 0,
                boulder: 0,
                walls: [],
              };
              for (let wkey in state.countries[tkey].regions[skey].areas[akey]
                .subAreas[subkey].crags[ckey].walls) {
                const filteredWall = {
                  name:
                    state.countries[tkey].regions[skey].areas[akey].subAreas[
                      subkey
                    ].crags[ckey].walls[wkey].name,
                  routes: [],
                };
                for (let rkey in state.countries[tkey].regions[skey].areas[akey]
                  .subAreas[subkey].crags[ckey].walls[wkey].routes) {
                  if (
                    state.countries[tkey].regions[skey].areas[akey].subAreas[
                      subkey
                    ].crags[ckey].walls[wkey].routes[rkey].style === 'trad' &&
                    state.filter.trad &&
                    state.countries[tkey].regions[skey].areas[akey].subAreas[
                      subkey
                    ].crags[ckey].walls[wkey].routes[rkey].grade >=
                      state.filter.yds_grade[0] &&
                    state.countries[tkey].regions[skey].areas[akey].subAreas[
                      subkey
                    ].crags[ckey].walls[wkey].routes[rkey].grade <=
                      state.filter.yds_grade[1]
                  ) {
                    filteredWall.routes.push(
                      state.countries[tkey].regions[skey].areas[akey].subAreas[
                        subkey
                      ].crags[ckey].walls[wkey].routes[rkey]
                    );
                    cragTotals.trad++;
                  }
                  if (
                    state.countries[tkey].regions[skey].areas[akey].subAreas[
                      subkey
                    ].crags[ckey].walls[wkey].routes[rkey].style === 'sport' &&
                    state.filter.sport &&
                    state.countries[tkey].regions[skey].areas[akey].subAreas[
                      subkey
                    ].crags[ckey].walls[wkey].routes[rkey].grade >=
                      state.filter.yds_grade[0] &&
                    state.countries[tkey].regions[skey].areas[akey].subAreas[
                      subkey
                    ].crags[ckey].walls[wkey].routes[rkey].grade <=
                      state.filter.yds_grade[1]
                  ) {
                    filteredWall.routes.push(
                      state.countries[tkey].regions[skey].areas[akey].subAreas[
                        subkey
                      ].crags[ckey].walls[wkey].routes[rkey]
                    );
                    cragTotals.sport++;
                  }
                  if (
                    state.countries[tkey].regions[skey].areas[akey].subAreas[
                      subkey
                    ].crags[ckey].walls[wkey].routes[rkey].style ===
                      'boulder' &&
                    state.filter.boulder &&
                    state.countries[tkey].regions[skey].areas[akey].subAreas[
                      subkey
                    ].crags[ckey].walls[wkey].routes[rkey].grade >=
                      state.filter.uiaa_grade[0] &&
                    state.countries[tkey].regions[skey].areas[akey].subAreas[
                      subkey
                    ].crags[ckey].walls[wkey].routes[rkey].grade <=
                      state.filter.uiaa_grade[1]
                  ) {
                    filteredWall.routes.push(
                      state.countries[tkey].regions[skey].areas[akey].subAreas[
                        subkey
                      ].crags[ckey].walls[wkey].routes[rkey]
                    );
                    cragTotals.boulder++;
                  }
                }
                cragTotals.walls.push(filteredWall);
              }

              if (
                (state.filterText === '' ||
                  cragTotals.name
                    .toUpperCase()
                    .includes(state.filter.filterText.toUpperCase()) ||
                  cragTotals.area
                    .toUpperCase()
                    .includes(state.filter.filterText.toUpperCase())) &&
                (cragTotals.trad || cragTotals.sport || cragTotals.boulder) &&
                state.countries[tkey].regions[skey].areas[akey].subAreas[subkey]
                  .crags[ckey].state === 'PUBLIC' &&
                (!state.mapBounds ||
                  (((state.mapBounds._ne.lat >
                    state.countries[tkey].regions[skey].areas[akey].subAreas[
                      subkey
                    ].crags[ckey].location.latitude &&
                    state.countries[tkey].regions[skey].areas[akey].subAreas[
                      subkey
                    ].crags[ckey].location.latitude >
                      state.mapBounds._sw.lat) ||
                    (state.mapBounds._ne.lat <
                      state.countries[tkey].regions[skey].areas[akey].subAreas[
                        subkey
                      ].crags[ckey].location.latitude &&
                      state.countries[tkey].regions[skey].areas[akey].subAreas[
                        subkey
                      ].crags[ckey].location.latitude <
                        state.mapBounds._sw.lat)) &&
                    ((state.mapBounds._ne.lng >
                      state.countries[tkey].regions[skey].areas[akey].subAreas[
                        subkey
                      ].crags[ckey].location.longitude &&
                      state.countries[tkey].regions[skey].areas[akey].subAreas[
                        subkey
                      ].crags[ckey].location.longitude >
                        state.mapBounds._sw.lng) ||
                      (state.mapBounds._ne.lng <
                        state.countries[tkey].regions[skey].areas[akey]
                          .subAreas[subkey].crags[ckey].location.longitude &&
                        state.countries[tkey].regions[skey].areas[akey]
                          .subAreas[subkey].crags[ckey].location.longitude <
                          state.mapBounds._sw.lng))))
              ) {
                subAreaTotals.boulder += cragTotals.boulder;
                subAreaTotals.trad += cragTotals.trad;
                subAreaTotals.sport += cragTotals.sport;
                subAreaTotals.filteredCrags.push(cragTotals);
                filteredRoutes.crags.push(cragTotals);
              }
            }
            if (
              subAreaTotals.trad ||
              subAreaTotals.sport ||
              subAreaTotals.boulder
            ) {
              areaTotals.boulder += subAreaTotals.boulder;
              areaTotals.trad += subAreaTotals.trad;
              areaTotals.sport += subAreaTotals.sport;
              areaTotals.filteredSubAreas.push(subAreaTotals);
              filteredRoutes.subAreas.push(subAreaTotals);
            }
          }
          if (areaTotals.trad || areaTotals.sport || areaTotals.boulder) {
            regionTotals.boulder += areaTotals.boulder;
            regionTotals.trad += areaTotals.trad;
            regionTotals.sport += areaTotals.sport;
            regionTotals.filteredAreas.push(areaTotals);
            filteredRoutes.areas.push(areaTotals);
          }
        }
        if (regionTotals.trad || regionTotals.sport || regionTotals.boulder) {
          countryTotals.boulder += regionTotals.boulder;
          countryTotals.trad += regionTotals.trad;
          countryTotals.sport += regionTotals.sport;
          countryTotals.filteredRegions.push(regionTotals);
          filteredRoutes.regions.push(regionTotals);
        }
      }
      if (countryTotals.trad || countryTotals.sport || countryTotals.boulder) {
        filteredRoutes.countries.push(countryTotals);
      }
    }
    return filteredRoutes;
  },
  crag: (state) => {
    let cragTotals = {
      name: state.cragState.name,
      crag: state.cragState,
      trad: 0,
      sport: 0,
      boulder: 0,
      walls: [],
    };
    for (let wkey in state.cragState.walls) {
      let filteredWall = {
        name: state.cragState.walls[wkey].name,
        trad: 0,
        sport: 0,
        boulder: 0,
        routes: [],
      };
      for (let rkey in state.cragState.walls[wkey].routes) {
        if (
          state.filterText === '' ||
          state.cragState.walls[wkey].routes[rkey].name
            .toUpperCase()
            .includes(state.filter.filterText.toUpperCase()) ||
          state.cragState.walls[wkey].name
            .toUpperCase()
            .includes(state.filter.filterText.toUpperCase())
        ) {
          if (
            state.cragState.walls[wkey].routes[rkey].style === 'trad' &&
            state.filter.trad &&
            state.cragState.walls[wkey].routes[rkey].grade >=
              state.filter.yds_grade[0] &&
            state.cragState.walls[wkey].routes[rkey].grade <=
              state.filter.yds_grade[1]
          ) {
            filteredWall.routes.push(state.cragState.walls[wkey].routes[rkey]);
            filteredWall.routes[filteredWall.routes.length - 1].routeNum =
              parseInt(rkey) + 1;
            filteredWall.trad++;
            cragTotals.trad++;
          }
          if (
            state.cragState.walls[wkey].routes[rkey].style === 'sport' &&
            state.filter.sport &&
            state.cragState.walls[wkey].routes[rkey].grade >=
              state.filter.yds_grade[0] &&
            state.cragState.walls[wkey].routes[rkey].grade <=
              state.filter.yds_grade[1]
          ) {
            filteredWall.routes.push(state.cragState.walls[wkey].routes[rkey]);
            filteredWall.routes[filteredWall.routes.length - 1].routeNum =
              parseInt(rkey) + 1;
            filteredWall.sport++;
            cragTotals.sport++;
          }
          if (
            state.cragState.walls[wkey].routes[rkey].style === 'boulder' &&
            state.filter.boulder &&
            state.cragState.walls[wkey].routes[rkey].grade >=
              state.filter.uiaa_grade[0] &&
            state.cragState.walls[wkey].routes[rkey].grade <=
              state.filter.uiaa_grade[1]
          ) {
            filteredWall.routes.push(state.cragState.walls[wkey].routes[rkey]);
            filteredWall.routes[filteredWall.routes.length - 1].routeNum =
              parseInt(rkey) + 1;
            filteredWall.boulder++;
            cragTotals.boulder++;
          }
        }
      }
      cragTotals.walls.push(filteredWall);
    }
    return cragTotals;
  },
  area: (state) => {
    const areaTotals = {
      name: state.areaState.name,
      areaId: state.areaState.areaId,
      area: state.areaState,
      trad: 0,
      sport: 0,
      boulder: 0,
      filteredSubAreas: [],
    };
    for (let subkey in state.areaState.subAreas) {
      const subAreaTotals = {
        name: state.areaState.subAreas[subkey].name,
        areaId: state.areaState.subAreas[subkey].subAreaId,
        subAreaKey: subkey,
        subArea: state.areaState.subAreas[subkey],
        trad: 0,
        sport: 0,
        boulder: 0,
        filteredCrags: [],
      };
      for (let ckey in state.areaState.subAreas[subkey].crags) {
        const cragTotals = {
          name: state.areaState.subAreas[subkey].crags[ckey].name,
          subArea: state.areaState.subAreas[subkey].name,
          crag: state.areaState.subAreas[subkey].crags[ckey],
          location: state.areaState.subAreas[subkey].crags[ckey].location,
          area: state.areaState.name,
          cragId: state.areaState.subAreas[subkey].crags[ckey].cragId,
          cragKey: ckey,
          trad: 0,
          sport: 0,
          boulder: 0,
          walls: [],
        };
        for (let wkey in state.areaState.subAreas[subkey].crags[ckey].walls) {
          const filteredWall = {
            name: state.areaState.subAreas[subkey].crags[ckey].walls[wkey].name,
            routes: [],
          };
          for (let rkey in state.areaState.subAreas[subkey].crags[ckey].walls[
            wkey
          ].routes) {
            if (
              state.areaState.subAreas[subkey].crags[ckey].walls[wkey].routes[
                rkey
              ].style === 'trad' &&
              state.filter.trad &&
              state.areaState.subAreas[subkey].crags[ckey].walls[wkey].routes[
                rkey
              ].grade >= state.filter.yds_grade[0] &&
              state.areaState.subAreas[subkey].crags[ckey].walls[wkey].routes[
                rkey
              ].grade <= state.filter.yds_grade[1]
            ) {
              filteredWall.routes.push(
                state.areaState.subAreas[subkey].crags[ckey].walls[wkey].routes[
                  rkey
                ]
              );
              cragTotals.trad++;
            }
            if (
              state.areaState.subAreas[subkey].crags[ckey].walls[wkey].routes[
                rkey
              ].style === 'sport' &&
              state.filter.sport &&
              state.areaState.subAreas[subkey].crags[ckey].walls[wkey].routes[
                rkey
              ].grade >= state.filter.yds_grade[0] &&
              state.areaState.subAreas[subkey].crags[ckey].walls[wkey].routes[
                rkey
              ].grade <= state.filter.yds_grade[1]
            ) {
              filteredWall.routes.push(
                state.areaState.subAreas[subkey].crags[ckey].walls[wkey].routes[
                  rkey
                ]
              );
              cragTotals.sport++;
            }
            if (
              state.areaState.subAreas[subkey].crags[ckey].walls[wkey].routes[
                rkey
              ].style === 'boulder' &&
              state.filter.boulder &&
              state.areaState.subAreas[subkey].crags[ckey].walls[wkey].routes[
                rkey
              ].grade >= state.filter.uiaa_grade[0] &&
              state.areaState.subAreas[subkey].crags[ckey].walls[wkey].routes[
                rkey
              ].grade <= state.filter.uiaa_grade[1]
            ) {
              filteredWall.routes.push(
                state.areaState.subAreas[subkey].crags[ckey].walls[wkey].routes[
                  rkey
                ]
              );
              cragTotals.boulder++;
            }
          }
          cragTotals.walls.push(filteredWall);
        }

        if (
          (state.filterText === '' ||
            cragTotals.name
              .toUpperCase()
              .includes(state.filter.filterText.toUpperCase()) ||
            cragTotals.subArea
              .toUpperCase()
              .includes(state.filter.filterText.toUpperCase())) &&
          (cragTotals.trad || cragTotals.sport || cragTotals.boulder)
        ) {
          subAreaTotals.boulder += cragTotals.boulder;
          subAreaTotals.trad += cragTotals.trad;
          subAreaTotals.sport += cragTotals.sport;
          subAreaTotals.filteredCrags.push(cragTotals);
        }
      }

      areaTotals.boulder += subAreaTotals.boulder;
      areaTotals.trad += subAreaTotals.trad;
      areaTotals.sport += subAreaTotals.sport;
      areaTotals.filteredSubAreas.push(subAreaTotals);
    }
    return areaTotals;
  },
};
const mutations = {
  updateFilter: (state, payload) => {
    state.filter.uiaa_grade = payload.uiaa_grade;
    state.filter.yds_grade = payload.yds_grade;
    state.filter.boulder = payload.boulder;
    state.filter.sport = payload.sport;
    state.filter.trad = payload.trad;
  },
  updateRoutes: (state, payload) => {
    state.countries.push(payload);
  },
  updateLoadedCrags: (state, payload) => {
    state.loadedCrags.push(payload);
  },
  updateFilterText: (state, payload) => {
    state.filter.filterText = payload;
  },
  updateCrag: (state, payload) => {
    state.cragState.name = payload.name;
    state.cragState.cragId = payload.cragId;
    state.cragState.subAreaId = payload.subAreaId;
    state.cragState.imageLocation = payload.imageLocation;
    state.cragState.description = payload.description;
    state.cragState.location = payload.location;
    state.cragState.model = payload.model;
    state.cragState.walls = payload.walls;
    // state.cragState = payload;
  },
  updateCragPoints: (state, wi, ri, payload) => {
    state.cragState.wall[wi].routes[ri].points = payload;
  },
  updateArea: (state, payload) => {
    state.areaState.name = payload.name;
    state.areaState.areaId = payload.areaId;
    state.areaState.regionId = payload.regionId;
    state.areaState.description = payload.description;
    state.areaState.location = payload.location;
    state.areaState.subAreas = payload.subAreas;

    // state.areaState = payload;
  },
  updateMapBounds: (state, payload) => {
    state.mapBounds = payload;
  },
  dataSet: (state, payload) => {
    state.dataSet = payload;
  },
  updateLoadError: (state, payload) => {
    state.loadError = payload;
  },
};

const actions = {};
export default {
  state,
  getters,
  mutations,
  actions,
};
