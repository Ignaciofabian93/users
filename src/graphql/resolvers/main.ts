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
      // Return the correct profile with __typename
      if (parent.sellerType === "PERSON" && parent.personProfile) {
        return { ...parent.personProfile, __typename: "PersonProfile" };
      }
      if ((parent.sellerType === "STARTUP" || parent.sellerType === "COMPANY") && parent.businessProfile) {
        return { ...parent.businessProfile, __typename: "BusinessProfile" };
      }
      return null;
    },
    country: (parent: any) => parent.country || null,
    region: (parent: any) => parent.region || null,
    city: (parent: any) => parent.city || null,
    county: (parent: any) => parent.county || null,
    sellerLevel: (parent: any) => parent.sellerLevel || null,
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
