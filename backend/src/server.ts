import app from './app';
import { config } from './config';
import { prisma } from './libraries/prisma';
import { ROLES, PERMISSIONS } from './constants';

const PORT = config.port;

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting automatic database role and permission synchronization...');
    
    // 1. Ensure all roles exist
    const roleNames = Object.values(ROLES);
    for (const name of roleNames) {
      await prisma.role.upsert({
        where: { name },
        update: {},
        create: { name, description: `${name} Role` }
      });
    }

    // 2. Ensure all permissions exist
    const actions = Object.values(PERMISSIONS);
    for (const action of actions) {
      await prisma.permission.upsert({
        where: { action },
        update: {},
        create: { action, description: action.replace(':', ' ').toUpperCase() }
      });
    }

    const dbPermissions = await prisma.permission.findMany();

    // 3. Map all permissions to ORG_ADMIN
    const orgAdminRole = await prisma.role.findUnique({ where: { name: 'ORG_ADMIN' } });
    if (orgAdminRole) {
      for (const perm of dbPermissions) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: orgAdminRole.id,
              permissionId: perm.id
            }
          },
          update: {},
          create: {
            roleId: orgAdminRole.id,
            permissionId: perm.id
          }
        });
      }
    }

    // 4. Map standard receiver permissions to VOLUNTEER (Campaigner)
    const volunteerRole = await prisma.role.findUnique({ where: { name: 'VOLUNTEER' } });
    if (volunteerRole) {
      const volunteerPerms = dbPermissions.filter(p => ['donation:create', 'donor:create'].includes(p.action));
      for (const perm of volunteerPerms) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: volunteerRole.id,
              permissionId: perm.id
            }
          },
          update: {},
          create: {
            roleId: volunteerRole.id,
            permissionId: perm.id
          }
        });
      }
    }

    // 5. Map permissions to CLASS_LEADER
    const leaderRole = await prisma.role.findUnique({ where: { name: 'CLASS_LEADER' } });
    if (leaderRole) {
      const leaderPerms = dbPermissions.filter(p => ['donation:create', 'donor:create', 'donation:verify', 'donor:read'].includes(p.action));
      for (const perm of leaderPerms) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: leaderRole.id,
              permissionId: perm.id
            }
          },
          update: {},
          create: {
            roleId: leaderRole.id,
            permissionId: perm.id
          }
        });
      }
    }

    console.log('✔ Database role and permission synchronization complete.');
  } catch (err) {
    console.error('❌ Failed to synchronize database seed roles and permissions:', err);
  }
};

const startServer = async () => {
  try {
    // Verify database connection on startup
    await prisma.$connect();
    console.log('✔ Connected to Neon PostgreSQL database via Prisma ORM.');

    // Seed database roles and permissions
    await seedDatabase();

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
