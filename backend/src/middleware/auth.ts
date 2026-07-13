import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { prisma } from '../libraries/prisma';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    organizationId: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. Header missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret as string) as {
      userId: string;
      orgId: string;
      email: string;
    };

    // Retrieve user and their role permissions
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user || user.status !== 'ACTIVE' || user.deletedAt) {
      return res.status(403).json({ error: 'User is inactive or has been suspended' });
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    
    // Accumulate all granular action strings from the user roles
    const permissionsSet = new Set<string>();
    user.userRoles.forEach((ur) => {
      ur.role.permissions.forEach((rp) => {
        permissionsSet.add(rp.permission.action);
      });
    });

    req.user = {
      id: user.id,
      organizationId: user.organizationId,
      email: user.email,
      roles,
      permissions: Array.from(permissionsSet)
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token credentials' });
  }
};

export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication credentials required' });
    }

    // Super Admin can do everything
    if (req.user.roles.includes('SUPER_ADMIN')) {
      return next();
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Access denied: Insufficient permissions to complete this operation' });
    }

    next();
  };
};

export const requireRole = (rolesAllowed: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication credentials required' });
    }

    const hasRole = req.user.roles.some((role) => rolesAllowed.includes(role));
    if (!hasRole && !req.user.roles.includes('SUPER_ADMIN')) {
      return res.status(403).json({ error: 'Access denied: Insufficient role permissions' });
    }

    next();
  };
};
