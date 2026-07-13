import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../libraries/prisma';
import { config } from '../config';
import { ApiError } from '../middleware/error';

// Auth Validation Schemas
export const registerSchema = z.object({
  organizationName: z.string().min(3, 'Organization name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  phone: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string()
});

export class AuthService {
  static async register(data: z.infer<typeof registerSchema>) {
    // Validate request inputs
    const validated = registerSchema.parse(data);

    // Verify if organization slug or email already exists
    const existingOrg = await prisma.organization.findUnique({ where: { slug: validated.slug } });
    if (existingOrg) throw new ApiError(400, 'Organization identifier slug is already taken');

    const existingUser = await prisma.user.findUnique({ where: { email: validated.email } });
    if (existingUser) throw new ApiError(400, 'User with this email address already exists');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    // Execute in a database transaction
    return prisma.$transaction(async (tx) => {
      // 1. Create Organization
      const org = await tx.organization.create({
        data: {
          name: validated.organizationName,
          slug: validated.slug
        }
      });

      // 2. Fetch or Create Role ORG_ADMIN
      let role = await tx.role.findUnique({ where: { name: 'ORG_ADMIN' } });
      if (!role) {
        role = await tx.role.create({
          data: { name: 'ORG_ADMIN', description: 'Organization Admin Control' }
        });
      }

      // 3. Create user
      const user = await tx.user.create({
        data: {
          organizationId: org.id,
          email: validated.email,
          passwordHash,
          fullName: validated.fullName,
          phone: validated.phone,
          status: 'ACTIVE'
        }
      });

      // 4. Assign Admin Role
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id
        }
      });

      // Generate Tokens
      const tokens = this.generateTokens(user.id, org.id, user.email);

      // Create session in db
      await tx.session.create({
        data: {
          userId: user.id,
          refreshToken: tokens.refreshToken,
          tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      });

      return {
        user: { id: user.id, email: user.email, fullName: user.fullName },
        organization: { id: org.id, name: org.name, slug: org.slug },
        ...tokens
      };
    });
  }

  static async login(data: z.infer<typeof loginSchema>, ip?: string, userAgent?: string) {
    const validated = loginSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
      include: { organization: true }
    });

    if (!user || user.deletedAt) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new ApiError(403, 'Your account is currently disabled or suspended');
    }

    const tokens = this.generateTokens(user.id, user.organizationId, user.email);

    // Save session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: ip,
        userAgent
      }
    });

    // Write login system audit logs
    await prisma.activityLog.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        description: `User successfully logged in from IP ${ip || 'unknown'}`
      }
    });

    return {
      user: { id: user.id, email: user.email, fullName: user.fullName },
      organization: { id: user.organization.id, name: user.organization.name },
      ...tokens
    };
  }

  static async refresh(data: z.infer<typeof refreshTokenSchema>) {
    const validated = refreshTokenSchema.parse(data);

    const session = await prisma.session.findUnique({
      where: { refreshToken: validated.refreshToken },
      include: { user: true }
    });

    if (!session || !session.isValid || session.tokenExpiry < new Date()) {
      throw new ApiError(401, 'Invalid or expired session refresh token');
    }

    const tokens = this.generateTokens(session.userId, session.user.organizationId, session.user.email);

    // Invalidate old session token and issue new one
    await prisma.$transaction([
      prisma.session.delete({ where: { id: session.id } }),
      prisma.session.create({
        data: {
          userId: session.userId,
          refreshToken: tokens.refreshToken,
          tokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ipAddress: session.ipAddress,
          userAgent: session.userAgent
        }
      })
    ]);

    return tokens;
  }

  private static generateTokens(userId: string, orgId: string, email: string) {
    const accessToken = jwt.sign(
      { userId, orgId, email },
      config.jwt.secret as string,
      { expiresIn: config.jwt.accessExpiry as any }
    );

    const refreshToken = jwt.sign(
      { userId, orgId },
      config.jwt.refreshSecret as string,
      { expiresIn: config.jwt.refreshExpiry as any }
    );

    return { accessToken, refreshToken };
  }
}
