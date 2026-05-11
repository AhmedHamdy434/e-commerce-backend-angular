import { sql } from '@/lib/db'

export class OrderRepository {
  async findByUserId(userId: string) {
    return sql`
      SELECT o.*, 
             (SELECT json_agg(json_build_object(
               'id', oi.id,
               'quantity', oi.quantity,
               'price', oi.price,
               'product', json_build_object(
                 'id', p.id,
                 'name', p.name,
                 'slug', p.slug,
                 'images', p.images
               )
             )) FROM "OrderItem" oi 
             LEFT JOIN "Product" p ON oi."productId" = p.id
             WHERE oi."orderId" = o.id) as items
      FROM "Order" o
      WHERE o."userId" = ${userId}
      ORDER BY o."createdAt" DESC
    `;
  }

  async findById(id: string) {
    const results = await sql`
      SELECT o.*, 
             (SELECT json_agg(json_build_object(
               'id', oi.id,
               'quantity', oi.quantity,
               'price', oi.price,
               'product', json_build_object(
                 'id', p.id,
                 'name', p.name,
                 'slug', p.slug,
                 'images', p.images
               )
             )) FROM "OrderItem" oi 
             LEFT JOIN "Product" p ON oi."productId" = p.id
             WHERE oi."orderId" = o.id) as items
      FROM "Order" o
      WHERE o.id = ${id}
    `;
    return results[0];
  }
}


export const orderRepository = new OrderRepository()
