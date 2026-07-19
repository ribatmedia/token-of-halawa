const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$transaction([
      prisma.payment.deleteMany(),
      prisma.receipt.deleteMany(),
      prisma.workflowLog.deleteMany(),
      prisma.donation.deleteMany(),
      prisma.donor.deleteMany()
    ]);
    console.log('success');
  } catch(e) {
    console.error('Error:', e.message);
  }
}
main();
