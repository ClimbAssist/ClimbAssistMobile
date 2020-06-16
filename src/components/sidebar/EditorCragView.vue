<template>
  <div>
    <v-btn v-if="editTabs === 'info'" @click="editModel()">Edit Model</v-btn>
    <v-container v-if="editTabs === 'model'">
      <v-layout row wrap>
        <v-slider
          v-model="light"
          label="Light"
          :max="6"
          :min="0.5"
          :step="0.1"
        />
        <v-slider
          v-model="scale"
          label="Scale"
          :min="0.1"
          :step="0.1"
          :max="5"
        />
        <v-slider
          v-model="modelAngle"
          label="Model Rotation"
          :max="2 * Math.PI"
          :min="0"
          :step="0.1"
        />
        <v-slider
          v-model="north"
          label="North Rotation"
          :max="2 * Math.PI"
          :min="0"
          :step="0.1"
        />
        <v-switch v-model="limitRotate" label="limit Rotation"></v-switch>
        <v-flex v-if="azimuth">
          <v-range-slider
            v-model="azimuth"
            label="Rotation"
            :max="Math.PI"
            :min="-Math.PI"
            :step="0.1"
          />
        </v-flex>
        <v-flex row>
          <v-btn @click="editInfo()">Submit</v-btn>
          <v-btn @click="editInfo()">cancel</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "editorcragV",
  data() {
    return {
      limitRotate: false,
    };
  },
  watch: {
    limitRotate: {
      handler() {
        if (this.limitRotate) {
          if (this.azimuth.length == 0) {
            this.$store.commit("editor/updateAzimuth", [-Math.PI.toFixed(1), Math.PI.toFixed(1)]);
          }
        } else {
          this.$store.commit("editor/updateAzimuth", []);
        }
      }
    }
  },
  computed: {
    modelInfo() {
      return this.$store.state.editor.cragStateEditor.model;
    },
    north: {
      get() {
        return this.$store.state.editor.modelSettings.northAngle;
      },
      set(value) {
        this.$store.commit("editor/updateNorth", value);
      }
    },
    modelAngle: {
      get() {
        return this.$store.state.editor.modelSettings.modelAngle;
      },
      set(value) {
        this.$store.commit("editor/updateModelAngle", value);
      }
    },
    scale: {
      get() {
        return this.$store.state.editor.modelSettings.scale;
      },
      set(value) {
        this.$store.commit("editor/updateScale", value);
      }
    },
    light: {
      get() {
        return this.$store.state.editor.modelSettings.light;
      },
      set(value) {
        this.$store.commit("editor/updateLight", value);
      }
    },
    azimuth: {
      get() {
        return this.$store.state.editor.modelSettings.azimuth;
      },
      set(value) {
        this.$store.commit("editor/updateAzimuth", value);
      }
    },
    editTabs() {
      return this.$store.state.editor.editTabs;
    }
  },
  methods: {
    editModel() {
      this.$store.commit("editor/editView", "model");
    },
    editInfo() {
      this.$store.commit("editor/editView", "info");
    },
    checkazimuth() {
      if (this.modelInfo.azimuth) {
        this.limitRotate = true;
        let azimuth = []
        azimuth[0] = this.modelInfo.azimuth.minimum;
        azimuth[1] = this.modelInfo.azimuth.maximum;
        this.$store.commit("editor/updateAzimuth", azimuth);
      } else {
        this.limitRotate = false;
      }
    }
  },
  mounted() {
    this.checkazimuth();
  }
};
</script>
