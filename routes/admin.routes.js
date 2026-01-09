import express from "express";
import pool from "../config/db.js";
import {authenticate} from "../middlewares/auth.js";

const router = express.Router();

router.get("/tenants", authenticate, async (req, res) => {
    const result = await pool.query(
      `SELECT id, tenant_uuid, name, email, is_active, created_at
       FROM tenants
       ORDER BY created_at DESC`
    );
  
    res.json(result.rows);
  });
  

router.get("/tenants/:tenant_uuid", authenticate, async (req, res) => {
    const { tenant_uuid } = req.params;
  
    const result = await pool.query(
      `SELECT * FROM tenants WHERE tenant_uuid = $1`,
      [tenant_uuid]
    );
  
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tenant not found" });
    }
  
    res.json(result.rows[0]);
});

  
router.post("/admin/tenants", authenticate, async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      `INSERT INTO tenants (name, email)
       VALUES ($1, $2)
       RETURNING id, tenant_uuid, name, email, is_active, created_at`,
      [name, email]
    );

    res.status(201).json({
      success: true,
      tenant: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/tenants/:tenant_uuid", authenticate, async (req, res) => {
    const { tenant_uuid } = req.params;
  
    await pool.query(
      `UPDATE tenants SET is_active = false WHERE tenant_uuid = $1`,
      [tenant_uuid]
    );
  
    res.json({ message: "Tenant disabled successfully" });
  });
  

export default router;
