import { PrismaClient } from '@prisma/client'

// Prevent multiple Prisma instances in development (Hot Reload fix)
const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

async function getTenantData() {
  // We fetch the first tenant (Company A) for this demo
  const tenant = await prisma.tenant.findFirst({
    include: { products: true } // Join the tables
  })
  return tenant
}

export default async function Home() {
  const data = await getTenantData()

  if (!data) return <div className="p-10">Database is empty. Run seed script!</div>

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold">📦 {data.name} Inventory</h1>
          <p className="text-indigo-200 text-sm">Tenant ID: {data.id}</p>
        </div>

        {/* Table */}
        <div className="p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wide">
                <th className="py-3">Item Name</th>
                <th className="py-3">Stock</th>
                <th className="py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                  <td className="py-4 font-medium">{item.name}</td>
                  <td className="py-4">{item.stock} units</td>
                  <td className="py-4">
                    {item.stock < 100 ? (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}