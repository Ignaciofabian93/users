import { MainResolver } from "./main";

export const resolvers = {
  Query: {
    ...MainResolver.Query,
  },
  Mutation: {
    ...MainResolver.Mutation,
  },
  Seller: {
    ...MainResolver.Seller,
  },
  Profile: {
    ...MainResolver.Profile,
  },
};
