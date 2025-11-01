import { checkPermission } from './services/api'

export const canAccess = (userType, requiredPermission) => {
  return checkPermission(userType, requiredPermission)
}

export const getAccessLevel = (userType) => {
  const levels = { admin: 3, gestor: 2, colaborador: 1 }
  return levels[userType] || 0
}