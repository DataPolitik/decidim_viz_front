export interface CategoryResponse{
  categories: Array<Category>
}

export interface Category{
  id: number,
  name_es: string,
  name_ca: string,
  name_en: string,
  comments: number
}
