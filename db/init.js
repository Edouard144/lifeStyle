const db = require('./index');

const createTables = async () => {
  try {
    console.log('🔄 Initializing database tables...');

    // Members table
    await db.query(`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        member_id VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        plan_type VARCHAR(50) NOT NULL DEFAULT 'Basic',
        plan_status VARCHAR(20) NOT NULL DEFAULT 'Active',
        plan_expiry DATE,
        current_weight DECIMAL(5,2),
        target_weight DECIMAL(5,2),
        calories_burnt_week INTEGER DEFAULT 0,
        attendance_days INTEGER DEFAULT 0,
        total_days INTEGER DEFAULT 26,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Members table created');

    // Workouts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS workouts (
        id SERIAL PRIMARY KEY,
        member_id VARCHAR(20) REFERENCES members(member_id),
        workout_type VARCHAR(100) NOT NULL,
        duration_minutes INTEGER NOT NULL,
        trainer VARCHAR(100),
        workout_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'Completed',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Workouts table created');

    // Transformations table
    await db.query(`
      CREATE TABLE IF NOT EXISTS transformations (
        id SERIAL PRIMARY KEY,
        member_id VARCHAR(20) REFERENCES members(member_id),
        member_name VARCHAR(200) NOT NULL,
        before_image_url TEXT,
        after_image_url TEXT,
        program_name VARCHAR(200),
        description TEXT,
        testimonial TEXT,
        weight_lost DECIMAL(5,2),
        duration_months INTEGER,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Transformations table created');

    // Classes table
    await db.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id SERIAL PRIMARY KEY,
        class_name VARCHAR(100) NOT NULL,
        instructor VARCHAR(100),
        class_time TIME NOT NULL,
        class_date DATE NOT NULL,
        duration_minutes INTEGER DEFAULT 60,
        max_capacity INTEGER DEFAULT 20,
        current_enrolled INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Classes table created');

    // Contact submissions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'New',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contact submissions table created');

    // Insert sample data
    console.log('🔄 Inserting sample data...');

    // Sample member
    await db.query(`
      INSERT INTO members (member_id, first_name, last_name, email, phone, plan_type, plan_status, plan_expiry, current_weight, target_weight, calories_burnt_week, attendance_days)
      VALUES ('LSG001', 'Jean', 'Baptiste', 'jean.baptiste@example.com', '+250-789450433', 'Gold', 'Active', '2026-10-31', 75.0, 70.0, 3500, 20)
      ON CONFLICT (member_id) DO NOTHING
    `);

    // Sample workouts
    await db.query(`
      INSERT INTO workouts (member_id, workout_type, duration_minutes, trainer, workout_date, status)
      VALUES 
        ('LSG001', 'Strength Training', 75, 'Self', '2026-03-24', 'Completed'),
        ('LSG001', 'Aerobics', 60, 'Coach IKRAM', '2026-03-23', 'Completed'),
        ('LSG001', 'Jumping Trampoline', 60, 'Coach Diane', '2026-03-22', 'Completed'),
        ('LSG001', 'Aerobics', 60, 'Coach DIDI', '2026-03-21', 'Completed')
      ON CONFLICT DO NOTHING
    `);

    // Sample transformations
    await db.query(`
      INSERT INTO transformations (member_id, member_name, before_image_url, after_image_url, program_name, description, testimonial, weight_lost, duration_months, is_featured)
      VALUES 
        ('LSG001', 'Eric Niyonzima', 'https://images.unsplash.com/photo-1579621970795-87facc2f935d?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1599058917215-a926cc40989d?q=80&w=2070&auto=format&fit=crop', '6-Month Fat Loss Program', 'Eric dropped 25 kgs in 6 months with our customized fat loss program and personal training.', 'Lifestyle Gym changed my life. The trainers pushed me, and the community motivated me. Highly recommend!', 25.0, 6, true),
        ('LSG001', 'Grace Uwimana', 'https://images.unsplash.com/photo-1594917631720-d30d19ce407e?q=80&w=1964&auto=format&fit=crop', 'https://images.unsplash.com/photo-1601004890693-43401570d588?q=80&w=2070&auto=format&fit=crop', 'Advanced Strength Training', 'Grace gained significant muscle mass and boosted her strength with our advanced strength training.', 'I never thought I could lift this much! The personalized plans at Lifestyle Gym are incredible.', 0, 4, true)
      ON CONFLICT DO NOTHING
    `);

    // Sample classes
    await db.query(`
      INSERT INTO classes (class_name, instructor, class_time, class_date, duration_minutes, max_capacity, current_enrolled)
      VALUES 
        ('Aerobics', 'Coach IKRAM', '18:00', CURRENT_DATE, 60, 25, 18),
        ('Jumping Trampoline', 'Coach Diane', '08:00', CURRENT_DATE, 60, 20, 12),
        ('Jumping Trampoline', 'Coach Diane', '18:30', CURRENT_DATE, 90, 20, 15),
        ('Aerobics', 'Coach DIDI', '19:00', CURRENT_DATE, 60, 25, 20)
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Sample data inserted');
    console.log('🎉 Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  createTables()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = createTables;
