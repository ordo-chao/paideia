import permissions from './permissions.json'  with { type: 'json' }

// export permissions
export const PERMISSIONS_CONFIG  = permissions;
export const ALL_PERMISSION_KEYS = Object.keys(permissions.permissionCatalog);
export const POSITIONS           = permissions.positions;
export const DEPARTMENTS         = permissions.departments