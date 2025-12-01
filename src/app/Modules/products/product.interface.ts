export interface IRating {
  rate: number
  count: number
}

export interface IProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: IRating
}

export interface IProductResponse {
  total: number
  products: IProduct[]
}

export interface IProductByCategoryResponse {
  category: string
  total: number
  products: IProduct[]
}

export interface ISingleProductResponse extends IProduct {}

export interface ICategory {
  id: number
  name: string
}

export interface ICategoryResponse {
  total: number
  categories: ICategory[]
}
