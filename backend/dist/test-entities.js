"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./config/data-source");
// Test the entities and database connection
async function testEntities() {
    try {
        console.log('🔄 Initializing database connection...');
        await (0, data_source_1.initializeDatabase)();
        console.log('✅ Database connected successfully!');
        console.log('📋 Available entities:');
        data_source_1.AppDataSource.entityMetadatas.forEach((entity) => {
            console.log(`  - ${entity.name} (table: ${entity.tableName})`);
        });
        console.log('🎉 All entities loaded successfully!');
        // Close the connection
        await data_source_1.AppDataSource.destroy();
        console.log('✅ Database connection closed');
    }
    catch (error) {
        console.error('❌ Error testing entities:', error);
        process.exit(1);
    }
}
// Run the test
testEntities();
//# sourceMappingURL=test-entities.js.map