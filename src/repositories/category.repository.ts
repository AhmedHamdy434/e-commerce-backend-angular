import { sql } from "@/lib/db";

export class CategoryRepository {
  async findAll() {
    return sql`
      SELECT c.*, 
        (SELECT COUNT(*)::int FROM "Product" p WHERE p."categoryId" = c.id) as products_count
      FROM "Category" c
      ORDER BY c."createdAt" DESC
    `;
  }

  async findById(id: string) {
    const categories = await sql`
      SELECT * FROM "Category" WHERE id = ${id}
    `;
    const category = categories[0];
    if (category) {
      category.products = await sql`
        SELECT * FROM "Product" WHERE "categoryId" = ${id}
      `;
    }
    return category;
  }

  async findBySlug(slug: string) {
    const categories = await sql`
      SELECT * FROM "Category" WHERE slug = ${slug}
    `;
    const category = categories[0];
    if (category) {
      category.products = await sql`
        SELECT * FROM "Product" WHERE "categoryId" = ${category.id}
      `;
    }
    return category;
  }

  async create(data: any) {
    const { name, slug, image } = data;
    // Note: Generating a simple UUID if ID is not provided, 
    // but ideally the table should have a default gen_random_uuid()
    const results = await sql`
      INSERT INTO "Category" (id, name, slug, image, "updatedAt")
      VALUES (COALESCE(${data.id}, 'cat_' || floor(random() * 1000000)::text), ${name}, ${slug}, ${image}, NOW())
      RETURNING *
    `;
    return results[0];
  }

  async update(id: string, data: any) {
    const keys = Object.keys(data).filter(k => data[k] !== undefined);
    if (keys.length === 0) return this.findById(id);

    const setClause = keys.map(k => `"${k}" = ${JSON.stringify(data[k])}`).join(', ');
    // Direct interpolation is risky, so we use a more structured approach if possible, 
    // but neon() template literals are safest. 
    // For simplicity in this migration, I'll update fields individually or use a helper.
    
    // Safer approach for dynamic updates in raw SQL:
    let query = 'UPDATE "Category" SET "updatedAt" = NOW()';
    if (data.name) query += `, name = ${data.name}`;
    if (data.slug) query += `, slug = ${data.slug}`;
    if (data.image) query += `, image = ${data.image}`;
    
    const results = await sql`
      UPDATE "Category" 
      SET 
        name = COALESCE(${data.name}, name),
        slug = COALESCE(${data.slug}, slug),
        image = COALESCE(${data.image}, image),
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return results[0];
  }

  async delete(id: string) {
    const results = await sql`
      DELETE FROM "Category" WHERE id = ${id} RETURNING *
    `;
    return results[0];
  }
}


export const categoryRepository = new CategoryRepository();
