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

  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM transformations ORDER BY is_featured DESC, created_at DESC'
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching transformations:', error);
      res.status(500).json({ error: 'Failed to fetch transformations' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        member_id,
        member_name,
        before_image_url,
        after_image_url,
        program_name,
        description,
        testimonial,
        weight_lost,
        duration_months,
        is_featured
      } = req.body;

      const result = await pool.query(
        `INSERT INTO transformations (member_id, member_name, before_image_url, after_image_url, program_name, description, testimonial, weight_lost, duration_months, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [member_id, member_name, before_image_url, after_image_url, program_name, description, testimonial, weight_lost, duration_months, is_featured]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding transformation:', error);
      res.status(500).json({ error: 'Failed to add transformation' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
