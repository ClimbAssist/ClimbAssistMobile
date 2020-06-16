<template>
  <v-container>
    <v-card>
      <v-btn @click="getDirectory()"> Get Directory</v-btn>
      <p>file path: {{ path }}</p>
      <p>Directory Entry: {{dirEntry}}</p>
    </v-card>
    <v-card>
      <v-btn @click="getFileSystem()"> Write Model File</v-btn>
    </v-card>
    <v-card>
      <v-btn @click="readFile()"> Open Model File</v-btn>
    </v-card>
    <v-card>
      <v-btn @click="saveJsonFile()"> Write Json File</v-btn>
    </v-card>
    <v-card>
      <v-btn @click="readJsonFile()"> Read Json File</v-btn>
    </v-card>
    {{json}}
  </v-container>
</template>

<script>
import axios from 'axios'
import * as fs from 'fs';
export default {
  name: "FileTest",
  data() {
    return {
      path: null,
      dirEntry: undefined,
      json: undefined
    };
  },
  computed: {
    crag() {
      return this.$store.state.filter.countries[0].regions[0].areas[0].subAreas[0].crags[1];
    }
  },
  watch: {
    json: {
      handler() {
        this.$store.commit(
          "updateLoadedCrags",
          this.json
        );
      }
    }
  },
  methods: {
    getDirectory() {
      window.requestFileSystem(window.PERSISTENT, 100 * 1024 * 1024, (fs) => {
        let rootDirEntry = cordova.file.dataDirectory;
        fs.root.getDirectory('bell-buttress', { create: true }, (dirEntry) => {
              this.dirEntry = dirEntry;
          }, (error) => {console.log(error)});
      });
    },
    getFileSystem() {
      window.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, (fs) => {

          console.log('file system open: ' + fs.name);
          console.log(fs.root)
          fs.root.getFile("bell-buttress.glb", { create: true, exclusive: false }, (fileEntry) => {

              console.log("fileEntry is file?" + fileEntry.isFile.toString());
              // fileEntry.name == 'someFile.txt'
              // fileEntry.fullPath == '/someFile.txt'
              console.log(fileEntry)
              this.downloadFile(fileEntry, "bell-buttress.glb", false);

          }, (error) => {console.log(error)});
      });
    },
    async downloadFile(fileEntry, fileName, isAppend) {
      try {
        console.log("downloading model")
        let blob = await axios({
        method: "get",
        url:
          "https://s3-us-west-2.amazonaws.com/models-172776452117-us-west-2/united-states/colorado/boulder-canyon/boulder-canyon/bell-buttress/Bell_Buttress.glb",
        responseType: "blob"
      });
      console.log("file downloaded")
      this.writeFile(fileEntry, blob);
      } catch (error) {
        console.log(error)
      }
    },
    writeFile(fileEntry, dataObj) {
      console.log("in write file")
      fileEntry.createWriter( (fileWriter) =>{
        fileWriter.write(dataObj.data);
        fileWriter.onwriteend = () => {
            console.log("Successful file write...");
        };

        fileWriter.onerror = function(e) {
            console.log("Failed file write: " + e.toString());
        };


      });
    },
    readFile() {
      window.requestFileSystem(window.PERSISTENT, 0, (fs) => {
        console.log(fs.root)
        fs.root.getFile("bell-buttress.glb", {create: false}, (fileEntry) => {
          fileEntry.file( (file) => {
            console.log("in read file function")
            var reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onloadend = function() {

                console.log("Successful file read: " + this.result);



                // var blob = new Blob([new Uint8Array(this.result)], { type: "model/gltf-binary" });
                // console.log(blob)
            };
            // this.$store.commit("updateLoadedModels", this.result);


            // console.log(file)

        }, (error) => { console.log("error reading file"); console.log(error);});
      }, (error) => { console.log("error at get file"); console.log(error);});
    }, (error) => { console.log("error at request file system"); console.log(error);});
  },
  saveJsonFile() {
      window.requestFileSystem(window.PERSISTENT, 10 * 1024 * 1024, (fs) => {

          console.log('file system open: ' + fs.name);
          console.log(fs.root)
          fs.root.getFile("bell-buttress.json", { create: true, exclusive: false }, (fileEntry) => {
            console.log("fileEntry is file?" + fileEntry.isFile.toString());
            // fileEntry.name == 'someFile.txt'
            // fileEntry.fullPath == '/someFile.txt'
            console.log(fileEntry)
            this.writeJsonFile(fileEntry, "bell-buttress.json", false);

          }, (error) => {console.log(error)});
      });
    },
    writeJsonFile(fileEntry) {
      console.log("in write file")
      fileEntry.createWriter( (fileWriter) =>{
        fileWriter.write(this.crag);
        fileWriter.onwriteend = () => {
            console.log("Successful file write...");
        };

        fileWriter.onerror = function(e) {
            console.log("Failed file write: " + e.toString());
        };
      });
    },
    readJsonFile() {
      window.requestFileSystem(window.PERSISTENT,  10 * 1024 * 1024, (fs) => {
        fs.root.getFile("bell-buttress.json", {create: false}, (fileEntry) => {
          fileEntry.file( (file) => {
            console.log("in read file function")
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onloadend = (result) =>  {
                console.log("Successful file read: " + result);
                this.json = JSON.parse(result.target._result);
            };

            // console.log(file)

        }, (error) => { console.log("error reading file"); console.log(error);});
      }, (error) => { console.log("error at get file"); console.log(error);});
    }, (error) => { console.log("error at request file system"); console.log(error);});
  }
  }
};
</script>
