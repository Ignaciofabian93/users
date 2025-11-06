import { MainResolver } from "./main";

export const resolvers = {
  Query: {
    ...MainResolver.Query,
  },
  Mutation: {
    ...MainResolver.Mutation,
  },
  Admin: {
    ...MainResolver.Admin,
  },
  Seller: {
    ...MainResolver.Seller,
  },
  Profile: {
    ...MainResolver.Profile,
  },
};
