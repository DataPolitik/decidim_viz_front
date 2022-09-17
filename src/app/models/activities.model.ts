import { Activities_History } from "./activities_history.model";

export interface Activities{
  count: number,
  name: string,
  history: Array<Activities_History>
}
