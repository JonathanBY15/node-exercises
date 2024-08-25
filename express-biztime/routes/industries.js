const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /industries: Add a new industry
router.post('/', async (req, res, next) => {
  try {
    const { code, industry } = req.body;

    if (!code || !industry) {
      return res.status(400).json({ error: 'Missing code or industry' });
    }

    const result = await db.query(
      `INSERT INTO industries (code, industry)
       VALUES ($1, $2)
       RETURNING code, industry`,
      [code, industry]
    );

    return res.status(201).json({ industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// GET /industries: List all industries with company codes
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT i.code, i.industry, array_agg(c.code) AS companies
       FROM industries AS i
       LEFT JOIN companies_industries AS ci ON i.code = ci.ind_code
       LEFT JOIN companies AS c ON ci.comp_code = c.code
       GROUP BY i.code, i.industry`
    );

    return res.json({ industries: result.rows });
  } catch (err) {
    return next(err);
  }
});

// POST /industries/:code/companies/:compCode: Associate an industry with a company
router.post('/:code/companies/:compCode', async (req, res, next) => {
  try {
    const { code } = req.params;
    const { compCode } = req.params;

    // Check if the industry and company exist
    const checkIndustry = await db.query(`SELECT code FROM industries WHERE code=$1`, [code]);
    const checkCompany = await db.query(`SELECT code FROM companies WHERE code=$1`, [compCode]);

    if (checkIndustry.rows.length === 0 || checkCompany.rows.length === 0) {
      return res.status(404).json({ error: 'Industry or Company not found' });
    }

    // Associate industry with company
    await db.query(
      `INSERT INTO companies_industries (comp_code, ind_code)
       VALUES ($1, $2)`,
      [compCode, code]
    );

    return res.status(201).json({ message: 'Association created' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
