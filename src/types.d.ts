declare namespace Express {
  export interface Request {
    user: any;
    file: { location: string };
  }
  export interface Response {
    user: any;
  }
}
