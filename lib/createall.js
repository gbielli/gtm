import { buildExport } from "./gtmContainer";

export const jsonObj = (triggers, variables) =>
  buildExport({ trigger: triggers, variable: variables });
