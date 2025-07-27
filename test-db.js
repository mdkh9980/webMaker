const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Attempting to connect to the database...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();