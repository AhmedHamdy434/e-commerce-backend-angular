import { sql } from '@/lib/db'

export class CartRepository {
  async findByUserId(userId: string) {
    return sql`
      SELECT c.*, 
             json_build_object(
               'id', p.id, 
               'name', p.name, 
               'price', p.price, 
               'images', p.images,
               'slug', p.slug
             ) as product
      FROM "Cart" c
      LEFT JOIN "Product" p ON c."productId" = p.id
      WHERE c."userId" = ${userId}
    `;
  }

  async findItem(userId: string, productId: string) {
    const results = await sql`
      SELECT * FROM "Cart" 
      WHERE "userId" = ${userId} AND "productId" = ${productId}
    `;
    return results[0];
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const id = 'cart_' + Math.random().toString(36).substr(2, 9);
    const results = await sql`
      INSERT INTO "Cart" (id, "userId", "productId", quantity)
      VALUES (${id}, ${userId}, ${productId}, ${quantity})
      ON CONFLICT ("userId", "productId") 
      DO UPDATE SET quantity = "Cart".quantity + EXCLUDED.quantity
      RETURNING *
    `;
    return results[0];
  }

  async updateQuantity(id: string, quantity: number) {
    const results = await sql`
      UPDATE "Cart" SET quantity = ${quantity}
      WHERE id = ${id}
      RETURNING *
    `;
    return results[0];
  }

  async removeItem(id: string) {
    const results = await sql`
      DELETE FROM "Cart" WHERE id = ${id} RETURNING *
    `;
    return results[0];
  }

  async clear(userId: string) {
    const results = await sql`
      DELETE FROM "Cart" WHERE "userId" = ${userId} RETURNING *
    `;
    return results;
  }
}


export const cartRepository = new CartRepository()
