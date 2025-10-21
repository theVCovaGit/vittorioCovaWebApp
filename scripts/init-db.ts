import { config } from 'dotenv';
import { initializeDatabase } from '../lib/db';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function main() {
  try {
    console.log('🚀 Initializing database schema...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    await initializeDatabase();
    console.log('✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();
