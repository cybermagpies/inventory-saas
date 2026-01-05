// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Clean the database (optional, but good for testing)
  await prisma.product.deleteMany()
  await prisma.tenant.deleteMany()

  // 2. Create "Company A" (TechStart)
  const techStart = await prisma.tenant.create({
    data: {
      name: 'TechStart Inc',
      products: {
        create: [
          { name: 'Gaming Laptop', stock: 50 },
          { name: 'Mechanical Keyboard', stock: 120 },
          { name: 'USB-C Hub', stock: 300 }
        ]
      }
    }
  })

  // 3. Create "Company B" (Burger Joint)
  const burgerJoint = await prisma.tenant.create({
    data: {
      name: 'Joe\'s Burger Joint',
      products: {
        create: [
          { name: 'Burger Buns', stock: 500 },
          { name: 'Beef Patties', stock: 50 } // Low stock!
        ]
      }
    }
  })

  console.log('✅ Database seeded!')
  console.log(`Created tenant: ${techStart.name} (ID: ${techStart.id})`)
  console.log(`Created tenant: ${burgerJoint.name} (ID: ${burgerJoint.id})`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })