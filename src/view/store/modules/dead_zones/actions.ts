import { ActionTree } from "vuex";
import { RootState } from "../../types";
import { IDeadZoneState } from "./types";
import { GetAPI } from "src/view/external.api";
import { IDeadZone } from "src/models/dead_zone";

export const actions: ActionTree<IDeadZoneState, RootState> = {
    setCurrentItem({commit}, val: number) {
      commit("setActiveDeadZone", {number: val});
    },
    async newDeadZone({commit, dispatch}) {
      commit("setActiveDeadZone", {number: -1});
      const deadZone: IDeadZone = {
        ID: -1,
        name: "Yet another DZ",
        start: 0,
        done: 1,
        enable: false,
        disabled_days: [],
      };
      await GetAPI().DeadZones().Create(deadZone);
      const deadZones = await GetAPI().DeadZones().Get();
      commit("loadedDeadZones", {deadZones});
      dispatch("app/setFreeHours", {}, {root: true});
    },
    async loadDeadZones({commit}) {
      const deadZones = await GetAPI().DeadZones().Get();
      commit("loadedDeadZones", {deadZones});
    },
    async saveChangedDeadZone({commit, dispatch}, deadZone: IDeadZone) {
      // console.log(dead_zone)
      await GetAPI().DeadZones().Update(deadZone);
      const deadZones = await GetAPI().DeadZones().Get();
      commit("loadedDeadZones", {deadZones});
      dispatch("app/setFreeHours", {}, {root: true});
    },
    async deleteDeadZone({commit, dispatch}, deadZone: IDeadZone) {
      commit("setActiveDeadZone", {number: -1});
      await GetAPI().DeadZones().Delete({ID: deadZone.ID});
      const deadZones = await GetAPI().DeadZones().Get();
      commit("loadedDeadZones", {deadZones});
      dispatch("app/setFreeHours", {}, {root: true});
    },
};
