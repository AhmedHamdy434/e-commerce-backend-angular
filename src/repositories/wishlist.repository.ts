import { sql } from '@/lib/db'

export class WishlistRepository {
  async findByUserId(userId: string) {
    return sql`
      SELECT w.*, 
             json_build_object(
               'id', p.id, 
               'name', p.name, 
               'price', p.price, 
               'images', p.images,
               'slug', p.slug
             ) as product
      FROM "Wishlist" w
      LEFT JOIN "Product" p ON w."productId" = p.id
      WHERE w."userId" = ${userId}
    `;
  }

  async findItem(userId: string, productId: string) {
    const results = await sql`
      SELECT * FROM "Wishlist" 
      WHERE "userId" = ${userId} AND "productId" = ${productId}
    `;
    return results[0];
  }

  async addItem(userId: string, productId: string) {
    const id = 'wish_' + Math.random().toString(36).substr(2, 9);
    const results = await sql`
      INSERT INTO "Wishlist" (id, "userId", "productId")
      VALUES (${id}, ${userId}, ${productId})
      RETURNING *
    `;
    return results[0];
  }

  async removeItem(id: string) {
    const results = await sql`
      DELETE FROM "Wishlist" WHERE id = ${id} RETURNING *
    `;
    return results[0];
  }
}


export const wishlistRepository = new WishlistRepository()
