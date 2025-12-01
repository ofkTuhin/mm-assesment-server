import prisma from '@/shared/prisma'
import { Prisma } from 'generated/prisma'
import { BaseRepository } from '../baseRepository/baseRepository'

export class CategoryRepository extends BaseRepository<Prisma.CategoryDelegate> {
  constructor() {
    super(prisma.category)
  }

  async findAllCategories() {
    return this.findAll({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    })
  }
}

export const categoryRepository = new CategoryRepository()
