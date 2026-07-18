export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  AREA_MANAGER: 'AREA_MANAGER',
  CLASS_LEADER: 'CLASS_LEADER',
  VOLUNTEER: 'VOLUNTEER',
  AUDITOR: 'AUDITOR'
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

export const PERMISSIONS = {
  // Donor Management Permissions
  DONOR_CREATE: 'donor:create',
  DONOR_READ: 'donor:read',
  DONOR_UPDATE: 'donor:update',
  DONOR_DELETE: 'donor:delete',
  DONOR_MERGE: 'donor:merge',

  // Donation Management Permissions
  DONATION_CREATE: 'donation:create',
  DONATION_READ: 'donation:read',
  DONATION_VERIFY: 'donation:verify',
  DONATION_REJECT: 'donation:reject',
  DONATION_REFUND: 'donation:refund',
  DONATION_DELETE: 'donation:delete',

  // Campaign Permissions
  CAMPAIGN_CREATE: 'campaign:create',
  CAMPAIGN_READ: 'campaign:read',
  CAMPAIGN_UPDATE: 'campaign:update',
  CAMPAIGN_DELETE: 'campaign:delete',

  // Report & Analytics Permissions
  REPORT_READ: 'report:read',
  ANALYTICS_READ: 'analytics:read',
  EXPORT_DATA: 'export:data',

  // Security & Audit Logs Permissions
  SYSTEM_LOGS_READ: 'system:logs:read',
  AUDIT_LOGS_READ: 'audit:logs:read',
  BACKUP_MANAGE: 'backup:manage',

  // Settings & Configurations Permissions
  SETTINGS_WRITE: 'settings:write'
} as const;

export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS];
