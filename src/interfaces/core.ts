import {IRoutine} from "src/models/routines.routine";
import { IDeadZone } from "src/models/dead_zone";
import { INowTask } from "src/models/now.tasks";
import { ISettings } from "./settingsStore";
import IStatistics from "src/models/statistics";

export interface ISettingsCore {
  Import: () => void;
  Export: () => void;
  ClearAll: () => void;
  Get: () => ISettings;
  Put: (s: ISettings) => void;
}

export interface IScheduleCore {
  Get: () => Promise< Array<INowTask | string> >;
  Clear: () => void;
}

export interface IDeadZonesCore {
  Get: () => Promise< IDeadZone[]>;
  Create: (zone: IDeadZone) => void;
  Update: (unit: any) => Promise<void>;
  Delete: (unit: any) => Promise<void>;
}

export interface IRoutinesCore {
  Get: () => Promise< IRoutine[]>;
  Create: (routine: IRoutine) => void;
  Delete: (unit: any) => Promise<void>;
  Update: (unit: IRoutine) => void;
}

export interface IStatisticCore {
  Get: () => Promise< IStatistics[]>;
}

export interface ICore {
  Routines: () => IRoutinesCore;
  Schedule: () => IScheduleCore;
  DeadZones: () => IDeadZonesCore;
  Settings: () => ISettingsCore;
  FreeTime: () => Promise<number>;
  Statistics: () => IStatisticCore;
}
