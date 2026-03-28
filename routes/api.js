const express = require('express');
const router = express.Router();
const db = require('../db');

// ==================== MEMBERS ====================

// Get all members
router.get('/members', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM members ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get single member by member_id
router.get('/members/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const result = await db.query('SELECT * FROM members WHERE member_id = $1', [memberId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

// Create new member
router.post('/members', async (req, res) => {
  try {
    const {
      member_id,
      first_name,
      last_name,
      email,
      phone,
      plan_type,
      plan_status,
      plan_expiry,
      current_weight,
      target_weight
    } = req.body;

    const result = await db.query(
      `INSERT INTO members (member_id, first_name, last_name, email, phone, plan_type, plan_status, plan_expiry, current_weight, target_weight)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [member_id, first_name, last_name, email, phone, plan_type, plan_status, plan_expiry, current_weight, target_weight]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Failed to create member' });
  }
});

// Update member
router.put('/members/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
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

    const result = await db.query(
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
});

// ==================== WORKOUTS ====================

// Get workouts for a member
router.get('/members/:memberId/workouts', async (req, res) => {
  try {
    const { memberId } = req.params;
    const result = await db.query(
      'SELECT * FROM workouts WHERE member_id = $1 ORDER BY workout_date DESC',
      [memberId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// Add workout
router.post('/members/:memberId/workouts', async (req, res) => {
  try {
    const { memberId } = req.params;
    const { workout_type, duration_minutes, trainer, workout_date, status, notes } = req.body;

    const result = await db.query(
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
});

// ==================== TRANSFORMATIONS ====================

// Get all transformations
router.get('/transformations', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM transformations ORDER BY is_featured DESC, created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching transformations:', error);
    res.status(500).json({ error: 'Failed to fetch transformations' });
  }
});

// Get featured transformations
router.get('/transformations/featured', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM transformations WHERE is_featured = true ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching featured transformations:', error);
    res.status(500).json({ error: 'Failed to fetch featured transformations' });
  }
});

// Add transformation
router.post('/transformations', async (req, res) => {
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

    const result = await db.query(
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
});

// ==================== CLASSES ====================

// Get today's classes
router.get('/classes/today', async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM classes WHERE class_date = CURRENT_DATE ORDER BY class_time ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get all classes
router.get('/classes', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM classes ORDER BY class_date DESC, class_time ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// ==================== CONTACT ====================

// Submit contact form
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const result = await db.query(
      `INSERT INTO contact_submissions (name, email, phone, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, phone, message]
    );

    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      submission: result.rows[0]
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// ==================== STATS ====================

// Get dashboard stats
router.get('/stats/dashboard', async (req, res) => {
  try {
    const membersCount = await db.query('SELECT COUNT(*) FROM members');
    const activeMembers = await db.query("SELECT COUNT(*) FROM members WHERE plan_status = 'Active'");
    const totalTransformations = await db.query('SELECT COUNT(*) FROM transformations');
    const todayClasses = await db.query("SELECT COUNT(*) FROM classes WHERE class_date = CURRENT_DATE");

    res.json({
      total_members: parseInt(membersCount.rows[0].count),
      active_members: parseInt(activeMembers.rows[0].count),
      total_transformations: parseInt(totalTransformations.rows[0].count),
      today_classes: parseInt(todayClasses.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;
