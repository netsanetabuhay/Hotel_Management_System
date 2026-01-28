// src/utils/roleHelpers.js
import { USER_ROLES, ROLE_HIERARCHY, ROLE_DISPLAY_NAMES, ROLE_PERMISSIONS } from './constants';

// Helper functions for role management
export const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role;
};

export const getAllRoles = () => {
  return Object.values(USER_ROLES);
};

export const getRolesWithDisplayNames = () => {
  return getAllRoles().map(role => ({
    value: role,
    label: getRoleDisplayName(role),
  }));
};

export const hasPermission = (userRole, module, action) => {
  if (!userRole || !module || !action) return false;
  
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;
  
  const modulePermissions = permissions[module];
  if (!modulePermissions) return false;
  
  return modulePermissions.includes(action);
};

export const canAccessModule = (userRole, module) => {
  if (!userRole || !module) return false;
  
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;
  
  return permissions[module] && permissions[module].length > 0;
};

export const getAccessibleModules = (userRole) => {
  if (!userRole) return [];
  
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return [];
  
  return Object.keys(permissions).filter(module => 
    permissions[module] && permissions[module].length > 0
  );
};

export const canManageRole = (managerRole, targetRole) => {
  if (!managerRole || !targetRole) return false;
  
  const managerLevel = ROLE_HIERARCHY[managerRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole] || 0;
  
  return managerLevel > targetLevel;
};

export const getManageableRoles = (managerRole) => {
  if (!managerRole) return [];
  
  const managerLevel = ROLE_HIERARCHY[managerRole] || 0;
  
  return Object.entries(ROLE_HIERARCHY)
    .filter(([role, level]) => level < managerLevel)
    .map(([role]) => role);
};