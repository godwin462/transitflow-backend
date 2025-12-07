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
