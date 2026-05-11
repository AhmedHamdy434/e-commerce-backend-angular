import { sql } from '@/lib/db'
import { ApiError } from '@/lib/error-handler'

export class CheckoutService {
  async processCheckout(userId: string) {
    try {
      // We use a single SQL query with CTEs to ensure atomicity in a connectionless driver
      const result = await sql`
        WITH 
        -- 1. Get cart items with product details
        cart_items AS (
          SELECT c.*, p.price, p.discount, p."stockQuantity", p.name as product_name
          FROM "Cart" c
          JOIN "Product" p ON c."productId" = p.id
          WHERE c."userId" = ${userId}
        ),
        -- 2. Validate stock and calculate total
        check_stock AS (
          SELECT 
            COUNT(*) filter (where quantity > "stockQuantity") as insufficient_stock_count,
            SUM((price - discount) * quantity) as total_amount,
            COUNT(*) as items_count
          FROM cart_items
        ),
        -- 3. Create the Order (only if stock is OK and cart not empty)
        new_order AS (
          INSERT INTO "Order" (id, "userId", "totalAmount", "updatedAt", "createdAt")
          SELECT 
            'ord_' || floor(random() * 1000000)::text, 
            ${userId}, 
            total_amount, 
            NOW(), 
            NOW()
          FROM check_stock
          WHERE insufficient_stock_count = 0 AND items_count > 0
          RETURNING *
        ),
        -- 4. Create OrderItems
        new_order_items AS (
          INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, price, "updatedAt")
          SELECT 
            'oi_' || floor(random() * 1000000)::text || p.id,
            (SELECT id FROM new_order),
            p."productId",
            p.quantity,
            (p.price - p.discount),
            NOW()
          FROM cart_items p
          WHERE (SELECT id FROM new_order) IS NOT NULL
          RETURNING *
        ),
        -- 5. Update Product Stock
        update_stock AS (
          UPDATE "Product" p
          SET "stockQuantity" = p."stockQuantity" - ci.quantity,
              "updatedAt" = NOW()
          FROM cart_items ci
          WHERE p.id = ci."productId" AND (SELECT id FROM new_order) IS NOT NULL
        ),
        -- 6. Clear Cart
        clear_cart AS (
          DELETE FROM "Cart" 
          WHERE "userId" = ${userId} AND (SELECT id FROM new_order) IS NOT NULL
        )
        -- Finally, return the order and status
        SELECT 
          no.*,
          (SELECT insufficient_stock_count FROM check_stock) as insufficient_stock_count,
          (SELECT items_count FROM check_stock) as items_count
        FROM new_order no
      `;

      if (result.length === 0) {
        // If no order was returned, figure out why
        const check = await sql`
          SELECT 
            COUNT(*) filter (where c.quantity > p."stockQuantity") as insufficient_stock_count,
            COUNT(*) as items_count
          FROM "Cart" c
          JOIN "Product" p ON c."productId" = p.id
          WHERE c."userId" = ${userId}
        `;
        
        if (check[0].items_count === 0) throw new ApiError(400, 'Cart is empty');
        if (check[0].insufficient_stock_count > 0) throw new ApiError(400, 'Insufficient stock for one or more products');
        
        throw new ApiError(500, 'Checkout failed');
      }

      return result[0];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('Checkout Error:', error);
      throw new ApiError(500, 'Failed to process checkout');
    }
  }
}


export const checkoutService = new CheckoutService()
