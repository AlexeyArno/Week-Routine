import {Routine} from "src/models/routines.routine";

export function GetRoutines(): Routine[] {
  const routines: Routine[] = [];

  for (let i = 0; i < 20; i++) {
    routines.push({
      ID: i,
      actionBody: "https://loco.com",
      actionType: 2,
      colorScheme: "orange",
      describe: `I learn English to find best company
      in the world which can use my skills
      to make world better place`,
      hours: 7,
      name: "English",
    });
  }
  return routines;
}