// routes/invoices.js

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /invoices: Return info on invoices
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, comp_code FROM invoices');
    return res.json({ invoices: result.rows });
  } catch (err) {
    return next(err);
  }
});

// GET /invoices/:id: Return obj on given invoice
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT i.id, i.amt, i.paid, i.add_date, i.paid_date, 
              c.code, c.name, c.description 
       FROM invoices AS i
       JOIN companies AS c ON i.comp_code = c.code
       WHERE i.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    const invoice = result.rows[0];
    return res.json({
      invoice: {
        id: invoice.id,
        amt: invoice.amt,
        paid: invoice.paid,
        add_date: invoice.add_date,
        paid_date: invoice.paid_date,
        company: {
          code: invoice.code,
          name: invoice.name,
          description: invoice.description,
        },
      },
    });
  } catch (err) {
    return next(err);
  }
});

// POST /invoices: Adds an invoice
router.post('/', async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;
    const result = await db.query(
      `INSERT INTO invoices (comp_code, amt)
       VALUES ($1, $2)
       RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [comp_code, amt]
    );
    return res.status(201).json({ invoice: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// Helper function to get the current date
const getCurrentDate = () => new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

// PUT /invoices/:id: Updates an invoice
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amt, paid } = req.body;

    if (typeof amt !== 'number' || typeof paid !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Fetch the current invoice data
    const result = await db.query(
      `SELECT id, amt, paid, paid_date FROM invoices WHERE id=$1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const invoice = result.rows[0];
    const updatedPaidDate = paid ? getCurrentDate() : null;

    // Update the invoice
    const updateResult = await db.query(
      `UPDATE invoices SET amt=$1, paid=$2, paid_date=$3
       WHERE id=$4
       RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [amt, paid, updatedPaidDate, id]
    );

    return res.json({ invoice: updateResult.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// DELETE /invoices/:id: Deletes an invoice
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM invoices WHERE id=$1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    return res.json({ status: "deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
