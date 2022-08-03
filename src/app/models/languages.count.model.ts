import { Metrics_History } from "./metrics_history.model";

export interface LanguagesCount{
  languages: Array<LanguageCount>
}

export interface LanguageCount{
  language: string,
  count: number
}
