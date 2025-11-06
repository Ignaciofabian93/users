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

  Admin: {
    __resolveReference: (reference: { id: string }) => ReferenceService.adminReference({ id: reference.id }),
  },

  Seller: {
    __resolveReference: (reference: { id: string }) => ReferenceService.sellerReference({ id: reference.id }),
    profile: (parent: any) => {
      // Return personProfile or businessProfile depending on which exists
      return parent.personProfile || parent.businessProfile || null;
    },
  },
  Profile: {
    __resolveType(obj: any) {
      // PersonProfile has firstName field
      if (obj.firstName !== undefined) {
        return "PersonProfile";
      }
      // BusinessProfile has businessName field
      if (obj.businessName !== undefined) {
        return "BusinessProfile";
      }
      // Should not happen, but return null as fallback
      return null;
    },
  },
};
