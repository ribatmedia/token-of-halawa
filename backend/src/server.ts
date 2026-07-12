import app from './app';
import { config } from './config';
import { prisma } from './libraries/prisma';

const PORT = config.port;

const startServer = async () => {
  try {
    // Verify database connection on startup
    await prisma.$connect();
    console.log('✔ Connected to Neon PostgreSQL database via Prisma ORM.');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Token of Halawa Server executing on port ${PORT} in [${config.env}] environment`);
    });

    // Handle graceful shutdowns
    const shutdown = async () => {
      console.log('Shutting down server gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Prisma disconnected. Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('❌ Bootstrapping failed:', error);
    process.exit(1);
  }
};

startServer();
