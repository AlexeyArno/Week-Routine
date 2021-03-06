import { ActionTree } from "vuex";
import { IRootState } from "../../types";
import { IRoutinesState } from "./types";
import { IRoutine } from "src/models/routines.routine";
import { GetAPI } from "src/view/external.api";
import {DrawerContent, ModalContent} from "../../api";
import IStatistics from "src/models/statistics";
import { routines } from ".";

export const actions: ActionTree<IRoutinesState, IRootState> = {
  newRoutineWindow({commit}) {
    commit("app/drawerOpen", DrawerContent.Routine,  { root: true });
  },
  routineSettingsWindow({commit}) {
    commit("app/drawerOpen", DrawerContent.RoutineSettings,  { root: true });
  },
  currentRoutineChange({commit}, val: number) {
    commit("setCurrentRoutine", val);
  },
  async addRoutine({commit, dispatch}, routine: IRoutine) {
    await GetAPI().Routines().Create(routine);
    const routines = await GetAPI().Routines().Get();
    commit("loadedRoutines", routines);

    commit("setCurrentRoutine",  -1);
    commit("drop");
    commit("app/drawerClose", {}, { root: true });
    dispatch("app/setFreeHours", {}, {root: true});
  },
  async deleteRoutine({commit, dispatch}, routine: IRoutine) {
    // console.log(routine);
    await GetAPI().Routines().Delete({ID: routine.ID});
    const routines = await GetAPI().Routines().Get();
    commit("loadedRoutines", routines);
    dispatch("app/setFreeHours", {}, {root: true});
  },
  async loadRoutines({commit}) {
      commit("loaded");
      const routines = await GetAPI().Routines().Get();
      const statistics = await GetAPI().Statistics().Get();
      routines.forEach((v: IRoutine) => {
        statistics.forEach((s: IStatistics) => {
          if (v.ID === s.ID) {
            v.hoursSpended = s.spent;
          }
        });
      });
      // console.log("LoadedRoutines");
      commit("loadedRoutines", routines);
  },
  async saveRoutine({commit, dispatch}, routine: IRoutine) {
    commit("setCurrentRoutine", -1);
    await GetAPI().Routines().Update(routine);
    dispatch("loadRoutines", {});
    dispatch("app/setFreeHours", {}, {root: true});
  },
  async changeStatistics({commit, dispatch}, data: {routineID: number, spent: number[]}) {
    await GetAPI().Statistics().ChangeSpent(data);
    dispatch("updateCurrentRoutine", data.routineID);
    // console.log(updateRes);
    // dispatch("loadRoutines", {});
  },
  setRoutineGraph({commit, dispatch}, routineID: number) {
    commit("setCurrentGraphPanel", routineID);
    dispatch("loadRoutines", {});
  },

  async updateCurrentRoutine({commit, dispatch}, routineID: number) {

    const routines = await GetAPI().Routines().Get();
    const statistics = await GetAPI().Statistics().Get();
    routines.forEach((r, i) => {
      if (r.ID === routineID) {
        r.hoursSpended = statistics.reduce((a, s) => {
          if (s.routineID === routineID) {
            return s.spent;
          } else {
            return a;
          }
        }, r.hoursSpended);
        // console.log(r);
        commit("setRoutine", {routine: r, index: i});
      }
    });
    // const routine = routines.reduce((a: IRoutine, v: IRoutine) => {
    //   if (v.ID === routineID) {
    //     return v;
    //   } else {
    //     return a;
    //   }
    // });
    // console.log(routine);
  },

};
