import { sql } from '@/lib/db'
import { ProductFilters } from '@/types/api'

export class ProductRepository {
 async findAll(filters: ProductFilters, skip: number, take: number) {
  // 1. جلب العناصر مع تحديد الأنواع صراحة لمنع خطأ الـ Type Determination
  const items = await sql`
    SELECT p.*, 
           json_build_object(
             'id', c.id, 
             'name', c.name, 
             'slug', c.slug, 
             'image', c.image
           ) as category
    FROM "Product" p
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    WHERE (c.slug = ${filters.category || null} OR ${filters.category || null}::text IS NULL)
      AND (p.brand = ${filters.brand || null} OR ${filters.brand || null}::text IS NULL)
      AND (p."isFeatured" = ${filters.isFeatured ?? null}::boolean OR ${filters.isFeatured ?? null}::boolean IS NULL)
      AND (p.price >= ${filters.minPrice ?? 0})
      AND (p.price <= ${filters.maxPrice ?? 99999999})
    ORDER BY 
      CASE WHEN ${filters.sort || null}::text = 'price_asc' THEN p.price END ASC,
      CASE WHEN ${filters.sort || null}::text = 'price_desc' THEN p.price END DESC,
      CASE WHEN ${filters.sort || null}::text = 'rating' THEN p.ratings END DESC,
      p."createdAt" DESC
    LIMIT ${take}::int OFFSET ${skip}::int
  `;

  // 2. جلب العدد الكلي بنفس التعديلات
  const countResult = await sql`
    SELECT COUNT(*)::int as total
    FROM "Product" p
    LEFT JOIN "Category" c ON p."categoryId" = c.id
    WHERE (c.slug = ${filters.category || null} OR ${filters.category || null}::text IS NULL)
      AND (p.brand = ${filters.brand || null} OR ${filters.brand || null}::text IS NULL)
      AND (p."isFeatured" = ${filters.isFeatured ?? null}::boolean OR ${filters.isFeatured ?? null}::boolean IS NULL)
      AND (p.price >= ${filters.minPrice ?? 0})
      AND (p.price <= ${filters.maxPrice ?? 99999999})
  `;

  const total = countResult[0]?.total || 0;

  return { items, total };
}

  async findById(id: string) {
    const products = await sql`
      SELECT p.*, 
             json_build_object(
               'id', c.id, 
               'name', c.name, 
               'slug', c.slug, 
               'image', c.image
             ) as category
      FROM "Product" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      WHERE p.id = ${id}
    `;
    return products[0];
  }

  async findBySlug(slug: string) {
    const products = await sql`
      SELECT p.*, 
             json_build_object(
               'id', c.id, 
               'name', c.name, 
               'slug', c.slug, 
               'image', c.image
             ) as category
      FROM "Product" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      WHERE p.slug = ${slug}
    `;
    return products[0];
  }

  async create(data: any) {
    const id = data.id || 'prod_' + Math.random().toString(36).substr(2, 9);
    const results = await sql`
      INSERT INTO "Product" (
        id, name, slug, description, price, discount, 
        "stockQuantity", images, ratings, brand, "isFeatured", "categoryId", "updatedAt"
      ) VALUES (
        ${id}, ${data.name}, ${data.slug}, ${data.description}, ${data.price}, 
        ${data.discount || 0}, ${data.stockQuantity || 0}, ${data.images || []}, 
        ${data.ratings || 0}, ${data.brand}, ${data.isFeatured || false}, 
        ${data.categoryId}, NOW()
      ) RETURNING *
    `;
    return results[0];
  }

  async update(id: string, data: any) {
    // Dynamic updates can be complex in raw SQL. 
    // For this migration, I'll update the most common fields or use a COALESCE pattern.
    const results = await sql`
      UPDATE "Product" SET
        name = COALESCE(${data.name}, name),
        slug = COALESCE(${data.slug}, slug),
        description = COALESCE(${data.description}, description),
        price = COALESCE(${data.price}, price),
        discount = COALESCE(${data.discount}, discount),
        "stockQuantity" = COALESCE(${data.stockQuantity}, "stockQuantity"),
        images = COALESCE(${data.images}, images),
        ratings = COALESCE(${data.ratings}, ratings),
        brand = COALESCE(${data.brand}, brand),
        "isFeatured" = COALESCE(${data.isFeatured}, "isFeatured"),
        "categoryId" = COALESCE(${data.categoryId}, "categoryId"),
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return results[0];
  }

  async delete(id: string) {
    const results = await sql`
      DELETE FROM "Product" WHERE id = ${id} RETURNING *
    `;
    return results[0];
  }
}

export const productRepository = new ProductRepository()

