import Vue from 'vue'
import Vuex from 'vuex'
import RoutinesModule from './modules/routines.store-module'
import AppModule from './modules/app.store-module'
import SettingsModule from './modules/settings.store-module'
import DeadZonesModule from './modules/dead_zones.store-module'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    routines: RoutinesModule,
    app:AppModule,
    settings: SettingsModule,
    dead_zones: DeadZonesModule
  },
})