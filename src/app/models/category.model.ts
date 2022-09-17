import { AbstractDash } from "./abstract_dash.model"

export interface CategoryResponse extends AbstractDash{
  categories: Array<Category>
}

export interface Category{
  id: number,
  name_es: string,
  name_ca: string,
  name_en: string,
  comments: number
}
