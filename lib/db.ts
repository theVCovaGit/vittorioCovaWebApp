import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Initialize Neon connection
const sql = neon(process.env.DATABASE_URL!);

export { sql };

// Lazy table initialization - tables are created when first accessed
export async function ensureTableExists(tableName: string) {
  try {
    switch (tableName) {
      case 'architecture_projects':
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
            icon_secondary VARCHAR(500),
            position INTEGER DEFAULT 1,
            page INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        await sql`
          ALTER TABLE architecture_projects
          ADD COLUMN IF NOT EXISTS icon_secondary VARCHAR(500)
        `;
        break;
        
      case 'art_projects':
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
            position INTEGER DEFAULT 1,
            page INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        break;
        
      case 'film_projects':
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
            position INTEGER DEFAULT 1,
            page INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        break;
        
      case 'productdesign_projects':
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
            position INTEGER DEFAULT 1,
            page INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        break;
        
      case 'blog_articles':
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
        break;
    }
  } catch (error) {
    console.error(`❌ Error creating table ${tableName}:`, error);
    throw error;
  }
}
