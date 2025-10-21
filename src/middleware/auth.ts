import { type Context } from "../types/context";

export const createContext = ({ req }: { req: any }): Context => {
  console.log("REQ:: ", req.headers);

  const authHeader = req.headers.authorization;
  const sellerId: string | undefined = req.headers["x-seller-id"];

  return {
    req,
    res: req.res,
    token: authHeader?.replace("Bearer ", ""),
    sellerId,
  };
};
