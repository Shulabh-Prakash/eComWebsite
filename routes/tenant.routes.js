import express from "express";
import pool from "../config/db.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:tenant/products", authenticate, async (req, res) => {
  try {
    const { tenant } = req.params;

    const tenantResult = await pool.query(
      "SELECT tenant_uuid FROM tenants WHERE name = $1",
      [tenant]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const tenantUuid = tenantResult.rows[0].tenant_uuid;

    const result = await pool.query(
      `SELECT *
       FROM tenant_products
       WHERE tenant_uuid = $1 AND is_active = true
       ORDER BY created_at DESC`,
      [tenantUuid]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/:tenant/products", authenticate, async (req, res) => {
  try {
    const { tenant } = req.params;
    const { name, description, price, quantity, image_url } = req.body;

    const tenantResult = await pool.query(
      "SELECT tenant_uuid FROM tenants WHERE name = $1",
      [tenant]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const tenantUuid = tenantResult.rows[0].tenant_uuid;

    const result = await pool.query(
      `INSERT INTO tenant_products
       (tenant_uuid, name, description, price, quantity, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [tenantUuid, name, description, price, quantity, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/:tenant/products/:id", authenticate, async (req, res) => {
  try {
    const { tenant, id } = req.params;
    const { name, description, price, quantity, image_url } = req.body;

    const tenantResult = await pool.query(
      "SELECT tenant_uuid FROM tenants WHERE name = $1",
      [tenant]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const tenantUuid = tenantResult.rows[0].tenant_uuid;

    const result = await pool.query(
      `UPDATE tenant_products
       SET name = $1,
           description = $2,
           price = $3,
           quantity = $4,
           image_url = $5,
           updated_at = NOW()
       WHERE id = $6 AND tenant_uuid = $7
       RETURNING *`,
      [name, description, price, quantity, image_url, id, tenantUuid]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:tenant/products/:id", authenticate, async (req, res) => {
  try {
    const { tenant, id } = req.params;

    const tenantResult = await pool.query(
      "SELECT tenant_uuid FROM tenants WHERE name = $1",
      [tenant]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const tenantUuid = tenantResult.rows[0].tenant_uuid;

    const result = await pool.query(
      `UPDATE tenant_products
       SET is_active = false
       WHERE id = $1 AND tenant_uuid = $2`,
      [id, tenantUuid]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
