import express from "express";
import pool from "../config/db.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "8");
    const search = req.query.search?.trim() || "";

    const offset = (page - 1) * limit;

    let productsQuery;
    let values;

    if (search === "") {
      
      productsQuery = `
        SELECT *
        FROM tenant_products
        WHERE is_active = true
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      values = [limit, offset];
    } else {

      productsQuery = `
        SELECT *
        FROM tenant_products
        WHERE is_active = true
          AND (
            LOWER(name) LIKE LOWER($1)
            OR LOWER(description) LIKE LOWER($1)
          )
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      values = [`%${search}%`, limit, offset];
    }

    const products = await pool.query(productsQuery, values);

    let countQuery;
    let countValues;

    if (search === "") {
      countQuery = `
        SELECT COUNT(*) 
        FROM tenant_products
        WHERE is_active = true
      `;
      countValues = [];
    } else {
      countQuery = `
        SELECT COUNT(*) 
        FROM tenant_products
        WHERE is_active = true
          AND (
            LOWER(name) LIKE LOWER($1)
            OR LOWER(description) LIKE LOWER($1)
          )
      `;
      countValues = [`%${search}%`];
    }

    const totalResult = await pool.query(countQuery, countValues);
    const totalProducts = parseInt(totalResult.rows[0].count);

    res.json({
      products: products.rows,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
      },
    });
  } catch (err) {
    console.error("Products fetch error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/cart/add", authenticate, async (req, res) => {
  try {
    console.log("cart req: ",req);
    const userUuid = req.user.sub;
    const { product_id, name, image_url, price, quantity } = req.body;

    const productResult = await pool.query(
      `SELECT quantity FROM tenant_products WHERE id = $1 AND is_active = true`,
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > productResult.rows[0].quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    await pool.query(
      `
      INSERT INTO cart (user_uuid, name, price, image_url, product_id, quantity)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_uuid, product_id)
      DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity
      `,
      [userUuid, name, price, image_url, product_id, quantity]
    );

    res.json({ message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/cart", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM cart
      ORDER BY id DESC
      `
    );
    console.log("cart Items :", result.rows)
    res.json(result.rows);
  } catch (err) {
    console.error("Cart fetch error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/cart/remove/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM cart
      WHERE product_id = $1
      `,
      [product_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    res.json({ message: "Product removed from cart" });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ message: err.message });
  }
});



router.post("/buy", authenticate, async (req, res) => {
  const client = await pool.connect();

  try {
    const userUuid = req.user.sub;

    await client.query("BEGIN");

    const cartResult = await client.query(
      `
      SELECT product_id, quantity
      FROM cart
      WHERE user_uuid = $1
      `,
      [userUuid]
    );

    if (cartResult.rows.length === 0) {
      throw new Error("Cart is empty");
    }

    for (const item of cartResult.rows) {
      const stockResult = await client.query(
        `
        SELECT quantity
        FROM tenant_products
        WHERE id = $1
        FOR UPDATE
        `,
        [item.product_id]
      );

      if (stockResult.rows.length === 0) {
        throw new Error("Product not found");
      }

      if (stockResult.rows[0].quantity < item.quantity) {
        throw new Error("Insufficient stock");
      }

      await client.query(
        `
        UPDATE tenant_products
        SET quantity = quantity - $1
        WHERE id = $2
        `,
        [item.quantity, item.product_id]
      );
    }

    await client.query(
      `
      DELETE FROM cart
      WHERE user_uuid = $1
      `,
      [userUuid]
    );

    await client.query("COMMIT");

    res.json({ message: "Order placed successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Order error:", err.message);

    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
});

export default router;
