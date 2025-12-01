import prisma from '@/shared/prisma'
import { Prisma } from 'generated/prisma'
import { BaseRepository } from '../baseRepository/baseRepository'

export class ProductRepository extends BaseRepository<Prisma.ProductDelegate> {
  constructor() {
    super(prisma.product)
  }

  async findAllProducts(limit?: number) {
    const products = await this.findAll({
      take: limit,
      include: {
        rating: {
          select: {
            rate: true,
            count: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return products.map((product: any) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category.name,
      image: product.image,
      rating: {
        rate: product.rating?.rate || 0,
        count: product.rating?.count || 0,
      },
    }))
  }

  async findByCategory(category: string, limit?: number) {
    const products = await this.findAll({
      where: {
        category: {
          name: {
            equals: category,
            mode: 'insensitive',
          },
        },
      },
      take: limit,
      include: {
        rating: {
          select: {
            rate: true,
            count: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return products.map((product: any) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category.name,
      image: product.image,
      rating: {
        rate: product.rating?.rate || 0,
        count: product.rating?.count || 0,
      },
    }))
  }

  async findProductById(id: number) {
    const product = await this.findById({
      where: { id },
      include: {
        rating: {
          select: {
            rate: true,
            count: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!product) return null

    return {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category.name,
      image: product.image,
      rating: {
        rate: product.rating?.rate || 0,
        count: product.rating?.count || 0,
      },
    }
  }

  async findAllCategories() {
    return prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    })
  }
}

export const productRepository = new ProductRepository()
