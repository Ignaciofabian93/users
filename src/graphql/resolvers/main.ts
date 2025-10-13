import { ReferenceService } from "../services/reference";
import { AccountResolver } from "./account";
import { LocationResolver } from "./location";
import { SellerResolver } from "./sellers";

export const MainResolver = {
  Query: {
    // Location queries
    ...LocationResolver.Query,
    // Seller queries
    ...SellerResolver.Query,
  },

  Mutation: {
    ...SellerResolver.Mutation,
    ...AccountResolver.Mutation,
  },

  Seller: {
    __resolveReference: (reference: { id: string }) => ReferenceService.sellerReference({ id: reference.id }),
  },
  Profile: {
    __resolveType(obj: any) {
      if (obj.firstName !== undefined) {
        return "PersonProfile";
      }
      if (obj.businessName !== undefined && obj.serviceArea === undefined) {
        return "BusinessProfile";
      }
      return null;
    },
  },
};
