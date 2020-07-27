<template>
  <v-container>
    <v-card>
      <v-btn @click="getDirectory()"> Get Directory</v-btn>
      <p>file path: {{ path }}</p>
      <p>Directory Entry: {{ dirEntry }}</p>
      <p>size: {{ size }}</p>
      <p>Last Modified: {{ lastModified }}</p>
      <p>Entries: {{ entries }}</p>
      <p>SubEntries: {{ subEntries }}</p>
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
    <v-card>
      <v-btn @click="deleteFiles()"> Delete Files</v-btn>
    </v-card>
    <v-card>
      <v-btn @click="checkLocalLogin()"> Get Last Login </v-btn>
      <p>Last Login: {{ lastLogin }}</p>
    </v-card>
    {{ json }}
  </v-container>
</template>

<script>
import axios from 'axios';
import * as fs from 'fs';
export default {
  name: 'FileTest',
  data() {
    return {
      path: null,
      dirEntry: undefined,
      json: undefined,
      entries: undefined,
      subEntries: undefined,
      lastModified: undefined,
      size: undefined,
      lastLogin: undefined,
    };
  },
  computed: {
    crag() {
      return this.$store.state.filter.countries[0].regions[0].areas[0]
        .subAreas[0].crags[1];
    },
  },
  watch: {
    json: {
      handler() {
        this.$store.commit('updateLoadedCrags', this.json);
      },
    },
  },
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
        fs.root.getDirectory(
          'crags/box-top-boulder-n4cd77j3bm',
          { create: true },
          (dirEntry) => {
            this.dirEntry = dirEntry;
            // Get a directory reader
            var directoryReader = dirEntry.createReader();

            // Get a list of all the entries in the directory
            directoryReader.readEntries(
              (entries) => {
                this.subEntries = entries;
                entries[0].file((file) => {
                  console.log('file');
                  console.log(file);
                  console.log(file.lastModified);
                  this.lastModified = new Date(file.lastModified);
                  this.size = file.size;
                });
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
    getFileSystem() {
      window.requestFileSystem(window.PERSISTENT, 5 * 1024 * 1024, (fs) => {
        console.log('file system open: ' + fs.name);
        console.log(fs.root);
        fs.root.getDirectory(
          'crags/bell-buttress',
          { create: true },
          (dirEntry) => {
            console.log(dirEntry);
          },
          (error) => {
            console.log(error);
          }
        );
        fs.root.getFile(
          'crags/bell-buttress/bell-buttress.glb',
          { create: true, exclusive: false },
          (fileEntry) => {
            console.log('fileEntry is file?' + fileEntry.isFile.toString());
            console.log(fileEntry);
            this.downloadFile(fileEntry, 'bell-buttress.glb', false);
          },
          (error) => {
            console.log(error);
          }
        );
      });
    },
    async downloadFile(fileEntry, fileName, isAppend) {
      try {
        console.log('downloading model');
        let blob = await axios({
          method: 'get',
          url:
            'https://s3-us-west-2.amazonaws.com/models-172776452117-us-west-2/united-states/colorado/boulder-canyon/boulder-canyon/bell-buttress/Bell_Buttress.glb',
          responseType: 'blob',
        });
        console.log('file downloaded');
        this.writeFile(fileEntry, blob);
      } catch (error) {
        console.log(error);
      }
    },
    writeFile(fileEntry, dataObj) {
      console.log('in write file');
      fileEntry.createWriter((fileWriter) => {
        fileWriter.write(dataObj.data);
        fileWriter.onwriteend = () => {
          console.log('Successful file write...');
        };

        fileWriter.onerror = function(e) {
          console.log('Failed file write: ' + e.toString());
        };
      });
    },
    readFile() {
      window.requestFileSystem(
        window.PERSISTENT,
        0,
        (fs) => {
          console.log(fs.root);
          fs.root.getFile(
            'crags/bell-buttress/bell-buttress.glb',
            { create: false },
            (fileEntry) => {
              fileEntry.file(
                (file) => {
                  console.log('in read file function');
                  var reader = new FileReader();
                  reader.readAsBinaryString(file);
                  reader.onloadend = function() {
                    console.log('Successful file read: ' + this.result);

                    // var blob = new Blob([new Uint8Array(this.result)], { type: "model/gltf-binary" });
                    // console.log(blob)
                  };
                  // this.$store.commit("updateLoadedModels", this.result);

                  // console.log(file)
                },
                (error) => {
                  console.log('error reading file');
                  console.log(error);
                }
              );
            },
            (error) => {
              console.log('error at get file');
              console.log(error);
            }
          );
        },
        (error) => {
          console.log('error at request file system');
          console.log(error);
        }
      );
    },
    saveJsonFile() {
      window.requestFileSystem(window.PERSISTENT, 10 * 1024 * 1024, (fs) => {
        console.log('file system open: ' + fs.name);
        console.log(fs.root);
        fs.root.getFile(
          'crags/bell-buttress/bell-buttress.json',
          { create: true, exclusive: false },
          (fileEntry) => {
            console.log('fileEntry is file?' + fileEntry.isFile.toString());
            console.log(fileEntry);
            this.writeJsonFile(fileEntry, 'bell-buttress.json', false);
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
        fileWriter.write(this.crag);
        fileWriter.onwriteend = () => {
          console.log('Successful file write...');
        };

        fileWriter.onerror = function(e) {
          console.log('Failed file write: ' + e.toString());
        };
      });
    },
    readJsonFile() {
      window.requestFileSystem(
        window.PERSISTENT,
        10 * 1024 * 1024,
        (fs) => {
          fs.root.getFile(
            'crags/box-top-boulder-n4cd77j3bm/box-top-boulder-n4cd77j3bm.json',
            { create: false },
            (fileEntry) => {
              fileEntry.file(
                (file) => {
                  console.log('in read file function');
                  var reader = new FileReader();
                  reader.readAsText(file);
                  reader.onloadend = (result) => {
                    console.log('Successful file read: ' + result);
                    this.json = JSON.parse(result.target._result);
                  };

                  // console.log(file)
                },
                (error) => {
                  console.log('error reading file');
                  console.log(error);
                }
              );
            },
            (error) => {
              console.log('error at get file');
              console.log(error);
            }
          );
        },
        (error) => {
          console.log('error at request file system');
          console.log(error);
        }
      );
    },
    deleteFiles() {
      window.requestFileSystem(
        window.PERSISTENT,
        10 * 1024 * 1024,
        (fs) => {
          fs.root.getFile(
            'crags/bell-buttress/bell-buttress.json',
            { create: false },
            (fileEntry) => {
              fileEntry.remove(
                (file) => {
                  console.log('json removed');
                },
                (error) => {
                  console.log('error removing json');
                  console.log(error);
                }
              );
            },
            (error) => {
              console.log('error at get json');
              console.log(error);
            }
          );
          fs.root.getFile(
            'crags/bell-buttress/bell-buttress.glb',
            { create: false },
            (fileEntry) => {
              fileEntry.remove(
                (file) => {
                  console.log('glb removed');
                },
                (error) => {
                  console.log('error removing glb');
                  console.log(error);
                }
              );
            },
            (error) => {
              console.log('error at get glb');
              console.log(error);
            }
          );
          fs.root.getDirectory(
            'crags/bell-buttress',
            { create: false },
            (dirEntry) => {
              dirEntry.remove(
                (directory) => {
                  console.log('directory removed');
                },
                (error) => {
                  console.log('error removing directory');
                  console.log(error);
                }
              );
            },
            (error) => {
              console.log('error at get directory');
              console.log(error);
            }
          );
        },
        (error) => {
          console.log('error at request file system');
          console.log(error);
        }
      );
    },
    checkLocalLogin() {
      window.requestFileSystem(window.PERSISTENT, 10 * 1024 * 1024, (fs) => {
        console.log('file system open: ' + fs.name);
        console.log(fs.root);
        fs.root.getFile(
          'localUser.json',
          { create: false },
          (fileEntry) => {
            console.log(fileEntry);
            fileEntry.file(
              (file) => {
                this.lastLogin = new Date(file.lastModified);
              },
              (error) => {
                console.log('error reading file');
                console.log(error);
              }
            );
          },
          (error) => {
            console.log('error getting file');
            console.log(error);
            this.lastLogin = 'none';
          }
        );
      });
    },
  },
};
</script>
