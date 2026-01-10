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
    id: string;
    email: string;
    username: string;
    roles: { role: string }[];
  };
}
declare interface JwtPayloadInterface {
  id: string;
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

interface BrevoEmailResponse {
  messageId?: string;
  error?: {
    message: string;
  };
}

interface BrevoMailPayload {
  email: string;
  subject: string;
  html: string;
}

// Row shape returned by the recommendation query
interface RawMatch {
  shift_id: string;
  pickup_point: PostgisGeometry;
  dropoff_point: PostgisGeometry;
  pickup_fraction: number;
  dropoff_fraction: number;
  pickup_walk_meters: number;
  dropoff_walk_meters: number;
  score: number;
}
