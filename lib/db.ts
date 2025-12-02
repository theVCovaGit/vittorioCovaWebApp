import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Initialize Neon connection
const sql = neon(process.env.DATABASE_URL!);

export { sql };

// Helper function to check if table exists
async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      )
    `;
    return result[0]?.exists === true;
  } catch (error) {
    console.warn(`⚠️ Could not check if table ${tableName} exists:`, error);
    return false;
  }
}

// Lazy table initialization - tables are created when first accessed
export async function ensureTableExists(tableName: string, retries = 2): Promise<boolean> {
  // First, check if table already exists
  const exists = await tableExists(tableName);
  if (exists) {
    return true;
  }

  // If table doesn't exist, try to create it with retry logic
  for (let attempt = 0; attempt <= retries; attempt++) {
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
          // Try to add icon_secondary column if it doesn't exist
          try {
            await sql`
              ALTER TABLE architecture_projects
              ADD COLUMN IF NOT EXISTS icon_secondary VARCHAR(500)
            `;
          } catch (alterError) {
            // Column might already exist, ignore
            console.warn('⚠️ Could not add icon_secondary column (might already exist)');
          }
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
      
      // Verify table was created
      const created = await tableExists(tableName);
      if (created) {
        console.log(`✅ Table ${tableName} created/verified successfully`);
        return true;
      }
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      const isTableExistsError = errorMessage.includes('already exists') || 
                                 errorMessage.includes('duplicate') ||
                                 errorMessage.includes('relation') && errorMessage.includes('already');
      
      if (isTableExistsError) {
        // Table exists, which is fine
        console.log(`ℹ️ Table ${tableName} already exists`);
        return true;
      }
      
      if (attempt < retries) {
        console.warn(`⚠️ Error creating table ${tableName} (attempt ${attempt + 1}/${retries + 1}), retrying...`, errorMessage);
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      // Last attempt failed
      console.error(`❌ Error creating table ${tableName} after ${retries + 1} attempts:`, error);
      // Don't throw - return false so calling code can handle gracefully
      return false;
    }
  }
  
  return false;
}
