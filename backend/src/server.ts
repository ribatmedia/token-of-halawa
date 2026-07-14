import app from './app';
import { config } from './config';
import { prisma } from './libraries/prisma';
import { ROLES, PERMISSIONS } from './constants';
import bcrypt from 'bcryptjs';

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

    // 6. Ensure default campaigner accounts exist for login support
    console.log('🌱 Seeding 40 campaigner accounts...');
    let org = await prisma.organization.findFirst();
    if (!org) {
      org = await prisma.organization.create({
        data: {
          name: "Token of Halawa Organization",
          slug: "halawa"
        }
      });
    }

    const campaignersToSeed = [
      { hn: 1, name: "Asif ali", class: "Final year" },
      { hn: 2, name: "Bishrul wafa", class: "Final year" },
      { hn: 3, name: "Muhammed Falil", class: "Final year" },
      { hn: 4, name: "Sinan Cheekod", class: "Final year" },
      { hn: 5, name: "Sinan rafi", class: "Final year" },
      { hn: 6, name: "Ubayy Valliyad", class: "Final year" },
      { hn: 7, name: "Adhil Ameen", class: "Degree Third year" },
      { hn: 8, name: "Hashir puthoor", class: "Degree Third year" },
      { hn: 9, name: "Muhammed shaheer", class: "Degree Third year" },
      { hn: 10, name: "Muhammed Riswan", class: "Degree Third year" },
      { hn: 11, name: "Muhammed Ali", class: "Degree second year" },
      { hn: 12, name: "Muhammed Fayis", class: "Degree second year" },
      { hn: 13, name: "Sinan k", class: "Degree second year" },
      { hn: 14, name: "Yaseen kondotty", class: "Degree second year" },
      { hn: 15, name: "Muhammed Melattoor", class: "Degree first year" },
      { hn: 16, name: "Nihal valliyad", class: "Degree first year" },
      { hn: 17, name: "Anas Rahman", class: "Plus two" },
      { hn: 18, name: "Anas koduvally", class: "Plus two" },
      { hn: 19, name: "Anwar", class: "Plus two" },
      { hn: 20, name: "Adhil Nizar", class: "Plus two" },
      { hn: 21, name: "Naseel", class: "Plus two" },
      { hn: 22, name: "Sabith", class: "Plus two" },
      { hn: 23, name: "Sanah", class: "Plus two" },
      { hn: 24, name: "Savad", class: "Plus two" },
      { hn: 25, name: "Hashir kannur", class: "Plus two" },
      { hn: 26, name: "Yaseen c.k", class: "Plus two" },
      { hn: 27, name: "Abdu Rahman", class: "Plus one" },
      { hn: 28, name: "Adnan", class: "Plus one" },
      { hn: 29, name: "Anas Mooniyur", class: "Plus one" },
      { hn: 30, name: "Anees", class: "Plus one" },
      { hn: 31, name: "Basith moosa", class: "Plus one" },
      { hn: 32, name: "Farseen", class: "Plus one" },
      { hn: 33, name: "Hafil", class: "Plus one" },
      { hn: 34, name: "Mufeed", class: "Plus one" },
      { hn: 35, name: "Muzammil", class: "Plus one" },
      { hn: 36, name: "Rashal", class: "Plus one" },
      { hn: 37, name: "Rayyan", class: "Plus one" },
      { hn: 38, name: "Swalih", class: "Plus one" },
      { hn: 39, name: "Aboobacker Sidheeque", class: "Plus one" },
      { hn: 40, name: "Aneeb", class: "Plus one" }
    ];

    const salt = await bcrypt.genSalt(10);

    for (const c of campaignersToSeed) {
      const email = `hn${c.hn}@hidayaonline.org`;
      const existing = await prisma.user.findUnique({ where: { email } });
      if (!existing) {
        const passwordHash = await bcrypt.hash(`halawa${c.hn}`, salt);
        const newUser = await prisma.user.create({
          data: {
            organizationId: org.id,
            email,
            passwordHash,
            fullName: c.name,
            status: 'ACTIVE'
          }
        });
        if (volunteerRole) {
          await prisma.userRole.create({
            data: {
              userId: newUser.id,
              roleId: volunteerRole.id
            }
          });
        }
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
