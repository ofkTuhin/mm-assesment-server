export interface ICategory {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  _count: {
    products: number
  }
}

export interface ICategoryResponse {
  total: number
  categories: ICategory[]
}
