import { UserRole } from 'generated/prisma/client';
import { User } from 'generated/prisma/client';
import { Role } from 'generated/prisma/enums';

export const matchRoles = (
  user: User & { roles: UserRole[] },
  roles: Role[],
) => {
  // console.log(user);
  const hasRole = roles.some((role) =>
    user.roles?.find((userRole) => userRole.role === role),
  );
  return hasRole;
};
