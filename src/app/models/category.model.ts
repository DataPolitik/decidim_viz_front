export interface CategoryResponse{
  categories: Array<Category>
}

export interface Category{
  id: number,
  name_es: string | null,
  name_ca: string | null,
  name_en: string | null
}
