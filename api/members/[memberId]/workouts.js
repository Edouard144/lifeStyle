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
      const result = await pool.query(
        'SELECT * FROM workouts WHERE member_id = $1 ORDER BY workout_date DESC',
        [memberId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      res.status(500).json({ error: 'Failed to fetch workouts' });
    }
  } else if (req.method === 'POST') {
    try {
      const { workout_type, duration_minutes, trainer, workout_date, status, notes } = req.body;

      const result = await pool.query(
        `INSERT INTO workouts (member_id, workout_type, duration_minutes, trainer, workout_date, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [memberId, workout_type, duration_minutes, trainer, workout_date, status, notes]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error adding workout:', error);
      res.status(500).json({ error: 'Failed to add workout' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
