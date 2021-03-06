import { IRoutine } from "src/models/routines.routine";

export interface IRoutinesState {
  current_routine: number;
  routine_settings_open: boolean;
  new_routine_open: boolean;
  routineGraph: number;
  loaded: boolean;
  items: IRoutine[];
}
