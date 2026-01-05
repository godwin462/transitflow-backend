import { User } from 'generated/prisma/client';
import { Role } from 'generated/prisma/enums';

export const matchRoles = (user: User, roles: Role[]) => {
  // console.log(user);
  const hasRole = roles.some((role) => user.activeRole === role);
  return hasRole;
};
