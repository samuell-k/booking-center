import 'reflect-metadata';
import { initializeDatabase, AppDataSource } from './config/data-source';

// Test the entities and database connection
async function testEntities() {
  try {
    console.log('🔄 Initializing database connection...');
    await initializeDatabase();
    
    console.log('✅ Database connected successfully!');
    console.log('📋 Available entities:');
    
    AppDataSource.entityMetadatas.forEach((entity) => {
      console.log(`  - ${entity.name} (table: ${entity.tableName})`);
    });
    
    console.log('🎉 All entities loaded successfully!');
    
    // Close the connection
    await AppDataSource.destroy();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error testing entities:', error);
    process.exit(1);
  }
}

// Run the test
testEntities();
