import { PrismaClient } from '../generated/prisma'
import bcrypt from 'bcrypt'
import { products, categories } from './config'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Seed Categories
  const categoryMap = new Map<string, number>()

  for (const categoryName of categories) {
    const category = await prisma.category.create({
      data: {
        name: categoryName,
      },
    })
    categoryMap.set(categoryName, category.id)
    console.log(`✅ Category "${categoryName}" created`)
  }

  console.log('✅ All categories seeded successfully')

  // Seed Products
  for (const product of products) {
    const categoryId = categoryMap.get(product.category)

    if (!categoryId) {
      console.error(`❌ Category "${product.category}" not found for product "${product.title}"`)
      continue
    }

    await prisma.product.create({
      data: {
        title: product.title,
        price: product.price,
        description: product.description,
        categoryId: categoryId,
        image: product.image,
        rating: {
          create: {
            rate: product.rating.rate,
            count: product.rating.count,
          },
        },
      },
    })

    console.log(`✅ Product "${product.title}" created`)
  }

  console.log('✅ All products seeded successfully')
  console.log('🌱 Seeding complete!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async err => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
