# Climb-Assist-Mobile

Welcome to the Cordova app for Android and IOS!

As this is generated as a webview for native applications we want to try to keep the design and functionality in sync with the UI. If you have design changes try to make them in the UI repo first before modifying the cordova app.

This project is built on the [Vue](https://vuejs.org/) and [Cordova](https://cordova.apache.org/) Frameworks.

It also uses the [Vuetify](https://vuetifyjs.com/) Material Library and [Three.js](https://threejs.org/) Library for WebGL.

Project Structure
-----------------
This project is mostly a copy from the webapp that has been modified to fit the cordova structure and allow downloading of data and models for offline use. This project is not intended for data management so the editor has been removed.

The general setup is that the Layout folder contains the app layout for entire app with the views folder containing the layouts for all the routes. The views and layouts may be made up of various components imported from the Components folder.

Hierarchy: App > View > Component

The project uses a central store [Vuex Store](https://vuex.vuejs.org/) in the store folder to maintain a common state across the entire application

If you have any questions or concerns, reach out to the development team at
[dev@climbassist.com](mailto:dev@climbassist.com).

For information on contributing see the [Contributing Guidelines](CONTRIBUTING.md)

## Project setup
This project requires [npm](https://github.com/npm/cli) and [cordova](https://cordova.apache.org)


```
npm install
```

### Compiles build for android or ios
```
npm run cordova-build-android
npm run cordova-build-ios
```

### run dev build for local simulation
```
cd src-cordova
cordova run android
cordova run ios
```

### Run your tests
```
npm run test
```
