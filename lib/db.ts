import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Initialize Neon connection
const sql = neon(process.env.DATABASE_URL!);

export { sql };

// Database schema creation
export async function initializeDatabase() {
  try {
    // Architecture projects table
    await sql`
      CREATE TABLE IF NOT EXISTS architecture_projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        country VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        year VARCHAR(10),
        images TEXT[],
        icon VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Art projects table
    await sql`
      CREATE TABLE IF NOT EXISTS art_projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        country VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        year VARCHAR(10),
        images TEXT[],
        icon VARCHAR(500),
        collection VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Film projects table
    await sql`
      CREATE TABLE IF NOT EXISTS film_projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        country VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        year VARCHAR(10),
        images TEXT[],
        icon VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Product design projects table
    await sql`
      CREATE TABLE IF NOT EXISTS productdesign_projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        country VARCHAR(100) NOT NULL,
        city VARCHAR(100) NOT NULL,
        material VARCHAR(255),
        year INTEGER,
        use_case VARCHAR(500),
        images TEXT[],
        icon VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Blog articles table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        author VARCHAR(100),
        date VARCHAR(20) NOT NULL,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        sizes TEXT[],
        discount VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}
