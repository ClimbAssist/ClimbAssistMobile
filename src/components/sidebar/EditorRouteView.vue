<template>
  <div>
    <v-container v-if="editTabs === 'model'">
      <v-layout row wrap>
        <v-radio-group v-model="editing" label="Set 3D Position">
          <v-radio
            v-for="n in radioGroup"
            :key="n"
            :label="n"
            :value="n"
          ></v-radio>
        </v-radio-group>
      </v-layout>
      <v-layout row v-if="editing==='Line'">
        <v-select
          label="Pitch"
          :items="pitchList"
          v-model="selectedPitch"
          disabled
        />
      </v-layout>
      <v-layout row>
        <v-list two-line>
          <div v-for="(anchor, i) in anchors" :key="i">
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title
                  >Anchor {{ i + 1 }}</v-list-tile-title
                >
                <v-list-tile-sub-title>
                  <v-checkbox v-model="fixed[i]" label="Fixed" />
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </div>
        </v-list>
      </v-layout>
      <v-layout row>
        <v-btn color="primary" @click="editInfo()">Submit</v-btn>
        <v-btn @click="editInfo()">cancel</v-btn>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "editorrouteV",
  data() {
    return {
      radioGroup: ["Location", "Line"],
      fixed: []
    };
  },
  watch: {
    fixed: {
      handler() {
        this.$store.commit("editor/editAnchors", this.fixed);
      }
    }
  },
  computed: {
    editTabs() {
      return this.$store.state.editor.editTabs;
    },
    selectedPitch: {
      get() {
        return this.$store.state.editor.activePitch;
      },
      set(value) {
        this.$store.commit("editor/updateActivePitch", value);
      }
    },
    editing: {
      get() {
        return this.$store.state.editor.editing;
      },
      set(value) {
        this.$store.commit("editor/updateEditing", value);
      }
    },
    activeRoute() {
      return this.$store.state.editor.activeRoute;
    },
    selectedRoute() {
      return this.$store.state.editor.cragStateEditor.walls[this.activeRoute[0]].routes[this.activeRoute[1]];
    },
    pitchList() {
      let pitchList = [];
      for (let key in this.selectedRoute.pitches) {
        pitchList.push(parseInt(key) + 1);
      }
      return pitchList;
    },
    anchors() {
      this.fixed = [];
      for (let key in this.$store.state.editor.anchors) {
        this.fixed.push(this.$store.state.editor.anchors[key].fixed);
      }
      return this.$store.state.editor.anchors;
    }
  },
  methods: {
    editInfo() {
      this.$store.commit("editor/editView", "info");
    }
  }
};
</script>
