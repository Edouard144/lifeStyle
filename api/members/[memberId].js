const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { memberId } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM members WHERE member_id = $1', [memberId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Member not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching member:', error);
      res.status(500).json({ error: 'Failed to fetch member' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        first_name,
        last_name,
        email,
        phone,
        plan_type,
        plan_status,
        plan_expiry,
        current_weight,
        target_weight,
        calories_burnt_week,
        attendance_days
      } = req.body;

      const result = await pool.query(
        `UPDATE members 
         SET first_name = $1, last_name = $2, email = $3, phone = $4, plan_type = $5, 
             plan_status = $6, plan_expiry = $7, current_weight = $8, target_weight = $9,
             calories_burnt_week = $10, attendance_days = $11, updated_at = CURRENT_TIMESTAMP
         WHERE member_id = $12
         RETURNING *`,
        [first_name, last_name, email, phone, plan_type, plan_status, plan_expiry, 
         current_weight, target_weight, calories_burnt_week, attendance_days, memberId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Member not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating member:', error);
      res.status(500).json({ error: 'Failed to update member' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
