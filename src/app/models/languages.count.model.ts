import { Activities_History } from "./activities_history.model";

export interface LanguagesCount{
  languages: Array<LanguageCount>
}

export interface LanguageCount{
  language: string,
  count: number
}
