declare interface UserInterface {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: Role;
}
declare interface RequestWithUser extends Request {
  user: {
    userId: string;
  };
}
declare interface JwtPayloadInterface {
  userId: string;
  role: string;
}

declare interface DriverAdapterError {
  cause: {
    originalCode: string;
    originalMessage: string;
    kind: string;
    constraint: { fields: string[] };
  };
}
