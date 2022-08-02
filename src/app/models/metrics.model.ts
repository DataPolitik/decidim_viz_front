import { Metrics_History } from "./metrics_history.model";

export interface Metrics{
  count: number,
  name: string,
  history: Array<Metrics_History>
}
